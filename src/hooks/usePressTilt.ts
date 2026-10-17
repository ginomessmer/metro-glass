import { useEffect, type RefObject } from 'react';

export interface PressTiltOptions {
  /** Disable the 3D tilt but keep the pointer light. */
  tilt?: boolean;
  disabled?: boolean;
}

/**
 * Metro's signature "tilt on press", plus Liquid Glass's pointer-following
 * light. Each element tracks its own pointers, so several tiles can be held
 * at once on a multi-touch screen.
 *
 * Writes `--mg-tilt-x`, `--mg-tilt-y`, `--mg-press`, `--mg-light-x`,
 * `--mg-light-y` and `data-pressed` on the element; CSS does the rest.
 */
export function usePressTilt<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { tilt = true, disabled = false }: PressTiltOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const pointers = new Set<number>();

    const place = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
      const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
      return { x, y };
    };

    const setLight = (x: number, y: number) => {
      el.style.setProperty('--mg-light-x', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--mg-light-y', `${(y * 100).toFixed(1)}%`);
    };

    const press = (event: PointerEvent) => {
      const { x, y } = place(event);
      setLight(x, y);
      if (!tilt) return;
      // Distance from centre decides tilt vs. sink: the edge you press goes down.
      const dx = x - 0.5;
      const dy = y - 0.5;
      const edge = Math.max(Math.abs(dx), Math.abs(dy)) * 2; // 0 centre → 1 edge
      const max = 'var(--mg-tilt-max)';
      el.style.setProperty('--mg-tilt-x', `calc(${max} * ${(-dy * 2 * edge).toFixed(3)})`);
      el.style.setProperty('--mg-tilt-y', `calc(${max} * ${(dx * 2 * edge).toFixed(3)})`);
      el.style.setProperty('--mg-press', (0.97 + 0.02 * edge).toFixed(3));
    };

    const release = () => {
      el.removeAttribute('data-pressed');
      el.style.removeProperty('--mg-tilt-x');
      el.style.removeProperty('--mg-tilt-y');
      el.style.removeProperty('--mg-press');
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointers.add(event.pointerId);
      el.setAttribute('data-pressed', '');
      press(event);
    };

    const onMove = (event: PointerEvent) => {
      if (pointers.has(event.pointerId)) press(event);
      else if (event.pointerType === 'mouse') setLight(place(event).x, place(event).y);
    };

    const onUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size === 0) release();
    };

    const onLeave = (event: PointerEvent) => {
      // Touch pointers leave when lifted; mouse may leave while held.
      onUp(event);
      if (event.pointerType === 'mouse') el.style.removeProperty('--mg-light-x');
      if (event.pointerType === 'mouse') el.style.removeProperty('--mg-light-y');
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
        el.setAttribute('data-pressed', '');
        if (tilt) el.style.setProperty('--mg-press', '0.97');
      }
    };
    const onKeyUp = () => {
      if (pointers.size === 0) release();
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('keydown', onKeyDown);
    el.addEventListener('keyup', onKeyUp);
    el.addEventListener('blur', onKeyUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('keyup', onKeyUp);
      el.removeEventListener('blur', onKeyUp);
      release();
    };
  }, [ref, tilt, disabled]);
}
