import type { MetaFunction } from 'react-router';
import { Anchor } from '~/components/anchor';
import { Page } from '~/components/page';
import { getTimelineComponent } from '~/components/timeline';
import { PageTitle } from '~/components/page-title';
import { useLoaderData } from 'react-router';
import { getTimeline } from '~/lib/timeline.server';
import { pageMeta } from '~/lib/seo';

export const meta: MetaFunction = () =>
  pageMeta({
    title: 'Work history | Eric Cecchi',
    description:
      'Eric Cecchi’s career timeline: web development, engineering management at Sprout Social, platform architecture, and security engineering leadership.',
    path: '/work',
  });

export default function Work() {
  const { timeline } = useLoaderData<typeof loader>();

  return (
    <Page>
      <div className="space-y-6">
        <PageTitle>A (sort of) brief history of me</PageTitle>

        <p className="sm:text-lg">
          I lead security engineering at Perch Energy. I started out building
          apps and websites, moved into engineering management at Chicago’s
          beloved{' '}
          <Anchor
            href="https://investors.sproutsocial.com/news/news-details/2019/Sprout-Social-Announces-Launch-of-Initial-Public-Offering/default.aspx"
            rel="noopener"
            target="_blank"
          >
            unicorn
          </Anchor>{' '}
          startup, Sprout Social, and then into platform architecture as a Staff
          and Senior Staff Engineer before turning to security. The timeline
          below starts with the most recent.
        </p>

        {timeline.map((entry) => {
          return <div key={entry.date}>{getTimelineComponent(entry)}</div>;
        })}
      </div>
    </Page>
  );
}

export async function loader() {
  const timeline = await getTimeline();
  return { timeline };
}
