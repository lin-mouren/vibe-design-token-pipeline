// Auto-generated from Badge/Tag contract — do not edit manually
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Tag, Space } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Badge> = {
  title: 'Generated/Badge/Tag',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'select', options: ["arcoblue","red","orangered","orange","gold","lime","green","cyan","blue","purple","pinkpurple","magenta","gray"] },
    size: { control: 'select', options: ["small","default","medium","large"] },
    bordered: { control: 'boolean' },
    closable: { control: 'boolean' },
    dot: { control: 'boolean' },
    status: { control: 'select', options: ["default","processing","success","warning","error"] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {"color":"arcoblue","size":"default","status":"default","children":"Badge"},
};

export const SizeSmall: Story = {
  name: 'Size: small',
  args: { ...Default.args, size: 'small' },
};

export const SizeMedium: Story = {
  name: 'Size: medium',
  args: { ...Default.args, size: 'medium' },
};

export const SizeLarge: Story = {
  name: 'Size: large',
  args: { ...Default.args, size: 'large' },
};

export const StatusProcessing: Story = {
  name: 'Status: processing',
  args: { ...Default.args, status: 'processing' },
};

export const StatusSuccess: Story = {
  name: 'Status: success',
  args: { ...Default.args, status: 'success' },
};

export const StatusWarning: Story = {
  name: 'Status: warning',
  args: { ...Default.args, status: 'warning' },
};

export const StatusError: Story = {
  name: 'Status: error',
  args: { ...Default.args, status: 'error' },
};

export const ColorRed: Story = {
  name: 'Color: red',
  args: { ...Default.args, color: 'red' },
};

export const ColorOrangered: Story = {
  name: 'Color: orangered',
  args: { ...Default.args, color: 'orangered' },
};

export const ColorOrange: Story = {
  name: 'Color: orange',
  args: { ...Default.args, color: 'orange' },
};

export const ColorGold: Story = {
  name: 'Color: gold',
  args: { ...Default.args, color: 'gold' },
};

export const ColorLime: Story = {
  name: 'Color: lime',
  args: { ...Default.args, color: 'lime' },
};

export const ColorGreen: Story = {
  name: 'Color: green',
  args: { ...Default.args, color: 'green' },
};

export const ColorCyan: Story = {
  name: 'Color: cyan',
  args: { ...Default.args, color: 'cyan' },
};

export const ColorBlue: Story = {
  name: 'Color: blue',
  args: { ...Default.args, color: 'blue' },
};

export const ColorPurple: Story = {
  name: 'Color: purple',
  args: { ...Default.args, color: 'purple' },
};

export const ColorPinkpurple: Story = {
  name: 'Color: pinkpurple',
  args: { ...Default.args, color: 'pinkpurple' },
};

export const ColorMagenta: Story = {
  name: 'Color: magenta',
  args: { ...Default.args, color: 'magenta' },
};

export const ColorGray: Story = {
  name: 'Color: gray',
  args: { ...Default.args, color: 'gray' },
};

