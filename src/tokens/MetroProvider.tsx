import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import {
  resolveAccent,
  shapePresets,
  tokensToStyle,
  type AccentColor,
  type MetroTokens,
  type ShapePreset,
} from './tokens';

export type MetroTheme = 'light' | 'dark' | 'system';

interface MetroContextValue {
  accent: string;
  theme: MetroTheme;
}

const MetroContext = createContext<MetroContextValue>({ accent: '#1ba1e2', theme: 'system' });

export const useMetro = () => useContext(MetroContext);

export interface MetroProviderProps extends MetroTokens {
  children?: ReactNode;
  /** Forces a colour scheme. Defaults to following the OS. */
  theme?: MetroTheme;
  /** Corner style preset. Individual radius tokens win over the preset. */
  shape?: ShapePreset;
  className?: string;
  style?: CSSProperties;
}

/**
 * Scopes Metro Glass tokens to a subtree. Providers can be nested, e.g. to
 * give one section of a page a different accent.
 */
export function MetroProvider({
  children,
  theme = 'system',
  shape,
  className,
  style,
  accent = 'cyan',
  ...tokens
}: MetroProviderProps) {
  const resolved = resolveAccent(accent);
  const tokenStyle = useMemo(
    () => tokensToStyle({ ...(shape ? shapePresets[shape] : {}), ...tokens, accent }),
    [shape, accent, JSON.stringify(tokens)],
  );
  const value = useMemo(() => ({ accent: resolved, theme }), [resolved, theme]);

  return (
    <MetroContext.Provider value={value}>
      <div
        className={cx('mg-theme', className)}
        data-mg-theme={theme === 'system' ? undefined : theme}
        style={{ ...tokenStyle, ...style }}
      >
        {children}
      </div>
    </MetroContext.Provider>
  );
}

export type { AccentColor };
