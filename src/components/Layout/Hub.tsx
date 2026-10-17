import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface HubProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The oversized panorama title that drifts slower than the content. */
  title: ReactNode;
  /** Optional background image, also parallaxed. */
  background?: string;
  children?: ReactNode;
}

/**
 * Metro's panorama / hub: a wide, horizontally scrolling canvas of sections.
 * The title and background parallax with a CSS scroll-driven animation —
 * no scroll listeners involved. Sections peek in from the right on phones.
 */
export function Hub({ title, background, className, children, style, ...rest }: HubProps) {
  return (
    <section
      className={cx('mg-hub', className)}
      style={background ? ({ '--_hub-image': `url("${background}")`, ...style } as CSSProperties) : style}
      {...rest}
    >
      <div className="mg-hub__scroller" tabIndex={0}>
        {background && <div className="mg-hub__background" aria-hidden="true" />}
        <h1 className="mg-hub__title">{title}</h1>
        <div className="mg-hub__sections">{children}</div>
      </div>
    </section>
  );
}

export interface HubSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Section header, rendered as an `h2`. */
  title?: ReactNode;
  /** `wide` sections are twice as wide on large screens. */
  width?: 'normal' | 'wide';
  children?: ReactNode;
}

export function HubSection({ title, width = 'normal', className, children, ...rest }: HubSectionProps) {
  return (
    <section className={cx('mg-hub-section', className)} data-width={width} {...rest}>
      {title && <h2 className="mg-hub-section__title">{title}</h2>}
      {children}
    </section>
  );
}
