import { getPostExcerpts } from '~/lib/posts.server';
import { ORIGIN } from '~/lib/seo';

const STATIC_PATHS = ['/', '/work', '/security', '/blog'];

async function getPostPaths() {
  try {
    const posts = await getPostExcerpts();
    return posts.map((post) => `/blog/${post.slug}`);
  } catch (error) {
    // A database outage must not turn the sitemap into a 500. Serve the
    // static pages; the posts come back on the next successful read.
    console.error('sitemap: could not read posts', error);
    return [];
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function loader() {
  const paths = [...STATIC_PATHS, ...(await getPostPaths())];
  const urls = paths
    .map((path) => `  <url><loc>${escapeXml(ORIGIN + path)}</loc></url>`)
    .join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
