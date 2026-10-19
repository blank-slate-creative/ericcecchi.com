# ericcecchi.com

Eric Cecchi's personal site: React Router 7 on Vite, pre-rendered at build time and served as static
files by a Cloudflare Worker (no Worker script). There is no database and no server at request time.
Posts and the career timeline live in this repo, so a change ships by pull request.

## Posts

Each post is a Markdown (MDX) file at `posts/<slug>.md`; the file name is the URL (`/blog/<slug>`).

```
---
title: 'The post title'
date: '2026-10-11'
excerpt: 'One or two sentences. It is the blog index text and the meta description.'
---

Body in Markdown.
```

- `date` is `yyyy-MM-dd`. The blog index and the sitemap sort by it, newest first.
- Add `published: false` to keep a draft in the repo without serving it. An unpublished post isn't
  pre-rendered, so its URL answers 404, and it stays out of the blog index and the sitemap. Remove the
  line to publish.
- Optional: `coverImage` and `coverImageAlt`.
- Posts are reviewed repo content, so MDX may use JS expressions and the components in
  `app/components/mdx-components.tsx` (`Mermaid`, `Interwebz`, `InterwebzNoSteps`).

## Timeline

The `/work` timeline is `events.json`. Each entry has `date`, `title`, `content`, `link`
(`{ "href", "text" }` or `null`) and `type` (`event` or `quote`). Entries show newest first.

## Search metadata

`app/lib/seo.ts` builds every page's title, description, canonical URL, Open Graph tags, and
structured data (`ProfilePage` and `Person` on `/`, `BlogPosting` on each post). A new route calls
`pageMeta()` with a fixed path. Canonicals always use
`https://www.ericcecchi.com`. A post's `excerpt` becomes its meta description with any Markdown
marks removed.

## Fonts

Fira Mono is self-hosted from `app/fonts/` (SIL Open Font License, `app/fonts/OFL.txt`), so no
font service sees a visitor's request. The `@font-face` rules are at the top of `app/global.css`.

## Analytics

Cloudflare Web Analytics, loaded only on the production host. The token in `app/lib/analytics.ts` is
the switch: empty means no beacon, and the footer's line in `app/components/page.tsx` follows it.

## How it builds and serves

- `react-router.config.ts` sets `ssr: false` and pre-renders every page: the routes in `app/routes/`,
  one route per published post (`app/routes.ts`, using `app/post-page.tsx`), `sitemap.xml`, and the
  catch-all not-found page. Loaders run once, at build time, in Node.
- Routes can't export `headers` or `action`, because nothing runs at request time. Response headers
  (HSTS, long caching for the hashed files in `/assets/`) are in `public/_headers`.
- `scripts/postbuild.mjs` moves the not-found page to `build/client/404.html` and fails the build if
  any sitemap URL lacks a page, or a post page is missing from the sitemap.
- `wrangler.jsonc` serves `build/client`: `/blog` serves `blog/index.html`, `/blog/` redirects to
  `/blog`, and any path with no file gets `404.html` with a 404 status.
- Deploys: the target is Cloudflare Workers Builds deploying `master` and posting a preview for each
  pull request. That isn't connected yet; connecting it is milestone M2 (blank-slate issue 1616), and
  until then the Worker is deployed by hand with `npx wrangler deploy`. `vercel.json` turns off Vercel's
  Git deployments.
- `www.ericcecchi.com` is the Worker's Custom Domain (`routes` in `wrangler.jsonc`). A deploy of that file
  attaches the domain, and it fails while a DNS CNAME for `www` exists, so don't remove or edit the entry
  outside a cutover or rollback (blank-slate issue 1617).

## Develop

```
npm ci
npm run dev        # dev server with hot reload
npm run typecheck  # route types, then tsc
npm run build      # pre-render to build/client and check it
npm start          # serve build/client locally with Wrangler, as the Worker will
```

Posts and `events.json` are read at build time, so restart the dev server or rebuild after editing
them. `node scripts/compare-pages.mjs --candidate <URL>` compares the rendered head tags and visible
text of every sitemap URL against the live site.
