# Repository Agent Rules

## Hard Rules
- 不允许新增临时样式常量
- 不允许跳过 token 层直接写 magic number
- 组件变更优先修改 packages/ui，业务层禁止复制
- 任何视觉变更必须附 Playwright 截图验证
- 任何 token 变更必须更新 build 输出
- build/** 和 dist/** 禁止手动修改
- source/tokens/ 是唯一 DTCG SSOT，不允许在其他位置定义 token

## Token Workflow
- Token PR 使用 `tokens:` 前缀，独立 PR，不混合业务代码
- 变更 source/tokens/ → 运行 `npm run build` → 提交 dist/ 更新
- Gate 1 必须通过后才允许合并

## Component Workflow
- 新组件必须先有对应 `source/tokens/components/<name>.tokens.json`
- 组件必须消费 semantic token 层变量，禁止直接引用 core token
- 新组件须补充 Code Connect `.figma.tsx` 映射并更新 `figma/figma-code-map.json`

## CI/CD
- Gate 1-5 pipeline 由 `.github/workflows/` 管理，不可绕过
- Figma sync 输出为 PR，不直接推 main
- Gate 3 (Codex Review) 当前 DEFERRED，下一迭代激活

## Git Convention
- tokens: 前缀独立 PR，不混合业务代码
- feat/fix/refactor 前缀用于组件和功能变更
