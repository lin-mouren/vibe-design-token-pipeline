/**
 * Card.stories.tsx — Arco Design Card component stories
 *
 * Covers compound spacing, elevation (shadow tokens), and border-radius.
 * Token dimensions validated: background, border-color, border-radius, shadow, padding.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    hoverable: { control: 'boolean', description: 'Enable hover lift shadow' },
    bordered: { control: 'boolean', description: 'Show border ring' },
    loading: { control: 'boolean', description: 'Loading skeleton state' },
    size: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Internal padding scale',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    children: 'Card content area',
    bordered: true,
    hoverable: false,
  },
};

export const Hoverable: Story = {
  args: {
    title: 'Hoverable Card',
    children: 'Hover to see shadow lift (level1 → level2)',
    hoverable: true,
    bordered: true,
  },
};

export const SmallSize: Story = {
  name: 'Size: Small',
  args: {
    title: 'Small Card',
    children: 'Compact padding variant',
    size: 'small',
    bordered: true,
  },
};

export const Borderless: Story = {
  name: 'No Border',
  args: {
    title: 'Borderless Card',
    children: 'Shadow-only elevation without border ring',
    bordered: false,
    hoverable: true,
  },
};

export const WithExtra: Story = {
  name: 'With Extra Action',
  args: {
    title: 'Card with Extra',
    extra: 'More',
    children: 'Header includes extra slot (top-right action)',
    bordered: true,
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading State',
    loading: true,
    children: 'This content is hidden during load',
    bordered: true,
  },
};
