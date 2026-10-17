import type { Meta, StoryObj } from '@storybook/react-vite';
import { metroAccents } from '../tokens/tokens';
import { MetroProvider } from '../tokens/MetroProvider';
import { Heading, Subheading } from '../components/Typography/Heading';
import { Stack } from '../components/Layout/Stack';
import { Tile } from '../components/Tile/Tile';
import { Button } from '../components/Button/Button';

const meta = { title: 'Foundations' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Accents: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The Windows 8 accent palette. Everything derives from `--mg-accent` with relative colour syntax — including the text colour on top, which flips between black and white for contrast.',
      },
    },
  },
  render: () => (
    <Stack gap={5}>
      <div>
        <Heading level={1} lowercase>accents</Heading>
        <Subheading>Set one token, re-tint the system.</Subheading>
      </div>
      <Stack direction="row" gap={2} wrap>
        {Object.entries(metroAccents).map(([name]) => (
          <MetroProvider key={name} accent={name} style={{ display: 'contents' }}>
            <Tile size="medium" title={name}>
              <code style={{ fontSize: 12 }}>{metroAccents[name as keyof typeof metroAccents]}</code>
            </Tile>
          </MetroProvider>
        ))}
      </Stack>
    </Stack>
  ),
};

export const Material: Story = {
  name: 'Glass material',
  render: () => (
    <Stack gap={5}>
      <div>
        <Heading level={1} lowercase>material</Heading>
        <Subheading>Blurred, saturated backdrop · specular rim · pointer-following light.</Subheading>
      </div>
      <Stack direction="row" gap={4} wrap>
        <div className="mg-glass" style={{ width: 240, height: 160, borderRadius: 'var(--mg-radius-lg)', padding: 20 }}>Neutral glass</div>
        <div className="mg-glass" data-tint="accent" style={{ width: 240, height: 160, borderRadius: 'var(--mg-radius-lg)', padding: 20 }}>Accent glass</div>
      </Stack>
      <Subheading>
        Honours <code>prefers-reduced-transparency</code>, <code>prefers-contrast</code>, <code>forced-colors</code> and{' '}
        <code>prefers-reduced-motion</code>.
      </Subheading>
    </Stack>
  ),
};

export const Shapes: Story = {
  render: () => (
    <Stack direction="row" gap={6} wrap>
      {(['metro', 'blend', 'glass'] as const).map((shape) => (
        <MetroProvider key={shape} shape={shape} style={{ display: 'contents' }}>
          <Stack gap={3} align="start">
            <Heading level={2} size="section">{shape}</Heading>
            <Tile title={shape} />
            <Button variant="accent">Button</Button>
          </Stack>
        </MetroProvider>
      ))}
    </Stack>
  ),
};
