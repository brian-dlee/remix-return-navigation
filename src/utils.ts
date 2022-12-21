import type { To } from 'history';
import type { Path } from 'history';

const DEFAULT_RETURN_LOCATION_SEARCH_PARAM = 'return';
const ABSOLUTE_URL_REGEX = /^(\w+:)?\/\/.+[^.]+\.[^.]+\//;

export function getLocationFromUrl(source: string): To {
  const url = new URL(source);
  return {
    pathname: url.pathname,
    hash: url.hash,
    search: url.search,
  };
}

export function getReturnLocationFromSearch(search: string, param?: string) {
  const returnLocation = new URLSearchParams(search || '').get(
    param || DEFAULT_RETURN_LOCATION_SEARCH_PARAM
  );
  console.log('getReturnLocationFromSearch::beforePartialPath', returnLocation);
  return returnLocation && relativeUrlToPath(returnLocation);
}

export function isRelativeUrl(url: string): boolean {
  return !ABSOLUTE_URL_REGEX.test(url);
}

export function relativeUrlToPath(url: string): Path {
  const path: Path = { pathname: '', search: '', hash: '' };
  const [head, tail] = url.split('?', 2);

  if (tail) {
    const [search, hash] = tail.split('#', 2);
    path.pathname = head;
    path.search = search ? `?${search}` : '';
    path.hash = hash ? `#${hash}` : '';
  } else {
    const [pathname, hash] = head.split('#', 2);
    path.pathname = pathname;
    path.hash = hash ? `#${hash}` : '';
  }

  return path;
}

export function withReturnLocation(
  path: Partial<Path>,
  returnLocation: Partial<Path>,
  param?: string
) {
  const params = new URLSearchParams(path.search);
  const returnLocationPathname = returnLocation.pathname || '/';
  const returnLocationSearchParams = new URLSearchParams(returnLocation.search);

  returnLocationSearchParams.delete(param || DEFAULT_RETURN_LOCATION_SEARCH_PARAM);

  let returnLocationSearch = '';
  if (new Array(returnLocationSearchParams.keys()).length > 0) {
    returnLocationSearch = `?${returnLocationSearchParams.toString()}`;
  }

  let computed = returnLocationPathname;

  if (returnLocationSearch) {
    computed += returnLocationSearch;
  }

  params.set(param || DEFAULT_RETURN_LOCATION_SEARCH_PARAM, computed);

  const result: Partial<Path> = {
    pathname: path.pathname,
    hash: path.hash,
    search: '',
  };

  if (new Array(params.keys()).length > 0) {
    result.search = `?${params.toString()}`;
  }

  return result;
}
