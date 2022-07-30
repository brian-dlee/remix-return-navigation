import type { Location } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';

function combine(url: string, location: Location): string {
  const result = new URL(url);
  result.pathname = location.pathname;
  result.hash = location.hash;
  result.search = location.search;
  return result.toString();
}

export function useCurrentLocation(current: string) {
  const location = useLocation();
  const [url, setUrl] = useState<string | null>(combine(current, location));

  useEffect(() => {
    setUrl(`${window.location.origin}${location.pathname}${location.search}${location.hash}`);
  }, [location]);

  return url;
}
