import type { LinkProps } from '@remix-run/react';
import { Link } from '@remix-run/react';
import type { To } from 'history';
import * as React from 'react';
import { useReturnLocation } from './hooks';

export interface BackwardLinkProps extends Omit<LinkProps, 'to'> {
  fallback?: To;
}

export function BackwardLink(props: BackwardLinkProps) {
  const location = useReturnLocation() || props.fallback || '/';

  return <Link to={location}>{props.children}</Link>;
}
