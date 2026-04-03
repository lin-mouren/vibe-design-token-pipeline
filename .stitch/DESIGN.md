# Design Intent — Arco Design System

## Brand Voice
企业级 B 端设计语言；专业、高效、克制；
色彩策略：ArcoBlue (#165DFF) 为主色 + 中性灰 (#1D2129→#F7F8FA) + 功能色（Red/Green/Orange）

## Page Goals
信息密度适中的 B 端界面；首屏核心操作可达；
层级架构不超过 3 层

## Interaction Philosophy
直接操作优于层叠菜单；状态变化必须有视觉反馈；
> 300ms 操作显示骨架屏/loading 状态

## Token Architecture
三层 DTCG：core（原始值）→ semantic（语义映射）→ component（组件绑定）
双主题：Light + Dark（通过 Semantic Colors collection Modes 切换）

## Component Scope (MVP)
Button / Input / Select / Textarea / Checkbox / Radio / Switch /
Avatar / Tag / Divider / Card / MenuItem / Message / Modal / Drawer
