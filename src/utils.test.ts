/**
 * @jest-environment: jsdom
 */

import {
  getPathFromSearch,
  getPathFromUrl,
  isRelativeUrl,
  relativeUrlToPath,
  withReturnLocation,
} from './utils';

describe('utils', () => {
  describe('getPathFromUrl', () => {
    it('return a path given a string', () => {
      expect(getPathFromUrl('https://mysite.com/sign-up?t=9980#help')).toEqual({
        pathname: '/sign-up',
        search: '?t=9980',
        hash: '#help',
      });
    });

    it('handles missing components', () => {
      expect(getPathFromUrl('https://mysite.com')).toEqual({
        pathname: '/',
        search: '',
        hash: '',
      });
    });
  });

  describe('getPathFromSearch', () => {
    it('return a path from a search parameter', () => {
      expect(getPathFromSearch(`?return=${encodeURIComponent('/login?u=new')}`, 'return')).toEqual({
        pathname: '/login',
        search: '?u=new',
        hash: '',
      });
    });

    it('supports alternative params', () => {
      expect(getPathFromSearch(`?alt=${encodeURIComponent('/login?u=new')}`, 'alt')).toEqual({
        pathname: '/login',
        search: '?u=new',
        hash: '',
      });
    });

    it('throws for absolute urls', () => {
      expect(() =>
        getPathFromSearch(
          `?return=${encodeURIComponent('https://mysite.com/page1/login?u=new')}`,
          'return'
        )
      ).toThrowError(/absolute/);
    });
  });

  describe('isRelativeUrl', () => {
    it('handles absolute urls', () => {
      expect(isRelativeUrl('https://mysite.com/info')).toBe(false);
    });

    it('handles protocol relative urls', () => {
      expect(isRelativeUrl('//mysite.com')).toBe(false);
    });

    it('handles urls without a protocol', () => {
      expect(isRelativeUrl('mysite.com/info')).toBe(false);
    });

    it('handles urls with a port', () => {
      expect(isRelativeUrl('mysite.com:9000/info')).toBe(false);
    });

    it('rooted urls', () => {
      expect(isRelativeUrl('/info#help')).toBe(true);
    });

    it('non-rooted urls', () => {
      expect(isRelativeUrl('info?article=201')).toBe(true);
    });
  });

  describe('relativeUrlToPath', () => {
    it('return a path given a relative url', () => {
      expect(relativeUrlToPath('/sign-up?t=9980#help')).toEqual({
        pathname: '/sign-up',
        search: '?t=9980',
        hash: '#help',
      });
    });

    it('handles no search component', () => {
      expect(relativeUrlToPath('/sign-up#help')).toEqual({
        pathname: '/sign-up',
        search: '',
        hash: '#help',
      });
    });

    it('handles no hash component', () => {
      expect(relativeUrlToPath('/sign-up?meta=20')).toEqual({
        pathname: '/sign-up',
        search: '?meta=20',
        hash: '',
      });
    });

    it('handles name only', () => {
      expect(relativeUrlToPath('login')).toEqual({
        pathname: 'login',
        search: '',
        hash: '',
      });
    });

    it('throws for absolute urls', () => {
      expect(() => relativeUrlToPath('//mysite.com')).toThrow();
    });

    it('handles strange cases', () => {
      expect(relativeUrlToPath('?m=2')).toEqual({
        pathname: '',
        search: '?m=2',
        hash: '',
      });
      expect(relativeUrlToPath('#two')).toEqual({
        pathname: '',
        search: '',
        hash: '#two',
      });
    });
  });

  describe('withReturnLocation', () => {
    it('adds a return location to the provided path', () => {
      const path = { pathname: '/target', search: '?p=1', hash: '#info' };
      const location = { pathname: '/source', search: '?p=2', hash: '#top' };
      // we intenionally omit hash from the return link since it's not visible from the server-side
      expect(withReturnLocation(path, location, 'return')).toEqual({
        pathname: '/target',
        search: `?p=1&return=${encodeURIComponent('/source?p=2')}`,
        hash: '#info',
      });
    });

    it('removes an existing return', () => {
      const path = {
        pathname: '/target',
        search: `?p=1&return=${encodeURIComponent('/another-source')}`,
        hash: '#info',
      };
      const location = { pathname: '/source', search: '?p=2', hash: '#top' };
      expect(withReturnLocation(path, location, 'return')).toEqual({
        pathname: '/target',
        search: `?p=1&return=${encodeURIComponent('/source?p=2')}`,
        hash: '#info',
      });
    });

    it('defaults to root if there is no pathname', () => {
      const path = {
        pathname: 'target',
        search: '?p=1',
        hash: '#info',
      };
      const location = { search: '?p=2', hash: '#top' };
      expect(withReturnLocation(path, location, 'return')).toEqual({
        pathname: 'target',
        search: `?p=1&return=${encodeURIComponent('/?p=2')}`,
        hash: '#info',
      });
    });
  });
});
