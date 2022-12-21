import { ReturnNavigationState } from '@briandlee/remix-return-navigation';
import { useMatches } from '@remix-run/react';

export interface RootLoaderData {
  referrer: ReturnNavigationState['referrer'];
}

export function useRootLoaderData(): RootLoaderData {
  return useMatches().find(({ id }) => id === 'root')?.data as RootLoaderData;
}
