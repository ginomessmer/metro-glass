import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Hub, HubSection } from './Hub';
import { Stack } from './Stack';
import { TileGrid, TileGroup } from './TileGrid';
import { Tile } from '../Tile/Tile';
import { Button } from '../Button/Button';
import { Heading, Subheading } from '../Typography/Heading';
import { Link } from '../Link/Link';
import {
  CalendarIcon,
  MailIcon,
  MusicIcon,
  PeopleIcon,
  PhotoIcon,
  SettingsIcon,
  StoreIcon,
  SunIcon,
  ZoomOutIcon,
  landscape,
} from '../../stories/icons';

const meta = {
  title: 'Layout',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {};

export const StartScreen: Story = {
  name: 'TileGrid – start screen',
  parameters: {
    docs: {
      description: {
        story:
          'Groups scroll sideways on wide screens (the mouse wheel scrolls horizontally) and stack into a 4-unit column on phones. Pinch with two fingers — or ctrl + scroll on a trackpad — for semantic zoom.',
      },
    },
  },
  render: function Render() {
    const [zoomed, setZoomed] = useState(false);
    return (
      <Stack gap={5}>
        <Stack direction="row" justify="space-between" align="end" wrap gap={3}>
          <Heading level={1} lowercase>start</Heading>
          <Button variant="glass" shape="pill" icon={<ZoomOutIcon />} onClick={() => setZoomed(!zoomed)} aria-pressed={zoomed}>
            {zoomed ? 'Zoom in' : 'Zoom out'}
          </Button>
        </Stack>
        <TileGrid aria-label="Start" semanticZoom zoomed={zoomed} onZoomedChange={setZoomed}>
          <TileGroup title="Life at a glance">
            <Tile size="wide" accent="cobalt" title="Weather" liveAnimation="peek" onClick={noop}>
              <Stack direction="row" gap={4} align="center">
                <SunIcon width={52} height={52} />
                <div><div style={{ fontSize: 40, fontWeight: 300 }}>23°</div>Stuttgart</div>
              </Stack>
              <div><div style={{ fontSize: 20, fontWeight: 300 }}>Tomorrow</div>19° · showers</div>
            </Tile>
            <Tile accent="teal" icon={<MailIcon />} title="Mail" badge={5} onClick={noop} />
            <Tile accent="orange" icon={<CalendarIcon />} title="Calendar" onClick={noop} />
            <Tile size="small" accent="red" icon={<MusicIcon />} title="Music" onClick={noop} />
            <Tile size="small" accent="lime" icon={<StoreIcon />} title="Store" onClick={noop} />
            <Tile size="small" accent="steel" icon={<SettingsIcon />} title="Settings" onClick={noop} />
            <Tile size="small" accent="violet" icon={<PeopleIcon />} title="People" onClick={noop} />
          </TileGroup>
          <TileGroup title="Play and explore" columns={4}>
            <Tile size="wide" image={landscape(200)} variant="glass" title="Photos" onClick={noop} />
            <Tile accent="magenta" icon={<MusicIcon />} title="Music" onClick={noop} />
            <Tile variant="glass" icon={<PhotoIcon />} title="Camera" onClick={noop} />
          </TileGroup>
          <TileGroup title="Work" columns={4}>
            <Tile size="large" accent="emerald" title="Projects" onClick={noop}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 300 }}>Metro Glass</div>
                <div>3 tasks due today</div>
              </div>
            </Tile>
          </TileGroup>
        </TileGrid>
      </Stack>
    );
  },
};

export const Panorama: Story = {
  name: 'Hub – panorama',
  render: () => (
    <Hub title="music + videos" background={landscape(280)}>
      <HubSection title="collection">
        <Stack gap={2}>
          {['music', 'videos', 'podcasts', 'radio'].map((x) => (
            <Link key={x} variant="nav" href="#">{x}</Link>
          ))}
        </Stack>
      </HubSection>
      <HubSection title="history" width="wide">
        <Stack direction="row" gap={2} wrap>
          <Tile accent="magenta" title="Daft Punk" icon={<MusicIcon />} onClick={noop} />
          <Tile accent="orange" title="Bonobo" icon={<MusicIcon />} onClick={noop} />
          <Tile accent="cobalt" title="Röyksopp" icon={<MusicIcon />} onClick={noop} />
        </Stack>
      </HubSection>
      <HubSection title="new">
        <Subheading>Fresh releases from artists you follow appear here.</Subheading>
      </HubSection>
      <HubSection title="apps">
        <Stack direction="row" gap={2} wrap>
          <Tile size="small" accent="lime" icon={<StoreIcon />} title="Store" onClick={noop} />
          <Tile size="small" accent="steel" icon={<SettingsIcon />} title="Settings" onClick={noop} />
        </Stack>
      </HubSection>
    </Hub>
  ),
};

export const StackLayout: Story = {
  name: 'Stack',
  render: () => (
    <Stack gap={4}>
      <Stack direction="row" gap={2}>
        {[1, 2, 3].map((i) => <div key={i} className="mg-glass" style={{ padding: 24, borderRadius: 'var(--mg-radius-md)' }}>{i}</div>)}
      </Stack>
      <Stack gap={2}>
        {[1, 2, 3].map((i) => <div key={i} className="mg-glass" style={{ padding: 24, borderRadius: 'var(--mg-radius-md)' }}>{i}</div>)}
      </Stack>
    </Stack>
  ),
};
