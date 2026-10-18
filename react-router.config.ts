import type { Config } from '@react-router/dev/config';

/*
 * The whole site is pre-rendered at build time and served as static files by
 * a Cloudflare Worker with no script (blank-slate issue 1615; plan:
 * company/ops/ericcecchi-com-workers-move-plan.md in blank-slate, section 2.2).
 * There is no server at request time, so routes can't export `headers` or
 * `action`; caching and HSTS live in public/_headers.
 *
 * getStaticPaths() lists every route without a URL parameter: the pages, the
 * sitemap, and one route per published post (app/routes.ts), so an unpublished
 * post has no file and answers 404 (ericcecchi.com PR 742). NOT_FOUND_PATH
 * renders the catch-all route once; scripts/postbuild.mjs moves it to
 * build/client/404.html, which wrangler.jsonc serves with a 404 status.
 */
const NOT_FOUND_PATH = '/404';

export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    return [...getStaticPaths(), NOT_FOUND_PATH];
  },
} satisfies Config;
