/**
 * Builds a review copy of the site and uploads it to a Netlify site.
 *
 *   npm run deploy:netlify
 *
 * Settings come from `.env.deploy` (never committed): NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID
 * and NETLIFY_URL. Only files that changed since the last upload are sent.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist-review');
const API = 'https://api.netlify.com/api/v1';

function fail(message) {
  console.error(`\nDeploy stopped: ${message}\n`);
  process.exit(1);
}

const envFile = path.join(root, '.env.deploy');
if (!existsSync(envFile)) fail('.env.deploy not found. Copy .env.deploy.example to .env.deploy and fill it in.');
const env = Object.fromEntries(
  readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, '$2')];
    }),
);
for (const key of ['NETLIFY_AUTH_TOKEN', 'NETLIFY_SITE_ID', 'NETLIFY_URL']) {
  if (!env[key]) fail(`${key} is missing from .env.deploy.`);
}

console.log('Building review copy...');
const build = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build', '--outDir', 'dist-review', '--site', env.NETLIFY_URL],
  { cwd: root, stdio: 'inherit', env: { ...process.env, PUBLIC_REVIEW_BUILD: 'true' } },
);
if (build.status !== 0) fail('the build failed, so nothing was uploaded.');

// Every file in the build, keyed by its web path, with a SHA-1 so Netlify can skip unchanged files.
const files = {};
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else {
      const webPath = '/' + path.relative(outDir, full).split(path.sep).join('/');
      files[webPath] = { full, sha: createHash('sha1').update(readFileSync(full)).digest('hex') };
    }
  }
};
walk(outDir);

const headers = { Authorization: `Bearer ${env.NETLIFY_AUTH_TOKEN}` };
const api = async (url, options = {}) => {
  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!response.ok) {
    fail(`Netlify answered ${response.status} ${response.statusText} for ${options.method ?? 'GET'} ${url.replace(API, '')}`);
  }
  return response.json();
};

try {
  const deploy = await api(`${API}/sites/${env.NETLIFY_SITE_ID}/deploys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: Object.fromEntries(Object.entries(files).map(([p, f]) => [p, f.sha])) }),
  });

  const needed = new Set(deploy.required ?? []);
  const toSend = Object.entries(files).filter(([, f]) => needed.has(f.sha));
  console.log(`Uploading ${toSend.length} changed file(s) of ${Object.keys(files).length}...`);
  for (const [webPath, file] of toSend) {
    await api(`${API}/deploys/${deploy.id}/files${encodeURI(webPath)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: readFileSync(file.full),
    });
  }

  // Wait for Netlify to publish the upload.
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const state = (await api(`${API}/deploys/${deploy.id}`)).state;
    if (state === 'ready') {
      console.log(`\nDone. Review copy is at ${env.NETLIFY_URL}\n`);
      process.exit(0);
    }
    if (state === 'error') fail('Netlify reported an error while publishing the upload.');
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  fail('the upload finished but Netlify had not published it after a minute. Check the Netlify dashboard.');
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
