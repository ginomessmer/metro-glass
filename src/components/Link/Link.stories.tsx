import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { Stack } from '../Layout/Stack';

const meta = {
  title: 'Components/Link',
  component: Link,
  args: { href: '#', children: 'Learn more' },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <Stack gap={5} style={{ maxWidth: 560 }}>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Inline links sit in running text, like this <Link variant="inline" href="#">privacy statement</Link>, and keep a quiet underline.
      </p>
      <Link variant="standalone" href="#">Standalone link</Link>
      <Link href="https://en.wikipedia.org/wiki/Metro_(design_language)" external>
        External link
      </Link>
      <Stack gap={1}>
        <Link variant="nav" href="#">personalise</Link>
        <Link variant="nav" href="#">devices</Link>
        <Link variant="nav" href="#">accounts</Link>
      </Stack>
    </Stack>
  ),
};
