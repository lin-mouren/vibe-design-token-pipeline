/**
 * Switch.stories.tsx — Arco Design Switch (Toggle) component stories
 *
 * Covers boolean state mapping, transition duration token, interactive feedback.
 * Token dimensions: track-background, handle-color, handle-shadow, transition-duration, border-radius.
 * Key validation: on/off state uses color.primary.6 vs color.bg.4 token binding.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@arco-design/web-react';
import { IconSun, IconMoon } from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean', description: 'On/off state' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['small', 'default'],
      description: 'Track size scale',
    },
    type: {
      control: 'select',
      options: ['circle', 'round', 'line'],
      description: 'Track/handle visual style',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = {
  name: 'State: Off',
  args: { defaultChecked: false },
};

export const On: Story = {
  name: 'State: On',
  args: { defaultChecked: true },
};

export const DisabledOff: Story = {
  name: 'Disabled: Off',
  args: { defaultChecked: false, disabled: true },
};

export const DisabledOn: Story = {
  name: 'Disabled: On',
  args: { defaultChecked: true, disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const SmallSize: Story = {
  name: 'Size: Small',
  args: { size: 'small' },
};

export const RoundType: Story = {
  name: 'Type: Round',
  args: { type: 'round' },
};

export const LineType: Story = {
  name: 'Type: Line',
  args: { type: 'line' },
};

export const WithLabels: Story = {
  name: 'With On/Off Labels',
  render: () => (
    <Switch
      checkedText="ON"
      uncheckedText="OFF"
      defaultChecked={false}
    />
  ),
};

export const WithIcons: Story = {
  name: 'With Icons',
  render: () => (
    <Switch
      checkedIcon={<IconSun />}
      uncheckedIcon={<IconMoon />}
      defaultChecked={true}
    />
  ),
};
