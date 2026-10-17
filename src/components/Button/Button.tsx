import { forwardRef, useImperativeHandle, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { usePressTilt } from '../../hooks/usePressTilt';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'accent' | 'glass' | 'outline' | 'subtle';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * `accent` – tinted glass in the accent colour (primary action).
   * `glass` – neutral frosted glass.
   * `outline` – Metro's classic 2px bordered button.
   * `subtle` – text-only until hovered.
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `circle` renders the Metro app-bar round icon button. Requires `aria-label`. */
  shape?: 'rect' | 'pill' | 'circle';
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  /** Stretches to the container width. */
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'glass',
    size = 'md',
    shape = 'rect',
    icon,
    iconPosition = 'start',
    block = false,
    type = 'button',
    className,
    children,
    ...rest
  },
  forwardedRef,
) {
  const ref = useRef<HTMLButtonElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);
  usePressTilt(ref, { tilt: false, disabled: rest.disabled });

  const isGlass = variant === 'accent' || variant === 'glass';

  return (
    <button
      ref={ref}
      type={type}
      className={cx('mg-button', isGlass && 'mg-glass', 'mg-focusable', className)}
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      data-block={block || undefined}
      data-tint={variant === 'accent' ? 'accent' : undefined}
      {...rest}
    >
      {icon && iconPosition === 'start' && <span className="mg-button__icon" aria-hidden="true">{icon}</span>}
      {children !== undefined && shape !== 'circle' && <span className="mg-button__label">{children}</span>}
      {icon && iconPosition === 'end' && <span className="mg-button__icon" aria-hidden="true">{icon}</span>}
    </button>
  );
});
