import { Anchor } from './anchor';
import { ExternalLinkIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';

export function MainNav() {
  return (
    <div>
      <header>
        <nav className="py-6 sm:flex items-center">
          <Anchor
            to="/"
            className="font-bold no-underline hover:underline mr-6"
          >
            &gt; ./eric_cecchi
          </Anchor>

          <ul className="flex-1 flex flex-wrap items-center gap-y-2 ml-4 sm:ml-0 mt-2 sm:mt-0">
            <li className="mr-5 sm:mr-6">
              <Anchor className="no-underline hover:underline" to="/work">
                ./work
              </Anchor>
            </li>

            <li className="mr-5 sm:mr-6">
              <Anchor className="no-underline hover:underline" to="/security">
                ./security
              </Anchor>
            </li>

            <li className="mr-5 sm:mr-6">
              <Anchor
                href="https://managerreadme.com/readme/ericcecchi"
                rel="noopener"
                target="_blank"
                className="flex items-center space-x-1 no-underline hover:underline"
              >
                <span>./mgmt</span>
                <ExternalLinkIcon />
              </Anchor>
            </li>

            <li className="mr-5 sm:mr-6">
              <Anchor className="no-underline hover:underline" to="/blog">
                ./blog
              </Anchor>
            </li>

            <li className="sm:ml-auto">
              <Anchor
                className="no-underline hover:underline"
                href="https://www.linkedin.com/in/ericcecchi/"
                rel="noopener"
                target="blank"
                title="Find me on LinkedIn"
              >
                <LinkedInLogoIcon className="w-5 h-5" />
                <span className="sr-only">Find me on LinkedIn</span>
              </Anchor>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
