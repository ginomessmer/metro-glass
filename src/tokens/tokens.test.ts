import { resolveAccent, tokensToStyle } from './tokens';

describe('tokens', () => {
  it('resolves named accents and passes other colours through', () => {
    expect(resolveAccent('lime')).toBe('#a4c400');
    expect(resolveAccent('oklch(0.7 0.2 30)')).toBe('oklch(0.7 0.2 30)');
  });

  it('maps token objects to --mg-* custom properties', () => {
    expect(tokensToStyle({ accent: 'red', radiusMd: '0px', glassTint: 0.5, tileUnit: undefined })).toEqual({
      '--mg-accent': '#e51400',
      '--mg-radius-md': '0px',
      '--mg-glass-tint': '0.5',
    });
  });
});
