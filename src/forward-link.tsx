import * as React from 'react';
import { useMemo } from 'react';
import type { LinkProps } from '@remix-run/react';
import { Link } from '@remix-run/react';
import type { Path } from 'history';
import { isRelativeUrl, relativeUrlToPath, withReturnLocation } from './utils';
import { useReturnNavigation } from './hooks';

interface ForwardLinkProps extends LinkProps {}

interface ForwardLinkTarget {
  to: Partial<Path>;
  state?: Record<string, Path>;
}

export function ForwardLink(props: ForwardLinkProps) {
  const { currentLocation, options } = useReturnNavigation();

  const target: ForwardLinkTarget | null = useMemo(() => {
    let path: Partial<Path>;

    // if the URL is relative, build a matching Partial<Path>
    if (typeof props.to === 'string' && isRelativeUrl(props.to)) {
      path = relativeUrlToPath(props.to);
    } else if (typeof props.to !== 'string') {
      path = props.to;
    } else {
      return null;
    }

    switch (options.clientSideReturnLocationStorage) {
      case 'searchParam':
        return {
          to: withReturnLocation(path, currentLocation, options.defaultReturnLocationSearchParam),
        };
      case 'locationState':
        return { to: path, state: { [options.defaultReturnLocationStateKey]: currentLocation } };
    }
  }, [props.to, options, currentLocation]);

  if (target === null) {
    return <Link {...props}>{props.children}</Link>;
  }

  const { to: _, ...extra } = props;

  return (
    <Link {...extra} to={target.to} state={target.state}>
      {props.children}
    </Link>
  );
}
