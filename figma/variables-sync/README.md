# Figma Variables Sync — Vibe Design Token Pipeline

> **状态**：LIVE — MCP Plugin API 路径已验证，430 变量双向同步完成。

## 同步路径

### 路径 A：MCP Plugin API（推荐，无需 PAT）

通过 Claude Code + Figma MCP 在会话内直接执行 Plugin API：

```bash
# 从 Figma 拉取 variables → DTCG
npm run figma:mcp-pull

# 将 DTCG token 推送到 Figma variables
npm run figma:mcp-push
```

- 无需 PAT，无需企业版 Figma
- 需在 Claude Code 会话中运行（调用 `use_figma` MCP tool）
- 证据文件：`evidence/figma-variables-mcp.json`（430 variables）

### 路径 B：Figma Variables REST API（备用，企业版）

```bash
# 获取文件中所有 Variables
GET https://api.figma.com/v1/files/:file_key/variables/local
Authorization: Bearer $FIGMA_PAT

npm run figma:sync   # 需要 file_variables:read scope
```

所需配置：`FIGMA_PAT`、`FIGMA_FILE_KEY` 环境变量

### 路径 C：Tokens Studio GitHub Sync（社区方案）

在 Figma Tokens Studio 插件中配置 GitHub sync：
- Repository: `lin-mouren/vibe-design-token-pipeline`
- Branch: `main`
- File path: `source/tokens/`
- Token format: `DTCG`

## 脚本说明

| 脚本 | 路径 | 说明 |
|------|------|------|
| `figma-mcp-pull.mjs` | MCP Plugin API | Figma Variables → DTCG source |
| `figma-mcp-push.mjs` | MCP Plugin API | DTCG source → Figma Variables |
| `figma-to-dtcg.mjs` | REST API | Figma Variables JSON → DTCG |
| `dtcg-to-figma.mjs` | REST API | DTCG JSON → Figma PATCH |

## Variable 结构（当前状态）

| Collection | Mode | 变量数 |
|-----------|------|-------|
| Core Colors | Default | 123 |
| Spacing | Default | 10 |
| Typography | Default | 14 |
| Semantic Colors | Light / Dark | 79 |
| Component Colors | Light / Dark | 204 |
| **合计** | | **430** |

## Gate 检查项（Gate 1a）

- [x] 所有 color 值绑定到 Figma Library Variables（135 裸色 → 0）
- [x] VARIABLE_ALIAS 修复完成（308 mode 赋值）
- [x] Variable 绑定指向 semantic 层而非 palette 层
- [ ] 画布组件 fill/stroke 属性绑定到 comp/* variables（Stage 1，待执行）
