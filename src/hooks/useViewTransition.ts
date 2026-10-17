import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { prefersReducedMotion } from './useReducedMotion';

export type MetroTransitionType = 'turnstile' | 'continuum' | 'slide' | 'slide-back' | 'fade';

export interface ViewTransitionOptions {
  /**
   * View transition types, exposed to CSS as
   * `:active-view-transition-type(…)`. Metro Glass ships styles for
   * `turnstile`, `continuum`, `slide`, `slide-back` and `fade`.
   */
  types?: Array<MetroTransitionType | (string & {})>;
}

type StartViewTransition = (
  arg: (() => void) | { update: () => void; types?: string[] },
) => { finished: Promise<void> };

/**
 * Runs a React state update inside `document.startViewTransition`, falling
 * back to a plain update when the API is missing or the user prefers reduced
 * motion. Returns a promise that resolves once the transition has finished.
 */
export function startViewTransition(
  update: () => void,
  { types = [] }: ViewTransitionOptions = {},
): Promise<void> {
  const doc = typeof document !== 'undefined' ? document : undefined;
  const start = (doc as { startViewTransition?: StartViewTransition } | undefined)
    ?.startViewTransition;

  if (!doc || !start || prefersReducedMotion()) {
    update();
    return Promise.resolve();
  }

  const run = () => flushSync(update);
  // Fall back to a type-less transition on engines that only take a callback,
  // exposing the type as a data attribute so CSS still knows what to play.
  const root = doc.documentElement;
  root.dataset.mgTransition = types.join(' ');
  let transition: { finished: Promise<void> };
  try {
    transition = start.call(doc, { update: run, types });
  } catch {
    transition = start.call(doc, run);
  }
  return transition.finished.finally(() => {
    delete root.dataset.mgTransition;
  });
}

/** Hook form of {@link startViewTransition}. */
export function useViewTransition() {
  return useCallback(
    (update: () => void, options?: ViewTransitionOptions) => startViewTransition(update, options),
    [],
  );
}
