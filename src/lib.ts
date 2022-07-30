export interface URLData {
  url: {
    referrer: string | null;
    current: string;
  };
}

export function withURLData(request: Request): URLData;

export function withURLData<T extends Record<string, unknown>>(
  request: Request,
  additional: T
): URLData & T;

export function withURLData<T>(request: Request, additional?: T): URLData | (URLData & T) {
  return { url: { current: request.url, referrer: request.headers.get('referer') }, ...additional };
}
