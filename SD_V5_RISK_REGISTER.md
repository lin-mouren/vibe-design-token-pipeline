# SD v5 兼容性探针风险登记表
# 探针日期：2026-03-30 | SD v4.x → v5.4.0

## 探针结论：**GO ✅**

| 指标 | 结果 |
|------|------|
| Class A 功能性错误 | **0** — 无 `[object Object]`，无丢失 token，无断裂 alias |
| Class B 值漂移 | **3处**（见下表） |
| v4 token 数 | 183 |
| v5 token 数 | 183 |
| 零值类型变化 | string `"0"` / `"0px"` → number `0` |

---

## Class A 检查结果（全部通过）

| 检查项 | v4 | v5 | 结论 |
|--------|----|----|------|
| `[object Object]` in CSS | 无 | 无 | ✅ PASS |
| `[object Object]` in SCSS | 无 | 无 | ✅ PASS |
| 丢失 token（v4有v5无） | — | 0 | ✅ PASS |
| 断裂 alias（未解析引用） | — | 0 | ✅ PASS |
| theme mode 错误 | — | 无 | ✅ PASS |

---

## Class B 值漂移明细（需在 Phase 1 验证）

| Token 路径 | 平台 | v4 值 | v5 值 | 风险评估 |
|-----------|------|-------|-------|---------|
| `--grid-breakpoints-xs` | CSS | `0px` | `0` | LOW — 浏览器等价，unitless zero |
| `$grid-breakpoints-xs` | SCSS | `0px` | `0` | LOW — 同上 |
| `GridBreakpointsXs` | JS/TS | `"0px"` (string) | `0` (number) | **MEDIUM** — TS 类型破坏，需检查消费方 |
| `RadiusNone` | JS/TS | `"0"` (string) | `0` (number) | **MEDIUM** — 同上 |

### 操作要求（Phase 1 执行前）
- [ ] 检查所有 `import { RadiusNone }` 和 `import { GridBreakpointsXs }` 使用处
- [ ] 若消费方做 string 比较（`=== "0"`），需更新为 `== 0` 或 `=== 0`
- [ ] SCSS/CSS `0px` → `0` 无需额外处理

---

## SD v5 构建警告（Class B / 非阻塞）

### Token Collisions (19处)
全部为 `$metadata` 字段冲突或 light/dark 主题 token 同名（如 `text.primary`、`surface.bg-*`）。
- **原因**：SD v5 对同名 token 跨文件检测更严格，v4 不报告此类冲突
- **影响**：无功能影响，最终使用后一个 source 文件的值（dark theme 覆盖 light theme 为预期行为）
- **建议**：Phase 1 整理 source 文件时给 dark theme tokens 加明确命名空间前缀

### Filtered Token References Warning (arco.css)
- **内容**：dark theme token 被 filter 过滤后，原本引用它们的 outputReferences 链无目标
- **影响**：无，filter 行为为预期设计（dark 只在 css-dark 平台输出）
- **结论**：可忽略

---

## SD v5 迁移决策

**Phase 0 Go/No-Go：✅ GO**
- Class A count = 0，无需 Phase 0 升级为阻塞项
- Phase 1 正常按计划执行 `dtcg-sd-v5-migrator`
- 携带本文件进入 Phase 1，在 JS/TS 消费方检查时重点关注零值类型变化

**package.json 更新时机**：Phase 1 `dtcg-sd-v5-migrator` 执行时将 `"style-dictionary": "^4.0.0"` 升级为 `"^5.0.0"`
