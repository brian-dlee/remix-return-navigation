import type { Path } from 'history';

const DEFAULT_RETURN_LOCATION_SEARCH_PARAM = 'return';
const ABSOLUTE_URL_REGEX = /^(\w+:(\/\/)?)?.+[^.]+\.[^.]+\/?/;

export function getPathFromUrl(source: string): Path {
  const url = new URL(source);

  return {
    pathname: url.pathname,
    hash: url.hash,
    search: url.search,
  };
}

export function getPathFromSearch(search: string, param?: string) {
  const url = new URLSearchParams(search || '').get(param || DEFAULT_RETURN_LOCATION_SEARCH_PARAM);

  return url && relativeUrlToPath(url);
}

export function isRelativeUrl(url: string): boolean {
  return !ABSOLUTE_URL_REGEX.test(url);
}

export function relativeUrlToPath(url: string): Path {
  if (!isRelativeUrl(url)) {
    throw new Error('URL cannot be absolute: ' + url);
  }

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
  const returnLocationParam = param || DEFAULT_RETURN_LOCATION_SEARCH_PARAM;
  const returnLocationPathname = returnLocation.pathname || '/';
  const returnLocationSearch = returnLocation.search || '';

  return {
    ...path,
    search: addSearchParameter(
      path.search || '',
      returnLocationParam,
      returnLocationPathname + removeSearchParameter(returnLocationSearch, returnLocationParam)
    ),
  };
}

function addSearchParameter(search: string, param: string, value: string): string {
  const params = new URLSearchParams(search);

  params.set(param, value);

  return `?${params.toString()}`;
}

function removeSearchParameter(search: string, param: string): string {
  const params = new URLSearchParams(search);

  params.delete(param);

  return new Array(params.keys()).length > 0 ? `?${params.toString()}` : '';
}
