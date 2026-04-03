// Auto-generated from Card contract — do not edit manually
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Card> = {
  title: 'Generated/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    hoverable: { control: 'boolean' },
    size: { control: 'select', options: ["default","small"] },
    bordered: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {"size":"default","children":"Card"},
};

export const SizeSmall: Story = {
  name: 'Size: small',
  args: { ...Default.args, size: 'small' },
};

export const Loading: Story = {
  args: { ...Default.args, loading: true },
};

