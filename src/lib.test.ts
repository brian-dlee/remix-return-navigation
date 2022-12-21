/**
 * @jest-environment: jsdom
 */

import { getReturnNavigationState } from './lib';

function fakeHeaders(all: Record<string, string>) {
  return {
    get(key: string) {
      return all[key];
    },
  };
}

function fakeRequest(url: string, headers: ReturnType<typeof fakeHeaders>): Request {
  return {
    url,
    headers,
  } as unknown as Request;
}

describe('lib', () => {
  describe('getReturnNavigationState', () => {
    it('return url data', () => {
      const requestUrl = 'https://mysite.com/sign-up';
      const referrer = 'https://mysite.com/promotion-page?utm=abcdefg';
      const request = fakeRequest(requestUrl, fakeHeaders({ referer: referrer }));
      expect(getReturnNavigationState(request)).toEqual({
        requestUrl,
        referrer,
      });
    });
  });
});
