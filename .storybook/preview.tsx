import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.css';
import { MetroProvider } from '../src/tokens/MetroProvider';
import { metroAccents, type ShapePreset } from '../src/tokens/tokens';
import { Page } from '../src/components/Layout/Page';
import type { MetroTheme } from '../src/tokens/MetroProvider';

const withMetro: Decorator = (Story, { globals, parameters }) => (
  <MetroProvider
    accent={globals.accent ?? 'cyan'}
    theme={(globals.theme as MetroTheme) ?? 'system'}
    shape={(globals.shape as ShapePreset) ?? 'blend'}
  >
    {parameters.metroPage === false ? (
      <Story />
    ) : (
      <Page as="div">
        <Story />
      </Page>
    )}
  </MetroProvider>
);

const preview: Preview = {
  decorators: [withMetro],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    backgrounds: { disable: true },
  },
  initialGlobals: { accent: 'cyan', theme: 'system', shape: 'blend' },
  globalTypes: {
    accent: {
      description: 'Accent colour',
      toolbar: {
        title: 'Accent',
        icon: 'paintbrush',
        items: Object.keys(metroAccents),
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Colour scheme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: ['system', 'light', 'dark'],
        dynamicTitle: true,
      },
    },
    shape: {
      description: 'Corner style',
      toolbar: {
        title: 'Shape',
        icon: 'component',
        items: [
          { value: 'metro', title: 'Metro (square)' },
          { value: 'blend', title: 'Blend' },
          { value: 'glass', title: 'Glass (round)' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
