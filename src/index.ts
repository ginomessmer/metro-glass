import './styles/index.css';

export * from './components/Tile';
export * from './components/Button';
export * from './components/Typography';
export * from './components/Link';
export * from './components/Tabs';
export * from './components/Layout';
export * from './components/PageTransition';
export * from './components/AppBar';

export { MetroProvider, useMetro } from './tokens/MetroProvider';
export type { MetroProviderProps, MetroTheme } from './tokens/MetroProvider';
export { metroAccents, resolveAccent, shapePresets, tokensToStyle } from './tokens/tokens';
export type { AccentColor, MetroAccentName, MetroTokens, ShapePreset } from './tokens/tokens';

export { usePressTilt } from './hooks/usePressTilt';
export type { PressTiltOptions } from './hooks/usePressTilt';
export { useSwipe } from './hooks/useSwipe';
export type { SwipeOptions } from './hooks/useSwipe';
export { usePinch } from './hooks/usePinch';
export type { PinchOptions } from './hooks/usePinch';
export { useReducedMotion } from './hooks/useReducedMotion';
export { startViewTransition, useViewTransition } from './hooks/useViewTransition';
export type { MetroTransitionType, ViewTransitionOptions } from './hooks/useViewTransition';
