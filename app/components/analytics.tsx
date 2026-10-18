import {
  ANALYTICS_HOSTS,
  ANALYTICS_LIVE,
  CF_BEACON_SRC,
  CF_BEACON_TOKEN,
} from '~/lib/analytics';

/*
 * Loads Cloudflare Web Analytics on the production hosts only. The check runs
 * in the visitor's browser because the same pre-rendered files are served from
 * the workers.dev previews, where the beacon must not report. It renders
 * nothing until a token is set in app/lib/analytics.ts.
 */
export function Analytics() {
  if (!ANALYTICS_LIVE) return null;

  // Every value is a constant from our own code, and the token is checked
  // against a letters-and-digits pattern, so nothing can break out of the
  // string or the script.
  const script =
    `(function(){var h=location.hostname;if(${JSON.stringify(ANALYTICS_HOSTS)}.indexOf(h)<0)return;` +
    `var s=document.createElement("script");s.defer=true;s.src=${JSON.stringify(CF_BEACON_SRC)};` +
    `s.setAttribute("data-cf-beacon",${JSON.stringify(JSON.stringify({ token: CF_BEACON_TOKEN }))});` +
    `document.head.appendChild(s);})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default Analytics;
