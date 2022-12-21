import type { PropsWithChildren } from 'react';
import * as React from 'react';
import { createContext, useEffect, useState } from 'react';
import type { To } from 'history';
import { getLocationFromUrl, getReturnLocationFromSearch } from './utils';
import { useLocation } from '@remix-run/react';

interface ReturnNavigationContextData {
  returnLocation: To | null;
  defaultReturnLocationParam?: string;
}

type Props = PropsWithChildren<{
  referrer: string | null;
  defaultReturnLocationParam?: string;
}>;

export const ReturnNavigationContext = createContext<ReturnNavigationContextData>({
  returnLocation: null,
});

export function ReturnNavigationContextProvider(props: Props) {
  const [returnLocation, setReturnLocation] = useState(
    props.referrer && getLocationFromUrl(props.referrer)
  );

  // Due to this issue, you cannot solely rely on the referer header
  //   https://github.com/remix-run/remix/issues/3510
  const location = useLocation();

  useEffect(() => {
    const returnLocation = getReturnLocationFromSearch(
      location.search,
      props.defaultReturnLocationParam
    );

    if (returnLocation) {
      setReturnLocation(returnLocation);
    }
  }, [location, props.defaultReturnLocationParam, props.referrer]);

  return (
    <ReturnNavigationContext.Provider
      value={{
        defaultReturnLocationParam: props.defaultReturnLocationParam,
        returnLocation,
      }}
    >
      {props.children}
    </ReturnNavigationContext.Provider>
  );
}
