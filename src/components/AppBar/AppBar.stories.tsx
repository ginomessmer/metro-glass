import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppBar, AppBarBrand, AppBarItem } from './AppBar';
import { Button } from '../Button/Button';
import { Heading, Subheading } from '../Typography/Heading';
import { Stack } from '../Layout/Stack';
import { Tile } from '../Tile/Tile';
import { SearchIcon } from '../../stories/icons';

const Logo = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1" y="1" width="10" height="10" rx="2" fill="var(--mg-accent)" />
    <rect x="13" y="1" width="10" height="10" rx="2" fill="oklch(from var(--mg-accent) l c calc(h + 60))" />
    <rect x="1" y="13" width="10" height="10" rx="2" fill="oklch(from var(--mg-accent) l c calc(h - 60))" />
    <rect x="13" y="13" width="10" height="10" rx="2" fill="oklch(from var(--mg-accent) l c calc(h + 120))" />
  </svg>
);

const meta = {
  title: 'Components/AppBar',
  component: AppBar,
  args: { morph: true },
  parameters: {
    docs: {
      description: {
        component:
          'Sticky glass app bar. With `morph`, a CSS scroll-driven animation turns the floating pill into a full-width bar fused with the top edge (and the safe area under a notch) as the page scrolls. On narrow bars the wordmark collapses to the logo but remains the link\'s accessible name.',
      },
    },
  },
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScrollToMorph: Story = {
  name: 'Scroll to morph',
  render: (args) => (
    <>
      <AppBar
        {...args}
        brand={<AppBarBrand href="#" logo={<Logo />}>metro glass</AppBarBrand>}
        actions={<Button variant="subtle" shape="circle" size="sm" icon={<SearchIcon />} aria-label="Search" />}
      >
        <AppBarItem href="#" current>Start</AppBarItem>
        <AppBarItem href="#">Hub</AppBarItem>
        <AppBarItem href="#">Personalise</AppBarItem>
      </AppBar>
      <Stack gap={5}>
        <div>
          <Heading level={1} size="display" lowercase>scroll down</Heading>
          <Subheading>The bar docks into the top edge over the first 96px of scrolling.</Subheading>
        </div>
        <Stack direction="row" gap={2} wrap>
          {Array.from({ length: 24 }, (_, i) => (
            <Tile key={i} accent={(['cyan', 'orange', 'lime', 'magenta', 'violet', 'teal'] as const)[i % 6]} title={`Tile ${i + 1}`} />
          ))}
        </Stack>
      </Stack>
    </>
  ),
};

export const Static: Story = {
  args: { morph: false },
  render: ScrollToMorph.render,
};
