import { route, type RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';
import { publishedPostSlugs } from './lib/published-posts.server';

// Not under routes/, so flatRoutes doesn't give it a URL of its own.
const POST_MODULE = 'post-page.tsx';

/*
 * Files in routes/ keep their URLs (flatRoutes): _index.tsx is /, sitemap[.]xml.tsx
 * is /sitemap.xml, and $.tsx catches every other path (the 404 page).
 *
 * Posts are the exception. Each published post gets its own fixed route, not
 * one /blog/:slug route, so the browser's router never matches a slug that has
 * no page. With a :slug route, /blog/nope would be served 404.html (rendered
 * by the catch-all) but hydrate as a post, and React would throw hydration
 * errors. With fixed routes, /blog/nope matches only the catch-all, the same
 * route that rendered 404.html.
 */
export default [
  ...(await flatRoutes()),
  ...publishedPostSlugs().map((slug) =>
    route(`blog/${slug}`, POST_MODULE, { id: `post/${slug}` }),
  ),
] satisfies RouteConfig;
