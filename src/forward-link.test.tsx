/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ReturnNavigationContext, defaultReturnNavigationOptions } from './context';
import { ForwardLink } from './forward-link';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Link } from './link';
import { Link as RemixLink } from '@remix-run/react';

jest.mock('./link', () => ({
  Link: jest.fn((props) => {
    return <RemixLink {...props}>{props.children}</RemixLink>;
  }),
}));

describe('ForwardLink', () => {
  it('renders a forward link with a string "to" prop with search param storage', async () => {
    render(
      <BrowserRouter>
        <ReturnNavigationContext.Provider
          value={{
            returnLocation: null,
            currentLocation: { pathname: '/catalog', hash: '#help', search: '?page=1' },
            ...defaultReturnNavigationOptions,
            clientSideReturnLocationStorage: 'searchParam',
          }}
        >
          <ForwardLink role={'target'} to={'/product/1?utm=junk#specs'}>
            View Product
          </ForwardLink>
        </ReturnNavigationContext.Provider>
      </BrowserRouter>
    );

    const element = screen.getByRole('target');

    expect(element.getAttribute('href')).toBe(
      `/product/1?utm=junk&return=${encodeURIComponent('/catalog?page=1')}#specs`
    );
    expect(element.textContent).toBe('View Product');
  });

  it('renders a forward link with a string "to" prop with location state storage', async () => {
    const currentLocation = { pathname: '/catalog', hash: '#help', search: '?page=1' };

    render(
      <BrowserRouter>
        <ReturnNavigationContext.Provider
          value={{
            returnLocation: null,
            currentLocation,
            ...defaultReturnNavigationOptions,
            clientSideReturnLocationStorage: 'locationState',
          }}
        >
          <ForwardLink role={'target'} to={'/product/1?utm=junk#specs'}>
            View Product
          </ForwardLink>
        </ReturnNavigationContext.Provider>
      </BrowserRouter>
    );

    const element = screen.getByRole('target');

    expect(Link).toHaveBeenCalledWith(
      {
        role: 'target',
        children: 'View Product',
        state: { returnLocation: currentLocation },
        to: {
          pathname: '/product/1',
          search: '?utm=junk',
          hash: '#specs',
        },
      },
      {}
    );
    expect(element.getAttribute('href')).toBe(`/product/1?utm=junk#specs`);
    expect(element.textContent).toBe('View Product');
  });

  it('renders a forward link with a string "to" prop with location state storage and alternate key', async () => {
    const currentLocation = { pathname: '/catalog', hash: '#help', search: '?page=1' };

    render(
      <BrowserRouter>
        <ReturnNavigationContext.Provider
          value={{
            returnLocation: null,
            currentLocation,
            ...defaultReturnNavigationOptions,
            clientSideReturnLocationStorage: 'locationState',
            defaultReturnLocationStateKey: 'something-else',
          }}
        >
          <ForwardLink role={'target'} to={'/product/1?utm=junk#specs'}>
            View Product
          </ForwardLink>
        </ReturnNavigationContext.Provider>
      </BrowserRouter>
    );

    const element = screen.getByRole('target');

    expect(Link).toHaveBeenCalledWith(
      {
        role: 'target',
        children: 'View Product',
        state: { returnLocation: currentLocation },
        to: {
          pathname: '/product/1',
          search: '?utm=junk',
          hash: '#specs',
        },
      },
      {}
    );
    expect(element.getAttribute('href')).toBe(`/product/1?utm=junk#specs`);
    expect(element.textContent).toBe('View Product');
  });

  it('renders a forward link with a Path "to" prop', async () => {
    render(
      <BrowserRouter>
        <ReturnNavigationContext.Provider
          value={{
            returnLocation: null,
            currentLocation: { pathname: '/catalog', hash: '#help', search: '?page=1' },
            ...defaultReturnNavigationOptions,
            clientSideReturnLocationStorage: 'searchParam',
          }}
        >
          <ForwardLink
            role={'target'}
            to={{ pathname: '/product/1', search: 'utm=junk', hash: '#specs' }}
          >
            View Product
          </ForwardLink>
        </ReturnNavigationContext.Provider>
      </BrowserRouter>
    );

    const element = screen.getByRole('target');

    expect(element.getAttribute('href')).toBe(
      `/product/1?utm=junk&return=${encodeURIComponent('/catalog?page=1')}#specs`
    );
    expect(element.textContent).toBe('View Product');
  });

  it('renders a forward link and obeys the return parameter option', async () => {
    render(
      <BrowserRouter>
        <ReturnNavigationContext.Provider
          value={{
            returnLocation: null,
            currentLocation: { pathname: '/catalog', hash: '#help', search: '?page=1' },
            ...defaultReturnNavigationOptions,
            clientSideReturnLocationStorage: 'searchParam',
            defaultReturnLocationSearchParam: 'something-else',
          }}
        >
          <ForwardLink
            role={'target'}
            to={{ pathname: '/product/1', search: 'utm=junk', hash: '#specs' }}
          >
            View Product
          </ForwardLink>
        </ReturnNavigationContext.Provider>
      </BrowserRouter>
    );

    const element = screen.getByRole('target');

    expect(element.getAttribute('href')).toBe(
      `/product/1?utm=junk&something-else=${encodeURIComponent('/catalog?page=1')}#specs`
    );
    expect(element.textContent).toBe('View Product');
  });
});
