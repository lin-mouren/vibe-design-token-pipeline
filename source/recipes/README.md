# Component Recipes

> **状态**：空 — 等待组件 token 提取完成后填写。

## 用途

Recipe 是可复用的多组件组合模式（如"表单行"、"数据表格"、"通知横幅"），描述：
- 所用组件及其 variant 参数
- 所用 token 列表
- 布局/间距规则

## 格式（参考 `registries/recipe-registry.json`）

```json
{
  "id": "form-row",
  "label": "Form Row",
  "components": ["Input", "Button"],
  "tokens": ["spacing.16", "text.primary", "border.1"],
  "layout": "flex row gap-spacing-16",
  "description": "Standard label + input + submit button row",
  "evidence": { "confidence": "medium", "sources": [] }
}
```

## 当前阻断项

- [ ] Input 组件 token 文件仍是 stub（无 $value 条目）
- [ ] 未完成 Figma 组件库审计
- [ ] 需要至少 2 个强证据组件才能建立有意义的 recipe

当 `source/component-contracts/` 中的所有 contract 置信度达到 `high` 后，在此目录下创建 recipe JSON 文件并注册到 `registries/recipe-registry.json`。
