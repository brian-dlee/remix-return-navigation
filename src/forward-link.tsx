import * as React from 'react';
import { useMemo } from 'react';
import type { LinkProps } from '@remix-run/react';
import { Link, useLocation } from '@remix-run/react';
import type { Path } from 'history';
import { isRelativeUrl, relativeUrlToPath, withReturnLocation } from './utils';
import { useReturnNavigationOptions } from './hooks';

interface ForwardLinkProps extends LinkProps {
  param?: string;
}

export function ForwardLink(props: ForwardLinkProps) {
  const options = useReturnNavigationOptions();
  const location = useLocation();

  const target: Partial<Path> | null = useMemo(() => {
    // if the URL is relative, build a matching Partial<Path>
    if (typeof props.to === 'string' && isRelativeUrl(props.to)) {
      return withReturnLocation(
        relativeUrlToPath(props.to),
        location,
        props.param || options.defaultReturnLocationParam
      );
    } else if (typeof props.to !== 'string') {
      return withReturnLocation(props.to, location);
    } else {
      return null;
    }
  }, [props.to, props.param, options, location]);

  if (target === null) {
    return <Link {...props}>{props.children}</Link>;
  }

  return <Link to={{ ...target }}>{props.children}</Link>;
}
