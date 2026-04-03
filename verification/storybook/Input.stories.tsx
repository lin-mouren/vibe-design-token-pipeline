/**
 * Input.stories.tsx — Arco Design Input component stories
 *
 * Evidence confidence: medium (token bindings derived from CSS var patterns,
 * pending Figma boundVariables audit).
 *
 * Run `npm install` before `npm run storybook`.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['mini', 'small', 'default', 'large'],
      description: 'Input size',
    },
    status: {
      control: 'select',
      options: ['warning', 'error'],
      description: 'Validation status',
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { size: 'default', placeholder: 'Placeholder text' },
};

// ── Sizes ────────────────────────────────────────────────────────────────────

export const SizeMini: Story = {
  name: 'Size / Mini',
  args: { size: 'mini', placeholder: 'Mini input' },
};

export const SizeSmall: Story = {
  name: 'Size / Small',
  args: { size: 'small', placeholder: 'Small input' },
};

export const SizeLarge: Story = {
  name: 'Size / Large',
  args: { size: 'large', placeholder: 'Large input' },
};

// ── Status ───────────────────────────────────────────────────────────────────

export const StatusError: Story = {
  name: 'Status / Error',
  args: { status: 'error', defaultValue: 'Invalid input', size: 'default' },
};

export const StatusWarning: Story = {
  name: 'Status / Warning',
  args: { status: 'warning', defaultValue: 'Warning value', size: 'default' },
};

// ── States ───────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Disabled input', size: 'default' },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'Read-only value', size: 'default' },
};

// ── With affixes ─────────────────────────────────────────────────────────────

export const WithPrefix: Story = {
  name: 'With / Prefix',
  args: { size: 'default', prefix: 'http://', placeholder: 'domain.com' },
};

export const WithSuffix: Story = {
  name: 'With / Suffix',
  args: { size: 'default', suffix: '.com', placeholder: 'domain' },
};
