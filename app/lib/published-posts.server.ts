import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

/*
 * The slugs of the published posts, read from posts/ on disk at build time.
 * app/routes.ts makes one route per slug, and react-router.config.ts
 * pre-renders each. The rule is posts.server.ts's: `published: false` hides a
 * post. scripts/postbuild.mjs fails the build if the pre-rendered posts and the
 * sitemap (built from posts.server.ts) ever disagree.
 */
export function publishedPostSlugs(): string[] {
  const dir = join(process.cwd(), 'posts');
  return readdirSync(dir)
    .filter((name) => /\.mdx?$/.test(name))
    .filter((name) => {
      const { data } = matter(readFileSync(join(dir, name), 'utf8'));
      return data.published !== false;
    })
    .map((name) => name.replace(/\.mdx?$/, ''))
    .sort();
}
