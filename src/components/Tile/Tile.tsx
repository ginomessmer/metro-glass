import {
  Children,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { usePressTilt } from '../../hooks/usePressTilt';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { resolveAccent, type AccentColor } from '../../tokens/tokens';
import { cx } from '../../utils/cx';

export type TileSize = 'small' | 'medium' | 'wide' | 'large';
export type TileLiveAnimation = 'flip' | 'peek' | 'fade';

interface TileOwnProps {
  /** Grid footprint: small 1×1, medium 2×2, wide 4×2, large 4×4 units. */
  size?: TileSize;
  /** Label in the bottom-left corner (hidden on small tiles, but still announced). */
  title?: ReactNode;
  /** Count / glyph in the bottom-right corner, e.g. unread messages. */
  badge?: ReactNode;
  /** Icon centred on the tile's front face. */
  icon?: ReactNode;
  /** Overrides the accent colour for this tile only. */
  accent?: AccentColor;
  /** `accent` is the classic Metro solid tile, `glass` is neutral frosted glass. */
  variant?: 'accent' | 'glass';
  /** Background image shown behind the content (photo tiles). */
  image?: string;
  /**
   * Live tile faces. When more than one child is given the tile cycles
   * through them; otherwise children render as a single static face.
   */
  children?: ReactNode;
  /** How live faces change. */
  liveAnimation?: TileLiveAnimation;
  /** Milliseconds between live updates. */
  liveInterval?: number;
  /** Stops the live rotation (it also pauses on hover/focus and reduced motion). */
  paused?: boolean;
  /** Shared-element name for view transitions (e.g. tile → page heading). */
  transitionName?: string;
  className?: string;
  style?: CSSProperties;
}

type TileAsLink = TileOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof TileOwnProps> & { href: string };
type TileAsButton = TileOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof TileOwnProps> & { href?: undefined };

export type TileProps = TileAsLink | TileAsButton;

const faceKeyframes: Record<TileLiveAnimation, [Keyframe[], Keyframe[]]> = {
  // Metro live tiles flip around the X axis.
  flip: [
    [{ transform: 'perspective(600px) rotateX(0deg)', opacity: 1 }, { transform: 'perspective(600px) rotateX(-90deg)', opacity: 0 }],
    [{ transform: 'perspective(600px) rotateX(90deg)', opacity: 0 }, { transform: 'perspective(600px) rotateX(0deg)', opacity: 1 }],
  ],
  // ...or "peek": the next face slides up from below.
  peek: [
    [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
    [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
  ],
  fade: [
    [{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(6px)' }],
    [{ opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0)' }],
  ],
};

/**
 * The Metro tile, rendered in Liquid Glass. Renders an `<a>` with `href`, a
 * `<button>` with `onClick`, or a static `<div>` otherwise.
 */
export function Tile(props: TileProps) {
  const {
    size = 'medium',
    title,
    badge,
    icon,
    accent,
    variant = 'accent',
    image,
    children,
    liveAnimation = 'flip',
    liveInterval = 4000,
    paused = false,
    transitionName,
    className,
    style,
    ...rest
  } = props;

  const ref = useRef<HTMLElement>(null);
  const faces = Children.toArray(children);
  const isLive = faces.length > 1;
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const faceId = useId();
  // Enter animation queued by the interval, played once the next face is in the DOM.
  const pendingEnter = useRef<{ keyframes: Keyframe[]; timing: KeyframeAnimationOptions } | null>(
    null,
  );

  const interactive = 'href' in rest ? rest.href !== undefined : 'onClick' in rest && !!rest.onClick;
  usePressTilt(ref, { disabled: !interactive });

  // Live tile rotation, driven by the Web Animations API.
  useEffect(() => {
    if (!isLive || paused || hold) return;
    const timer = setInterval(() => {
      const el = ref.current;
      const current = el?.querySelector<HTMLElement>('[data-face-active]');
      const next = (index + 1) % faces.length;
      if (!el || !current || reducedMotion || typeof current.animate !== 'function') {
        setIndex(next);
        return;
      }
      const [out, enter] = faceKeyframes[liveAnimation];
      const timing: KeyframeAnimationOptions = {
        duration: liveAnimation === 'peek' ? 600 : 360,
        easing: 'cubic-bezier(0.7, 0, 1, 0.5)',
        fill: 'forwards',
      };
      current.animate(out, timing).finished.then(
        () => {
          pendingEnter.current = {
            keyframes: enter,
            timing: { ...timing, easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)', fill: 'none' },
          };
          setIndex(next);
        },
        () => setIndex(next),
      );
    }, liveInterval);
    return () => clearInterval(timer);
  }, [isLive, paused, hold, index, faces.length, liveAnimation, liveInterval, reducedMotion]);

  // Start the enter animation before the browser paints the new face; waiting
  // for a rAF showed it fully visible for one frame, then snapped it away.
  useLayoutEffect(() => {
    const pending = pendingEnter.current;
    if (!pending) return;
    pendingEnter.current = null;
    ref.current
      ?.querySelector<HTMLElement>('[data-face-active]')
      ?.animate(pending.keyframes, pending.timing);
  }, [index]);

  const tileStyle: CSSProperties = {
    ...(accent ? { '--mg-accent': resolveAccent(accent) } : {}),
    ...(image ? { '--_tile-image': `url("${image}")` } : {}),
    ...(transitionName ? { viewTransitionName: transitionName } : {}),
    ...style,
  } as CSSProperties;

  const content = (
    <>
      {image && <span className="mg-tile__image" aria-hidden="true" />}
      <span className="mg-tile__faces" id={faceId}>
        {faces.length === 0 && icon && <span className="mg-tile__icon" aria-hidden="true">{icon}</span>}
        {faces.length === 1 && (
          <span className="mg-tile__face" data-face-active="">
            {icon && <span className="mg-tile__icon" aria-hidden="true">{icon}</span>}
            {faces[0]}
          </span>
        )}
        {isLive && (
          <span key={index} className="mg-tile__face" data-face-active="">
            {faces[index]}
          </span>
        )}
      </span>
      {(title || badge !== undefined) && (
        <span className="mg-tile__footer">
          {title && <span className="mg-tile__title">{title}</span>}
          {badge !== undefined && <span className="mg-tile__badge">{badge}</span>}
        </span>
      )}
    </>
  );

  const common = {
    className: cx('mg-tile', 'mg-glass', 'mg-focusable', className),
    'data-size': size,
    'data-tint': variant === 'accent' ? 'accent' : undefined,
    'data-mg-accent': accent ? '' : undefined,
    'data-live': isLive ? liveAnimation : undefined,
    style: tileStyle,
    onPointerEnter: () => setHold(true),
    onPointerLeave: () => setHold(false),
    onFocus: () => setHold(true),
    onBlur: () => setHold(false),
  };

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} {...common}>
        {content}
      </a>
    );
  }
  if (interactive) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        {...common}
      >
        {content}
      </button>
    );
  }
  const { onClick: _ignored, ...divRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} {...(divRest as React.HTMLAttributes<HTMLDivElement>)} {...common}>
      {content}
    </div>
  );
}
