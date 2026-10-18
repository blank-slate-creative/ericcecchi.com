import type { MetaDescriptor } from 'react-router';

/*
 * Page metadata and structured data (blank-slate issue 935, phase 4 of the
 * ericcecchi.com refresh).
 *
 * The rules, so the next edit keeps them:
 * - www is the canonical host: the apex answers 308 to www. Every canonical,
 *   og:url, and JSON-LD URL is built from ORIGIN and a fixed path, never from
 *   the request URL, so a query string can't become a canonical.
 * - Structured data says only what the page shows. Person carries the name,
 *   the photo, and live profiles; no jobTitle and no worksFor (BD-2026-121).
 * - sameAs lists only live profiles of Eric himself, each loaded and checked
 *   (LinkedIn answered 200 and names Eric on 2026-10-14). A company page such
 *   as blankslate.biz/about is not a profile of the person, so it stays out;
 *   the person-to-company link belongs on the company's side (founder).
 */

export const ORIGIN = 'https://www.ericcecchi.com';
export const SITE_NAME = 'Eric Cecchi';
export const PERSON_ID = `${ORIGIN}/#person`;

const SHARE_IMAGE = {
  url: `${ORIGIN}/me.jpg`,
  width: 1144,
  height: 1144,
  alt: 'Eric Cecchi',
};

const SAME_AS = ['https://www.linkedin.com/in/ericcecchi'];

export function absoluteUrl(path: string) {
  return ORIGIN + path;
}

/*
 * Excerpts are written in Markdown and one uses *emphasis*, which a search
 * result would show as literal asterisks. Keep the words, drop the marks.
 */
export function plainText(markdown: string) {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/(^|[^\w])_(.+?)_(?=[^\w]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
};

export function pageMeta({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
}: PageMetaInput): MetaDescriptor[] {
  const url = absoluteUrl(path);
  const meta: MetaDescriptor[] = [
    { title },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: SHARE_IMAGE.url },
    { property: 'og:image:width', content: String(SHARE_IMAGE.width) },
    { property: 'og:image:height', content: String(SHARE_IMAGE.height) },
    { property: 'og:image:alt', content: SHARE_IMAGE.alt },
    { name: 'twitter:card', content: 'summary' },
  ];
  if (publishedTime) {
    meta.push({ property: 'article:published_time', content: publishedTime });
  }
  return meta;
}

const CONTEXT = 'https://schema.org';

// The short form other pages use to point at the Person on the home page. A
// reference resolves within one page, so it repeats the name and url.
const personRef = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Eric Cecchi',
  url: absoluteUrl('/'),
};

/* The home page is Eric's profile. Its @id is what blankslate.biz's founder can point to. */
export function profilePageLd() {
  return {
    '@context': CONTEXT,
    '@type': 'ProfilePage',
    url: absoluteUrl('/'),
    mainEntity: {
      ...personRef,
      image: SHARE_IMAGE.url,
      sameAs: SAME_AS,
    },
  };
}

type PostLdInput = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export function blogPostingLd({ slug, title, description, date }: PostLdInput) {
  const url = absoluteUrl(`/blog/${slug}`);
  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    url,
    mainEntityOfPage: url,
    headline: title,
    description,
    datePublished: date,
    author: personRef,
  };
}

/*
 * The one place JSON-LD becomes a string for a <script>. JSON.stringify leaves
 * "<", ">", "&" and the two JS line separators as they are, and any of them can
 * end a script block or break parsing, so each is written as a \u escape (still
 * valid JSON, same value). Same rule as blankslate.biz's seo.ts.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
