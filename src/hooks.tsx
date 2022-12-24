import { useContext } from 'react';
import { ReturnNavigationContext } from './context';

export function useReturnNavigation() {
  const {
    returnLocation,
    currentLocation,
    clientSideReturnLocationStorage,
    defaultReturnLocationSearchParam,
    defaultReturnLocationStateKey,
    shouldUseNavigateOnHydrate,
  } = useContext(ReturnNavigationContext);

  return {
    returnLocation,
    currentLocation,
    options: {
      clientSideReturnLocationStorage,
      defaultReturnLocationSearchParam,
      defaultReturnLocationStateKey,
      shouldUseNavigateOnHydrate,
    },
  };
}

export function useReturnLocation() {
  const { returnLocation } = useReturnNavigation();
  return returnLocation;
}

export function useReturnNavigationOptions() {
  const { options } = useReturnNavigation();
  return options;
}
