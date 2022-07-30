import type { To } from 'history';
import type { Location } from '@remix-run/react';
import { useEffect, useState } from 'react';

export type ReadStateFunction = (state: Record<string, unknown>) => string | null

const defaultReadState: ReadStateFunction = (state) => {
  if (typeof state?.source === 'string') {
    return state.source;
  }
  return null
}

export function getReturnUrl(source: string): To | null {
  const url = new URL(source);
  return {
    pathname: url.pathname,
    hash: url.hash,
    search: url.search,
  };
}

// Due to this issue, you cannot solely rely on the referer header
//   https://github.com/remix-run/remix/issues/3510
export function useReturnNavigation(
  location: Location,
  referrer: string | null,
  readState: ReadStateFunction = defaultReadState,
): To | null {
  const [result, setResult] = useState(referrer && getReturnUrl(referrer));

  useEffect(() => {
    if (!location.state) {
      return;
    }

    const source = readState(location.state as Record<string, unknown>)

    if (source) {
      setResult(getReturnUrl(source))
    }
  }, [location, readState]);

  return result;
}
