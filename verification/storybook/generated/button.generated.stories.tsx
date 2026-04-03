// Auto-generated from Button contract — do not edit manually
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Button> = {
  title: 'Generated/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ["primary","secondary","outline","text","dashed"] },
    status: { control: 'select', options: ["default","warning","danger","success"] },
    size: { control: 'select', options: ["mini","small","default","large"] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {"type":"primary","status":"default","size":"default","children":"Button"},
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

export const TypeSecondary: Story = {
  name: 'Type: secondary',
  args: { ...Default.args, type: 'secondary' },
};

export const TypeOutline: Story = {
  name: 'Type: outline',
  args: { ...Default.args, type: 'outline' },
};

export const TypeText: Story = {
  name: 'Type: text',
  args: { ...Default.args, type: 'text' },
};

export const TypeDashed: Story = {
  name: 'Type: dashed',
  args: { ...Default.args, type: 'dashed' },
};

export const StatusWarning: Story = {
  name: 'Status: warning',
  args: { ...Default.args, status: 'warning' },
};

export const StatusDanger: Story = {
  name: 'Status: danger',
  args: { ...Default.args, status: 'danger' },
};

export const StatusSuccess: Story = {
  name: 'Status: success',
  args: { ...Default.args, status: 'success' },
};

export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

export const Loading: Story = {
  args: { ...Default.args, loading: true },
};

