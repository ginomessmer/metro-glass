/**
 * The classic Windows 8 / Windows Phone accent palette. Any CSS colour works as
 * an accent; these are provided as named presets.
 */
export const metroAccents = {
  lime: '#a4c400',
  green: '#60a917',
  emerald: '#008a00',
  teal: '#00aba9',
  cyan: '#1ba1e2',
  cobalt: '#0050ef',
  indigo: '#6a00ff',
  violet: '#aa00ff',
  pink: '#f472d0',
  magenta: '#d80073',
  crimson: '#a20025',
  red: '#e51400',
  orange: '#fa6800',
  amber: '#f0a30a',
  yellow: '#e3c800',
  brown: '#825a2c',
  olive: '#6d8764',
  steel: '#647687',
  mauve: '#76608a',
  taupe: '#87794e',
} as const;

export type MetroAccentName = keyof typeof metroAccents;

/** A named Metro accent or any valid CSS colour string. */
export type AccentColor = MetroAccentName | (string & {});

export function resolveAccent(accent: AccentColor): string {
  return accent in metroAccents ? metroAccents[accent as MetroAccentName] : accent;
}

/**
 * Tokens that can be set from JavaScript. Keys map 1:1 to `--mg-*` custom
 * properties (camelCase → kebab-case).
 */
export interface MetroTokens {
  accent?: AccentColor;
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  glassBlur?: string;
  glassTint?: number;
  tileUnit?: string;
  tileGap?: string;
  fontFamily?: string;
  durationFast?: string;
  durationNormal?: string;
  durationSlow?: string;
  easeOut?: string;
}

const toKebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Converts a token object into a style object of `--mg-*` custom properties. */
export function tokensToStyle(tokens: MetroTokens): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (value === undefined || value === null) continue;
    style[`--mg-${toKebab(key)}`] =
      key === 'accent' ? resolveAccent(value as AccentColor) : String(value);
  }
  return style;
}

/** Ready-made shape presets: pure Metro, the default blend, and pure glass. */
export const shapePresets = {
  metro: { radiusSm: '0px', radiusMd: '0px', radiusLg: '0px' },
  blend: { radiusSm: '6px', radiusMd: '10px', radiusLg: '18px' },
  glass: { radiusSm: '12px', radiusMd: '22px', radiusLg: '34px' },
} satisfies Record<string, MetroTokens>;

export type ShapePreset = keyof typeof shapePresets;
