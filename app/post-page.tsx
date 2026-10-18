import { getPostBySlug } from '~/lib/posts.server';
import { Page } from '~/components/page';
import Post from '~/components/post';
import { JsonLd } from '~/components/json-ld';
import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { blogPostingLd, pageMeta, plainText } from '~/lib/seo';

// The date as written in the post's front matter (yyyy-MM-dd), with no time
// the page doesn't show.
function publishedDate(iso: string) {
  return iso.slice(0, 10);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) return [];
  const { post } = data;

  return pageMeta({
    title: post.title,
    description: plainText(post.excerpt ?? ''),
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: publishedDate(post.date),
  });
};

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <Page>
      <JsonLd
        data={blogPostingLd({
          slug: post.slug,
          title: post.title,
          description: plainText(post.excerpt ?? ''),
          date: publishedDate(post.date),
        })}
      />
      <Post post={post} />
    </Page>
  );
}

// One route per published post (app/routes.ts), so the slug comes from the
// path, not a URL parameter. Every call is a pre-render at build time.
export async function loader({ request }: LoaderFunctionArgs) {
  const slug = new URL(request.url).pathname
    .replace(/^\/blog\//, '')
    .replace(/\/$/, '');
  const post = await getPostBySlug(slug);
  if (!post) {
    throw new Response('Post not found', { status: 404 });
  }

  return { post };
}
