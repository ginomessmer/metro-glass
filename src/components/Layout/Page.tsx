import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';

export interface PageProps extends HTMLAttributes<HTMLElement> {
  /** Landmark element. Use `main` once per document. */
  as?: 'main' | 'div' | 'section';
  /**
   * Paints the accent-tinted wallpaper behind the page. Glass needs something
   * to refract; turn this off if your app supplies its own background.
   */
  wallpaper?: boolean;
}

/** Full-height page surface with safe-area aware gutters. */
export function Page({ as: Tag = 'main', wallpaper = true, className, ...rest }: PageProps) {
  return <Tag className={cx('mg-page', className)} data-wallpaper={wallpaper || undefined} {...rest} />;
}
