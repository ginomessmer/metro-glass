import { useEffect, useState } from 'react';
import { startViewTransition, type MetroTransitionType } from 'metro-glass';

/** A tiny History API router whose navigations run inside view transitions. */
const setters = new Set<(path: string) => void>();

export function navigate(to: string, type: MetroTransitionType = 'turnstile') {
  if (to === location.pathname) return;
  void startViewTransition(
    () => {
      history.pushState({ type }, '', to);
      setters.forEach((set) => set(to));
      window.scrollTo(0, 0);
    },
    { types: [type] },
  );
}

export function usePath() {
  const [path, setPath] = useState(() => location.pathname);
  useEffect(() => {
    setters.add(setPath);
    const onPop = () =>
      void startViewTransition(() => setPath(location.pathname), { types: ['slide-back'] });
    addEventListener('popstate', onPop);
    return () => {
      setters.delete(setPath);
      removeEventListener('popstate', onPop);
    };
  }, []);
  return path;
}
