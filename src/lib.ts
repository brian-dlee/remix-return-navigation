export interface ReturnNavigationState {
  referrer: string | null;
  requestUrl: string;
}

export function getReturnNavigationState(request: Request): ReturnNavigationState {
  const referrer = request.headers.get('referer') || null;
  return { requestUrl: request.url, referrer };
}
