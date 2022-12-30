/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ReturnNavigationContext, defaultReturnNavigationOptions } from './context';
import { BackwardLink } from './backward-link';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('BackwardLink', () => {
  test('renders a backward link', async () => {
    render(
      <BrowserRouter>
        <ReturnNavigationContext.Provider
          value={{
            returnLocation: { pathname: '/catalog', hash: '#help', search: '?page=1' },
            currentLocation: { pathname: '/product/1', hash: '', search: '' },
            ...defaultReturnNavigationOptions,
          }}
        >
          <BackwardLink role={'target'}>Go Back</BackwardLink>
        </ReturnNavigationContext.Provider>
      </BrowserRouter>
    );

    const element = screen.getByRole('target');

    expect(element.getAttribute('href')).toBe('/catalog?page=1#help');
    expect(element.textContent).toBe('Go Back');
  });
});
