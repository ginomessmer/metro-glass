import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading, Subheading } from './Heading';
import { Stack } from '../Layout/Stack';

const meta = {
  title: 'Components/Typography',
  component: Heading,
  args: { children: 'People', level: 1, lowercase: true },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <Stack gap={6}>
      <div>
        <Subheading as="p" tone="caps">Display</Subheading>
        <Heading level={1} size="display" lowercase>Panorama</Heading>
      </div>
      <div>
        <Heading level={2} size="title">Page title</Heading>
        <Subheading>The light secondary line Metro used everywhere.</Subheading>
      </div>
      <div>
        <Heading level={3} size="header" lowercase>Section header</Heading>
        <Subheading>Lowercase is visual only; screen readers get the original text.</Subheading>
      </div>
      <div>
        <Heading level={4} size="section">Group header</Heading>
      </div>
      <Heading level={2} size="title" accent>Accent heading</Heading>
    </Stack>
  ),
};

export const Eyebrow: Story = {
  render: () => (
    <div>
      <Subheading as="p" tone="caps">Settings</Subheading>
      <Heading level={1} lowercase>Personalise</Heading>
      <Subheading>Choose an accent colour and a shape for every surface.</Subheading>
    </div>
  ),
};
