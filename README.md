# Vibe Design ↔ Code Token Pipeline

> Design → Token → Code 全链路打通框架 · DTCG 2025.10 标准

## What

一套将 Figma Variables 与代码完整打通的 Token 工程体系：

- **Figma Variables ↔ DTCG** — MCP Plugin API 双向同步，无需 PAT
- **DTCG ↔ Style Dictionary v5** — 3 层架构（core / semantic / component）
- **8 平台输出** — CSS · SCSS · Tailwind · JS/TS · iOS Swift · Android XML · JSON · FIGMA
- **多品牌支持** — arco 基线 + 主题变体（better-design 示例）

## Architecture

```
Figma Variables
      ↕  (MCP Plugin API)
source/tokens/          ← DTCG 2025.10 源文件
  core/                 ← 原子色板、尺寸、字体
  semantic/             ← 语义层（primary、danger…）
  components/           ← 组件层（button、input…）
      ↓  (Style Dictionary v5)
dist/
  css/     scss/     ts/     ios/     android/     json/
```

## Brands

| Brand | 类型 | Token 数 | 覆盖率 |
|-------|------|---------|--------|
| `arco` | 基线 | 428 | 100% |
| `better` | 主题变体（violet primary） | 173 overrides | 40% |

## Pipeline Gates

| Gate | 内容 | 状态 |
|------|------|------|
| 1a | Figma Variables 完整性 | PASS |
| 1b | Token 覆盖率 & 无阻塞违规 | PASS |
| 2 | Figma ↔ Code 组件映射 | PASS |
| 3 | Token 定制 ≥ 30% | PASS |
| 4 | Playwright token contract 测试 | PASS |
| 5 | Delivery manifest | PASS |

## Quick Start

```bash
# 安装
npm install

# 构建（arco 基线）
cd arco-design-system/arco-design && npm run build

# Gap 报告
npm run gap:report

# Figma → DTCG 同步（需 Claude Code + Figma MCP）
npm run figma:mcp-pull

# Storybook 预览
npm run storybook  # → http://localhost:6006
```

## Figma 同步路径

```
Claude Code + Figma MCP Plugin API  ← 推荐（无需 PAT）
npm run figma:mcp-pull / figma:mcp-push

REST API (file_variables:read scope)  ← 备用（需 PAT upgrade）
npm run figma:sync
```

## Repo Structure

```
arco-design-system/arco-design/   ← 基线品牌（本仓库）
better-design/                    ← 主题变体示例
shared/scripts/                   ← 共享工具脚本
```

## Related

- [AGENTS.md](AGENTS.md) — Multi-agent 编排合约
- [release/RUNBOOK.md](release/RUNBOOK.md) — 完整执行手册
- [docs/token-changelog.md](docs/token-changelog.md) — 变更记录
