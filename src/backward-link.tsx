import type { LinkProps } from '@remix-run/react';
import { Link, useNavigate } from '@remix-run/react';
import type { To } from 'history';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useReturnLocation, useReturnNavigationOptions } from './hooks';

export interface BackwardLinkProps extends Omit<LinkProps, 'to'> {
  fallback?: To;
}

type OnClickCallback = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;

export function BackwardLink(props: BackwardLinkProps) {
  const { useNavigateOnHydrate } = useReturnNavigationOptions();
  const [navigateEnabled, setNavigateEnabled] = useState(false);
  const returnLocation = useReturnLocation();
  const navigate = useNavigate();

  const location = returnLocation || props.fallback || '/';

  const onClick: OnClickCallback = useCallback(
    function (e) {
      navigateEnabled && e.preventDefault();
      props.onClick && props.onClick(e);
      navigateEnabled && navigate(-1);
    },
    [props, navigateEnabled, navigate]
  );

  useEffect(() => {
    if (useNavigateOnHydrate && !navigateEnabled) {
      setNavigateEnabled(true);
    }
  }, [navigateEnabled, useNavigateOnHydrate]);

  return (
    <Link onClick={onClick} to={location} {...props}>
      {props.children}
    </Link>
  );
}
