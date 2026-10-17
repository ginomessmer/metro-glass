import { useEffect, useRef, type RefObject } from 'react';

export interface SwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  /** Minimum horizontal travel in px. */
  threshold?: number;
  disabled?: boolean;
}

/**
 * Horizontal swipe detection with Pointer Events. Ignores multi-finger
 * gestures (those belong to pinch) and mostly-vertical drags (those scroll).
 * Pair with `touch-action: pan-y` on the element.
 */
export function useSwipe<T extends HTMLElement>(ref: RefObject<T | null>, options: SwipeOptions) {
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || options.disabled) return;

    const active = new Map<number, { x: number; y: number; t: number }>();
    let cancelled = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return; // mouse users have tabs & keys
      active.set(e.pointerId, { x: e.clientX, y: e.clientY, t: e.timeStamp });
      cancelled = active.size > 1;
    };

    const onUp = (e: PointerEvent) => {
      const start = active.get(e.pointerId);
      active.delete(e.pointerId);
      if (!start || cancelled) {
        if (active.size === 0) cancelled = false;
        return;
      }
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const { threshold = 48, onSwipeLeft, onSwipeRight } = latest.current;
      const fast = Math.abs(dx) / Math.max(e.timeStamp - start.t, 1) > 0.5;
      if (Math.abs(dx) < (fast ? threshold / 2 : threshold) || Math.abs(dx) < Math.abs(dy) * 1.5)
        return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    };

    const onCancel = (e: PointerEvent) => active.delete(e.pointerId);

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onCancel);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onCancel);
    };
  }, [ref, options.disabled]);
}
