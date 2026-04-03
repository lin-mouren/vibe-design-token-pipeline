/**
 * DesignTokensComponents.stories.tsx — Component Token 文档
 * Design Tokens/Components — 组件 token 层
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
  label: { fontFamily: 'monospace', fontSize: '12px', color: '#165dff', minWidth: '320px' } as React.CSSProperties,
  value: { fontFamily: 'monospace', fontSize: '12px', color: '#4e5969', minWidth: '100px' } as React.CSSProperties,
  desc: { fontSize: '12px', color: '#86909c' } as React.CSSProperties,
  swatch: (bg: string) => ({
    width: '20px', height: '20px', borderRadius: '3px',
    background: bg, border: '1px solid #e5e6eb', flexShrink: 0,
  } as React.CSSProperties),
};

// ── Button ─────────────────────────────────────────────────────────────────────
type TokenRow = { name: string; value: string; desc: string; swatch?: boolean };

const BtnRow = ({ rows }: { rows: TokenRow[] }) => (
  <>
    {rows.map(({ name, value, desc, swatch }) => (
      <div key={name} style={S.row}>
        <span style={S.label}>{name}</span>
        {swatch && <div style={S.swatch(value)} />}
        <span style={S.value}>{value}</span>
        <span style={S.desc}>{desc}</span>
      </div>
    ))}
  </>
);

const ButtonPage = () => (
  <div style={S.page}>
    <div style={S.h1}>组件 — comp.button.*</div>
    <div style={S.subtitle}>Button 组件 token | CSS: --comp-button-* | 对齐 Arco Design 官网全部类型</div>

    {/* ── 全类型预览 ── */}
    <div style={S.section}>
      <div style={S.h2}>全类型预览（对应官网 Stories）</div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
        {/* type variants */}
        <div>
          <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '6px' }}>按钮类型 type=primary / secondary / outline / text / dashed</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Primary</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(242,243,245)', color: 'rgb(29,33,41)', border: '1px solid rgb(229,230,235)', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Secondary</button>
            <button style={{ height: '32px', padding: '0 15px', background: '#fff', color: 'rgb(22,93,255)', border: '1px solid rgb(22,93,255)', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Outline</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'transparent', color: 'rgb(22,93,255)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Text</button>
            <button style={{ height: '32px', padding: '0 15px', background: '#fff', color: 'rgb(29,33,41)', border: '1px dashed rgb(229,230,235)', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Dashed</button>
          </div>
        </div>
        {/* status variants */}
        <div>
          <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '6px' }}>状态色 status=danger / warning / success</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(245,63,63)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Danger</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(255,125,0)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Warning</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(0,180,42)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Success</button>
          </div>
        </div>
        {/* size variants */}
        <div>
          <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '6px' }}>尺寸 size=mini / small / default / large</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' as const }}>
            <button style={{ height: '24px', padding: '0 7px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Mini</button>
            <button style={{ height: '28px', padding: '0 11px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Small</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Default</button>
            <button style={{ height: '36px', padding: '0 19px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Large</button>
          </div>
        </div>
        {/* states */}
        <div>
          <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '6px' }}>状态 Disabled / Loading</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
            <button disabled style={{ height: '32px', padding: '0 15px', background: 'rgb(148,191,255)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'not-allowed', fontSize: '14px', opacity: 0.6 }}>Disabled</button>
            <button disabled style={{ height: '32px', padding: '0 15px', background: 'rgb(242,243,245)', color: 'rgb(201,205,212)', border: '1px solid rgb(229,230,235)', borderRadius: '4px', cursor: 'not-allowed', fontSize: '14px' }}>Secondary Disabled</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'wait', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'none' }}>↻</span> Loading
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* ── Primary ── */}
    <div style={S.section}>
      <div style={S.h2}>① Primary — 实心主色（type=primary）</div>
      <BtnRow rows={[
        { name: '--comp-button-primary-bg-default',  value: 'rgb(22,93,255)',   desc: '→ {semantic.color.primary.default}',  swatch: true },
        { name: '--comp-button-primary-bg-hover',    value: 'rgb(64,128,255)',  desc: '→ {semantic.color.primary.hover}',    swatch: true },
        { name: '--comp-button-primary-bg-active',   value: 'rgb(14,66,210)',   desc: '→ {semantic.color.primary.active}',   swatch: true },
        { name: '--comp-button-primary-bg-disabled', value: 'rgb(148,191,255)', desc: '→ {semantic.color.primary.disabled}', swatch: true },
        { name: '--comp-button-primary-text-default', value: '#ffffff',         desc: '→ {core.color.white}',                swatch: true },
        { name: '--comp-button-primary-border-default', value: 'rgb(22,93,255)', desc: '→ {semantic.color.primary.default}', swatch: true },
      ]} />
    </div>

    {/* ── Secondary ── */}
    <div style={S.section}>
      <div style={S.h2}>② Secondary — 灰色填充（type=secondary）</div>
      <BtnRow rows={[
        { name: '--comp-button-secondary-bg-default',   value: 'rgb(242,243,245)', desc: '→ {semantic.color.secondary.default}（浅灰填充）', swatch: true },
        { name: '--comp-button-secondary-bg-hover',     value: 'rgb(229,230,235)', desc: '→ {semantic.color.secondary.hover}',   swatch: true },
        { name: '--comp-button-secondary-bg-active',    value: 'rgb(201,205,212)', desc: '→ {semantic.color.secondary.active}',  swatch: true },
        { name: '--comp-button-secondary-bg-disabled',  value: 'rgb(247,248,250)', desc: '→ {semantic.color.secondary.disabled}',swatch: true },
        { name: '--comp-button-secondary-text-default', value: 'rgb(29,33,41)',    desc: '→ {semantic.color.text.primary}',      swatch: true },
        { name: '--comp-button-secondary-border-default', value: 'rgb(229,230,235)', desc: '→ {semantic.color.border.default}',  swatch: true },
      ]} />
    </div>

    {/* ── Outline ── */}
    <div style={S.section}>
      <div style={S.h2}>③ Outline — 描边按钮（type=outline）</div>
      <BtnRow rows={[
        { name: '--comp-button-outline-bg-default',  value: '#ffffff',          desc: '→ {semantic.color.surface.1}（透明/白底）', swatch: true },
        { name: '--comp-button-outline-bg-hover',    value: 'rgb(232,243,255)', desc: '→ {semantic.color.primary.light}',    swatch: true },
        { name: '--comp-button-outline-bg-active',   value: 'rgb(232,243,255)', desc: '→ {semantic.color.primary.1}',        swatch: true },
        { name: '--comp-button-outline-bg-disabled', value: '#ffffff',          desc: '→ {semantic.color.surface.1}',        swatch: true },
        { name: '--comp-button-outline-text-default', value: 'rgb(22,93,255)',  desc: '→ {semantic.color.primary.default}',  swatch: true },
        { name: '--comp-button-outline-border-default', value: 'rgb(22,93,255)', desc: '→ {semantic.color.primary.default}', swatch: true },
      ]} />
    </div>

    {/* ── Text ── */}
    <div style={S.section}>
      <div style={S.h2}>④ Text — 纯文字（type=text）</div>
      <BtnRow rows={[
        { name: '--comp-button-text-bg-default',  value: 'transparent',      desc: '无背景' },
        { name: '--comp-button-text-bg-hover',    value: 'rgb(242,243,245)', desc: '→ {semantic.color.surface.3}', swatch: true },
        { name: '--comp-button-text-text-default', value: 'rgb(22,93,255)',  desc: '→ {semantic.color.primary.default}', swatch: true },
        { name: '--comp-button-text-text-disabled', value: 'rgb(201,205,212)', desc: '→ {semantic.color.text.disabled}', swatch: true },
      ]} />
    </div>

    {/* ── Dashed ── */}
    <div style={S.section}>
      <div style={S.h2}>⑤ Dashed — 虚线边框（type=dashed）</div>
      <BtnRow rows={[
        { name: '--comp-button-dashed-bg-default',   value: '#ffffff',          desc: '→ {semantic.color.surface.1}',  swatch: true },
        { name: '--comp-button-dashed-bg-hover',     value: 'rgb(232,243,255)', desc: '→ {semantic.color.primary.light}', swatch: true },
        { name: '--comp-button-dashed-text-default', value: 'rgb(29,33,41)',    desc: '→ {semantic.color.text.primary}', swatch: true },
        { name: '--comp-button-dashed-border-default', value: 'rgb(229,230,235)', desc: '→ {semantic.color.border.default}', swatch: true },
      ]} />
    </div>

    {/* ── Danger ── */}
    <div style={S.section}>
      <div style={S.h2}>⑥ Danger — 危险色（status=danger）</div>
      <BtnRow rows={[
        { name: '--comp-button-danger-bg-default',  value: 'rgb(245,63,63)',  desc: '→ {semantic.color.danger.default}', swatch: true },
        { name: '--comp-button-danger-bg-hover',    value: 'rgb(247,117,117)',desc: '→ {semantic.color.danger.hover}',   swatch: true },
        { name: '--comp-button-danger-bg-active',   value: 'rgb(203,39,45)',  desc: '→ {semantic.color.danger.active}',  swatch: true },
        { name: '--comp-button-danger-bg-disabled', value: 'rgb(253,228,228)',desc: '→ {semantic.color.danger.light}',   swatch: true },
        { name: '--comp-button-danger-text-default', value: '#ffffff',        desc: '→ {core.color.white}',              swatch: true },
        { name: '--comp-button-danger-border-default', value: 'rgb(245,63,63)', desc: '→ {semantic.color.danger.default}', swatch: true },
      ]} />
    </div>

    {/* ── Warning ── */}
    <div style={S.section}>
      <div style={S.h2}>⑦ Warning — 警告色（status=warning）</div>
      <BtnRow rows={[
        { name: '--comp-button-warning-bg-default',  value: 'rgb(255,125,0)',  desc: '→ {semantic.color.warning.default}', swatch: true },
        { name: '--comp-button-warning-bg-hover',    value: 'rgb(255,154,55)', desc: '→ {semantic.color.warning.hover}',   swatch: true },
        { name: '--comp-button-warning-bg-active',   value: 'rgb(211,97,0)',   desc: '→ {semantic.color.warning.active}',  swatch: true },
        { name: '--comp-button-warning-bg-disabled', value: 'rgb(255,241,224)',desc: '→ {semantic.color.warning.light}',   swatch: true },
        { name: '--comp-button-warning-text-default', value: '#ffffff',        desc: '→ {core.color.white}',               swatch: true },
        { name: '--comp-button-warning-border-default', value: 'rgb(255,125,0)', desc: '→ {semantic.color.warning.default}', swatch: true },
      ]} />
    </div>

    {/* ── Success ── */}
    <div style={S.section}>
      <div style={S.h2}>⑧ Success — 成功色（status=success）</div>
      <BtnRow rows={[
        { name: '--comp-button-success-bg-default',  value: 'rgb(0,180,42)',   desc: '→ {semantic.color.success.default}', swatch: true },
        { name: '--comp-button-success-bg-hover',    value: 'rgb(35,200,73)',  desc: '→ {semantic.color.success.hover}',   swatch: true },
        { name: '--comp-button-success-bg-active',   value: 'rgb(0,145,34)',   desc: '→ {semantic.color.success.active}',  swatch: true },
        { name: '--comp-button-success-bg-disabled', value: 'rgb(211,242,218)',desc: '→ {semantic.color.success.light}',   swatch: true },
        { name: '--comp-button-success-text-default', value: '#ffffff',        desc: '→ {core.color.white}',               swatch: true },
        { name: '--comp-button-success-border-default', value: 'rgb(0,180,42)', desc: '→ {semantic.color.success.default}', swatch: true },
      ]} />
    </div>

    <div style={S.section}>
      <div style={S.h2}>Size & Radius（高度）</div>
      {[
        { name: '--comp-button-size-mini', value: '24px', desc: '→ {core.size.component.mini}' },
        { name: '--comp-button-size-small', value: '28px', desc: '→ {core.size.component.small}' },
        { name: '--comp-button-size-default', value: '32px', desc: '★ → {core.size.component.default}' },
        { name: '--comp-button-size-large', value: '36px', desc: '→ {core.size.component.large}' },
        { name: '--comp-button-radius-default', value: '4px', desc: '→ {core.radius.medium}' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>Font Size（字体大小）</div>
      {[
        { name: '--comp-button-font-size-mini', value: '12px', desc: '→ {core.text.size.12}' },
        { name: '--comp-button-font-size-small', value: '14px', desc: '→ {core.text.size.14}' },
        { name: '--comp-button-font-size-default', value: '14px', desc: '★ → {core.text.size.14}' },
        { name: '--comp-button-font-size-large', value: '14px', desc: '→ {core.text.size.14}' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>Padding（水平内边距）</div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '12px' }}>
        {[
          { label: 'mini', h: '24px', ph: '7px', fs: '12px', text: 'mini' },
          { label: 'small', h: '28px', ph: '11px', fs: '14px', text: 'small' },
          { label: 'default', h: '32px', ph: '15px', fs: '14px', text: 'default' },
          { label: 'large', h: '36px', ph: '19px', fs: '14px', text: 'large' },
        ].map(({ label, h, ph, fs, text }) => (
          <div key={label} style={{ textAlign: 'center' as const }}>
            <button style={{ height: h, padding: `0 ${ph}`, background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: fs, cursor: 'default' }}>{text}</button>
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '2px' }}>h: {h} | ph: {ph}</div>
          </div>
        ))}
      </div>
      {[
        { name: '--comp-button-padding-h-mini', value: '7px', desc: 'mini 水平内边距' },
        { name: '--comp-button-padding-h-small', value: '11px', desc: 'small 水平内边距' },
        { name: '--comp-button-padding-h-default', value: '15px', desc: '★ default 水平内边距' },
        { name: '--comp-button-padding-h-large', value: '19px', desc: 'large 水平内边距' },
        { name: '--comp-button-padding-v', value: '0px', desc: '垂直内边距（高度由 size 固定）' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>Icon Gap（图标与文字间距）</div>
      {[
        { name: '--comp-button-icon-gap-mini', value: '4px', desc: 'mini 图标间距' },
        { name: '--comp-button-icon-gap-small', value: '4px', desc: 'small 图标间距' },
        { name: '--comp-button-icon-gap-default', value: '8px', desc: '★ default 图标间距' },
        { name: '--comp-button-icon-gap-large', value: '8px', desc: 'large 图标间距' },
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

// ── Input ──────────────────────────────────────────────────────────────────────
const InputPage = () => (
  <div style={S.page}>
    <div style={S.h1}>组件 — comp.input.*</div>
    <div style={S.subtitle}>Input 组件 token | CSS: --comp-input-*</div>

    <div style={S.section}>
      <div style={S.h2}>预览</div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '16px' }}>
        <input placeholder="Default" style={{ height: '32px', padding: '0 12px', border: '1px solid rgb(229,230,235)', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input placeholder="Focus" style={{ height: '32px', padding: '0 12px', border: '1px solid rgb(22,93,255)', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input placeholder="Error" style={{ height: '32px', padding: '0 12px', border: '1px solid rgb(245,63,63)', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input placeholder="Warning" style={{ height: '32px', padding: '0 12px', border: '1px solid rgb(255,125,0)', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input disabled placeholder="Disabled" style={{ height: '32px', padding: '0 12px', border: '1px solid rgb(229,230,235)', borderRadius: '4px', fontSize: '14px', background: 'rgb(247,248,250)', cursor: 'not-allowed' }} />
      </div>
    </div>

    <div style={S.section}>
      <div style={S.h2}>Background & Border</div>
      {[
        { name: '--comp-input-bg-default', value: '#ffffff', desc: '→ {semantic.color.surface.1}', swatch: true },
        { name: '--comp-input-bg-disabled', value: 'rgb(247,248,250)', desc: '→ {semantic.color.surface.2}', swatch: true },
        { name: '--comp-input-border-default', value: 'rgb(229,230,235)', desc: '→ {semantic.color.border.default}', swatch: true },
        { name: '--comp-input-border-hover', value: 'rgb(201,205,212)', desc: '→ {semantic.color.border.strong}', swatch: true },
        { name: '--comp-input-border-focus', value: 'rgb(22,93,255)', desc: '→ {semantic.color.primary.default}', swatch: true },
        { name: '--comp-input-border-error', value: 'rgb(245,63,63)', desc: '→ {semantic.color.danger.default}', swatch: true },
        { name: '--comp-input-border-warning', value: 'rgb(255,125,0)', desc: '→ {semantic.color.warning.default}', swatch: true },
        { name: '--comp-input-border-disabled', value: 'rgb(242,243,245)', desc: '→ {semantic.color.border.subtle}', swatch: true },
      ].map(({ name, value, desc, swatch }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          {swatch && <div style={S.swatch(value)} />}
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>Text Colors</div>
      {[
        { name: '--comp-input-text-default', value: 'rgb(29,33,41)', desc: '→ {semantic.color.text.primary}', swatch: true },
        { name: '--comp-input-text-placeholder', value: 'rgb(134,144,156)', desc: '→ {semantic.color.text.tertiary}', swatch: true },
        { name: '--comp-input-text-disabled', value: 'rgb(201,205,212)', desc: '→ {semantic.color.text.disabled}', swatch: true },
      ].map(({ name, value, desc, swatch }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          {swatch && <div style={S.swatch(value)} />}
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>Font Size（字体大小）</div>
      {[
        { name: '--comp-input-font-size-mini', value: '12px', desc: '→ {core.text.size.12}' },
        { name: '--comp-input-font-size-small', value: '12px', desc: '→ {core.text.size.12}' },
        { name: '--comp-input-font-size-default', value: '14px', desc: '★ → {core.text.size.14}' },
        { name: '--comp-input-font-size-large', value: '14px', desc: '→ {core.text.size.14}' },
      ].map(({ name, value, desc }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>Size & Padding（高度 + 水平内边距）</div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '12px' }}>
        {[
          { label: 'mini', h: '24px', ph: '6px', fs: '12px' },
          { label: 'small', h: '28px', ph: '8px', fs: '12px' },
          { label: 'default', h: '32px', ph: '12px', fs: '14px' },
          { label: 'large', h: '36px', ph: '16px', fs: '14px' },
        ].map(({ label, h, ph, fs }) => (
          <div key={label} style={{ textAlign: 'center' as const }}>
            <input placeholder={label} style={{ height: h, padding: `0 ${ph}`, border: '1px solid rgb(229,230,235)', borderRadius: '4px', fontSize: fs, outline: 'none', width: '80px' }} />
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '2px' }}>h: {h} | ph: {ph}</div>
          </div>
        ))}
      </div>
      {[
        { name: '--comp-input-size-mini', value: '24px', desc: '→ {core.size.component.mini}' },
        { name: '--comp-input-size-small', value: '28px', desc: '→ {core.size.component.small}' },
        { name: '--comp-input-size-default', value: '32px', desc: '★ → {core.size.component.default}' },
        { name: '--comp-input-size-large', value: '36px', desc: '→ {core.size.component.large}' },
        { name: '--comp-input-padding-h-mini', value: '6px', desc: 'mini 水平内边距' },
        { name: '--comp-input-padding-h-small', value: '8px', desc: '→ {core.space.2}' },
        { name: '--comp-input-padding-h-default', value: '12px', desc: '★ → {core.space.3}' },
        { name: '--comp-input-padding-h-large', value: '16px', desc: '→ {core.space.4}' },
        { name: '--comp-input-radius-default', value: '4px', desc: '→ {core.radius.medium}' },
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

// ── Card / Form / Switch / Avatar ──────────────────────────────────────────────
const CompGroup1Page = () => (
  <div style={S.page}>
    <div style={S.h1}>组件 — Card / Form / Switch / Avatar</div>
    <div style={S.subtitle}>comp.card.* / comp.form.* / comp.switch.* / comp.avatar.*</div>

    <div style={S.section}>
      <div style={S.h2}>comp.card.*</div>
      <div style={{ padding: '0', background: '#fff', borderRadius: '8px', border: '1px solid rgb(229,230,235)', boxShadow: '0 2px 5px rgba(0,0,0,0.08)', maxWidth: '300px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ fontWeight: 600, padding: '0 16px', height: '48px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgb(229,230,235)', color: 'rgb(29,33,41)' }}>Card Header</div>
        <div style={{ padding: '16px', color: '#86909c', fontSize: '13px' }}>Card body content</div>
      </div>
      {[
        { name: '--comp-card-bg-default', value: '#ffffff', desc: '→ {semantic.color.surface.1}', swatch: true },
        { name: '--comp-card-border-default', value: 'rgb(229,230,235)', desc: '→ {semantic.color.border.default}', swatch: true },
        { name: '--comp-card-header-border-default', value: 'rgb(229,230,235)', desc: '卡片头部分割线', swatch: true },
        { name: '--comp-card-header-text-color', value: 'rgb(29,33,41)', desc: '→ {semantic.color.text.primary}', swatch: true },
        { name: '--comp-card-radius-default', value: '8px', desc: '→ {core.radius.large}' },
        { name: '--comp-card-padding-header', value: '16px', desc: '→ {core.space.4}' },
        { name: '--comp-card-padding-body', value: '16px', desc: '→ {core.space.4}' },
      ].map(({ name, value, desc, swatch }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          {swatch && <div style={S.swatch(value)} />}
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>comp.form.*</div>
      <div style={{ maxWidth: '320px', marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: 'rgb(29,33,41)', marginBottom: '4px' }}>
          用户名 <span style={{ color: 'rgb(245,63,63)' }}>*</span>
        </label>
        <input placeholder="请输入" style={{ width: '100%', height: '32px', padding: '0 12px', border: '1px solid rgb(229,230,235)', borderRadius: '4px', boxSizing: 'border-box' as const }} />
        <div style={{ fontSize: '12px', color: 'rgb(134,144,156)', marginTop: '4px' }}>帮助文字 help text</div>
      </div>
      {[
        { name: '--comp-form-label-color-default', value: 'rgb(29,33,41)', desc: '→ {semantic.color.text.primary}', swatch: true },
        { name: '--comp-form-label-color-required', value: 'rgb(245,63,63)', desc: '→ {semantic.color.danger.default}', swatch: true },
        { name: '--comp-form-label-font-size', value: '14px', desc: '→ {core.text.size.14}' },
        { name: '--comp-form-help-color-default', value: 'rgb(134,144,156)', desc: '→ {semantic.color.text.tertiary}', swatch: true },
        { name: '--comp-form-help-color-error', value: 'rgb(245,63,63)', desc: '→ {semantic.color.danger.default}', swatch: true },
        { name: '--comp-form-help-font-size', value: '12px', desc: '→ {core.text.size.12}' },
        { name: '--comp-form-item-gap', value: '24px', desc: '→ {core.space.5}' },
      ].map(({ name, value, desc, swatch }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          {swatch && <div style={S.swatch(value)} />}
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>comp.switch.*</div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', marginBottom: '16px' }}>
        {[
          { bg: 'rgb(22,93,255)', on: true, label: 'on', h: '24px', w: '40px' },
          { bg: 'rgb(201,205,212)', on: false, label: 'off', h: '24px', w: '40px' },
          { bg: 'rgb(229,230,235)', on: false, label: 'disabled', h: '24px', w: '40px' },
          { bg: 'rgb(22,93,255)', on: true, label: 'small', h: '20px', w: '36px' },
          { bg: 'rgb(22,93,255)', on: true, label: 'mini', h: '16px', w: '28px' },
        ].map(({ bg, on, label, h, w }) => (
          <div key={label} style={{ textAlign: 'center' as const }}>
            <div style={{ width: w, height: h, borderRadius: '9999px', background: bg, position: 'relative' as const, margin: '0 auto' }}>
              <div style={{ position: 'absolute' as const, [on ? 'right' : 'left']: '2px', top: '2px', width: `calc(${h} - 4px)`, height: `calc(${h} - 4px)`, borderRadius: '50%', background: '#fff' }} />
            </div>
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '4px' }}>{label}</div>
            <div style={{ fontSize: '9px', color: '#c9cdd4' }}>{w}×{h}</div>
          </div>
        ))}
      </div>
      {[
        { name: '--comp-switch-track-bg-on', value: 'rgb(22,93,255)', desc: '→ {semantic.color.primary.default}', swatch: true },
        { name: '--comp-switch-track-bg-off', value: 'rgb(201,205,212)', desc: '→ {core.color.neutral.4}', swatch: true },
        { name: '--comp-switch-track-bg-disabled', value: 'rgb(229,230,235)', desc: '→ {core.color.neutral.3}', swatch: true },
        { name: '--comp-switch-knob-bg-default', value: '#ffffff', desc: '→ {core.color.white}', swatch: true },
        { name: '--comp-switch-size-mini-height', value: '16px', desc: 'mini 档高度' },
        { name: '--comp-switch-size-mini-width', value: '28px', desc: 'mini 档宽度' },
        { name: '--comp-switch-size-small-height', value: '20px', desc: 'small 档高度' },
        { name: '--comp-switch-size-small-width', value: '36px', desc: 'small 档宽度' },
        { name: '--comp-switch-size-default-height', value: '24px', desc: '★ default 档高度' },
        { name: '--comp-switch-size-default-width', value: '40px', desc: '★ default 档宽度' },
        { name: '--comp-switch-radius-default', value: '9999px', desc: '→ {core.radius.circle}' },
      ].map(({ name, value, desc, swatch }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          {swatch && <div style={S.swatch(value)} />}
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>

    <div style={S.section}>
      <div style={S.h2}>comp.avatar.*</div>
      {/* Circle variant */}
      <div style={{ fontSize: '10px', color: '#86909c', marginBottom: '6px' }}>circle（radius: 9999px）</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '12px' }}>
        {[
          { size: '24px', l: 'mini' },
          { size: '28px', l: 'small' },
          { size: '32px', l: 'default' },
          { size: '40px', l: 'large' },
          { size: '64px', l: 'xlarge' },
        ].map(({ size, l }) => (
          <div key={l} style={{ textAlign: 'center' as const }}>
            <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgb(22,93,255)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', margin: '0 auto' }}>U</div>
            <div style={{ fontSize: '9px', color: '#86909c', marginTop: '2px' }}>{l}</div>
            <div style={{ fontSize: '9px', color: '#86909c' }}>{size}</div>
          </div>
        ))}
      </div>
      {/* Square variant */}
      <div style={{ fontSize: '10px', color: '#86909c', marginBottom: '6px' }}>square（radius: 4px）</div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', marginBottom: '12px' }}>
        {[
          { size: '24px', l: 'mini' },
          { size: '28px', l: 'small' },
          { size: '32px', l: 'default' },
          { size: '40px', l: 'large' },
          { size: '64px', l: 'xlarge' },
        ].map(({ size, l }) => (
          <div key={`sq-${l}`} style={{ textAlign: 'center' as const }}>
            <div style={{ width: size, height: size, borderRadius: '4px', background: 'rgb(22,93,255)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', margin: '0 auto' }}>U</div>
            <div style={{ fontSize: '9px', color: '#86909c', marginTop: '2px' }}>{l}</div>
            <div style={{ fontSize: '9px', color: '#86909c' }}>{size}</div>
          </div>
        ))}
      </div>
      {[
        { name: '--comp-avatar-bg-default', value: 'rgb(22,93,255)', desc: '→ {semantic.color.primary.default}', swatch: true },
        { name: '--comp-avatar-text-default', value: '#ffffff', desc: '→ {core.color.white}', swatch: true },
        { name: '--comp-avatar-size-mini', value: '24px', desc: '→ {core.size.avatar.mini}' },
        { name: '--comp-avatar-size-small', value: '28px', desc: '→ {core.size.avatar.small}' },
        { name: '--comp-avatar-size-default', value: '32px', desc: '★ → {core.size.avatar.default}' },
        { name: '--comp-avatar-size-large', value: '40px', desc: '→ {core.size.avatar.large}' },
        { name: '--comp-avatar-size-xlarge', value: '64px', desc: '→ {core.size.avatar.xlarge}' },
        { name: '--comp-avatar-radius-circle', value: '9999px', desc: '→ {core.radius.circle}' },
        { name: '--comp-avatar-radius-square', value: '4px', desc: '→ {core.radius.medium}' },
        { name: '--comp-avatar-border-default', value: 'rgb(229,230,235)', desc: '→ {semantic.color.border.default}', swatch: true },
      ].map(({ name, value, desc, swatch }) => (
        <div key={name} style={S.row}>
          <span style={S.label}>{name}</span>
          {swatch && <div style={S.swatch(value)} />}
          <span style={S.value}>{value}</span>
          <span style={S.desc}>{desc}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Drawer / Modal / Message / Menu / Image / Icon ─────────────────────────────

/** 标注辅助线：在示意图上显示 token 标注 */
const Ann = ({ label, color = '#165dff' }: { label: string; color?: string }) => (
  <span style={{ fontFamily: 'monospace', fontSize: '10px', color, background: color + '18', padding: '1px 4px', borderRadius: '2px', whiteSpace: 'nowrap' as const }}>{label}</span>
);

type TR = { name: string; value: string; desc: string; swatch?: boolean };
const TRows = ({ rows }: { rows: TR[] }) => (
  <>
    {rows.map(({ name, value, desc, swatch }) => (
      <div key={name} style={S.row}>
        <span style={S.label}>{name}</span>
        {swatch && <div style={S.swatch(value)} />}
        <span style={S.value}>{value}</span>
        <span style={S.desc}>{desc}</span>
      </div>
    ))}
  </>
);

const CompGroup2Page = () => (
  <div style={S.page}>
    <div style={S.h1}>组件 — Drawer / Modal / Message / Menu / Image / Icon</div>
    <div style={S.subtitle}>comp.drawer.* / comp.modal.* / comp.message.* / comp.menu.* / comp.image.* / comp.icon.*</div>

    {/* ══════════════════════════════════════════════════════════
        DRAWER
    ══════════════════════════════════════════════════════════ */}
    <div style={S.section}>
      <div style={S.h2}>comp.drawer.*</div>

      {/* 示意图：Drawer 从右侧滑出，带遮罩 */}
      <div style={{ position: 'relative' as const, width: '560px', height: '260px', background: 'rgb(242,243,245)', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #e5e6eb' }}>
        {/* 页面背景 */}
        <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9cdd4', fontSize: '13px' }}>页面内容区域</div>
        {/* 遮罩层 */}
        <div style={{ position: 'absolute' as const, inset: 0, background: 'rgba(29,33,41,0.4)' }} />
        {/* Drawer 面板 */}
        <div style={{ position: 'absolute' as const, right: 0, top: 0, bottom: 0, width: '220px', background: '#ffffff', display: 'flex', flexDirection: 'column' as const }}>
          {/* Header */}
          <div style={{ padding: '0 24px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgb(229,230,235)', flexShrink: 0 }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'rgb(29,33,41)' }}>标题</span>
            <span style={{ color: '#86909c', fontSize: '16px', cursor: 'pointer' }}>✕</span>
          </div>
          {/* Body */}
          <div style={{ flex: 1, padding: '24px', overflow: 'hidden' }}>
            <div style={{ height: '12px', background: '#f2f3f5', borderRadius: '2px', marginBottom: '8px' }} />
            <div style={{ height: '12px', background: '#f2f3f5', borderRadius: '2px', width: '75%', marginBottom: '8px' }} />
            <div style={{ height: '12px', background: '#f2f3f5', borderRadius: '2px', width: '55%' }} />
          </div>
          {/* Footer */}
          <div style={{ padding: '12px 24px', borderTop: '1px solid rgb(229,230,235)', display: 'flex', gap: '8px', justifyContent: 'flex-end', flexShrink: 0 }}>
            <button style={{ height: '32px', padding: '0 15px', background: '#f2f3f5', border: '1px solid #e5e6eb', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>取消</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>确认</button>
          </div>
        </div>
        {/* 标注 */}
        <div style={{ position: 'absolute' as const, top: '6px', left: '8px', display: 'flex', flexDirection: 'column' as const, gap: '3px' }}>
          <Ann label="overlay-color: rgba(29,33,41,0.4)" color="#86909c" />
        </div>
        <div style={{ position: 'absolute' as const, top: '6px', right: '228px', display: 'flex', flexDirection: 'column' as const, gap: '3px' }}>
          <Ann label="width: 378px" />
        </div>
        <div style={{ position: 'absolute' as const, top: '56px', right: '228px' }}>
          <Ann label="header-border" color="#e5e6eb" />
        </div>
        <div style={{ position: 'absolute' as const, bottom: '56px', right: '228px' }}>
          <Ann label="padding: 24px" />
        </div>
      </div>

      <TRows rows={[
        { name: '--comp-drawer-bg-default',          value: '#ffffff',             desc: '面板背景色 → {semantic.color.surface.1}',  swatch: true },
        { name: '--comp-drawer-overlay-color',       value: 'rgba(29,33,41,0.4)', desc: '遮罩颜色 → {semantic.color.mask.bg}' },
        { name: '--comp-drawer-shadow-default',      value: 'level3',              desc: '面板边缘阴影 → {core.shadow.level3}' },
        { name: '--comp-drawer-title-font-size',     value: '16px',               desc: '标题字号 → {core.text.size.16}' },
        { name: '--comp-drawer-width-default',       value: '378px',              desc: '默认宽度（从右/左侧滑出）' },
        { name: '--comp-drawer-padding-default',     value: '24px',               desc: '内容区内边距 → {core.space.5}' },
        { name: '--comp-drawer-header-border-default', value: 'rgb(229,230,235)', desc: 'Header 底部分割线 → {semantic.color.border.default}', swatch: true },
        { name: '--comp-drawer-zindex-default',      value: '1000',               desc: 'z-index（低于 Modal 1001）' },
      ]} />
    </div>

    {/* ══════════════════════════════════════════════════════════
        MODAL
    ══════════════════════════════════════════════════════════ */}
    <div style={S.section}>
      <div style={S.h2}>comp.modal.*</div>

      {/* 示意图：Modal 居中弹层 */}
      <div style={{ position: 'relative' as const, width: '560px', height: '280px', background: 'rgb(242,243,245)', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px', border: '1px solid #e5e6eb' }}>
        {/* 页面背景 */}
        <div style={{ position: 'absolute' as const, inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9cdd4', fontSize: '13px' }}>页面内容区域</div>
        {/* 遮罩 */}
        <div style={{ position: 'absolute' as const, inset: 0, background: 'rgba(29,33,41,0.4)' }} />
        {/* Modal 面板 */}
        <div style={{ position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '340px', background: '#ffffff', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.16)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '0 24px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgb(229,230,235)' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'rgb(29,33,41)' }}>确认操作</span>
            <span style={{ color: '#86909c', cursor: 'pointer' }}>✕</span>
          </div>
          {/* Body */}
          <div style={{ padding: '24px' }}>
            <div style={{ fontSize: '14px', color: 'rgb(78,89,105)', lineHeight: 1.6 }}>此操作不可逆，确定要继续吗？</div>
          </div>
          {/* Footer */}
          <div style={{ padding: '12px 24px', borderTop: '1px solid rgb(229,230,235)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button style={{ height: '32px', padding: '0 15px', background: '#f2f3f5', border: '1px solid #e5e6eb', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>取消</button>
            <button style={{ height: '32px', padding: '0 15px', background: 'rgb(22,93,255)', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer' }}>确认</button>
          </div>
        </div>
        {/* 标注 */}
        <div style={{ position: 'absolute' as const, top: '6px', left: '8px', display: 'flex', flexDirection: 'column' as const, gap: '3px' }}>
          <Ann label="overlay-color: rgba(29,33,41,0.4)" color="#86909c" />
          <Ann label="shadow: level3 | radius: 8px" />
        </div>
        <div style={{ position: 'absolute' as const, bottom: '6px', right: '8px', display: 'flex', flexDirection: 'column' as const, gap: '3px', alignItems: 'flex-end' as const }}>
          <Ann label="width: 520px (full) / 340px (demo)" />
          <Ann label="padding: 24px | header-border & footer-border" />
        </div>
      </div>

      <TRows rows={[
        { name: '--comp-modal-bg-default',           value: '#ffffff',             desc: '面板背景 → {semantic.color.surface.1}',     swatch: true },
        { name: '--comp-modal-overlay-color',        value: 'rgba(29,33,41,0.4)', desc: '遮罩 → {semantic.color.mask.bg}' },
        { name: '--comp-modal-shadow-default',       value: 'level3',              desc: '浮层阴影 → {core.shadow.level3}' },
        { name: '--comp-modal-title-font-size',      value: '16px',               desc: '标题字号 → {core.text.size.16}' },
        { name: '--comp-modal-header-border-default',value: 'rgb(229,230,235)',   desc: 'Header 分割线 → {semantic.color.border.default}', swatch: true },
        { name: '--comp-modal-footer-border-default',value: 'rgb(229,230,235)',   desc: 'Footer 分割线 → {semantic.color.border.default}', swatch: true },
        { name: '--comp-modal-width-default',        value: '520px',              desc: '默认宽度' },
        { name: '--comp-modal-radius-default',       value: '8px',                desc: '圆角 → {core.radius.large}' },
        { name: '--comp-modal-padding-default',      value: '24px',               desc: '内边距 → {core.space.5}' },
        { name: '--comp-modal-zindex-default',       value: '1001',               desc: 'z-index（高于 Drawer 1000）' },
      ]} />
    </div>

    {/* ══════════════════════════════════════════════════════════
        MESSAGE
    ══════════════════════════════════════════════════════════ */}
    <div style={S.section}>
      <div style={S.h2}>comp.message.*</div>

      {/* 全局提示 Message — 对标 arco.design/react/components/message 官网样式 */}
      <div style={{ background: 'rgb(242,243,245)', borderRadius: '8px', padding: '24px', marginBottom: '20px', border: '1px solid #e5e6eb' }}>
        <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '16px' }}>全局提示 Message — 5 种类型 × 有/无关闭按钮（对标官网）</div>

        {/* 圆圈图标辅助组件 */}
        {(() => {
          // 圆圈图标：filled circle + white symbol，与官网一致
          const MsgIcon = ({ bg, symbol }: { bg: string; symbol: string }) => (
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: bg, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', fontWeight: 700, lineHeight: 1,
            }}>{symbol}</div>
          );

          // 单条 Message 卡片
          const MsgCard = ({ icon, text, showClose }: { icon: React.ReactNode; text: string; showClose: boolean }) => (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 16px',
              background: '#ffffff',
              borderRadius: '4px',
              border: '1px solid rgb(229,230,235)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              minWidth: '220px',
              maxWidth: '260px',
            }}>
              {icon}
              <span style={{ fontSize: '14px', color: 'rgb(29,33,41)', flex: 1, whiteSpace: 'nowrap' as const }}>{text}</span>
              {showClose && (
                <span style={{ fontSize: '13px', color: 'rgb(201,205,212)', cursor: 'pointer', marginLeft: '4px', lineHeight: 1 }}>✕</span>
              )}
            </div>
          );

          const variants = [
            { key: 'info',    bg: 'rgb(22,93,255)',   symbol: 'i',  text: 'General message' },
            { key: 'success', bg: 'rgb(0,180,42)',    symbol: '✓',  text: 'Success message' },
            { key: 'warning', bg: 'rgb(255,125,0)',   symbol: '!',  text: 'Warning message' },
            { key: 'error',   bg: 'rgb(245,63,63)',   symbol: '✕',  text: 'Error message' },
          ];

          return (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
              {/* 第一组：有/无图标的 General message（对应官网 1、2 变体） */}
              <div>
                <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '8px' }}>① General message — with icon / without icon</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                  <MsgCard icon={<MsgIcon bg="rgb(22,93,255)" symbol="i" />} text="General message" showClose={true} />
                  <MsgCard icon={null as any} text="General message" showClose={true} />
                  <MsgCard icon={<MsgIcon bg="rgb(22,93,255)" symbol="i" />} text="General message" showClose={false} />
                  <MsgCard icon={null as any} text="General message" showClose={false} />
                </div>
              </div>

              {/* 第二组：Success / Warning / Error — 带关闭按钮 */}
              <div>
                <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '8px' }}>② Status types — with close button</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                  {variants.slice(1).map(v => (
                    <MsgCard key={v.key} icon={<MsgIcon bg={v.bg} symbol={v.symbol} />} text={v.text} showClose={true} />
                  ))}
                </div>
              </div>

              {/* 第三组：Success / Warning / Error — 无关闭按钮 */}
              <div>
                <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '8px' }}>③ Status types — without close button</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                  {variants.slice(1).map(v => (
                    <MsgCard key={v.key} icon={<MsgIcon bg={v.bg} symbol={v.symbol} />} text={v.text} showClose={false} />
                  ))}
                </div>
              </div>

              {/* 标注 */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                <Ann label="bg: surface.1 (#ffffff)" />
                <Ann label="border: border.default (rgb(229,230,235))" color="#86909c" />
                <Ann label="padding: 10px 16px" />
                <Ann label="gap-icon: 8px" />
                <Ann label="radius: 4px" />
                <Ann label="shadow: level2" />
                <Ann label="icon: 20px filled circle (white symbol)" color="#165dff" />
              </div>
            </div>
          );
        })()}
      </div>

      <TRows rows={[
        { name: '--comp-message-bg-default',      value: '#ffffff',            desc: 'Toast 背景 → {semantic.color.surface.1}', swatch: true },
        { name: '--comp-message-border-default',  value: 'rgb(229,230,235)',   desc: '卡片边框 → {semantic.color.border.default}', swatch: true },
        { name: '--comp-message-shadow-default',  value: 'level2',             desc: '浮层阴影 → {core.shadow.level2}' },
        { name: '--comp-message-radius-default',  value: '4px',                desc: '圆角 → {core.radius.medium}' },
        { name: '--comp-message-padding-v',       value: '10px',               desc: '垂直内边距' },
        { name: '--comp-message-padding-h',       value: '16px',               desc: '水平内边距 → {core.space.4}' },
        { name: '--comp-message-gap-icon',        value: '8px',                desc: '图标与文字间距 → {core.space.2}' },
        { name: '--comp-message-text-default',    value: 'rgb(29,33,41)',       desc: '文字色 → {semantic.color.text.primary}', swatch: true },
        { name: '--comp-message-icon-info',       value: 'rgb(22,93,255)',      desc: 'Info 圆圈色 → {semantic.color.primary.default}', swatch: true },
        { name: '--comp-message-icon-success',    value: 'rgb(0,180,42)',       desc: 'Success 圆圈色 → {semantic.color.success.default}', swatch: true },
        { name: '--comp-message-icon-warning',    value: 'rgb(255,125,0)',      desc: 'Warning 圆圈色 → {semantic.color.warning.default}', swatch: true },
        { name: '--comp-message-icon-error',      value: 'rgb(245,63,63)',      desc: 'Error 圆圈色 → {semantic.color.danger.default}', swatch: true },
        { name: '--comp-message-zindex-default',  value: '1010',               desc: 'z-index（最高浮层）' },
      ]} />
    </div>

    {/* ══════════════════════════════════════════════════════════
        MENU
    ══════════════════════════════════════════════════════════ */}
    <div style={S.section}>
      <div style={S.h2}>comp.menu.*</div>

      {/* 示意图：侧边导航 + 状态标注 */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-start' as const }}>
        {/* 侧边菜单 */}
        <div style={{ width: '200px', background: '#fff', border: '1px solid rgb(229,230,235)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '8px 0' }}>
            {[
              { text: '概览 Overview', state: 'default' },
              { text: '组件 Components', state: 'active' },
              { text: '  ↳ Button', state: 'active-sub', indent: true },
              { text: '  ↳ Input', state: 'default-sub', indent: true },
              { text: '图标 Icons', state: 'hover' },
              { text: '更新日志', state: 'disabled' },
            ].map(({ text, state, indent }) => (
              <div key={text} style={{
                height: '40px', display: 'flex', alignItems: 'center',
                padding: `0 ${indent ? '28px' : '12px'}`,
                fontSize: '14px',
                background: state === 'active' ? 'rgb(232,243,255)' : state === 'hover' ? 'rgb(242,243,245)' : 'transparent',
                color: state === 'active' || state === 'active-sub' ? 'rgb(22,93,255)' : state === 'disabled' ? 'rgb(201,205,212)' : 'rgb(29,33,41)',
                borderLeft: state === 'active' ? '2px solid rgb(22,93,255)' : '2px solid transparent',
              }}>
                {text}
                {state === 'active' && <span style={{ marginLeft: 'auto', fontSize: '10px', background: '#e8f3ff', color: '#165dff', padding: '1px 4px', borderRadius: '2px' }}>active</span>}
                {state === 'hover' && <span style={{ marginLeft: 'auto', fontSize: '10px', background: '#f2f3f5', color: '#86909c', padding: '1px 4px', borderRadius: '2px' }}>hover</span>}
                {state === 'disabled' && <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#c9cdd4' }}>disabled</span>}
              </div>
            ))}
          </div>
        </div>
        {/* 标注说明 */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', background: 'rgb(232,243,255)', border: '1px solid #bedaff', borderRadius: '2px' }} />
            <span style={{ color: '#4e5969' }}>item-bg-active → <Ann label="primary.light" /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '20px', background: 'rgb(242,243,245)', border: '1px solid #e5e6eb', borderRadius: '2px' }} />
            <span style={{ color: '#4e5969' }}>item-bg-hover → <Ann label="surface.3" /></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '30px', background: 'rgb(22,93,255)', borderRadius: '1px' }} />
            <span style={{ color: '#4e5969' }}>active indicator（border-left）</span>
          </div>
          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
            <Ann label="item-height: 40px" />
            <Ann label="item-font-size: 14px" />
            <Ann label="item-padding-h: 12px" />
            <Ann label="indent: 16px（子菜单缩进）" />
          </div>
        </div>
      </div>

      <TRows rows={[
        { name: '--comp-menu-bg-default',          value: '#ffffff',          desc: '菜单背景 → {semantic.color.surface.1}',          swatch: true },
        { name: '--comp-menu-item-height-default', value: '40px',             desc: '菜单项高度' },
        { name: '--comp-menu-item-font-size',      value: '14px',             desc: '字号 → {core.text.size.14}' },
        { name: '--comp-menu-item-padding-h',      value: '12px',             desc: '水平内边距 → {core.space.3}' },
        { name: '--comp-menu-item-bg-hover',       value: 'rgb(242,243,245)', desc: 'Hover 背景 → {semantic.color.surface.3}',         swatch: true },
        { name: '--comp-menu-item-bg-active',      value: 'rgb(232,243,255)', desc: 'Active 背景 → {semantic.color.primary.light}',   swatch: true },
        { name: '--comp-menu-item-text-default',   value: 'rgb(29,33,41)',    desc: '默认文字 → {semantic.color.text.primary}',        swatch: true },
        { name: '--comp-menu-item-text-active',    value: 'rgb(22,93,255)',   desc: 'Active 文字 → {semantic.color.primary.default}',  swatch: true },
        { name: '--comp-menu-item-text-disabled',  value: 'rgb(201,205,212)', desc: 'Disabled 文字 → {semantic.color.text.disabled}',  swatch: true },
        { name: '--comp-menu-indent-default',      value: '16px',             desc: '子菜单缩进 → {core.space.4}' },
      ]} />
    </div>

    {/* ══════════════════════════════════════════════════════════
        IMAGE
    ══════════════════════════════════════════════════════════ */}
    <div style={S.section}>
      <div style={S.h2}>comp.image.*</div>

      {/* 示意图：图片各状态 */}
      <div style={{ background: 'rgb(242,243,245)', borderRadius: '8px', padding: '20px', marginBottom: '20px', border: '1px solid #e5e6eb' }}>
        <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '12px' }}>图片状态 — 加载中 / 正常 / 悬停遮罩 / 圆角 / 带边框</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' as const }}>
          {/* 占位 placeholder */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ width: '120px', height: '80px', background: 'rgb(242,243,245)', borderRadius: '4px', border: '1px solid rgb(229,230,235)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <div style={{ width: '24px', height: '20px', background: 'rgb(201,205,212)', borderRadius: '2px' }} />
              <div style={{ width: '40px', height: '6px', background: 'rgb(201,205,212)', borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '4px' }}>加载中（placeholder）</div>
          </div>
          {/* 正常图片 */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ width: '120px', height: '80px', background: 'linear-gradient(135deg,#5b8af5,#8ec5fc)', borderRadius: '4px', border: '1px solid rgb(229,230,235)' }} />
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '4px' }}>正常（radius: 4px）</div>
          </div>
          {/* hover overlay */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ width: '120px', height: '80px', borderRadius: '4px', overflow: 'hidden', position: 'relative' as const, border: '1px solid rgb(229,230,235)' }}>
              <div style={{ position: 'absolute' as const, inset: 0, background: 'linear-gradient(135deg,#5b8af5,#8ec5fc)' }} />
              <div style={{ position: 'absolute' as const, inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px' }}>⤢</div>
            </div>
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '4px' }}>Hover 遮罩（0.5）</div>
          </div>
          {/* 大圆角 */}
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg,#5b8af5,#8ec5fc)', borderRadius: '50%', border: '1px solid rgb(229,230,235)' }} />
            <div style={{ fontSize: '10px', color: '#86909c', marginTop: '4px' }}>circle（自定义）</div>
          </div>
        </div>
      </div>

      {/* 宽高比预设 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1d2129', marginBottom: '10px' }}>宽高比预设（aspect-ratio token）</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
          {[
            { label: '1:1', ratio: '1/1', w: '72px' },
            { label: '4:3', ratio: '4/3', w: '72px' },
            { label: '3:2', ratio: '3/2', w: '84px' },
            { label: '16:9', ratio: '16/9', w: '100px' },
            { label: '21:9', ratio: '21/9', w: '120px' },
            { label: '3:4', ratio: '3/4', w: '54px' },
            { label: '9:16', ratio: '9/16', w: '44px' },
          ].map(({ label, ratio, w }) => (
            <div key={label} style={{ textAlign: 'center' as const }}>
              <div style={{ width: w, aspectRatio: ratio, background: 'linear-gradient(135deg,#e8f3ff,#c3daff)', borderRadius: '4px', border: '1px solid #bedaff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '9px', color: '#165dff', fontWeight: 700 }}>{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TRows rows={[
        { name: '--comp-image-aspect-square',  value: '1',      desc: '1:1 正方形（头像/缩略图）' },
        { name: '--comp-image-aspect-4-3',     value: '1.3333', desc: '4:3 横版（通用卡片封面）' },
        { name: '--comp-image-aspect-3-2',     value: '1.5',    desc: '3:2 相机标准横版' },
        { name: '--comp-image-aspect-16-9',    value: '1.7778', desc: '16:9 视频/Banner 宽屏' },
        { name: '--comp-image-aspect-21-9',    value: '2.3333', desc: '21:9 超宽屏 Hero' },
        { name: '--comp-image-aspect-3-4',     value: '0.75',   desc: '3:4 竖版海报' },
        { name: '--comp-image-aspect-9-16',    value: '0.5625', desc: '9:16 全屏竖版（短视频封面）' },
        { name: '--comp-image-radius-default', value: '4px',    desc: '圆角 → {core.radius.medium}' },
        { name: '--comp-image-overlay-color',  value: 'rgba(0,0,0,0.5)', desc: '悬停遮罩（黑色半透明）' },
        { name: '--comp-image-placeholder-bg', value: 'rgb(242,243,245)', desc: '加载占位背景 → {semantic.color.surface.3}', swatch: true },
        { name: '--comp-image-border-default', value: 'rgb(229,230,235)', desc: '描边 → {semantic.color.border.default}',     swatch: true },
      ]} />
    </div>

    {/* ══════════════════════════════════════════════════════════
        ICON
    ══════════════════════════════════════════════════════════ */}
    <div style={S.section}>
      <div style={S.h2}>comp.icon.*</div>

      {/* 示意图：尺寸阶梯 + 颜色状态 */}
      <div style={{ background: 'rgb(242,243,245)', borderRadius: '8px', padding: '20px', marginBottom: '20px', border: '1px solid #e5e6eb' }}>
        {/* 尺寸阶梯 */}
        <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '10px' }}>尺寸阶梯（12-24px）</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '20px' }}>
          {[
            { size: 12, label: '12' }, { size: 14, label: '14' }, { size: 16, label: '16' },
            { size: 18, label: '18' }, { size: 20, label: '20' }, { size: 24, label: '24' },
          ].map(({ size, label }) => (
            <div key={label} style={{ textAlign: 'center' as const }}>
              {/* SVG icon placeholder */}
              <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: 'block', margin: '0 auto' }}>
                <circle cx="12" cy="8" r="4" fill="rgb(134,144,156)" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgb(134,144,156)" />
              </svg>
              <div style={{ fontSize: '9px', color: '#86909c', marginTop: '4px' }}>{label}px</div>
            </div>
          ))}
        </div>
        {/* 颜色状态 */}
        <div style={{ fontSize: '11px', color: '#86909c', marginBottom: '10px' }}>颜色状态 default / active / disabled</div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {[
            { label: 'default', color: 'rgb(134,144,156)', desc: 'text.tertiary' },
            { label: 'active',  color: 'rgb(22,93,255)',   desc: 'primary.default' },
            { label: 'disabled',color: 'rgb(201,205,212)', desc: 'text.disabled' },
          ].map(({ label, color, desc }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill={color} />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={color} />
              </svg>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(29,33,41)' }}>{label}</div>
                <Ann label={desc} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <TRows rows={[
        { name: '--comp-icon-color-default',  value: 'rgb(134,144,156)', desc: '默认图标色 → {semantic.color.text.tertiary}',  swatch: true },
        { name: '--comp-icon-color-active',   value: 'rgb(22,93,255)',   desc: 'Active 图标色 → {semantic.color.primary.default}', swatch: true },
        { name: '--comp-icon-color-disabled', value: 'rgb(201,205,212)', desc: 'Disabled → {semantic.color.text.disabled}',     swatch: true },
        { name: '--comp-icon-size-12',  value: '12px', desc: '→ {core.size.icon.12}' },
        { name: '--comp-icon-size-14',  value: '14px', desc: '→ {core.size.icon.14}' },
        { name: '--comp-icon-size-16',  value: '16px', desc: '→ {core.size.icon.16}（默认）' },
        { name: '--comp-icon-size-18',  value: '18px', desc: '→ {core.size.icon.18}' },
        { name: '--comp-icon-size-20',  value: '20px', desc: '→ {core.size.icon.20}' },
        { name: '--comp-icon-size-24',  value: '24px', desc: '→ {core.size.icon.24}' },
      ]} />
    </div>
  </div>
);

// ── Meta & Stories ─────────────────────────────────────────────────────────────
const PlaceholderComponent = () => null;

const meta: Meta<typeof PlaceholderComponent> = {
  title: 'Design Tokens/Components',
  component: PlaceholderComponent,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof PlaceholderComponent>;

export const Button: Story = {
  name: '⑧ 组件 Button',
  render: () => <ButtonPage />,
};
export const Input: Story = {
  name: '⑨ 组件 Input',
  render: () => <InputPage />,
};
export const CardFormSwitchAvatar: Story = {
  name: '⑩ 组件 Card / Form / Switch / Avatar',
  render: () => <CompGroup1Page />,
};
export const DrawerModalMessageMenuImageIcon: Story = {
  name: '⑪ 组件 Drawer / Modal / Message / Menu / Image / Icon',
  render: () => <CompGroup2Page />,
};
