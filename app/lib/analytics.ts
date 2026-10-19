/*
 * Cloudflare Web Analytics, the site's only analytics (blank-slate issue 1615;
 * plan section 4). It replaces Vercel Analytics and Speed Insights: the same
 * beacon reports page views and Core Web Vitals.
 *
 * The one switch is the token. While it is empty, the beacon is not rendered
 * and the footer says the site runs no analytics. Paste the site's token from
 * Cloudflare (Web Analytics, the `token` inside `data-cf-beacon`) and both
 * change together: the beacon loads, and the footer describes it. Never ship a
 * token without the footer line, or the footer line without a token. Same rule
 * as blankslate.biz's src/lib/analytics.ts.
 *
 * The token is public by design: it sits in the page source of every site that
 * uses Cloudflare Web Analytics, so it is not a secret.
 */
export const CF_BEACON_TOKEN = '';

/**
 * Only these hosts report. The same files are served from the workers.dev
 * previews and localhost, which stay out of the numbers and don't load the
 * beacon at all. The apex redirects to www, so www is the one that counts.
 */
export const ANALYTICS_HOSTS = ['www.ericcecchi.com', 'ericcecchi.com'];

/** True only for a token shaped like Cloudflare's, so a typo can't ship a broken tag. */
export const ANALYTICS_LIVE = /^[A-Za-z0-9]{16,64}$/.test(CF_BEACON_TOKEN);

export const CF_BEACON_SRC =
  'https://static.cloudflareinsights.com/beacon.min.js';
