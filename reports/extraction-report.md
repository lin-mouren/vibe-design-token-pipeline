# 提取报告 – Arco Design

## 来源台账

| 来源 | 类型 | 权威级别 | URL / 路径 | 获取时间 | 范围 | 备注 |
|---|---|---|---|---|---|---|
| `@arco-design/web-react` npm CSS 打包文件 | 包源码 | 1 | https://unpkg.com/@arco-design/web-react/dist/css/arco.css | 2026-03-20 | 全部 tokens | v2.66.12 (由 unpkg 自动解析) |
| Arco Design token 文档页 | 官方文档 | 3 | https://arco.design/react/docs/token | 2026-03-20 | 结构概览 | JS 渲染的 SPA – 直接访问受限；使用 CSS bundle 作为主要来源 |

## 采用的权威顺序
1. 包源码 CSS (`arco.css`)
2. 官方文档页 (用于结构化上下文；受机器人访问限制的 SPA)

## 提取方法
- 模式: **Public-doc** (主要来源: CSS package 源码)
- 工具: `curl -sL + grep` 针对 `https://unpkg.com/@arco-design/web-react/dist/css/arco.css`
- 捕获内容: 所有 `:root` 下匹配 `--color-`, `--primary-`, `--success-`, `--danger-`, `--warning-`, `--link-`, `--border-radius-`, `--gray-`, `--arcoblue-`, `--red-`, `--orange-`, `--green-`, `--font-weight-`, `font-size`, `line-height` 的 CSS 自定义属性

## Token 统计摘要
| 类别 | 数量 |
|---|---|
| core/color (色板) | ~110 (arcoblue×10, gray×10, red×10, orange×10, green×10, purple/cyan/gold 部分) |
| core/radius (圆角) | 5 |
| core/typography (排版) | ~15 (包括 sizes, weights, line-height) |
| semantic/color (语义颜色) | ~20 (primary, danger, success, warning, link 多级色阶 + 亮色变体) |
| semantic/text (文本) | 4 (text-1 至 text-4) |
| semantic/surface (表面/背景) | 6 (bg-1 至 bg-5, popup) |
| semantic/border (边框) | 4 |
| semantic/fill (填充) | 4 |
| semantic/secondary (次要状态) | 4 (default, hover, active, disabled) |
| semantic/mask + tooltip (遮罩与提示背景)| 2 |
| themes/dark (暗色主题) | ~10 (text 1-4, bg 1-5, border) |
| components/button (按钮组件) | ~8 |
| **总计** | **~202** |

## 冲突决策
- **`color-white` 和 `color-black` 出现两次** (亮色和暗色 `:root`)。亮色值 (`#ffffff` / `#000000`) 为标准值；暗色覆盖值 (`rgba(255,255,255,0.9)` / `#000000`) 记录在暗色主题文件中。无冲突 – 均保留在其各自文件中。
- **`color-bg-popup` 值** 指向 `var(--color-bg-5)` 而不是字面量颜色。遵守语义一致性规则，保留其引用 `{surface.bg-5}`。

## 未解决项 (TOKEN_GAP) — 历史记录 & 修复状态

### ✅ 已修复（本次补充提取）

**【原因分析：为什么初次提取失败？】**
初次提取策略是 `grep --css-variable-*` 对 `arco.css` 做全文扫描。该策略只能捕获**运行时 CSS 自定义属性（CSS Variables）**。

然而 Arco 官方将阴影和间距定义在了两个不同的地方：
- 阴影 → 定义在 **设计变量文档页** (`/react/docs/token`)，为 **纯设计规范值**，CSS 变量列显示为 `-`（即无 CSS var 对应）。
- 间距 → 定义在 **设计规范文档页** (`/docs/spec/space` & `/docs/spec/grid`)，同样**没有全局 CSS 变量**，而是以设计规范阶梯形式呈现。

因此 CSS grep 没有找到它们，并不说明这些 Token 不存在，而是因为**它们不是 CSS Variables**，只是设计规范层面的基础Token定义。

| 原 TOKEN_GAP 项 | 修复状态 | 新文件 | 证据来源 | 权威级别 |
|---|---|---|---|---|
| `shadow tokens` | ✅ 已提取 | `tokens/core/shadow.tokens.json` | 用户截图 + browser scroll `/react/docs/token` | Level 3 - Official Doc |
| `spacing tokens` | ✅ 已提取 | `tokens/core/spacing.tokens.json` | browser scroll `/docs/spec/space` | Level 3 - Official Doc |
| `grid / breakpoints` | ✅ 已提取 | `tokens/core/grid.tokens.json` | browser scroll `/docs/spec/grid` | Level 3 - Official Doc |

---

### ⚠️ 仍未解决项（真实不存在全局 Token）

1. **Purple / Cyan / Gold 完整色阶扩展** — 仅捕获了 step-6 默认值；若需数据可视化色板，需补充 1-10 全阶梯。
2. **Motion / Animation tokens** — Arco 无全局动画 CSS 变量，由组件 JS 内部控制。
3. **`tokens.resolved.*.json`** — 需运行 Style Dictionary pipeline 生成；当前包未输出。


## 废弃项
在 `arco.css` v2.66.12 中未发现废弃项。

## 假设前提
- `--primary-6` 解析为 `--arcoblue-6`，后者进而解析为 `rgb(22,93,255)` = `#165DFF`。这是权威的主品牌蓝。
- 色板的 RGB 三元组值 (例如, `22,93,255`) 是用于 `rgb()` 包装器中的原始通道值。这里将其存储为解析后的 `rgb()` 字符串形式。
- 字体族 (Font family) 栈是通过 body 元素的 CSS 推断的。假设了 token 名称为 `font-family`；在 root 中未发现 `--font-family` 自定义属性 (Arco 直接将其设置在 `body{}` 上)。
