/**
 * Builds a review copy of the site and uploads it to a preview address over FTPS.
 *
 *   npm run deploy:review
 *
 * Settings come from `.env.deploy` (never committed). See `.env.deploy.example`.
 *
 * Safety: the upload only goes ahead if the remote folder is empty or already holds
 * this site's marker file, so it cannot overwrite a different website by mistake.
 * Nothing on the server is ever deleted.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Writable } from 'node:stream';
import { Client } from 'basic-ftp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist-review');
const MARKER = '.kieran-portfolio-review';

function fail(message) {
  console.error(`\nDeploy stopped: ${message}\n`);
  process.exit(1);
}

// ---- settings ----
const envFile = path.join(root, '.env.deploy');
if (!existsSync(envFile)) {
  fail('.env.deploy not found. Copy .env.deploy.example to .env.deploy and fill it in.');
}
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
for (const key of ['DEPLOY_HOST', 'DEPLOY_USER', 'DEPLOY_PASSWORD', 'DEPLOY_REMOTE_DIR', 'DEPLOY_URL']) {
  if (!env[key]) fail(`${key} is missing from .env.deploy.`);
}

// ---- build ----
console.log('Building review copy...');
const build = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build', '--outDir', 'dist-review', '--site', env.DEPLOY_URL],
  { cwd: root, stdio: 'inherit', env: { ...process.env, PUBLIC_REVIEW_BUILD: 'true' } },
);
if (build.status !== 0) fail('the build failed, so nothing was uploaded.');
writeFileSync(path.join(outDir, MARKER), `Review copy uploaded ${new Date().toISOString()}\n`);

// ---- upload ----
const client = new Client(60_000);
try {
  await client.access({
    host: env.DEPLOY_HOST,
    port: Number(env.DEPLOY_PORT ?? 21),
    user: env.DEPLOY_USER,
    password: env.DEPLOY_PASSWORD,
    secure: true, // FTPS: the password and files are encrypted in transit
  });
  await client.ensureDir(env.DEPLOY_REMOTE_DIR);

  const existing = (await client.list()).filter((item) => item.name !== '.' && item.name !== '..');
  const hasMarker = existing.some((item) => item.name === MARKER);
  // cPanel adds these to new folders; they do not indicate another website.
  const harmless = new Set(['cgi-bin', '.well-known', '.htaccess', '.ftpquota', 'php.ini', '.user.ini']);
  let foreign = existing.filter((item) => !harmless.has(item.name));

  // The hand-uploaded test page (preview-test.html saved as index.html) may be replaced.
  if (foreign.length === 1 && foreign[0].name === 'index.html') {
    let text = '';
    const sink = new Writable({ write(chunk, _encoding, done) { text += chunk; done(); } });
    await client.downloadTo(sink, 'index.html');
    if (text.includes('teal-coral-cream-4321')) foreign = [];
  }
  if (!hasMarker && foreign.length > 0) {
    fail(
      `the remote folder "${env.DEPLOY_REMOTE_DIR}" already contains other files ` +
        `(${foreign.slice(0, 5).map((item) => item.name).join(', ')}...). ` +
        'Point DEPLOY_REMOTE_DIR at an empty folder used only for this preview.',
    );
  }

  console.log(`Uploading to ${env.DEPLOY_HOST}:${env.DEPLOY_REMOTE_DIR} ...`);
  await client.uploadFromDir(outDir);
  console.log(`\nDone. Review copy is at ${env.DEPLOY_URL}\n`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  client.close();
}
