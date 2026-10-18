import type { MetaFunction } from '@vercel/remix';
import { Anchor } from '~/components/anchor';
import { Page } from '~/components/page';
import { PageTitle } from '~/components/page-title';
import { cachedPageHeaders, pageMeta } from '~/lib/seo';

/*
 * /security (blank-slate issue 929, phase 2 of the ericcecchi.com refresh,
 * BD-2026-110 and BD-2026-121). A profile page in Eric's first person, not a
 * sales page: no price, no checkout, no ordering language (Vercel Hobby terms
 * bar commercial use, scope ask 8). Every claim traces to company/FACTS.md:
 * F8, F9 (what he does in his full-time role), F14 and F3 (the practice, and
 * readiness only), F20 and F15 (the one AI line, first-person form, which holds
 * only while Eric reads each custom deliverable). The employer is not named
 * here, as on blankslate.biz/about. No jobTitle, no worksFor (BD-2026-121).
 * Do not add a claim that is not in FACTS, and do not add a price.
 */

const GUIDES_ORIGIN = 'https://blankslate.biz';

export const meta: MetaFunction = () =>
  pageMeta({
    title: 'Security documentation and SOC 2 readiness | Eric Cecchi',
    description:
      'I lead security engineering and run Blank Slate Creative, a practice that writes security policies, SOC 2 readiness documentation, and questionnaire answers.',
    path: '/security',
  });

export const headers = cachedPageHeaders;

const guides = [
  {
    slug: 'first-five-security-policies-before-soc-2',
    title: 'The first five security policies a startup needs before SOC 2',
    note: 'Why policies come before controls and evidence, and which five to write first.',
  },
  {
    slug: 'do-you-need-soc-2-yet',
    title: 'Do you need SOC 2 yet? What to send before you have a report',
    note: 'For when a customer asks for a SOC 2 report and you don’t have one.',
  },
  {
    slug: 'first-security-questionnaire-five-day-plan',
    title: 'Your first security questionnaire: a five-day plan',
    note: 'How to answer a first vendor security questionnaire in five working days.',
  },
  {
    slug: 'answering-a-questionnaire-when-a-control-is-missing',
    title: 'Answering a security questionnaire when you don’t have the control',
    note: 'How to describe a compensating control or a roadmap item without guessing.',
  },
  {
    slug: 'incident-response-plan-small-team',
    title: 'An incident response plan a five-person team will follow',
    note: 'Who leads, how to rank severity, who to tell, and a 30-minute test.',
  },
];

export default function Security() {
  return (
    <Page>
      <div className="space-y-6">
        <PageTitle>
          Security work, and the documentation practice I run
        </PageTitle>

        <p className="sm:text-lg leading-relaxed">
          I lead security engineering in my full-time role. Day to day, that
          means writing security policies, running vendor security assessments,
          and answering enterprise security reviews. Through Blank Slate
          Creative, I do that kind of paperwork for other small companies. This
          page covers that work, and where it stops.
        </p>

        <h2 className="text-2xl font-bold mt-12">
          Both sides of the paperwork
        </h2>
        <p className="sm:text-lg leading-relaxed">
          A security questionnaire has two sides, and at work I handle both. I
          assess what vendors send, and I answer what customers ask. The
          documents I write for Blank Slate Creative are written with the reader
          on the other end in mind.
        </p>

        <h2 className="text-2xl font-bold mt-12">Blank Slate Creative</h2>
        <p className="sm:text-lg leading-relaxed">
          <Anchor href={GUIDES_ORIGIN}>Blank Slate Creative</Anchor> is a
          one-founder security documentation practice, and I’m the founder. It
          writes security policies, SOC 2 readiness documentation, and vendor
          security questionnaire answers for startups and lean engineering
          teams, tailored to how the team actually runs.
        </p>
        <p className="sm:text-lg leading-relaxed">
          Everything is written from public frameworks and from what the
          customer tells me. I never draw on another company’s confidential
          material. An AI model helps draft the documents I write. I read every
          custom deliverable before it goes out.
        </p>

        <h2 className="text-2xl font-bold mt-12">What I don’t do</h2>
        <ul className="list-disc pl-8 leading-relaxed space-y-2">
          <li className="sm:text-lg">
            <strong>No audits or attestations.</strong> Readiness and
            documentation work only. A SOC 2 report comes from an independent
            CPA firm.
          </li>
          <li className="sm:text-lg">
            <strong>No promised outcomes.</strong> A customer or an auditor
            decides what is enough. I can’t promise how anyone will judge a
            document.
          </li>
          <li className="sm:text-lg">
            <strong>No borrowed credibility.</strong> I don’t claim
            certifications I don’t hold.
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12">Free guides to start with</h2>
        <p className="sm:text-lg leading-relaxed">
          Blank Slate Creative publishes free guides for people who got handed
          this paperwork. These five are a good place to begin.
        </p>
        <ul className="list-disc pl-8 leading-relaxed space-y-3">
          {guides.map((guide) => (
            <li key={guide.slug} className="sm:text-lg">
              <Anchor href={`${GUIDES_ORIGIN}/guides/${guide.slug}`}>
                {guide.title}
              </Anchor>
              <span className="block text-base text-slate-600 dark:text-slate-400">
                {guide.note}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold mt-12">
          If you have a request in front of you
        </h2>
        <p className="sm:text-lg leading-relaxed">
          If a customer or an investor has asked you for security paperwork, you
          can tell me what you need through the{' '}
          <Anchor href={`${GUIDES_ORIGIN}/inquire`}>inquiry form</Anchor> on
          blankslate.biz.
        </p>

        <p>—E</p>
      </div>
    </Page>
  );
}
