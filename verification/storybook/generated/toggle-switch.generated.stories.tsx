// Auto-generated from Switch contract — do not edit manually
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Switch> = {
  title: 'Generated/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    size: { control: 'select', options: ["small","default"] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    type: { control: 'select', options: ["circle","round","line"] },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {"size":"default","type":"circle","children":"Switch"},
};

export const SizeSmall: Story = {
  name: 'Size: small',
  args: { ...Default.args, size: 'small' },
};

export const TypeRound: Story = {
  name: 'Type: round',
  args: { ...Default.args, type: 'round' },
};

export const TypeLine: Story = {
  name: 'Type: line',
  args: { ...Default.args, type: 'line' },
};

export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

export const Loading: Story = {
  args: { ...Default.args, loading: true },
};

