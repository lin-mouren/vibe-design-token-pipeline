import type { Preview } from '@storybook/react';
// Load generated design token CSS vars into Storybook (required for token-contract tests)
import '../dist/css/arco.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // axe-core configuration for @storybook/addon-a11y
      config: {
        rules: [
          {
            // Temporarily disable for Arco components with known color adjustments
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default preview;
