# 验证报告 – Arco Design System Package

> 本报告由 `scripts/validate_package.py` 和 `scripts/validate-dtcg.mjs` 生成结果人工汇总，**禁止手写数字**——所有计数以脚本输出为准。
> 最后运行：2026-03-22 · validate_package.py + validate-dtcg.mjs 对 `arco-design/` 执行（node_modules/ 已排除）

## 结果: ✅ PASSED

| 指标 | 值 | 来源 |
|---|---|---|
| 索引 Token 总数 | **183** | `source/tokens/token-index.json` |
| TOKEN_GAP 数量 | 0 | validate_package.py |
| 孤立别名数量 | 0 | validate_package.py |
| DTCG §6 类型值违规 | 0 | validate_package.py |
| DTCG §8 命名空间违规 | 0 | validate_package.py |
| 语义层违规 | 0 | validate_package.py |
| 循环引用 | 0 | validate_package.py |
| 悬空引用 | 0 | validate_package.py |
| Node.js 结构违规 | 0 | validate-dtcg.mjs |
| 错误（阻断） | 0 | 两个验证器均通过 |
| 警告 | 0 | 两个验证器均通过 |

## 生产门禁结果

| 门禁 | 结果 | 说明 |
|---|---|---|
| Gate 1 Figma 变量绑定 | **SKIP** | 需要 FIGMA_PAT + FIGMA_FILE_KEY，是发布唯一阻断项 |
| Gate 2 无硬编码值 | **PASS** | `node scripts/gates/gate-code.mjs` 实跑通过 |
| Gate 3 dist + manifest + stories | **PASS** | `node scripts/gates/gate-delivery.mjs` 实跑通过：Button(14)+Input(10)stories，177 CSS vars |

## Gate 3 覆盖面（实测）

| 检查项 | 内容 | 结果 |
|---|---|---|
| dist 产物存在 | arco.css, arco-dark.css, scss, js, json | ✅ |
| delivery-manifest 合法性 | 必填字段、gate 状态 | ✅ |
| Button.stories.tsx | 14 stories，真实 @arco-design/web-react import | ✅ |
| Input.stories.tsx | 10 stories，真实 @arco-design/web-react import | ✅ |
| component-registry 覆盖 | 所有注册组件均有 storybookPath | ✅ |
| CSS 变量数量 sanity check | 177 CSS custom properties（> 50 阈值）| ✅ |

## 构建产物（已生成）

| 产物 | 状态 |
|---|---|
| `dist/css/arco.css` | ✅ |
| `dist/css/arco-dark.css` | ✅ |
| `dist/scss/_arco-tokens.scss` | ✅ |
| `dist/tailwind/arco-preset.js` | ✅ |
| `dist/ts/arco.tokens.js` | ✅ |
| `dist/json/arco.resolved.json` | ✅ |
| `dist/ios/ArcoTokens.swift` | ✅ |
| `dist/android/arco_tokens.xml` | ✅ |

## Storybook 覆盖

| 组件 | Story 数 | 导入方式 |
|---|---|---|
| Button | 14 | `@arco-design/web-react`（真实） |
| Input | 10 | `@arco-design/web-react`（真实） |

## 文件完整性

| 路径 | 状态 |
|---|---|
| `source/tokens/core/` — 7 个文件 | ✅ |
| `source/tokens/semantic/` — 3 个文件 | ✅ |
| `source/tokens/themes/` — 2 个文件 | ✅ 已加入 SD 构建源 |
| `source/tokens/components/` — 2 个文件 | ✅ input 已填充真实 token |
| `source/tokens/token-index.json` — **183 tokens** | ✅ |
| `source/tokens/token-alias-map.json` — 170 entries | ✅ |
| `source/component-contracts/button.contract.json` | ✅ stable |
| `source/component-contracts/input.contract.json` | ✅ low-confidence，已填充真实绑定 |
| `registries/component-registry.json` | ✅ Input 升级为 low-confidence |
| `registries/recipe-registry.json` | ✅ |
| `release/delivery-manifest.json` | ✅ v0.2.0，183 tokens，Gate 2+3 PASS |
| `build/style-dictionary.config.mjs` | ✅ 含 themes/，8 平台 |
| `scripts/validate_package.py` | ✅ node_modules 排除已修复 |
| `scripts/build_token_index.py` | ✅ |
| `scripts/validate-dtcg.mjs` | ✅ |
| `scripts/gates/gate-*.mjs` | ✅ Gate 2+3 实跑通过 |
| `figma/variables-sync/dtcg-to-figma.mjs` | ✅ --dry-run 实跑: 3 collections, 168 vars |
| `figma/variables-sync/figma-to-dtcg.mjs` | ✅ |
| `verification/storybook/Button.stories.tsx` | ✅ 14 stories，真实 import |
| `verification/storybook/Input.stories.tsx` | ✅ 10 stories，真实 import（新增）|
| `guidelines/design-tokens/*.md` — 5 个文件 | ✅ 真实内容 |
| `guidelines/components/*.md` — 2 个文件 | ✅ 真实内容 |
| `ai/prompt-templates/*.md` — 4 个文件 | ✅ 真实内容 |
| `docs/token-*.md` — 4 个文件 | ✅ 真实内容 |

## 已知数据质量限制

| 条目 | 状态 | 说明 |
|---|---|---|
| `input.tokens.json` | ⚠️ low-confidence | 真实 token 值已填充，来源是 CSS var 模式推导；Figma boundVariables 审计未做 |
| `source/component-contracts/input.contract.json` | ⚠️ low-confidence | 绑定已填充，含 resolvedCssVar；Figma 审计前置信度为 medium |
| Figma Variable 绑定 | ⚠️ 未审计 | 唯一发布阻断项，需 FIGMA_PAT + FIGMA_FILE_KEY |
| Style Dictionary collision warnings | ⚠️ 非致命 | 93 个 collision 来自 dark theme 与 semantic 共享路径名；$schema/$metadata 重复键警告同理。均不影响产物正确性 |
| validate-dtcg.mjs 计数 192 vs index 183 | ✅ 预期差异 | validate-dtcg.mjs 扫描所有文件（含 dark.tokens.json 中 9 个主题覆盖 token）；token-index.json 只计唯一源 token，不含主题覆盖。两者口径均正确，以 index 183 为发布文档标准 |

## DTCG 2025.10 规范合规说明

| 规范要求 | 当前状态 |
|---|---|
| `$extensions` 反域名命名（§8）| ✅ `com.arco.design` / `com.anthropic.dtcg-skill` |
| `shadow $value` 结构化对象（§6.3）| ✅ |
| `fontWeight $value` 数字或 {reference}（§6.5）| ✅ |
| `dimension $value` 带单位或 "0" 或 {reference}（§6.1）| ✅ |
| `{path.to.token}` 引用语法，0 悬空引用 | ✅ |
| 无循环引用 | ✅ |
| 语义层链路 core→semantic→component | ✅ 0 跨层直引 |
