import * as React from 'react';
import type { LinkProps as RemixLinkProps } from '@remix-run/react';
import { Link as RemixLink } from '@remix-run/react';
import type { Ref } from 'react';
import { forwardRef } from 'react';

/**
 * This component wrapper makes unit testing much easier
 */
export type LinkProps = RemixLinkProps;

export const Link = forwardRef(function Link(
  props: LinkProps,
  ref: Ref<HTMLAnchorElement> | undefined
) {
  return (
    <RemixLink ref={ref} {...props}>
      {props.children}
    </RemixLink>
  );
});
