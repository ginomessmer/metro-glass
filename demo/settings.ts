import { useEffect, useState } from 'react';
import type { MetroAccentName, MetroTheme, ShapePreset } from 'metro-glass';

export interface DemoSettings {
  accent: MetroAccentName;
  theme: MetroTheme;
  shape: ShapePreset;
}

const KEY = 'metro-glass-demo';
const defaults: DemoSettings = { accent: 'cobalt', theme: 'system', shape: 'blend' };

function load(): DemoSettings {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
  } catch {
    return defaults;
  }
}

/** Personalisation, remembered per browser. */
export function useSettings() {
  const [settings, setSettings] = useState(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable: settings last for this visit only */
    }
  }, [settings]);
  return [settings, (patch: Partial<DemoSettings>) => setSettings((s) => ({ ...s, ...patch }))] as const;
}
