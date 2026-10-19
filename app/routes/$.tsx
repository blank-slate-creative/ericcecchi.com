import type { MetaFunction } from 'react-router';
import { NotFound } from '~/components/not-found';
import { SITE_NAME } from '~/lib/seo';

// Every path no other route matches. Pre-rendered once (NOT_FOUND_PATH in
// react-router.config.ts) and served as 404.html with a 404 status.
export const meta: MetaFunction = () => [
  { title: `Page not found | ${SITE_NAME}` },
  { name: 'robots', content: 'noindex' },
];

export default function CatchAll() {
  return <NotFound />;
}
