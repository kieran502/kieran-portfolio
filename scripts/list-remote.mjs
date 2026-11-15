/** Lists what is in the preview folder on the server (read-only). Usage: node scripts/list-remote.mjs */
import { readFileSync } from 'node:fs';
import { Writable } from 'node:stream';
import { Client } from 'basic-ftp';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.deploy', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith('#') && line.includes('='))
    .map((line) => [line.slice(0, line.indexOf('=')).trim(), line.slice(line.indexOf('=') + 1).trim()]),
);
const client = new Client(30_000);
try {
  await client.access({ host: env.DEPLOY_HOST, port: Number(env.DEPLOY_PORT ?? 21), user: env.DEPLOY_USER, password: env.DEPLOY_PASSWORD, secure: true });
  await client.cd(env.DEPLOY_REMOTE_DIR);
  for (const item of await client.list()) console.log(item.isDirectory ? 'dir ' : 'file', String(item.size).padStart(8), item.name);
  if (process.argv[2]) {
    let text = '';
    await client.downloadTo(new Writable({ write(chunk, _e, done) { text += chunk; done(); } }), process.argv[2]);
    console.log(`--- ${process.argv[2]} (first 300 chars) ---\n${text.slice(0, 300)}`);
    console.log('contains test phrase:', text.includes('teal-coral-cream-4321'));
  }
} finally {
  client.close();
}
