/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { unstable_createRemixStub } from '@remix-run/testing';
import {
  ReturnNavigationContextProvider,
  ReturnNavigationContext,
  defaultReturnNavigationOptions,
} from './context';
import { useContext } from 'react';
import { RemixBrowser } from '@remix-run/react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const spy = jest.fn((props) => null);

function Consumer() {
  return spy(useContext(ReturnNavigationContext));
}

describe('ReturnNavigationContextProvider', () => {
  test('passes return navigation data down to components', async () => {
    const Entry = unstable_createRemixStub([
      {
        path: '/',
        loader: () => null,
        element: (
          <ReturnNavigationContextProvider
            {...defaultReturnNavigationOptions}
            referrer="https://site.com/catalog?page=1#help"
            requestUrl="https://site.com/product/1?utm=junk#specs"
          >
            <Consumer />
          </ReturnNavigationContextProvider>
        ),
      },
    ]);

    render(<Entry />);

    expect(spy).toHaveBeenCalledWith({
      ...defaultReturnNavigationOptions,
      currentLocation: {
        pathname: '/product/1',
        search: '?utm=junk',
        hash: '#specs',
      },
      returnLocation: {
        pathname: '/catalog',
        search: '?page=1',
        hash: '#help',
      },
    });
  });
});
