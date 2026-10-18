import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppBar, AppBarBrand, AppBarItem } from '../components/AppBar/AppBar';
import { Button } from '../components/Button/Button';
import { Page } from '../components/Layout/Page';
import { Stack } from '../components/Layout/Stack';
import { PageTransition } from '../components/PageTransition/PageTransition';
import { Tile } from '../components/Tile/Tile';
import { Heading, Subheading } from '../components/Typography/Heading';
import { metroAccents, type MetroAccentName } from '../tokens/tokens';

const meta = {
  title: 'Patterns/Glass diagnostics',
  parameters: {
    metroPage: false,
    docs: {
      description: {
        component:
          'A bisect page for glass rendering bugs on iOS Safari (blurred blocks, missing border-radius clipping, black squares). Switch the suspects off one at a time on the device until it renders correctly; the culprit is the toggle that fixes it.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Wallpaper = 'fixed' | 'scroll' | 'layer';

interface Toggles {
  backdrop: boolean;
  blend: boolean;
  rim: boolean;
  contain: boolean;
  tilt: boolean;
  isolation: boolean;
  pageName: boolean;
  morph: boolean;
}

const togglesInit: Toggles = {
  backdrop: true,
  blend: true,
  rim: true,
  contain: true,
  tilt: true,
  isolation: true,
  pageName: true,
  morph: true,
};

const toggleLabels: Record<keyof Toggles, string> = {
  backdrop: 'backdrop-filter on tiles and bar',
  blend: 'soft-light light layer (::after)',
  rim: 'masked specular rim (::before)',
  contain: 'size container on tiles',
  tilt: '3D perspective transform on tiles',
  isolation: 'isolation: isolate on glass',
  pageName: 'view-transition-name on page content',
  morph: 'AppBar scroll-driven morph',
};

const counts = [8, 24, 48] as const;
const wallpapers: Wallpaper[] = ['fixed', 'scroll', 'layer'];
const accents = Object.keys(metroAccents) as MetroAccentName[];

/* Each rule undoes one ingredient of the glass material; unlayered, so it wins. */
const overrides = `
.mg-diag[data-off~='backdrop'] .mg-glass,
.mg-diag[data-off~='backdrop'] .mg-appbar { backdrop-filter: none; }
.mg-diag[data-off~='blend'] .mg-glass::after { mix-blend-mode: normal; }
.mg-diag[data-off~='rim'] .mg-glass::before { display: none; }
.mg-diag[data-off~='contain'] .mg-tile { container: none; }
.mg-diag[data-off~='tilt'] .mg-tile { transform: none; transition: none; }
.mg-diag[data-off~='isolation'] .mg-glass { isolation: auto; }
.mg-diag[data-wallpaper-mode='scroll'] .mg-page { background-attachment: scroll; }
.mg-diag[data-wallpaper-mode='layer'] .mg-page { background: var(--mg-bg); isolation: isolate; }
.mg-diag__wall { position: fixed; inset: 0; z-index: -1; background: var(--mg-wallpaper); pointer-events: none; }
`;

export const Bisect: Story = {
  render: function Render() {
    const [toggles, setToggles] = useState<Toggles>(togglesInit);
    const [count, setCount] = useState<(typeof counts)[number]>(24);
    const [wallpaper, setWallpaper] = useState<Wallpaper>('fixed');

    const off = (Object.keys(toggles) as Array<keyof Toggles>).filter((key) => !toggles[key]);
    const flip = (key: keyof Toggles) => setToggles((current) => ({ ...current, [key]: !current[key] }));
    const summary = `${count} tiles · wallpaper ${wallpaper} · off: ${off.length ? off.join(', ') : 'nothing'}`;

    const content = (
      <Stack gap={5}>
        <div>
          <Heading level={1} lowercase>glass bisect</Heading>
          <Subheading>Toggle suspects off and scroll. Note which one fixes the rendering.</Subheading>
        </div>

        <Stack gap={2}>
          <Stack direction="row" gap={2} wrap role="group" aria-label="Tile count">
            {counts.map((n) => (
              <Button key={n} variant={n === count ? 'accent' : 'glass'} aria-pressed={n === count} onClick={() => setCount(n)}>
                {n} tiles
              </Button>
            ))}
          </Stack>
          <Stack direction="row" gap={2} wrap role="group" aria-label="Wallpaper mode">
            {wallpapers.map((mode) => (
              <Button key={mode} variant={mode === wallpaper ? 'accent' : 'glass'} aria-pressed={mode === wallpaper} onClick={() => setWallpaper(mode)}>
                wallpaper: {mode}
              </Button>
            ))}
          </Stack>
          <Stack direction="row" gap={2} wrap role="group" aria-label="Ingredients">
            {(Object.keys(toggles) as Array<keyof Toggles>).map((key) => (
              <Button
                key={key}
                size="sm"
                variant={toggles[key] ? 'glass' : 'accent'}
                aria-pressed={!toggles[key]}
                onClick={() => flip(key)}
              >
                {toggles[key] ? 'on' : 'OFF'} · {toggleLabels[key]}
              </Button>
            ))}
          </Stack>
          <code style={{ fontSize: 12 }}>{summary}</code>
        </Stack>

        <Stack direction="row" gap={2} wrap style={{ ['--mg-tile-unit' as string]: '76px' }}>
          {Array.from({ length: count }, (_, i) => {
            const name = accents[i % accents.length];
            return <Tile key={i} size="small" accent={name} title={name} onClick={() => {}} />;
          })}
        </Stack>
        <div style={{ minBlockSize: '60dvh' }} aria-hidden="true" />
      </Stack>
    );

    return (
      <div className="mg-diag" data-off={off.join(' ')} data-wallpaper-mode={wallpaper}>
        <style>{overrides}</style>
        <Page>
          {wallpaper === 'layer' && <div className="mg-diag__wall" aria-hidden="true" />}
          <AppBar
            morph={toggles.morph}
            brand={<AppBarBrand href="#top">metro glass</AppBarBrand>}
          >
            <AppBarItem href="#hub">Hub</AppBarItem>
            <AppBarItem href="#personalise" current>Personalise</AppBarItem>
          </AppBar>
          {toggles.pageName ? <PageTransition>{content}</PageTransition> : <div>{content}</div>}
        </Page>
      </div>
    );
  },
};
