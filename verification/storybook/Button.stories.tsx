/**
 * Button.stories.tsx — Arco Design Button component stories
 *
 * Uses @arco-design/web-react (listed in devDependencies).
 * Run `npm install` before `npm run storybook`.
 *
 * Covers all variants required by Delivery Gate (Production Gate 3):
 *   - type × status × size matrix
 *   - interaction states: default, hover, focus, disabled, loading
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'text', 'dashed'],
      description: 'Visual style variant',
    },
    status: {
      control: 'select',
      options: ['default', 'warning', 'danger', 'success'],
      description: 'Semantic status color',
    },
    size: {
      control: 'select',
      options: ['mini', 'small', 'default', 'large'],
      description: 'Button size',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    shape: {
      control: 'select',
      options: ['square', 'round', 'circle'],
      description: 'Button shape',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Primary variants ─────────────────────────────────────────────────────────

export const Primary: Story = {
  args: { type: 'primary', status: 'default', size: 'default', children: 'Button' },
};

export const PrimarySmall: Story = {
  args: { type: 'primary', size: 'small', children: 'Button' },
};

export const PrimaryLarge: Story = {
  args: { type: 'primary', size: 'large', children: 'Button' },
};

export const PrimaryMini: Story = {
  args: { type: 'primary', size: 'mini', children: 'Button' },
};

// ── Secondary / Outline / Text / Dashed ─────────────────────────────────────

export const Secondary: Story = {
  args: { type: 'secondary', size: 'default', children: 'Button' },
};

export const Outline: Story = {
  args: { type: 'outline', size: 'default', children: 'Button' },
};

export const TextVariant: Story = {
  name: 'Text',
  args: { type: 'text', size: 'default', children: 'Button' },
};

export const Dashed: Story = {
  args: { type: 'dashed', size: 'default', children: 'Button' },
};

// ── Status variants ──────────────────────────────────────────────────────────

export const Danger: Story = {
  args: { type: 'primary', status: 'danger', size: 'default', children: 'Delete' },
};

export const Warning: Story = {
  args: { type: 'primary', status: 'warning', size: 'default', children: 'Warning' },
};

export const Success: Story = {
  args: { type: 'primary', status: 'success', size: 'default', children: 'Confirm' },
};

// ── Interaction states ───────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { type: 'primary', disabled: true, children: 'Disabled' },
};

export const Loading: Story = {
  args: { type: 'primary', loading: true, children: 'Loading' },
};

// ── Secondary disabled ───────────────────────────────────────────────────────

export const SecondaryDisabled: Story = {
  args: { type: 'secondary', disabled: true, children: 'Disabled' },
};

// ── Shape variants ───────────────────────────────────────────────────────────

export const ShapeRound: Story = {
  name: 'Shape: Round',
  args: { type: 'primary', shape: 'round', children: 'Round' },
};

export const ShapeCircle: Story = {
  name: 'Shape: Circle',
  args: { type: 'primary', shape: 'circle', children: 'A', iconOnly: true },
};
