import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Tile } from './Tile';
import { Stack } from '../Layout/Stack';
import { CalendarIcon, MailIcon, MusicIcon, PeopleIcon, PhotoIcon, SunIcon, landscape } from '../../stories/icons';

const meta = {
  title: 'Components/Tile',
  component: Tile,
  args: {
    size: 'medium',
    title: 'Mail',
    badge: 3,
    icon: <MailIcon />,
    onClick: fn(),
  },
  argTypes: {
    accent: { control: 'text' },
    children: { control: false },
    icon: { control: false },
  },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap={2} align="start" wrap>
      <Tile {...args} size="small" title="Mail" badge={3} />
      <Tile {...args} size="medium" />
      <Tile {...args} size="wide" accent="orange" icon={<CalendarIcon />} title="Calendar" badge={undefined} />
      <Tile {...args} size="large" accent="magenta" icon={<PhotoIcon />} title="Photos" badge={undefined} />
    </Stack>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap={2} wrap>
      <Tile {...args} variant="accent" title="Accent" />
      <Tile {...args} variant="glass" title="Glass" />
      <Tile {...args} accent="lime" title="Lime" icon={<MusicIcon />} badge={undefined} />
      <Tile {...args} accent="crimson" title="Crimson" icon={<PeopleIcon />} badge={undefined} />
    </Stack>
  ),
};

export const LiveFlip: Story = {
  name: 'Live tile – flip',
  args: { size: 'wide', title: 'Weather', badge: undefined, accent: 'cobalt', liveAnimation: 'flip', liveInterval: 2500 },
  render: (args) => (
    <Tile {...args}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center' }}>
        <SunIcon width={56} height={56} />
        <div>
          <div style={{ fontSize: 40, fontWeight: 300, lineHeight: 1 }}>23°</div>
          <div>Stuttgart · Sunny</div>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 300 }}>Tomorrow</div>
        <div>19° / 11° · Light showers</div>
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 300 }}>Weekend</div>
        <div>Warm and dry, 25°</div>
      </div>
    </Tile>
  ),
};

export const LivePeek: Story = {
  name: 'Live tile – peek',
  args: { size: 'wide', title: 'Photos', badge: undefined, liveAnimation: 'peek', liveInterval: 3000, accent: 'magenta' },
  render: (args) => (
    <Tile {...args}>
      <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
        <PhotoIcon width={64} height={64} />
      </div>
      <img src={landscape(200)} alt="Mountain lake at dusk" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
      <img src={landscape(20)} alt="Desert ridge at sunset" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
    </Tile>
  ),
};

export const Photo: Story = {
  args: { size: 'wide', image: landscape(250), title: 'Lake Constance', badge: undefined, icon: undefined, variant: 'glass' },
};

export const AsLink: Story = {
  args: { href: '#mail', onClick: undefined },
};

export const MultiTouch: Story = {
  name: 'Multi-touch press',
  parameters: {
    docs: {
      description: {
        story:
          'Each tile tracks its own pointers, so on a touch screen several tiles can be held and tilted at once. Press near an edge to push that edge down; press the centre to sink the whole tile.',
      },
    },
  },
  render: (args) => (
    <Stack direction="row" gap={2} wrap>
      {(['cyan', 'orange', 'lime', 'violet', 'red', 'teal'] as const).map((accent) => (
        <Tile key={accent} {...args} accent={accent} title={accent} badge={undefined} />
      ))}
    </Stack>
  ),
};
