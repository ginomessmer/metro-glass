import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { useSwipe } from '../../hooks/useSwipe';
import { startViewTransition } from '../../hooks/useViewTransition';
import { cx } from '../../utils/cx';
import { vtName } from '../../utils/vtName';

type TabsVariant = 'pivot' | 'segmented';

interface TabsContextValue {
  baseId: string;
  value: string;
  variant: TabsVariant;
  activation: 'automatic' | 'manual';
  listRef: RefObject<HTMLDivElement | null>;
  select: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return ctx;
}

const idFor = (base: string, kind: 'tab' | 'panel', value: string) =>
  `${base}-${kind}-${value.replace(/\s+/g, '-')}`;

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * `pivot` – Metro's big lowercase headers with a sliding glass indicator.
   * `segmented` – a compact Liquid Glass segmented control.
   */
  variant?: TabsVariant;
  /** `automatic` selects on arrow-key focus; `manual` waits for Enter/Space. */
  activation?: 'automatic' | 'manual';
  /** Animate changes with the View Transitions API. */
  animated?: boolean;
  children?: ReactNode;
}

/** Accessible tabs (WAI-ARIA tabs pattern) with swipe and view-transition support. */
export function Tabs({
  value: controlled,
  defaultValue = '',
  onValueChange,
  variant = 'pivot',
  activation = 'automatic',
  animated = true,
  className,
  children,
  ...rest
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlled ?? uncontrolled;
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const listRef = useRef<HTMLDivElement>(null);

  const select = useCallback(
    (next: string) => {
      if (next === value) return;
      const tabs = [...(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])];
      const from = tabs.findIndex((t) => t.dataset.value === value);
      const to = tabs.findIndex((t) => t.dataset.value === next);
      const commit = () => {
        if (controlled === undefined) setUncontrolled(next);
        onValueChange?.(next);
      };
      if (!animated) return commit();
      void startViewTransition(commit, { types: [to >= from ? 'slide' : 'slide-back'] });
    },
    [value, controlled, onValueChange, animated],
  );

  return (
    <TabsContext.Provider value={{ baseId, value, variant, activation, listRef, select }}>
      <div className={cx('mg-tabs', className)} data-variant={variant} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Required unless the tabs are labelled by a visible heading via `aria-labelledby`. */
  'aria-label'?: string;
}

export function TabList({ className, children, ...rest }: TabListProps) {
  const { listRef, variant, activation, select } = useTabs('TabList');

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')];
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const step: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
      Home: -Infinity,
      End: Infinity,
    };
    if (!(e.key in step)) return;
    e.preventDefault();
    const delta = step[e.key];
    const nextIndex = Number.isFinite(delta)
      ? (current + delta + tabs.length) % tabs.length
      : delta < 0
        ? 0
        : tabs.length - 1;
    const tab = tabs[nextIndex];
    tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (activation === 'automatic' && tab.dataset.value) select(tab.dataset.value);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      className={cx('mg-tablist', variant === 'segmented' && 'mg-glass', className)}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
}

export function Tab({ value, className, children, onClick, ...rest }: TabProps) {
  const { baseId, value: active, select } = useTabs('Tab');
  const selected = value === active;
  return (
    <button
      type="button"
      role="tab"
      id={idFor(baseId, 'tab', value)}
      aria-selected={selected}
      aria-controls={idFor(baseId, 'panel', value)}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      className={cx('mg-tab', 'mg-focusable', className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) select(value);
      }}
      {...rest}
    >
      <span className="mg-tab__label">{children}</span>
      {selected && (
        <span
          className="mg-tab__indicator"
          aria-hidden="true"
          style={{ viewTransitionName: vtName('mg-tab-indicator', baseId) } as CSSProperties}
        />
      )}
    </button>
  );
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Keep inactive panels mounted (hidden) to preserve their state. */
  keepMounted?: boolean;
}

export function TabPanel({ value, keepMounted = false, className, children, style, ...rest }: TabPanelProps) {
  const { baseId, value: active, listRef, select } = useTabs('TabPanel');
  const ref = useRef<HTMLDivElement>(null);
  const selected = value === active;

  const move = (delta: number) => {
    const tabs = [...(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [])];
    const i = tabs.findIndex((t) => t.dataset.value === active);
    const next = tabs[i + delta];
    if (next?.dataset.value) select(next.dataset.value);
  };
  useSwipe(ref, { onSwipeLeft: () => move(1), onSwipeRight: () => move(-1), disabled: !selected });

  if (!selected && !keepMounted) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={idFor(baseId, 'panel', value)}
      aria-labelledby={idFor(baseId, 'tab', value)}
      tabIndex={0}
      hidden={!selected}
      className={cx('mg-tabpanel', 'mg-focusable', className)}
      style={
        selected
          ? ({ viewTransitionName: vtName('mg-tabpanel', baseId), ...style } as CSSProperties)
          : style
      }
      {...rest}
    >
      {children}
    </div>
  );
}
