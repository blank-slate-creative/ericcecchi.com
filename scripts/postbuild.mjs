/* global console, process */
// Runs after `react-router build` (package.json). Two jobs:
//
// 1. Move the pre-rendered catch-all page to build/client/404.html, which the
//    Worker serves with a 404 status for any path that has no file
//    (wrangler.jsonc, not_found_handling).
// 2. Check the output: every URL in sitemap.xml has a pre-rendered page, every
//    pre-rendered post is in the sitemap, and 404.html exists. Any gap fails
//    the build, so a deploy can't ship a sitemap that points at a missing page.
import {
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
} from 'node:fs';
import { join } from 'node:path';

const ORIGIN = 'https://www.ericcecchi.com';
const OUT = 'build/client';
const NOT_FOUND_DIR = join(OUT, '404');

function fail(message) {
  console.error(`postbuild: ${message}`);
  process.exit(1);
}

// 1. The 404 page.
const notFoundSource = join(NOT_FOUND_DIR, 'index.html');
if (!existsSync(notFoundSource)) fail(`${notFoundSource} was not rendered`);
renameSync(notFoundSource, join(OUT, '404.html'));
rmSync(NOT_FOUND_DIR, { recursive: true, force: true });
// Files React Router writes that nothing here requests: the SPA fallback
// (unused, since every page is pre-rendered and 404.html covers the rest) and
// the sitemap's client data. Left in, each would answer 200 at its own URL.
for (const extra of ['__spa-fallback.html', 'sitemap.xml.data']) {
  rmSync(join(OUT, extra), { force: true });
}
if (!readFileSync(join(OUT, '404.html'), 'utf8').includes('Page not found')) {
  fail('404.html does not contain the not-found page');
}

// 2. The sitemap and the pages agree.
const sitemapFile = join(OUT, 'sitemap.xml');
if (!existsSync(sitemapFile)) fail('sitemap.xml was not rendered');
const locs = [
  ...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => m[1]);
if (locs.length === 0) fail('sitemap.xml lists no URLs');

function pageFile(path) {
  return path === '/' ? join(OUT, 'index.html') : join(OUT, path, 'index.html');
}

const paths = locs.map((loc) => {
  if (!loc.startsWith(ORIGIN))
    fail(`sitemap URL off the canonical host: ${loc}`);
  return loc.slice(ORIGIN.length);
});
const missing = paths.filter((path) => !existsSync(pageFile(path)));
if (missing.length) fail(`no page for sitemap paths: ${missing.join(', ')}`);

const blogDir = join(OUT, 'blog');
const renderedPosts = readdirSync(blogDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `/blog/${entry.name}`);
const unlisted = renderedPosts.filter((path) => !paths.includes(path));
if (unlisted.length)
  fail(`posts rendered but not in the sitemap: ${unlisted.join(', ')}`);

console.log(
  `postbuild: ${paths.length} sitemap paths, each pre-rendered, plus 404.html`,
);
for (const path of paths) console.log(`  ${path}`);
