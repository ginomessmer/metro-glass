import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { Stack } from '../Layout/Stack';
import { AddIcon, SearchIcon, SettingsIcon } from '../../stories/icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Continue', variant: 'accent', onClick: fn() },
  argTypes: { icon: { control: false } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} wrap align="center">
      <Button {...args} variant="accent">Accent</Button>
      <Button {...args} variant="glass">Glass</Button>
      <Button {...args} variant="outline">Outline</Button>
      <Button {...args} variant="subtle">Subtle</Button>
      <Button {...args} disabled>Disabled</Button>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} wrap align="center">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </Stack>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <Stack direction="row" gap={3} wrap align="center">
      <Button {...args} shape="rect">Rectangle</Button>
      <Button {...args} shape="pill" icon={<SearchIcon />}>Pill</Button>
      <Button {...args} shape="circle" icon={<AddIcon />} aria-label="Add" />
    </Stack>
  ),
};

export const AppBar: Story = {
  name: 'App bar (circle buttons)',
  render: () => (
    <Stack direction="row" gap={5} justify="center" className="mg-glass" style={{ padding: 16, borderRadius: 'var(--mg-radius-lg)', width: 'fit-content' }}>
      {[
        { icon: <AddIcon />, label: 'New' },
        { icon: <SearchIcon />, label: 'Search' },
        { icon: <SettingsIcon />, label: 'Settings' },
      ].map(({ icon, label }) => (
        <Stack key={label} gap={1} align="center">
          <Button variant="outline" shape="circle" icon={icon} aria-label={label} />
          <span aria-hidden="true" style={{ fontSize: 12 }}>{label.toLowerCase()}</span>
        </Stack>
      ))}
    </Stack>
  ),
};
