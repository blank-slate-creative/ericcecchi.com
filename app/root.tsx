import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from 'react-router';
import type { LinksFunction } from 'react-router';
import { ReactNode } from 'react';
import { Analytics } from '~/components/analytics';
import { NotFound } from '~/components/not-found';
import { Page } from '~/components/page';
import { PageTitle } from '~/components/page-title';
import stylesheet from './global.css?url';
// The body text font. Preloaded so text paints in Fira Mono without waiting on
// the stylesheet; the other weights and subsets load as the page needs them.
import firaMono400 from './fonts/fira-mono-400-latin.woff2?url';

export const links: LinksFunction = () => [
  {
    rel: 'preload',
    href: firaMono400,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  { rel: 'stylesheet', href: stylesheet },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#a855f7" />
        <Meta />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Links />
      </head>
      <body className="bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// A 404 met during client-side navigation shows the not-found page: for
// example, a tab still open on an older build follows a link to a post that
// a newer build removed, and its .data file is gone.
export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }
  return (
    <Page>
      <div className="space-y-6">
        <PageTitle>Something went wrong</PageTitle>
        <p className="sm:text-lg leading-relaxed">
          This page didn’t load. Reload it, or try again in a minute.
        </p>
      </div>
    </Page>
  );
}
