import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
}

const getSnapshot = () =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches;

/** True when the user asked the OS to minimise motion. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Non-hook variant for event handlers. */
export const prefersReducedMotion = getSnapshot;
