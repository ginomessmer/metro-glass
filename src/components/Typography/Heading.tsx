import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level – controls the element (`h1`…`h6`), not the look. */
  level?: Level;
  /**
   * Visual size, independent from the level.
   * `display` – the Metro panorama/hub title. `title` – page title.
   * `header` – section header. `section` – group header.
   */
  size?: 'display' | 'title' | 'header' | 'section';
  /** Metro set headings in lowercase. Purely visual; the DOM text is untouched. */
  lowercase?: boolean;
  /** Paints the text in the accent colour. */
  accent?: boolean;
  /** Shared-element name for view transitions (e.g. tile → page heading). */
  transitionName?: string;
}

const defaultSize: Record<Level, NonNullable<HeadingProps['size']>> = {
  1: 'title',
  2: 'header',
  3: 'section',
  4: 'section',
  5: 'section',
  6: 'section',
};

export function Heading({
  level = 1,
  size,
  lowercase = false,
  accent = false,
  transitionName,
  className,
  style,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cx('mg-heading', className)}
      data-size={size ?? defaultSize[level]}
      data-lowercase={lowercase || undefined}
      data-accent={accent || undefined}
      style={transitionName ? ({ viewTransitionName: transitionName, ...style } as CSSProperties) : style}
      {...rest}
    />
  );
}

export interface SubheadingProps extends HTMLAttributes<HTMLElement> {
  /** Render as a heading element (when it starts a section) or a paragraph. */
  as?: 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  /** `caps` – small tracked uppercase eyebrow; `light` – Metro's light secondary line. */
  tone?: 'light' | 'caps';
}

/** Secondary line under a heading, or a small eyebrow label above it. */
export function Subheading({ as: Tag = 'p', tone = 'light', className, ...rest }: SubheadingProps) {
  return <Tag className={cx('mg-subheading', className)} data-tone={tone} {...rest} />;
}
