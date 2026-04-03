// Auto-generated Foundation: Colors — do not edit manually
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '@arco-design/web-react/dist/css/arco.css';

const meta: Meta = {
  title: 'Generated/Foundations/Colors',
  tags: ['autodocs'],
};
export default meta;

const Swatch = ({ name, cssVar, hex }: { name: string; cssVar: string; hex: string }) => (
  <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: 4, width: 80 }}>
    <div style={{ width: 64, height: 64, borderRadius: 8, background: cssVar ? `var(${cssVar})` : hex, border: '1px solid #e5e6eb' }} />
    <span style={{ fontSize: 10, marginTop: 4, color: '#4e5969', textAlign: 'center', wordBreak: 'break-all' }}>{name}</span>
  </div>
);

export const CoreColorBlue: StoryObj = {
  name: 'core.color.blue',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="1" cssVar="--core-color-blue-1" hex="#e8f3ff" />
      <Swatch name="2" cssVar="--core-color-blue-2" hex="#bedaff" />
      <Swatch name="3" cssVar="--core-color-blue-3" hex="#94bfff" />
      <Swatch name="4" cssVar="--core-color-blue-4" hex="#6aa1ff" />
      <Swatch name="5" cssVar="--core-color-blue-5" hex="#4080ff" />
      <Swatch name="6" cssVar="--core-color-blue-6" hex="#165dff" />
      <Swatch name="7" cssVar="--core-color-blue-7" hex="#0e42d2" />
      <Swatch name="8" cssVar="--core-color-blue-8" hex="#072ca6" />
      <Swatch name="9" cssVar="--core-color-blue-9" hex="#031a79" />
      <Swatch name="10" cssVar="--core-color-blue-10" hex="#000d4d" />
    </div>
  ),
};

export const CoreColorNeutral: StoryObj = {
  name: 'core.color.neutral',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="1" cssVar="--core-color-neutral-1" hex="#f7f8fa" />
      <Swatch name="2" cssVar="--core-color-neutral-2" hex="#f2f3f5" />
      <Swatch name="3" cssVar="--core-color-neutral-3" hex="#e5e6eb" />
      <Swatch name="4" cssVar="--core-color-neutral-4" hex="#c9cdd4" />
      <Swatch name="5" cssVar="--core-color-neutral-5" hex="#a9aeb8" />
      <Swatch name="6" cssVar="--core-color-neutral-6" hex="#86909c" />
      <Swatch name="7" cssVar="--core-color-neutral-7" hex="#6b7785" />
      <Swatch name="8" cssVar="--core-color-neutral-8" hex="#4e5969" />
      <Swatch name="9" cssVar="--core-color-neutral-9" hex="#272e3b" />
      <Swatch name="10" cssVar="--core-color-neutral-10" hex="#1d2129" />
    </div>
  ),
};

export const CoreColorRed: StoryObj = {
  name: 'core.color.red',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="1" cssVar="--core-color-red-1" hex="#ffece8" />
      <Swatch name="2" cssVar="--core-color-red-2" hex="#fdcdc5" />
      <Swatch name="3" cssVar="--core-color-red-3" hex="#fbaca3" />
      <Swatch name="4" cssVar="--core-color-red-4" hex="#f98981" />
      <Swatch name="5" cssVar="--core-color-red-5" hex="#f76560" />
      <Swatch name="6" cssVar="--core-color-red-6" hex="#f53f3f" />
      <Swatch name="7" cssVar="--core-color-red-7" hex="#cb272d" />
      <Swatch name="8" cssVar="--core-color-red-8" hex="#a1151e" />
      <Swatch name="9" cssVar="--core-color-red-9" hex="#770813" />
      <Swatch name="10" cssVar="--core-color-red-10" hex="#4d000a" />
    </div>
  ),
};

export const CoreColorOrange: StoryObj = {
  name: 'core.color.orange',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="1" cssVar="--core-color-orange-1" hex="#fff7e8" />
      <Swatch name="2" cssVar="--core-color-orange-2" hex="#ffe4ba" />
      <Swatch name="3" cssVar="--core-color-orange-3" hex="#ffcf8b" />
      <Swatch name="4" cssVar="--core-color-orange-4" hex="#ffb65d" />
      <Swatch name="5" cssVar="--core-color-orange-5" hex="#ff9a2e" />
      <Swatch name="6" cssVar="--core-color-orange-6" hex="#ff7d00" />
      <Swatch name="7" cssVar="--core-color-orange-7" hex="#d25f00" />
      <Swatch name="8" cssVar="--core-color-orange-8" hex="#a64500" />
      <Swatch name="9" cssVar="--core-color-orange-9" hex="#792e00" />
      <Swatch name="10" cssVar="--core-color-orange-10" hex="#4d1b00" />
    </div>
  ),
};

export const CoreColorGreen: StoryObj = {
  name: 'core.color.green',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="1" cssVar="--core-color-green-1" hex="#e8ffea" />
      <Swatch name="2" cssVar="--core-color-green-2" hex="#aff0b5" />
      <Swatch name="3" cssVar="--core-color-green-3" hex="#7be188" />
      <Swatch name="4" cssVar="--core-color-green-4" hex="#4cd263" />
      <Swatch name="5" cssVar="--core-color-green-5" hex="#23c343" />
      <Swatch name="6" cssVar="--core-color-green-6" hex="#00b42a" />
      <Swatch name="7" cssVar="--core-color-green-7" hex="#009a29" />
      <Swatch name="8" cssVar="--core-color-green-8" hex="#008026" />
      <Swatch name="9" cssVar="--core-color-green-9" hex="#006622" />
      <Swatch name="10" cssVar="--core-color-green-10" hex="#004d1c" />
    </div>
  ),
};

export const CoreColorPurple: StoryObj = {
  name: 'core.color.purple',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="1" cssVar="--core-color-purple-1" hex="#f5e8ff" />
      <Swatch name="6" cssVar="--core-color-purple-6" hex="#722ed1" />
    </div>
  ),
};

export const CoreColorCyan: StoryObj = {
  name: 'core.color.cyan',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="6" cssVar="--core-color-cyan-6" hex="#14c9c9" />
    </div>
  ),
};

export const CoreColorGold: StoryObj = {
  name: 'core.color.gold',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="6" cssVar="--core-color-gold-6" hex="#f7ba1e" />
    </div>
  ),
};

export const CoreColorDark: StoryObj = {
  name: 'core.color.dark',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="1" cssVar="--core-color-dark-bg-1" hex="#ccc" />
      <Swatch name="2" cssVar="--core-color-dark-bg-2" hex="#ccc" />
      <Swatch name="3" cssVar="--core-color-dark-bg-3" hex="#ccc" />
      <Swatch name="4" cssVar="--core-color-dark-bg-4" hex="#ccc" />
      <Swatch name="5" cssVar="--core-color-dark-bg-5" hex="#ccc" />
      <Swatch name="border" cssVar="--core-color-dark-border" hex="#ccc" />
    </div>
  ),
};

export const CoreColorWhite: StoryObj = {
  name: 'core.color.white',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="white" cssVar="--core-color-white" hex="#ffffff" />
    </div>
  ),
};

export const CoreColorBlack: StoryObj = {
  name: 'core.color.black',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <Swatch name="black" cssVar="--core-color-black" hex="#000000" />
    </div>
  ),
};

