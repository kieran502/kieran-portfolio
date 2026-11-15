/**
 * Makes a built copy of the site work from a sub-folder address, e.g.
 * https://user.github.io/repo-name/ instead of the root of a domain.
 *
 *   node scripts/prefix-base.mjs <build folder> </prefix>
 *
 * It rewrites root-relative addresses ("/work/", "/_astro/x.css") in the built HTML and CSS.
 * The source files are not touched, so the real site still builds for a root domain.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const [dir, rawPrefix] = process.argv.slice(2);
if (!dir || !rawPrefix) {
  console.error('Usage: node scripts/prefix-base.mjs <build folder> </prefix>');
  process.exit(1);
}
const prefix = '/' + rawPrefix.replace(/^\/+|\/+$/g, '');
if (prefix === '/') process.exit(0);

let changed = 0;
const walk = (folder) => {
  for (const name of readdirSync(folder)) {
    const full = path.join(folder, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    const ext = path.extname(name);
    if (ext !== '.html' && ext !== '.css') continue;
    const before = readFileSync(full, 'utf8');
    let after = before;
    if (ext === '.html') {
      // href="/x", src="/x", poster="/x", action="/x" (but not protocol-relative "//x")
      after = after.replace(/\b(href|src|poster|action)="\/(?!\/)/g, `$1="${prefix}/`);
      // srcset="/a.webp 360w, /b.webp 640w"
      after = after.replace(/\bsrcset="([^"]*)"/g, (_m, list) =>
        `srcset="${list.replace(/(^|,\s*)\/(?!\/)/g, `$1${prefix}/`)}"`,
      );
    }
    // url(/x) in stylesheets and inline styles
    after = after.replace(/url\((['"]?)\/(?!\/)/g, `url($1${prefix}/`);
    if (after !== before) {
      writeFileSync(full, after);
      changed += 1;
    }
  }
};
walk(dir);
console.log(`Prefixed ${changed} file(s) with ${prefix}`);
