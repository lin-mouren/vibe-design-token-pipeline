// Auto-generated from Input contract — do not edit manually
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Input> = {
  title: 'Generated/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ["mini","small","default","large"] },
    status: { control: 'select', options: ["default","warning","error"] },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {"size":"default","status":"default","children":"Input"},
};

export const SizeMini: Story = {
  name: 'Size: mini',
  args: { ...Default.args, size: 'mini' },
};

export const SizeSmall: Story = {
  name: 'Size: small',
  args: { ...Default.args, size: 'small' },
};

export const SizeLarge: Story = {
  name: 'Size: large',
  args: { ...Default.args, size: 'large' },
};

export const StatusWarning: Story = {
  name: 'Status: warning',
  args: { ...Default.args, status: 'warning' },
};

export const StatusError: Story = {
  name: 'Status: error',
  args: { ...Default.args, status: 'error' },
};

export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

