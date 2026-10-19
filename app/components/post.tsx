import { MDXComponents } from './mdx-components';
import { PageTitle } from './page-title';
import { MDXRemote } from 'next-mdx-remote';
import { Avatar } from './avatar';
import { FormattedDate } from './formatted-date';
import { loader } from '~/post-page';
import { useLoaderData } from 'react-router';

export function Post({
  post,
}: ReturnType<typeof useLoaderData<typeof loader>>) {
  const { content } = post;

  return (
    <article className="text-pretty">
      <div className="space-y-6 mb-12">
        <PageTitle>{post.title}</PageTitle>

        <div className="sm:flex items-center sm:space-x-2 text-sm text-muted-600 dark:text-muted-400 flex-wrap">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6 border-2" />
            <span>Eric Cecchi</span>
          </div>
          <div className="flex items-center mt-2 sm:mt-0 flex-wrap">
            <span className="hidden sm:inline mr-2">•</span>
            <FormattedDate to="MMMM d, yyyy" from={new Date(post.date)} />
            <span className="mx-2">•</span>
            <span>{post.stats.text}</span>
          </div>
        </div>
      </div>

      <MDXRemote
        compiledSource={content}
        scope={null}
        frontmatter={null}
        components={MDXComponents}
      />
    </article>
  );
}

export default Post;
