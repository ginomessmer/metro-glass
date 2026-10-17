import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

type Space = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: Space;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'ul' | 'ol';
}

/** Flexbox stack using the spacing scale. */
export function Stack({
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  as = 'div',
  className,
  style,
  ...rest
}: StackProps) {
  const Tag = as as 'div';
  return (
    <Tag
      className={cx('mg-stack', className)}
      style={{
        flexDirection: direction,
        gap: gap === 0 ? 0 : `var(--mg-space-${gap})`,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}
