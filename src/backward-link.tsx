import { useNavigate } from '@remix-run/react';
import type { Path, To } from 'history';
import * as React from 'react';
import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import { useReturnLocation, useReturnNavigationOptions } from './hooks';
import type { LinkProps } from './link';
import { Link } from './link';

export interface BackwardLinkFCProps {
  returnLocation: Path | null;
}

export interface BackwardLinkFC {
  (props: BackwardLinkFCProps): ReactNode;
}

export interface BackwardLinkProps extends Omit<LinkProps, 'to'> {
  fallback?: To;
  fallbackContent?: ReactNode;
  render?: BackwardLinkFC;
}

type OnClickCallback = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;

export function BackwardLink(props: BackwardLinkProps) {
  const { shouldUseNavigateOnHydrate } = useReturnNavigationOptions();
  const returnLocation = useReturnLocation();
  const navigate = useNavigate();

  const location = returnLocation || props.fallback || '/';

  const onClick: OnClickCallback = useCallback(
    function (e) {
      shouldUseNavigateOnHydrate && returnLocation && e.preventDefault();
      props.onClick && props.onClick(e);
      shouldUseNavigateOnHydrate && returnLocation && navigate(-1);
    },
    [props, navigate, returnLocation, shouldUseNavigateOnHydrate]
  );

  return (
    <Link onClick={onClick} to={location} {...props}>
      <BackwardLinkInner
        children={props.children}
        fallbackContent={props.fallbackContent}
        render={props.render}
        returnLocation={returnLocation}
      />
    </Link>
  );
}

interface BackwardLinkInnerProps {
  children: BackwardLinkProps['children'];
  fallbackContent: BackwardLinkProps['fallbackContent'];
  render: BackwardLinkProps['render'];
  returnLocation: Path | null;
}

const BackwardLinkInner = memo<BackwardLinkInnerProps>(
  function BackwardLinkInner(props: BackwardLinkInnerProps) {
    return (
      <>
        {props.render
          ? props.render({ returnLocation: props.returnLocation })
          : props.returnLocation
          ? props.children
          : props.fallbackContent || props.children}
      </>
    );
  },
  function propsAreEqual(prev: BackwardLinkInnerProps, next: BackwardLinkInnerProps) {
    if (prev.render !== next.render) return false;
    if (next.render) {
      return prev.render === next.render && prev.returnLocation === next.returnLocation;
    }

    return (
      prev.fallbackContent === next.fallbackContent &&
      prev.returnLocation === next.returnLocation &&
      prev.children === next.children
    );
  }
);
