import {
  Children,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Link, type LinkProps } from '../Link/Link';
import { cx } from '../../utils/cx';

export interface AppBarProps extends HTMLAttributes<HTMLElement> {
  /** Usually an `<AppBarBrand>`. */
  brand?: ReactNode;
  /** Navigation items (`<AppBarItem>`), wrapped in a labelled `<nav>` list. */
  children?: ReactNode;
  /** Extra controls after the navigation, e.g. a search button. */
  actions?: ReactNode;
  /** Accessible name of the navigation landmark. */
  navLabel?: string;
  /**
   * Morph from a floating glass pill into a full-width bar fused with the top
   * edge as the page scrolls. Driven by a CSS scroll-driven animation.
   */
  morph?: boolean;
}

const supportsScrollTimeline = () =>
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: scroll()');

/**
 * Top app bar. Sticky, glass, and — with `morph` — it docks into the top edge
 * of the viewport on scroll, extending under the status bar / notch.
 */
export function AppBar({
  brand,
  children,
  actions,
  navLabel = 'Main',
  morph = true,
  className,
  ...rest
}: AppBarProps) {
  const ref = useRef<HTMLElement>(null);

  // Fallback for engines without scroll-driven animations: same progress
  // variable, written from a rAF-throttled scroll listener.
  useEffect(() => {
    const el = ref.current;
    if (!el || !morph || supportsScrollTimeline()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = parseFloat(getComputedStyle(el).getPropertyValue('--mg-appbar-morph-distance')) || 96;
      el.style.setProperty('--mg-appbar-progress', String(Math.min(Math.max(scrollY / distance, 0), 1)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [morph]);

  const items = Children.toArray(children);

  return (
    <header ref={ref} className={cx('mg-appbar', 'mg-glass', className)} data-morph={morph || undefined} {...rest}>
      {brand}
      {items.length > 0 && (
        <nav aria-label={navLabel} className="mg-appbar__nav">
          <ul className="mg-appbar__list">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </nav>
      )}
      {actions && <div className="mg-appbar__actions">{actions}</div>}
    </header>
  );
}

export interface AppBarBrandProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Mark shown before the name; stays visible when the name collapses. */
  logo?: ReactNode;
  /** Product name. Visually hidden on narrow bars, but kept as the link's name. */
  children: ReactNode;
}

export function AppBarBrand({ logo, children, className, ...rest }: AppBarBrandProps) {
  return (
    <a className={cx('mg-appbar__brand', 'mg-focusable', className)} {...rest}>
      {logo && (
        <span className="mg-appbar__logo" aria-hidden="true">
          {logo}
        </span>
      )}
      <span className="mg-appbar__name">{children}</span>
    </a>
  );
}

export interface AppBarItemProps extends Omit<LinkProps, 'variant' | 'external'> {
  /** Marks the item as the current page (`aria-current="page"`). */
  current?: boolean;
}

export function AppBarItem({ current = false, className, ...rest }: AppBarItemProps) {
  return (
    <Link
      variant="inline"
      className={cx('mg-appbar__item', className)}
      aria-current={current ? 'page' : undefined}
      {...rest}
    />
  );
}
