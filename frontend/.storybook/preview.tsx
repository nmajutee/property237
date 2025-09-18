import React from 'react';
import type { Preview } from '@storybook/react-vite';
import '../src/app/globals.css';
import '../src/design/themes/variables.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'high-contrast', title: 'High Contrast' },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;

      // Apply theme to document element
      document.documentElement.setAttribute('data-theme', theme);

      return (
        <div className="p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;