import type { LinkProps } from '@remix-run/react';
import { Link, useNavigate } from '@remix-run/react';
import type { To } from 'history';
import * as React from 'react';
import { useCallback } from 'react';
import { useReturnLocation, useReturnNavigationOptions } from './hooks';

export interface BackwardLinkProps extends Omit<LinkProps, 'to'> {
  fallback?: To;
}

type OnClickCallback = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;

export function BackwardLink(props: BackwardLinkProps) {
  const { shouldUseNavigateOnHydrate } = useReturnNavigationOptions();
  const returnLocation = useReturnLocation();
  const navigate = useNavigate();

  const location = returnLocation || props.fallback || '/';

  const onClick: OnClickCallback = useCallback(
    function (e) {
      shouldUseNavigateOnHydrate && e.preventDefault();
      props.onClick && props.onClick(e);
      shouldUseNavigateOnHydrate && navigate(-1);
    },
    [props, navigate, shouldUseNavigateOnHydrate]
  );

  return (
    <Link onClick={onClick} to={location} {...props}>
      {props.children}
    </Link>
  );
}
