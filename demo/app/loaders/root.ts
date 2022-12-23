import { ReturnNavigationState } from '@briandlee/remix-return-navigation';
import { useMatches } from '@remix-run/react';
import { OptionsCookieData } from '~/session.server';

export interface RootLoaderData {
  requestUrl: ReturnNavigationState['requestUrl'];
  referrer: ReturnNavigationState['referrer'];
  options: OptionsCookieData;
}

export function useRootLoaderData(): RootLoaderData {
  return useMatches().find(({ id }) => id === 'root')?.data as RootLoaderData;
}
