/**
 * DesignTokens.stories.tsx — Core Token 文档
 * Design Tokens/Core — 基础 token 层
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const S = {
  page: {
    padding: '24px 32px',
    fontFamily: 'var(--core-text-family-sans, system-ui, sans-serif)',
    fontSize: '14px',
    color: '#1d2129',
    maxWidth: '960px',
  } as React.CSSProperties,
  h1: { fontSize: '20px', fontWeight: 600, marginBottom: '4px', color: '#1d2129' } as React.CSSProperties,
  subtitle: { fontSize: '13px', color: '#86909c', marginBottom: '32px' } as React.CSSProperties,
  section: { marginBottom: '40px' } as React.CSSProperties,
  h2: {
    fontSize: '16px', fontWeight: 600, color: '#1d2129',
    borderBottom: '1px solid #e5e6eb', paddingBottom: '8px', marginBottom: '16px',
  } as React.CSSProperties,
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px',
  } as React.CSSProperties,
  swatch: { borderRadius: '6px', overflow: 'hidden', border: '1px solid #e5e6eb' } as React.CSSProperties,
  swatchColor: (bg: string) => ({ height: '56px', background: bg } as React.CSSProperties),
  swatchInfo: { padding: '8px 10px', background: '#fff' } as React.CSSProperties,
  swatchName: { fontSize: '11px', fontWeight: 600, color: '#1d2129', fontFamily: 'monospace' } as React.CSSProperties,
  swatchValue: { fontSize: '11px', color: '#86909c', marginTop: '2px', fontFamily: 'monospace' } as React.CSSProperties,
  swatchUsage: { fontSize: '10px', color: '#4e5969', marginTop: '4px' } as React.CSSProperties,
  row: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 0', borderBottom: '1px solid #f2f3f5',
  } as React.CSSProperties,
  label: { fontFamily: 'monospace', fontSize: '12px', color: '#165dff', minWidth: '280px' } as React.CSSProperties,
  value: { fontFamily: 'monospace', fontSize: '12px', color: '#4e5969', minWidth: '120px' } as React.CSSProperties,
  desc: { fontSize: '12px', color: '#86909c' } as React.CSSProperties,
};

const Swatch = ({ name, value, usage }: { name: string; value: string; usage?: string }) => (
  <div style={S.swatch}>
    <div style={S.swatchColor(value)} />
    <div style={S.swatchInfo}>
      <div style={S.swatchName}>{name}</div>
      <div style={S.swatchValue}>{value}</div>
      {usage && <div style={S.swatchUsage}>{usage}</div>}
    </div>
  </div>
);

const Scale = ({ name, colors }: { name: string; colors: { step: string; value: string; note?: string }[] }) => (
  <div style={S.section}>
    <div style={{ fontSize: '13px', fontWeight: 600, color: '#4e5969', marginBottom: '8px' }}>{name}</div>
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
      {colors.map(c => (
        <div key={c.step} style={{ textAlign: 'center' as const }}>
          <div style={{ width: '56px', height: '40px', borderRadius: '4px', background: c.value, border: '1px solid #e5e6eb' }} />
          <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#86909c', marginTop: '4px' }}>{c.step}</div>
          {c.note && <div style={{ fontSize: '9px', color: '#165dff' }}>{c.note}</div>}
        </div>
      ))}
    </div>
  </div>
);

// ── Color Palette ──────────────────────────────────────────────────────────────
const ColorPalettePage = () => (
  <div style={S.page}>
    <div style={S.h1}>调色板 — Core Color</div>
    <div style={S.subtitle}>core.color.* | CSS: --core-color-*</div>
    <Scale name="core.color.blue（主品牌蓝）" colors={[
      { step: '1', value: 'rgb(232,243,255)' }, { step: '2', value: 'rgb(190,218,255)' },
      { step: '3', value: 'rgb(148,191,255)' }, { step: '4', value: 'rgb(106,161,255)' },
      { step: '5', value: 'rgb(64,128,255)', note: 'hover' },
      { step: '6', value: 'rgb(22,93,255)', note: '★ primary' },
      { step: '7', value: 'rgb(14,66,210)', note: 'active' },
      { step: '8', value: 'rgb(7,44,166)' }, { step: '9', value: 'rgb(3,26,121)' }, { step: '10', value: 'rgb(0,13,77)' },
    ]} />
    <Scale name="core.color.neutral（中性色）" colors={[
      { step: '1', value: 'rgb(247,248,250)', note: 'page bg' }, { step: '2', value: 'rgb(242,243,245)', note: 'fill' },
      { step: '3', value: 'rgb(229,230,235)', note: 'border' }, { step: '4', value: 'rgb(201,205,212)' },
      { step: '5', value: 'rgb(169,174,184)' }, { step: '6', value: 'rgb(134,144,156)', note: 'text-3' },
      { step: '7', value: 'rgb(107,119,133)' }, { step: '8', value: 'rgb(78,89,105)', note: 'text-2' },
      { step: '9', value: 'rgb(39,46,59)' }, { step: '10', value: 'rgb(29,33,41)', note: '★ text-1' },
    ]} />
    <Scale name="core.color.red（危险）" colors={[
      { step: '1', value: 'rgb(255,236,232)' }, { step: '5', value: 'rgb(247,101,96)' },
      { step: '6', value: 'rgb(245,63,63)', note: '★ danger' }, { step: '7', value: 'rgb(203,39,45)' },
    ]} />
    <Scale name="core.color.orange（警告）" colors={[
      { step: '1', value: 'rgb(255,247,232)' }, { step: '5', value: 'rgb(255,154,46)' },
      { step: '6', value: 'rgb(255,125,0)', note: '★ warning' }, { step: '7', value: 'rgb(210,95,0)' },
    ]} />
    <Scale name="core.color.green（成功）" colors={[
      { step: '1', value: 'rgb(232,255,234)' }, { step: '5', value: 'rgb(35,195,67)' },
      { step: '6', value: 'rgb(0,180,42)', note: '★ success' }, { step: '7', value: 'rgb(0,154,41)' },
    ]} />
    <div style={S.section}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#4e5969', marginBottom: '8px' }}>core.color.white / core.color.black</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Swatch name="--core-color-white" value="#ffffff" usage="button text, inverse" />
        <Swatch name="--core-color-black" value="#000000" usage="absolute dark" />
      </div>
    </div>
    <div style={S.section}>
      <div style={S.h2}>core.color.dark.bg.* — Dark Mode 背景原色</div>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[{ s: '1', v: '#17171a', n: 'page bg' }, { s: '2', v: '#232324' }, { s: '3', v: '#2a2a2b' }, { s: '4', v: '#313132' }, { s: '5', v: '#373739' }].map(c => (
          <div key={c.s} style={{ textAlign: 'center' as const }}>
            <div style={{ width: '56px', height: '40px', borderRadius: '4px', background: c.v, border: '1px solid #333' }} />
            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#86909c', marginTop: '4px' }}>bg.{c.s}</div>
            {c.n && <div style={{ fontSize: '9px', color: '#165dff' }}>{c.n}</div>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Semantic Color ─────────────────────────────────────────────────────────────
const SemanticColorPage = () => (
  <div style={S.page}>
    <div style={S.h1}>语义色 — Semantic Color</div>
    <div style={S.subtitle}>semantic.color.* | CSS: --semantic-color-*</div>
    <div style={S.section}>
      <div style={S.h2}>Primary</div>
      <div style={S.grid}>
        <Swatch name="--semantic-color-primary-default" value="rgb(22,93,255)" usage="button, link, focus" />
        <Swatch name="--semantic-color-primary-hover" value="rgb(64,128,255)" usage="hover state" />
        <Swatch name="--semantic-color-primary-active" value="rgb(14,66,210)" usage="pressed state" />
        <Swatch name="--semantic-color-primary-disabled" value="rgb(148,191,255)" usage="disabled" />
        <Swatch name="--semantic-color-primary-light" value="rgb(232,243,255)" usage="light tint bg" />
      </div>
    </div>
    <div style={S.section}>
      <div style={S.h2}>Danger / Success / Warning</div>
      <div style={S.grid}>
        <Swatch name="--semantic-color-danger-default" value="rgb(245,63,63)" usage="error, destructive" />
        <Swatch name="--semantic-color-danger-light" value="rgb(255,236,232)" usage="danger bg tint" />
        <Swatch name="--semantic-color-success-default" value="rgb(0,180,42)" usage="success, positive" />
        <Swatch name="--semantic-color-success-light" value="rgb(232,255,234)" usage="success bg tint" />
        <Swatch name="--semantic-color-warning-default" value="rgb(255,125,0)" usage="warning" />
        <Swatch name="--semantic-color-warning-light" value="rgb(255,247,232)" usage="warning bg tint" />
      </div>
    </div>
    <div style={S.section}>
      <div style={S.h2}>Text</div>
      <div style={S.grid}>
        <Swatch name="--semantic-color-text-primary" value="rgb(29,33,41)" usage="titles, labels" />
        <Swatch name="--semantic-color-text-secondary" value="rgb(78,89,105)" usage="descriptions" />
        <Swatch name="--semantic-color-text-tertiary" value="rgb(134,144,156)" usage="placeholder" />
        <Swatch name="--semantic-color-text-disabled" value="rgb(201,205,212)" usage="disabled text" />
        <Swatch name="--semantic-color-text-inverse" value="#ffffff" usage="text on dark bg" />
      </div>
    </div>
    <div style={S.section}>
      <div style={S.h2}>Surface & Border</div>
      <div style={S.grid}>
        <Swatch name="--semantic-color-surface-1" value="#ffffff" usage="card, primary" />
        <Swatch name="--semantic-color-surface-2" value="rgb(247,248,250)" usage="near-white fill" />
        <Swatch name="--semantic-color-surface-3" value="rgb(242,243,245)" usage="hover fill" />
        <Swatch name="--semantic-color-surface-4" value="rgb(229,230,235)" usage="selected fill" />
        <Swatch name="--semantic-color-border-subtle" value="rgb(242,243,245)" usage="subtle divider" />
        <Swatch name="--semantic-color-border-default" value="rgb(229,230,235)" usage="input, card" />
        <Swatch name="--semantic-color-border-strong" value="rgb(201,205,212)" usage="hover border" />
        <Swatch name="--semantic-color-mask-bg" value="rgba(29,33,41,0.6)" usage="modal overlay" />
      </div>
    </div>
  </div>
);

// ── Text ───────────────────────────────────────────────────────────────────────
const CoreTextPage = () => (
  <div style={S.page}>
    <div style={S.h1}>文字排版 — Core Text</div>
    <div style={S.subtitle}>core.text.* | CSS: --core-text-*</div>
    <div style={S.section}>
      <div style={S.h2}>字体族 Family</div>
      {[
        { name: '--core-text-family-sans', value: 'system-ui, PingFang SC, sans-serif', usage: '正文、标题' },
        { name: '--core-text-family-mono', value: 'Consolas, SFMono-Regular, monospace', usage: '代码块' },
      ].map(t => (
        <div key={t.name} style={S.row}>
          <span style={S.label}>{t.name}</span>
          <span style={S.value}>{t.value}</span>
          <span style={S.desc}>{t.usage}</span>
        </div>
      ))}
    </div>
    <div style={S.section}>
      <div style={S.h2}>字号 Size</div>
      {[12, 13, 14, 16, 18, 20, 24].map(size => (
        <div key={size} style={S.row}>
          <span style={S.label}>{`--core-text-size-${size}`}</span>
          <span style={{ ...S.value, fontSize: `${size}px` }}>{size}px — 样本文本</span>
          <span style={S.desc}>{size === 14 ? '★ base body' : size === 12 ? 'caption' : size >= 20 ? 'heading' : ''}</span>
        </div>
      ))}
    </div>
    <div style={S.section}>
      <div style={S.h2}>字重 Weight</div>
      {[{ w: 400, l: 'Regular', u: 'body' }, { w: 500, l: 'Medium', u: 'subheading' }, { w: 600, l: 'SemiBold', u: 'title' }, { w: 700, l: 'Bold', u: 'emphasis' }].map(({ w, l, u }) => (
        <div key={w} style={S.row}>
          <span style={S.label}>{`--core-text-weight-${w}`}</span>
          <span style={{ ...S.value, fontWeight: w }}>{l} — 设计系统</span>
          <span style={S.desc}>{u}</span>
        </div>
      ))}
    </div>
    <div style={S.section}>
      <div style={S.h2}>行高 Line Height</div>
      {[{ k: 'tight', v: '1.4', u: 'heading' }, { k: 'base', v: '1.5715', u: 'body text' }, { k: 'relaxed', v: '1.75', u: 'long-form' }].map(lh => (
        <div key={lh.k} style={S.row}>
          <span style={S.label}>{`--core-text-lineheight-${lh.k}`}</span>
          <span style={S.value}>{lh.v}</span>
          <span style={S.desc}>{lh.u}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Radius ─────────────────────────────────────────────────────────────────────
const CoreRadiusPage = () => (
  <div style={S.page}>
    <div style={S.h1}>圆角 — Core Radius</div>
    <div style={S.subtitle}>core.radius.* | CSS: --core-radius-*</div>
    <div style={S.section}>
      {[
        { name: 'none', value: '0', usage: 'sharp, tables' },
        { name: 'small', value: '2px', usage: 'Tag, Badge' },
        { name: 'medium', value: '4px', usage: '★ Button, Input, Select' },
        { name: 'large', value: '8px', usage: 'Card, Modal, Drawer' },
        { name: 'xlarge', value: '16px', usage: 'prominent containers' },
        { name: 'circle', value: '9999px', usage: 'Avatar, Switch, pill' },
      ].map(({ name, value, usage }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{`--core-radius-${name}`}</span>
          <div style={{ width: '80px', height: '40px', background: '#e8f3ff', border: '2px solid #165dff', borderRadius: value === '9999px' ? '9999px' : value }} />
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{usage}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Shadow ─────────────────────────────────────────────────────────────────────
const CoreShadowPage = () => (
  <div style={S.page}>
    <div style={S.h1}>阴影 — Core Shadow</div>
    <div style={S.subtitle}>core.shadow.* | CSS: --core-shadow-*</div>
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' as const, marginBottom: '32px' }}>
      {[
        { name: 'special', shadow: '0 0 1px rgba(0,0,0,0.3)', usage: '选中态轮廓' },
        { name: 'level1', shadow: '0 -2px 5px rgba(0,0,0,0.1)', usage: 'dropdown, tooltip' },
        { name: 'level2', shadow: '0 0 10px rgba(0,0,0,0.1)', usage: '★ Card, Popover' },
        { name: 'level3', shadow: '0 0 20px rgba(0,0,0,0.1)', usage: 'Modal, Drawer' },
      ].map(({ name, shadow, usage }) => (
        <div key={name} style={{ textAlign: 'center' as const }}>
          <div style={{ width: '120px', height: '80px', background: '#fff', borderRadius: '8px', boxShadow: shadow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#86909c' }}>{name}</div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#165dff', marginTop: '8px' }}>{`--core-shadow-${name}`}</div>
          <div style={{ fontSize: '10px', color: '#86909c' }}>{usage}</div>
        </div>
      ))}
    </div>
    <div style={S.section}>
      <div style={S.h2}>Shadow Token 值</div>
      {[
        { name: '--core-shadow-special', value: '0 0 1px rgba(0,0,0,0.3)', usage: '$type: shadow' },
        { name: '--core-shadow-level1', value: '0 -2px 5px rgba(0,0,0,0.1)', usage: '$type: shadow' },
        { name: '--core-shadow-level2', value: '0 0 10px rgba(0,0,0,0.1)', usage: '$type: shadow' },
        { name: '--core-shadow-level3', value: '0 0 20px rgba(0,0,0,0.1)', usage: '$type: shadow' },
      ].map(({ name, value, usage }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{usage}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Size ───────────────────────────────────────────────────────────────────────
const CoreSizePage = () => (
  <div style={S.page}>
    <div style={S.h1}>尺寸 — Core Size</div>
    <div style={S.subtitle}>core.size.* | CSS: --core-size-*</div>
    <div style={S.section}>
      <div style={S.h2}>组件高度 Component Height</div>
      {[{ name: 'mini', value: '24px', usage: 'mini 档' }, { name: 'small', value: '28px', usage: 'small 档' }, { name: 'default', value: '32px', usage: '★ 默认档' }, { name: 'large', value: '36px', usage: 'large 档' }].map(({ name, value, usage }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{`--core-size-component-${name}`}</span>
          <div style={{ height: value, width: '120px', background: '#e8f3ff', border: '1px solid #94bfff', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#165dff' }}>{value}</div>
          <span style={S.desc}>{usage}</span>
        </div>
      ))}
    </div>
    <div style={S.section}>
      <div style={S.h2}>图标尺寸 Icon Size</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
        {[12, 14, 16, 18, 20, 24].map(size => (
          <div key={size} style={{ textAlign: 'center' as const }}>
            <div style={{ width: `${size}px`, height: `${size}px`, background: '#165dff', borderRadius: '2px', margin: '0 auto' }} />
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '4px' }}>{size}px</div>
            <div style={{ fontSize: '9px', fontFamily: 'monospace', color: '#165dff' }}>{`icon-${size}`}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={S.section}>
      <div style={S.h2}>头像尺寸 Avatar Size</div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const, alignItems: 'flex-end' as const }}>
        {[{ name: 'mini', value: '24px' }, { name: 'small', value: '28px' }, { name: 'default', value: '32px' }, { name: 'large', value: '40px' }, { name: 'xlarge', value: '64px' }].map(({ name, value }) => (
          <div key={name} style={{ textAlign: 'center' as const }}>
            <div style={{ width: value, height: value, borderRadius: '50%', background: '#165dff', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px' }}>U</div>
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '4px' }}>{name}</div>
            <div style={{ fontSize: '9px', color: '#86909c' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Dark Theme ─────────────────────────────────────────────────────────────────
const DarkThemePage = () => (
  <div style={{ ...S.page, background: '#17171a', color: '#fff', minHeight: '100vh' }}>
    <div style={{ ...S.h1, color: 'rgba(255,255,255,0.9)' }}>深色主题 — Dark Theme</div>
    <div style={{ ...S.subtitle, color: 'rgba(255,255,255,0.5)' }}>core.color.dark.* → themes/dark.tokens.json semantic overrides</div>
    <div style={{ marginBottom: '32px' }}>
      <div style={{ ...S.h2, color: 'rgba(255,255,255,0.9)', borderBottomColor: '#333' }}>Dark 背景层级</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
        {[{ n: 'core.color.dark.bg.1', v: '#17171a', d: 'page bg' }, { n: 'core.color.dark.bg.2', v: '#232324', d: 'card bg' }, { n: 'core.color.dark.bg.3', v: '#2a2a2b', d: 'surface 3' }, { n: 'core.color.dark.bg.4', v: '#313132', d: 'surface 4' }, { n: 'core.color.dark.bg.5', v: '#373739', d: 'lightest' }].map(({ n, v, d }) => (
          <div key={n} style={{ textAlign: 'center' as const }}>
            <div style={{ width: '80px', height: '50px', background: v, borderRadius: '6px', border: '1px solid #444' }} />
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', fontFamily: 'monospace' }}>{v}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)' }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ marginBottom: '32px' }}>
      <div style={{ ...S.h2, color: 'rgba(255,255,255,0.9)', borderBottomColor: '#333' }}>Dark 文字层级</div>
      {[{ v: 'rgba(255,255,255,0.9)', l: 'text.primary' }, { v: 'rgba(255,255,255,0.7)', l: 'text.secondary' }, { v: 'rgba(255,255,255,0.5)', l: 'text.tertiary' }, { v: 'rgba(255,255,255,0.3)', l: 'text.disabled' }].map(({ v, l }) => (
        <div key={l} style={{ ...S.row, borderBottomColor: '#333' }}>
          <span style={{ ...S.label, color: v }}>{v}</span>
          <span style={{ ...S.desc, color: 'rgba(255,255,255,0.5)' }}>{l}</span>
        </div>
      ))}
    </div>
    <div>
      <div style={{ ...S.h2, color: 'rgba(255,255,255,0.9)', borderBottomColor: '#333' }}>Dark Border</div>
      <div style={{ padding: '16px', border: '1px solid #333335', borderRadius: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>core.color.dark.border = #333335</div>
    </div>
  </div>
);

// ── Meta & Stories ─────────────────────────────────────────────────────────────
const PlaceholderComponent = () => null;

const meta: Meta<typeof PlaceholderComponent> = {
  title: 'Design Tokens/Core',
  component: PlaceholderComponent,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof PlaceholderComponent>;

export const ColorPalette: Story = {
  name: '① 调色板 Color Palette',
  render: () => <ColorPalettePage />,
};
export const SemanticColor: Story = {
  name: '② 语义色 Semantic Color',
  render: () => <SemanticColorPage />,
};
export const Text: Story = {
  name: '③ 文字排版 Text',
  render: () => <CoreTextPage />,
};
export const Radius: Story = {
  name: '⑤ 圆角 Radius',
  render: () => <CoreRadiusPage />,
};
export const Shadow: Story = {
  name: '⑥ 阴影 Shadow',
  render: () => <CoreShadowPage />,
};
export const Size: Story = {
  name: '⑦ 尺寸 Size',
  render: () => <CoreSizePage />,
};
export const DarkTheme: Story = {
  name: '⑫ 深色主题 Dark Theme',
  render: () => <DarkThemePage />,
};
