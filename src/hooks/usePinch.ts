import { useEffect, useRef, type RefObject } from 'react';

export interface PinchOptions {
  /** Fingers moved together (zoom out). */
  onPinchIn?: () => void;
  /** Fingers moved apart (zoom in). */
  onPinchOut?: () => void;
  /** Live scale while pinching (1 = start distance). */
  onPinchMove?: (scale: number) => void;
  onPinchEnd?: () => void;
  /** Scale change that commits a pinch. 0.25 → commits below 0.75 or above 1.25. */
  sensitivity?: number;
  disabled?: boolean;
}

/**
 * Two-finger pinch via Pointer Events, plus trackpad pinch (which browsers
 * report as ctrl + wheel). Fires each commit callback at most once per gesture.
 */
export function usePinch<T extends HTMLElement>(ref: RefObject<T | null>, options: PinchOptions) {
  const latest = useRef(options);
  latest.current = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || options.disabled) return;

    const pointers = new Map<number, { x: number; y: number }>();
    let startDistance = 0;
    let committed = false;

    const distance = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const commit = (scale: number) => {
      const { sensitivity = 0.25, onPinchIn, onPinchOut } = latest.current;
      if (committed) return;
      if (scale < 1 - sensitivity) {
        committed = true;
        onPinchIn?.();
      } else if (scale > 1 + sensitivity) {
        committed = true;
        onPinchOut?.();
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        startDistance = distance();
        committed = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size !== 2 || startDistance === 0) return;
      const scale = distance() / startDistance;
      latest.current.onPinchMove?.(scale);
      commit(scale);
    };

    const onUp = (e: PointerEvent) => {
      if (!pointers.delete(e.pointerId)) return;
      if (pointers.size < 2 && startDistance) {
        startDistance = 0;
        latest.current.onPinchEnd?.();
      }
    };

    // Trackpad pinch: accumulate ctrl+wheel deltas into one gesture.
    let wheelScale = 1;
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (wheelScale === 1) committed = false;
      wheelScale *= Math.exp(-e.deltaY / 100);
      latest.current.onPinchMove?.(wheelScale);
      commit(wheelScale);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelScale = 1;
        latest.current.onPinchEnd?.();
      }, 160);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      clearTimeout(wheelTimer);
    };
  }, [ref, options.disabled]);
}
