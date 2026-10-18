import { Anchor } from './anchor';
import { Page } from './page';
import { PageTitle } from './page-title';

/*
 * The not-found page. The catch-all route ($.tsx) pre-renders it once, the
 * build copies it to 404.html, and the Worker serves that file with a 404
 * status for any path that has no file. The root ErrorBoundary shows it too,
 * for a 404 met during client-side navigation.
 */
export function NotFound() {
  return (
    <Page>
      <div className="space-y-6">
        <PageTitle>Page not found</PageTitle>
        <p className="sm:text-lg leading-relaxed">
          There’s nothing at this address. Try the{' '}
          <Anchor to="/">home page</Anchor> or the{' '}
          <Anchor to="/blog">blog</Anchor>.
        </p>
      </div>
    </Page>
  );
}

export default NotFound;
