import type { MetaFunction } from 'react-router';
import { Page } from '~/components/page';
import { PageTitle } from '~/components/page-title';
import { FormattedDate } from '~/components/formatted-date';
import { Card } from '~/components/card';
import { Anchor } from '~/components/anchor';
import { useLoaderData } from 'react-router';
import { getPostExcerpts } from '~/lib/posts.server';
import { pageMeta } from '~/lib/seo';

export const meta: MetaFunction = () =>
  pageMeta({
    title: 'Blog | Eric Cecchi',
    description:
      'Posts by Eric Cecchi on web development, React, and engineering work.',
    path: '/blog',
  });

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <Page>
      <div className="space-y-6">
        <PageTitle>Blog</PageTitle>

        {posts &&
          posts.map((post) => {
            return (
              <Card key={post.slug}>
                <article>
                  <header>
                    {post.date && (
                      <FormattedDate
                        from={new Date(post.date)}
                        to="MMMM d, yyyy"
                        className="text-sm text-muted-600 dark:text-muted-400"
                      />
                    )}

                    <h2 className="text-xl font-semibold my-2">
                      &gt;{' '}
                      <Anchor to={'/blog/' + post.slug}>{post.title}</Anchor>
                    </h2>
                  </header>

                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.coverImageAlt || ''} />
                  )}

                  {post.excerpt}
                </article>
              </Card>
            );
          })}
      </div>
    </Page>
  );
}

export async function loader() {
  const posts = await getPostExcerpts();
  return {
    posts,
  };
}
