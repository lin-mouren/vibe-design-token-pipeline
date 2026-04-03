/**
 * DesignTokensLayout.stories.tsx — Layout Token 文档
 * Design Tokens/Layout — 布局 token 层：间距、栅格、语义布局
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
  row: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 0', borderBottom: '1px solid #f2f3f5',
  } as React.CSSProperties,
  label: { fontFamily: 'monospace', fontSize: '12px', color: '#165dff', minWidth: '280px' } as React.CSSProperties,
  value: { fontFamily: 'monospace', fontSize: '12px', color: '#4e5969', minWidth: '100px' } as React.CSSProperties,
  desc: { fontSize: '12px', color: '#86909c' } as React.CSSProperties,
};

// ── Space ──────────────────────────────────────────────────────────────────────
const SpacePage = () => (
  <div style={S.page}>
    <div style={S.h1}>间距 — Core Space</div>
    <div style={S.subtitle}>core.space.* | 4px 基准单元间距体系 | CSS: --core-space-*</div>
    <div style={S.section}>
      {[
        { step: 1, value: '4px', usage: 'icon-label gap, micro spacing' },
        { step: 2, value: '8px', usage: 'button icon gap, tag spacing' },
        { step: 3, value: '12px', usage: 'tight content blocks' },
        { step: 4, value: '16px', usage: '★ most common — card padding, form gap' },
        { step: 5, value: '24px', usage: 'section spacing, grid gutter' },
        { step: 6, value: '32px', usage: 'page-level loose spacing' },
        { step: 7, value: '40px', usage: 'breathing space' },
        { step: 8, value: '48px', usage: 'nav height reference' },
        { step: 9, value: '64px', usage: 'hero section' },
        { step: 10, value: '80px', usage: 'landing page separator' },
      ].map(({ step, value, usage }) => (
        <div key={step} style={S.row}>
          <span style={S.label}>{`--core-space-${step}`}</span>
          <div style={{ width: Math.min(parseInt(value) * 2, 160), height: '20px', background: '#bedaff', borderRadius: '2px', minWidth: '4px' }} />
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{usage}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Grid ───────────────────────────────────────────────────────────────────────
const GridPage = () => (
  <div style={S.page}>
    <div style={S.h1}>栅格 — Core Grid</div>
    <div style={S.subtitle}>core.grid.* | 24等分栅格体系 | CSS: --core-grid-*</div>

    <div style={S.section}>
      <div style={S.h2}>栅格列数 Columns</div>
      <div style={S.row}>
        <span style={S.label}>--core-grid-columns-standard</span>
        <span style={S.value}>24</span>
        <span style={S.desc}>★ 推荐标准 — 复杂信息密集型系统页面</span>
      </div>
      <div style={S.row}>
        <span style={S.label}>--core-grid-columns-simple</span>
        <span style={S.value}>12</span>
        <span style={S.desc}>简单页面 — 信息量少、布局简单的页面</span>
      </div>
      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '12px', color: '#86909c', marginBottom: '8px' }}>24列栅格可视化</div>
        <div style={{ display: 'flex', gap: '4px', height: '32px' }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i % 2 === 0 ? '#e8f3ff' : '#bedaff', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#165dff' }}>{i + 1}</div>
          ))}
        </div>
      </div>
    </div>

    <div style={S.section}>
      <div style={S.h2}>水槽间距 Gutter Options</div>
      <div style={S.row}>
        <span style={S.label}>--core-grid-gutter-default</span>
        <span style={S.value}>24px</span>
        <span style={S.desc}>★ 推荐默认水槽</span>
      </div>
      {[8, 16, 24, 32, 40].map(g => (
        <div key={g} style={S.row}>
          <span style={S.label}>{`--core-grid-gutter-${g}`}</span>
          <div style={{ display: 'flex', gap: `${g}px`, alignItems: 'center' }}>
            <div style={{ width: '40px', height: '24px', background: '#e8f3ff', borderRadius: '2px' }} />
            <div style={{ width: `${g}px`, height: '24px', background: '#ffd666', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#664d00' }}>{g}</div>
            <div style={{ width: '40px', height: '24px', background: '#e8f3ff', borderRadius: '2px' }} />
          </div>
          <span style={S.value}>{g}px</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>响应式断点 Breakpoints</div>
      {[
        { name: 'xs', value: '0px', desc: '超小屏 — 手机竖屏 < 576px' },
        { name: 'sm', value: '576px', desc: '小屏 — 手机横屏 ≥ 576px' },
        { name: 'md', value: '768px', desc: '中屏 — 平板 ≥ 768px' },
        { name: 'lg', value: '992px', desc: '大屏 — 桌面端标准 ≥ 992px' },
        { name: 'xl', value: '1200px', desc: '超大屏 — 宽屏桌面 ≥ 1200px' },
        { name: 'xxl', value: '1600px', desc: '极大屏 — 超大显示器 ≥ 1600px' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{`--core-grid-breakpoint-${name}`}</span>
          <span style={{ ...S.value, color: '#165dff', fontWeight: 600 }}>{name.toUpperCase()}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
      <div style={{ marginTop: '16px', position: 'relative' as const, height: '48px', background: '#f7f8fa', borderRadius: '4px', overflow: 'hidden' }}>
        {[
          { bp: 'xs', left: '0%', width: '10%', color: '#bedaff', label: 'xs' },
          { bp: 'sm', left: '10%', width: '13%', color: '#94bfff', label: 'sm' },
          { bp: 'md', left: '23%', width: '15%', color: '#6aa1ff', label: 'md' },
          { bp: 'lg', left: '38%', width: '17%', color: '#4080ff', label: 'lg' },
          { bp: 'xl', left: '55%', width: '20%', color: '#2060e0', label: 'xl' },
          { bp: 'xxl', left: '75%', width: '25%', color: '#165dff', label: 'xxl' },
        ].map(({ bp, left, width, color, label }) => (
          <div key={bp} style={{ position: 'absolute' as const, left, width, top: 0, bottom: 0, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 600 }}>{label}</div>
        ))}
      </div>
    </div>
  </div>
);

// ── Layout & Divider ───────────────────────────────────────────────────────────
const LayoutDividerPage = () => (
  <div style={S.page}>
    <div style={S.h1}>布局 & 分割线 — Layout & Divider</div>
    <div style={S.subtitle}>semantic.layout.* | CSS: --semantic-layout-* / --comp-divider-*</div>

    <div style={S.section}>
      <div style={S.h2}>semantic.layout.divider.* — 分割线布局规范</div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ height: '1px', background: 'rgb(229,230,235)', margin: '16px 0' }} />
        <div style={{ fontSize: '12px', color: '#86909c', textAlign: 'center' as const }}>↑ 示例：semantic.layout.divider</div>
      </div>
      {[
        { name: '--semantic-layout-divider-color', value: 'rgb(229,230,235)', desc: '分割线颜色 → {semantic.color.border.default}' },
        { name: '--semantic-layout-divider-thickness', value: '1px', desc: '分割线粗细' },
        { name: '--semantic-layout-divider-margin', value: '16px', desc: '分割线外边距 → {core.space.4}' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>semantic.layout.content.* — 内容区布局规范</div>
      <div style={{ marginBottom: '16px', padding: '0 24px', background: '#f7f8fa', borderRadius: '8px', border: '1px dashed #94bfff' }}>
        <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
          <div style={{ height: '40px', background: '#bedaff', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '12px', color: '#165dff' }}>内容块 A</div>
          <div style={{ height: '40px', background: '#bedaff', borderRadius: '4px', display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '12px', color: '#165dff' }}>内容块 B</div>
        </div>
        <div style={{ fontSize: '11px', color: '#86909c', paddingBottom: '8px', textAlign: 'center' as const }}>padding: 24px | gap: 16px</div>
      </div>
      {[
        { name: '--semantic-layout-content-padding', value: '24px', desc: '内容区 padding → {core.space.5}' },
        { name: '--semantic-layout-content-gap', value: '16px', desc: '内容块间距 → {core.space.4}' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>comp.divider.* — Divider 组件 Token</div>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ height: '1px', flex: 1, background: 'rgb(229,230,235)' }} />
          <span style={{ fontSize: '12px', color: 'rgb(134,144,156)', whiteSpace: 'nowrap' as const }}>分割线文字</span>
          <div style={{ height: '1px', flex: 1, background: 'rgb(229,230,235)' }} />
        </div>
      </div>
      {[
        { name: '--comp-divider-color-default', value: 'rgb(229,230,235)', desc: '→ {semantic.color.border.default}' },
        { name: '--comp-divider-thickness-default', value: '1px', desc: '线条粗细' },
        { name: '--comp-divider-margin-horizontal', value: '16px', desc: '水平分割线上下边距 → {core.space.4}' },
        { name: '--comp-divider-margin-vertical', value: '16px', desc: '垂直分割线左右边距 → {core.space.4}' },
        { name: '--comp-divider-text-color', value: 'rgb(134,144,156)', desc: '分割线文字颜色 → {semantic.color.text.tertiary}' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Meta & Stories ─────────────────────────────────────────────────────────────
const PlaceholderComponent = () => null;

const meta: Meta<typeof PlaceholderComponent> = {
  title: 'Design Tokens/Layout',
  component: PlaceholderComponent,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof PlaceholderComponent>;

export const Space: Story = {
  name: '④ 间距 Space',
  render: () => <SpacePage />,
};
export const Grid: Story = {
  name: '④-B 栅格 Grid',
  render: () => <GridPage />,
};
export const LayoutDivider: Story = {
  name: '④-C 布局 & 分割线 Layout & Divider',
  render: () => <LayoutDividerPage />,
};
