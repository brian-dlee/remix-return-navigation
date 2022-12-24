import type { PropsWithChildren } from 'react';
import * as React from 'react';
import { useMemo } from 'react';
import { createContext, useEffect, useReducer } from 'react';
import type { Path } from 'history';
import { getPathFromUrl, getPathFromSearch, hasMatchingOrigin } from './utils';
import { useLocation, useTransition } from '@remix-run/react';

interface ReturnNavigationOptions {
  shouldUseNavigateOnHydrate: boolean;
  defaultReturnLocationSearchParam: string;
  defaultReturnLocationStateKey: string;
  clientSideReturnLocationStorage: 'searchParam' | 'locationState';
}

type ReturnNavigationReducerAction =
  | { type: 'LOADING'; nextLocation: Path }
  | { type: 'IDLE'; currentLocation: Path; returnLocation: Path | null };

interface ReturnNavigationReducerState {
  returnLocation: Path | null;
  currentLocation: Path;
}

interface ReturnNavigationContextData extends ReturnNavigationOptions {
  returnLocation: Path | null;
  currentLocation: Path;
}

type ReturnNavigationContextProps = PropsWithChildren<
  Partial<ReturnNavigationOptions> & {
    referrer: string | null;
    requestUrl: string;
  }
>;

const defaultValue: ReturnNavigationContextData = {
  returnLocation: null,
  currentLocation: { pathname: '/', search: '', hash: '' },
  shouldUseNavigateOnHydrate: true,
  defaultReturnLocationSearchParam: 'return',
  defaultReturnLocationStateKey: 'returnLocation',
  clientSideReturnLocationStorage: 'locationState',
};

export const ReturnNavigationContext = createContext<ReturnNavigationContextData>(defaultValue);

export function ReturnNavigationContextProvider(props: ReturnNavigationContextProps) {
  const [state, dispatch] = useReducer(
    returnNavigationReducer,
    { referrer: props.referrer, requestUrl: props.requestUrl },
    (initial) => ({
      returnLocation:
        props.referrer && hasMatchingOrigin(props.requestUrl, props.referrer)
          ? getPathFromUrl(props.referrer)
          : null,
      currentLocation: getPathFromUrl(initial.requestUrl),
    })
  );

  // Due to this issue, you cannot solely rely on the referer header since it's erased on refresh when Javascript is enabled
  //   https://github.com/remix-run/remix/issues/3510
  const location = useLocation();
  const transition = useTransition();

  const options: ReturnNavigationOptions = useMemo(
    () => ({
      clientSideReturnLocationStorage:
        props.clientSideReturnLocationStorage || defaultValue.clientSideReturnLocationStorage,
      defaultReturnLocationSearchParam:
        props.defaultReturnLocationSearchParam || defaultValue.defaultReturnLocationSearchParam,
      defaultReturnLocationStateKey:
        props.defaultReturnLocationStateKey || defaultValue.defaultReturnLocationStateKey,
      shouldUseNavigateOnHydrate: resolveBoolean(
        props.shouldUseNavigateOnHydrate,
        defaultValue.shouldUseNavigateOnHydrate
      ),
    }),
    [props]
  );

  useEffect(() => {
    if (transition.state === 'idle') {
      dispatch({
        type: 'IDLE',
        currentLocation: {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
        returnLocation:
          options.clientSideReturnLocationStorage === 'searchParam'
            ? getPathFromSearch(location.search, options.defaultReturnLocationSearchParam)
            : location.state?.[options.defaultReturnLocationStateKey] || null,
      });
    } else if (transition.state === 'loading') {
      dispatch({
        type: 'LOADING',
        nextLocation: transition.location,
      });
    }
  }, [transition, location, options]);

  return (
    <ReturnNavigationContext.Provider
      value={{
        clientSideReturnLocationStorage: options.clientSideReturnLocationStorage,
        defaultReturnLocationSearchParam: options.defaultReturnLocationSearchParam,
        defaultReturnLocationStateKey: options.defaultReturnLocationStateKey,
        shouldUseNavigateOnHydrate: options.shouldUseNavigateOnHydrate,
        returnLocation: state.returnLocation,
        currentLocation: state.currentLocation,
      }}
    >
      {props.children}
    </ReturnNavigationContext.Provider>
  );
}

function resolveBoolean(...values: unknown[]): boolean {
  for (const value of values) {
    if (typeof value === 'boolean') {
      return value;
    }
  }
  return false;
}

function returnNavigationReducer(
  state: ReturnNavigationReducerState,
  action: ReturnNavigationReducerAction
): ReturnNavigationReducerState {
  switch (action.type) {
    case 'LOADING':
      return state;
    case 'IDLE':
      return {
        currentLocation: action.currentLocation,
        returnLocation: action.returnLocation,
      };
  }
}
