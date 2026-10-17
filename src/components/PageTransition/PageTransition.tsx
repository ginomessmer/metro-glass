import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface PageTransitionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The view-transition-name for the page area. Must be unique on the page;
   * the default (`mg-page`) is what Metro Glass's transition styles target.
   */
  name?: string;
  children?: ReactNode;
}

/**
 * Marks the region that animates between pages. Trigger the animation by
 * changing what renders inside it within `startViewTransition` /
 * `useViewTransition`, or via `<Link onNavigate>`:
 *
 * ```tsx
 * const transition = useViewTransition();
 * transition(() => setRoute('/settings'), { types: ['turnstile'] });
 * ```
 *
 * For multi-page apps, import `metro-glass/navigation.css` instead to opt into
 * cross-document view transitions.
 */
export function PageTransition({ name = 'mg-page', className, style, ...rest }: PageTransitionProps) {
  return (
    <div
      className={cx('mg-page-transition', className)}
      style={{ viewTransitionName: name, ...style } as CSSProperties}
      {...rest}
    />
  );
}
