/* global console, process, fetch, URL */
// Compares the rendered <head> tags and the visible text of every sitemap URL
// on two hosts: a reference (the live site) and a candidate (a preview, or
// `npm start` locally). Used for the move to Cloudflare Workers (blank-slate
// issue 1615), and useful after any change that should not alter what a page
// says.
//
//   node scripts/compare-pages.mjs --candidate https://<preview>.workers.dev
//   node scripts/compare-pages.mjs --candidate http://127.0.0.1:8787 \
//     --reference https://www.ericcecchi.com \
//     --ignore '^(What this site collects|This site runs no analytics)'
//
// --ignore takes a regular expression: visible-text lines that match it on
// either side are left out of the text comparison and listed once at the end,
// for a change the PR makes on purpose (the footer's analytics line, here).
//
// It reads the HTML each server sends (what a crawler sees), not the page after
// scripts run. The URL list is the reference's sitemap.xml. Exit code 1 if any
// page differs, 0 if all match. Node 20 or later (global fetch); no packages.

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
}
const reference = arg('reference', 'https://www.ericcecchi.com').replace(
  /\/$/,
  '',
);
const candidate = arg('candidate', '').replace(/\/$/, '');
const ignoreSource = arg('ignore', '');
const ignore = ignoreSource ? new RegExp(ignoreSource) : null;
const ignored = new Set();
if (!candidate) {
  console.error(
    'usage: compare-pages.mjs --candidate <base URL> [--reference <base URL>]',
  );
  process.exit(2);
}

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g))
    out[m[1].toLowerCase()] = decode(m[2]);
  return out;
}

// The SEO-relevant head: title, named and property meta tags, canonical and
// other non-asset links, and each JSON-LD block, parsed.
function headSignature(html) {
  const head = html.slice(0, html.indexOf('</head>'));
  const lines = [];
  for (const m of head.matchAll(/<title>([^<]*)<\/title>/g))
    lines.push(`title: ${decode(m[1])}`);
  for (const m of head.matchAll(/<meta\b[^>]*>/g)) {
    const a = attrs(m[0]);
    const key = a.name ?? a.property;
    if (key) lines.push(`meta ${key}: ${a.content}`);
    else if (a.charset) lines.push(`meta charset: ${a.charset}`);
  }
  for (const m of head.matchAll(/<link\b[^>]*>/g)) {
    const a = attrs(m[0]);
    // Hashed build assets (stylesheet, font preload, modulepreload) change
    // with every build; their presence is what matters, not their names.
    if (['stylesheet', 'preload', 'modulepreload'].includes(a.rel)) {
      lines.push(`link ${a.rel}${a.as ? ` as=${a.as}` : ''}`);
    } else {
      lines.push(`link ${a.rel}: ${a.href}`);
    }
  }
  for (const m of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  )) {
    try {
      lines.push(`json-ld: ${JSON.stringify(JSON.parse(m[1]))}`);
    } catch {
      lines.push('json-ld: DOES NOT PARSE');
    }
  }
  // modulepreload links sit in the body in Remix and in the head in React
  // Router; count them nowhere, so the comparison is about the page.
  const kept = lines.filter((l) => !l.startsWith('link modulepreload'));
  // Duplicates matter (two titles, two canonicals), so count each tag kind.
  const count = (prefix) => kept.filter((l) => l.startsWith(prefix)).length;
  kept.push(
    `count: ${count('title:')} title, ${count('link canonical:')} canonical, ${count('json-ld:')} json-ld`,
  );
  return [...new Set(kept)].sort();
}

function visibleText(html) {
  const body = html.slice(html.indexOf('<body'));
  return decode(
    body
      .replace(/<script\b[\s\S]*?<\/script>/g, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(
        /<(p|div|h[1-6]|li|header|footer|section|article|nav|br)\b[^>]*>/g,
        '\n',
      )
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((l) => {
      if (ignore && ignore.test(l)) {
        ignored.add(l);
        return false;
      }
      return true;
    });
}

function diff(a, b) {
  const onlyA = a.filter((x) => !b.includes(x));
  const onlyB = b.filter((x) => !a.includes(x));
  return [...onlyA.map((x) => `  - ${x}`), ...onlyB.map((x) => `  + ${x}`)];
}

async function get(url) {
  const res = await fetch(url, { redirect: 'manual' });
  return { status: res.status, html: await res.text() };
}

const sitemap = await (await fetch(`${reference}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);
const candidateSitemap = await get(`${candidate}/sitemap.xml`);
const candidatePaths = [
  ...candidateSitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g),
].map((m) => new URL(m[1]).pathname);

let failures = 0;
let pageMatches = 0;
console.log(
  `reference ${reference}, candidate ${candidate}, ${paths.length} sitemap URLs\n`,
);
const sitemapDiff = diff(paths, candidatePaths);
console.log(`sitemap.xml: ${sitemapDiff.length ? 'DIFFERS' : 'same URLs'}`);
if (sitemapDiff.length) {
  failures++;
  console.log(sitemapDiff.join('\n'));
}

for (const path of paths) {
  const [ref, cand] = await Promise.all([
    get(reference + path),
    get(candidate + path),
  ]);
  const refHead = headSignature(ref.html);
  const headDiff = diff(refHead, headSignature(cand.html));
  const textDiff = diff(visibleText(ref.html), visibleText(cand.html));
  const ok = ref.status === cand.status && !headDiff.length && !textDiff.length;
  if (ok) pageMatches++;
  else failures++;
  console.log(
    `\n${path}: status ${ref.status}/${cand.status}, head ${headDiff.length ? 'DIFFERS' : 'same'} (${refHead.length} tags), text ${textDiff.length ? 'DIFFERS' : 'same'}`,
  );
  if (headDiff.length)
    console.log(' head (- reference, + candidate):\n' + headDiff.join('\n'));
  if (textDiff.length)
    console.log(' text (- reference, + candidate):\n' + textDiff.join('\n'));
}

if (ignored.size) {
  console.log('\nLeft out of the text comparison (--ignore):');
  for (const line of ignored) console.log(`  ${line}`);
}
console.log(`\n${pageMatches} of ${paths.length} pages match.`);
process.exit(failures ? 1 : 0);
