import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { usePinch } from '../../hooks/usePinch';
import { startViewTransition } from '../../hooks/useViewTransition';
import { cx } from '../../utils/cx';
import { vtName } from '../../utils/vtName';

interface TileGridContextValue {
  zoomed: boolean;
  zoomTo: (groupId: string) => void;
}
const TileGridContext = createContext<TileGridContextValue>({ zoomed: false, zoomTo: () => {} });

export interface TileGridProps extends HTMLAttributes<HTMLElement> {
  /** Accessible name for the region, e.g. "Start". */
  'aria-label'?: string;
  /**
   * Enables Metro's semantic zoom: pinch in (or ctrl + scroll on a trackpad)
   * to see all groups at once, pinch out or pick a group to zoom back in.
   */
  semanticZoom?: boolean;
  zoomed?: boolean;
  defaultZoomed?: boolean;
  onZoomedChange?: (zoomed: boolean) => void;
  /**
   * `auto` scrolls groups horizontally on wide containers and stacks them on
   * narrow ones; `horizontal` / `vertical` force one layout.
   */
  orientation?: 'auto' | 'horizontal' | 'vertical';
  children?: ReactNode;
}

/**
 * The Start-screen canvas. Holds `TileGroup`s and handles responsive layout,
 * wheel-to-horizontal scrolling and semantic zoom.
 */
export function TileGrid({
  semanticZoom = false,
  zoomed: controlled,
  defaultZoomed = false,
  onZoomedChange,
  orientation = 'auto',
  className,
  children,
  ...rest
}: TileGridProps) {
  const ref = useRef<HTMLElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultZoomed);
  const zoomed = semanticZoom && (controlled ?? uncontrolled);

  const setZoomed = (next: boolean, then?: () => void) => {
    if (next === zoomed) return;
    void startViewTransition(
      () => {
        if (controlled === undefined) setUncontrolled(next);
        onZoomedChange?.(next);
      },
      { types: ['fade'] },
    ).then(then);
  };

  usePinch(ref, {
    disabled: !semanticZoom,
    onPinchIn: () => setZoomed(true),
    onPinchOut: () => setZoomed(false),
  });

  // Desktop mice only have a vertical wheel; map it to horizontal scrolling
  // when the grid only overflows sideways (as the Windows 8 Start screen did).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const sideways = el.scrollWidth > el.clientWidth + 1;
      const vertical = el.scrollHeight > el.clientHeight + 1;
      if (!sideways || vertical) return;
      e.preventDefault();
      el.scrollBy({ left: e.deltaY, behavior: e.deltaMode === 0 ? 'instant' : 'smooth' });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const zoomTo = (groupId: string) =>
    setZoomed(false, () => {
      document.getElementById(groupId)?.scrollIntoView({ inline: 'start', block: 'nearest' });
      document.getElementById(groupId)?.querySelector<HTMLElement>('a, button, [tabindex]')?.focus();
    });

  return (
    <TileGridContext.Provider value={{ zoomed, zoomTo }}>
      <section
        ref={ref}
        className={cx('mg-tile-grid', className)}
        data-orientation={orientation}
        data-zoomed={zoomed || undefined}
        data-semantic-zoom={semanticZoom || undefined}
        {...rest}
      >
        <div className="mg-tile-grid__groups">{children}</div>
      </section>
    </TileGridContext.Provider>
  );
}

export interface TileGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Group header (rendered as an `h2`). */
  title?: ReactNode;
  /** Columns in tile units on wide layouts. Small = 1, medium = 2, wide = 4. */
  columns?: number;
  /**
   * Fill gaps with later tiles (Metro packing). This can make the visual order
   * differ from the focus order, so it is off by default.
   */
  dense?: boolean;
  children?: ReactNode;
}

export function TileGroup({ title, columns = 6, dense = false, className, children, style, ...rest }: TileGroupProps) {
  const { zoomed, zoomTo } = useContext(TileGridContext);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const groupId = rest.id ?? `mg-group-${id}`;
  const headingId = `${groupId}-heading`;

  return (
    <div
      id={groupId}
      role="group"
      aria-labelledby={title ? headingId : undefined}
      className={cx('mg-tile-group', className)}
      data-dense={dense || undefined}
      style={{ '--_cols': columns, viewTransitionName: vtName('mg-group', id), ...style } as CSSProperties}
      {...rest}
    >
      {title && (
        <h2 id={headingId} className="mg-tile-group__title">
          {title}
        </h2>
      )}
      <div className="mg-tile-group__tiles" inert={zoomed || undefined}>
        {children}
      </div>
      {zoomed && (
        <button
          type="button"
          className="mg-tile-group__zoom mg-focusable"
          onClick={() => zoomTo(groupId)}
          aria-label={typeof title === 'string' ? `Open ${title}` : 'Open group'}
        />
      )}
    </div>
  );
}
