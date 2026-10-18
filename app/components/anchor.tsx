import { ComponentProps } from 'react';
import { cn } from '~/lib/classnames';
import { Link } from 'react-router';

type AnchorProps = ComponentProps<'a'> | ComponentProps<typeof Link>;

function isAnchorProps(props: AnchorProps): props is ComponentProps<'a'> {
  return 'href' in props;
}

function isLinkProps(props: AnchorProps): props is ComponentProps<typeof Link> {
  return 'to' in props;
}

export function Anchor({ className, ...props }: AnchorProps) {
  const classes = cn(
    'text-primary-600 dark:text-primary-500 underline break-words',
    className,
  );

  if (isAnchorProps(props)) {
    return <a className={classes} {...props} />;
  } else if (isLinkProps(props)) {
    return <Link className={classes} {...props} />;
  }

  return null;
}
