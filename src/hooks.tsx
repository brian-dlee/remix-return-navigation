import { useContext } from 'react';
import { ReturnNavigationContext } from './context';

export function useReturnLocation() {
  const { returnLocation } = useContext(ReturnNavigationContext);
  return returnLocation;
}

export function useReturnNavigationOptions() {
  const { defaultReturnLocationParam } = useContext(ReturnNavigationContext);
  return { defaultReturnLocationParam };
}
