import React from 'react';
import { ANALYTICS_LIVE } from '~/lib/analytics';
import { cn } from '~/lib/classnames';
import { Anchor } from './anchor';
import { MainNav } from './main-nav';

export function Page({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('max-w-3xl mx-auto px-4 pb-12', className)}>
      <MainNav />
      <main {...props} />
      <footer className="mt-16 text-sm text-slate-500 dark:text-slate-400 space-y-3">
        <p>
          I also run Blank Slate Creative, a security documentation practice.{' '}
          <Anchor to="/security">About my security work</Anchor>.
        </p>
        {/* Follows the beacon's switch in app/lib/analytics.ts. */}
        {ANALYTICS_LIVE ? (
          <p>
            What this site collects: anonymous page-view counts and page-speed
            measurements through Cloudflare Web Analytics, which uses no cookies
            and doesn’t identify you by your IP address. Fonts load from this
            site, not a third party. I don’t collect names or emails.
          </p>
        ) : (
          <p>
            This site runs no analytics. Fonts load from this site, not a third
            party. I don’t collect names or emails.
          </p>
        )}
      </footer>
    </div>
  );
}

export default Page;
