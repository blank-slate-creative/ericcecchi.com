import type { MetaFunction } from 'react-router';
import { Avatar } from '~/components/avatar';
import { Anchor } from '~/components/anchor';
import { JsonLd } from '~/components/json-ld';
import Page from '~/components/page';
import { PageTitle } from '~/components/page-title';
import { pageMeta, profilePageLd } from '~/lib/seo';

export const meta: MetaFunction = () =>
  pageMeta({
    title: 'Eric Cecchi | Software and security engineering leader',
    description:
      'Eric Cecchi is a software and security engineering leader in Chicago with 15 years on the web. He also runs Blank Slate Creative, a security documentation practice.',
    path: '/',
    type: 'profile',
  });

export default function Home() {
  return (
    <Page>
      <JsonLd data={profilePageLd()} />
      <div className="flex flex-col items-center mt-auto">
        <header className="md:flex items-center md:space-x-6 sm:mt-24 mt-12 mb-6">
          <div className="flex-0 mb-4 md:mb-0">
            <Avatar className="w-24 h-24" />
          </div>
          <PageTitle className="m-0">
            I’m a software and security engineering leader based in Chicago, IL.
          </PageTitle>
        </header>

        <section className="space-y-6 sm:text-lg leading-relaxed">
          <p>
            I lead security engineering at Perch Energy. The work is cloud
            infrastructure security, vendor security assessments, and compliance
            and audit support. Before I moved into security, I was a Staff and
            Senior Staff Engineer, guiding platform architecture and technical
            direction.
          </p>

          <p>
            I also run{' '}
            <Anchor href="https://blankslate.biz">Blank Slate Creative</Anchor>,
            a one-founder security documentation practice that writes security
            policies, SOC 2 readiness documentation, and vendor security
            questionnaire answers for startups.
          </p>

          <p>
            I started out building apps and websites, and I have 15 years of
            engineering experience behind the security work. At Sprout Social, I
            founded and grew the team of web developers tasked with elevating
            the brand and growing the customer base through digital marketing,
            including the{' '}
            <Anchor
              href="https://sproutsocial.com/"
              rel="noopener"
              target="_blank"
            >
              website
            </Anchor>{' '}
            and{' '}
            <Anchor
              href="https://sproutsocial.com/insights/"
              rel="noopener"
              target="_blank"
            >
              Insights blog
            </Anchor>
            , which draw millions of visitors each month. After that, I managed
            a team of software engineers building Sprout’s flagship social media
            management product used by over 30,000 customers. That background
            gives me a pragmatic perspective on security: grounded in how
            developers actually work and how systems are built.
          </p>

          <p>
            I’m a husband and a father, a thinker and a tinkerer, a minimalist
            and{' '}
            <Anchor
              href="http://www.sleepingatlast.com/blog/2018/6/8/five"
              rel="noopener"
              target="_blank"
            >
              an observer
            </Anchor>
            . You won’t find me on social media, so you can write me the
            old-fashioned way at{' '}
            <Anchor href="mailto:eric.cecchi@gmail.com">
              eric.cecchi@gmail.com
            </Anchor>
            .
          </p>

          <p>—E</p>
        </section>
      </div>
    </Page>
  );
}
