import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { Heading, Subheading } from '../Typography/Heading';
import { Link } from '../Link/Link';
import { Stack } from '../Layout/Stack';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { defaultValue: 'all', variant: 'pivot' },
  parameters: {
    docs: {
      description: {
        component:
          'WAI-ARIA tabs with roving focus (←/→/Home/End), swipe between panels on touch, and a View Transition that glides the indicator and slides the panel.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const people = ['Anna Weber', 'Jonas Becker', 'Lea Fischer', 'Noah Wagner', 'Mia Schulz'];

const Panels = () => (
  <>
    <TabPanel value="all">
      <Stack gap={3}>
        {people.map((p) => (
          <div key={p}>
            <Heading level={3} size="section">{p}</Heading>
            <Subheading>Last seen today</Subheading>
          </div>
        ))}
      </Stack>
    </TabPanel>
    <TabPanel value="recent">
      <Stack gap={3}>
        {people.slice(0, 2).map((p) => (
          <Link key={p} variant="nav" href="#">{p.toLowerCase()}</Link>
        ))}
      </Stack>
    </TabPanel>
    <TabPanel value="whats-new">
      <Subheading>Lea shared 12 photos from Lisbon.</Subheading>
    </TabPanel>
    <TabPanel value="together">
      <Subheading>Create a room to share a calendar and chat.</Subheading>
    </TabPanel>
  </>
);

export const Pivot: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="People">
        <Tab value="all">All</Tab>
        <Tab value="recent">Recent</Tab>
        <Tab value="whats-new">What's new</Tab>
        <Tab value="together">Together</Tab>
      </TabList>
      <Panels />
    </Tabs>
  ),
};

export const Segmented: Story = {
  args: { variant: 'segmented' },
  render: Pivot.render,
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('recent');
    return (
      <Stack gap={4}>
        <Subheading tone="caps">Selected: {value}</Subheading>
        <Tabs {...args} value={value} onValueChange={setValue}>
          <TabList aria-label="People">
            <Tab value="all">All</Tab>
            <Tab value="recent">Recent</Tab>
            <Tab value="whats-new" disabled>What's new</Tab>
            <Tab value="together">Together</Tab>
          </TabList>
          <Panels />
        </Tabs>
      </Stack>
    );
  },
};
