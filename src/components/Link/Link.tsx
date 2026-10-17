import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { startViewTransition, type MetroTransitionType } from '../../hooks/useViewTransition';
import { cx } from '../../utils/cx';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * `inline` – underlined, for running text.
   * `standalone` – Metro style: accent text, underline on hover.
   * `nav` – a large light navigation link with a chevron.
   */
  variant?: 'inline' | 'standalone' | 'nav';
  /** Opens in a new tab with safe `rel` and an announced hint. */
  external?: boolean;
  /**
   * Client-side navigation hook. When given, the click is intercepted
   * (unless modified with ⌘/Ctrl/Shift or middle-click) and `onNavigate` runs
   * inside a view transition.
   */
  onNavigate?: (href: string) => void;
  /** View transition type for `onNavigate`. */
  transition?: MetroTransitionType;
}

const isModified = (e: MouseEvent) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'standalone', external = false, onNavigate, transition = 'turnstile', className, children, onClick, target, rel, ...rest },
  ref,
) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !onNavigate || external || isModified(e) || !rest.href) return;
    e.preventDefault();
    const href = rest.href;
    void startViewTransition(() => onNavigate(href), { types: [transition] });
  };

  return (
    <a
      ref={ref}
      className={cx('mg-link', 'mg-focusable', className)}
      data-variant={variant}
      {...rest}
      target={external ? '_blank' : target}
      rel={external ? 'noopener noreferrer' : rel}
      onClick={handleClick}
    >
      {children}
      {external && (
        <>
          <svg className="mg-link__glyph" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M6 3h7v7M13 3 4 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="mg-visually-hidden"> (opens in a new tab)</span>
        </>
      )}
      {variant === 'nav' && !external && (
        <svg className="mg-link__glyph" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </a>
  );
});
