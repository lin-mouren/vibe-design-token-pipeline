# Figma Variables Sync

> **状态**：Stub — 等待 Figma 文件访问权限后实现。

## 目的

本目录包含 Figma Variables ↔ Git DTCG JSON 双向同步管道脚本。

## 预期实现方式（二选一）

### 方式 A：Figma Variables REST API（官方，企业版）

```bash
# 获取文件中所有 Variables
GET https://api.figma.com/v1/files/:file_key/variables/local
Authorization: Bearer $FIGMA_PAT

# 将返回的 variable JSON 转换为 DTCG 格式
node scripts/figma-to-dtcg.mjs --input figma-variables.json --out source/tokens/
```

所需文件（待创建）：
- `figma-to-dtcg.mjs` — Figma Variable JSON → DTCG `$value`/`$type` 转换器
- `dtcg-to-figma.mjs` — DTCG JSON → Figma Variable PATCH 推送器
- `.env.example` — `FIGMA_PAT`, `FIGMA_FILE_KEY` 变量模板

### 方式 B：Tokens Studio GitHub Sync（社区方案，速度更快）

在 Figma Tokens Studio 插件中配置 GitHub sync：
- Repository: `<org>/<repo>`
- Branch: `main`
- File path: `source/tokens/`
- Token format: `DTCG`

## 当前阻断项

- [ ] Figma 文件 URL / File Key 未提供
- [ ] Figma Personal Access Token 未配置
- [ ] 未确认使用 REST API 还是 Tokens Studio

## Figma Gate 检查项（Production Gate 1）

执行同步后，需验证：
- [ ] 所有 color/spacing/radius/font 值绑定到 Figma Library Variables（无裸值）
- [ ] 所有重复 UI 元素使用 Library Components（无 detach frame）
- [ ] Variable 绑定指向 semantic 层而非 palette 层

详见 `references/quality-gates.md` Production Gate 1。
