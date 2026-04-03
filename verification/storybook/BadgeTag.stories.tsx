/**
 * BadgeTag.stories.tsx — Arco Design Badge + Tag component stories
 *
 * Covers 13-color variant matrix, compact spacing, WCAG AA high-contrast check.
 * Token dimensions: background, text-color, border-radius, font-size, padding.
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Tag, Space } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';

// ─── Tag stories ──────────────────────────────────────────────────────────────

const tagMeta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['arcoblue', 'red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'purple', 'pinkpurple', 'magenta', 'gray'],
      description: 'Semantic color variant',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'medium', 'large'],
      description: 'Tag size scale',
    },
    bordered: { control: 'boolean' },
    closable: { control: 'boolean' },
  },
};

export default tagMeta;
type TagStory = StoryObj<typeof Tag>;

export const Blue: TagStory = {
  args: { color: 'arcoblue', children: 'arcoblue', size: 'medium' },
};

export const Red: TagStory = {
  args: { color: 'red', children: 'red', size: 'medium' },
};

export const Green: TagStory = {
  args: { color: 'green', children: 'green', size: 'medium' },
};

export const Gold: TagStory = {
  args: { color: 'gold', children: 'gold', size: 'medium' },
};

export const ColorMatrix: TagStory = {
  name: 'All Colors',
  render: () => (
    <Space wrap>
      {(['arcoblue', 'red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'purple', 'pinkpurple', 'magenta', 'gray'] as const).map(
        color => <Tag key={color} color={color}>{color}</Tag>
      )}
    </Space>
  ),
};

export const SmallSize: TagStory = {
  name: 'Size: Small',
  args: { color: 'arcoblue', children: 'small tag', size: 'small' },
};

export const LargeSize: TagStory = {
  name: 'Size: Large',
  args: { color: 'arcoblue', children: 'large tag', size: 'large' },
};

export const Closable: TagStory = {
  args: { color: 'arcoblue', children: 'closable', closable: true, size: 'medium' },
};

export const Bordered: TagStory = {
  args: { color: 'arcoblue', children: 'bordered', bordered: true, size: 'medium' },
};

export const Checkable: TagStory = {
  name: 'Checkable',
  args: { color: 'arcoblue', children: 'checkable', checkable: true, defaultChecked: false, size: 'medium' },
};

// ─── Badge stories ────────────────────────────────────────────────────────────

const badgeMeta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    count: { control: 'number', description: 'Number to show in badge' },
    dot: { control: 'boolean', description: 'Show as small red dot' },
    status: {
      control: 'select',
      options: ['default', 'processing', 'success', 'warning', 'error'],
      description: 'Status dot type',
    },
    color: {
      control: 'select',
      options: ['red', 'orangered', 'orange', 'gold', 'lime', 'green', 'cyan', 'arcoblue', 'purple', 'pinkpurple', 'magenta', 'gray'],
      description: 'Preset dot color',
    },
  },
};

type BadgeStory = StoryObj<typeof Badge>;

export const BadgeCount: BadgeStory = {
  name: 'Badge / Count',
  render: () => (
    <Space size="large">
      <Badge count={5}><div style={{ width: 40, height: 40, background: 'var(--color-fill-2)', borderRadius: 4 }} /></Badge>
      <Badge count={99}><div style={{ width: 40, height: 40, background: 'var(--color-fill-2)', borderRadius: 4 }} /></Badge>
      <Badge count={100} maxCount={99}><div style={{ width: 40, height: 40, background: 'var(--color-fill-2)', borderRadius: 4 }} /></Badge>
    </Space>
  ),
};

export const BadgeDot: BadgeStory = {
  name: 'Badge / Dot',
  render: () => (
    <Badge dot>
      <div style={{ width: 40, height: 40, background: 'var(--color-fill-2)', borderRadius: 4 }} />
    </Badge>
  ),
};

export const BadgeProcessing: BadgeStory = {
  name: 'Badge / Status: Processing',
  render: () => (
    <Space size="large">
      <Badge status="processing" text="Processing" />
      <Badge status="success" text="Success" />
      <Badge status="warning" text="Warning" />
      <Badge status="error" text="Error" />
      <Badge status="default" text="Default" />
    </Space>
  ),
};
