/**
 * @jest-environment: jsdom
 */

import { withURLData } from './lib'

function fakeHeaders(all: Record<string, string>) {
  return {
    get(key: string) { return all[key] }
  }
}

function fakeRequest(url: string, headers: ReturnType<typeof fakeHeaders>): Request {
  return {
    url,
    headers,
  } as unknown as Request
}

describe('lib', () => {
  describe('withURLData', () => {
    it('return url data', () => {
      const current = "https://mysite.com/sign-up"
      const referrer = "https://mysite.com/promotion-page?utm=abcdefg"
      const request = fakeRequest(current, fakeHeaders({ 'referer': referrer }));
      expect(withURLData(request, { a: 1 })).toEqual({
        url: { current, referrer },
        a: 1,
      })
    })
  })
})
