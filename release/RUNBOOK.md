# Arco Design Token Package — 完整执行 Runbook

> 本 Runbook 涵盖从零环境到三个生产门全部通过的完整步骤，每步均可独立验证。

---

## 前置条件检查

```bash
# 验证工具版本
node --version        # 需 >= 20
python3 --version     # 需 >= 3.9
npm --version         # 需 >= 10
```

---

## Phase 1 — 依赖安装与 DTCG 验证

### 步骤 1.1：安装 npm 依赖

```bash
cd arco-design   # 进入包根目录

npm install
# 安装内容：
#   style-dictionary@4  —— 多平台 token 构建
#   storybook@8         —— 组件文档与视觉测试
#   @storybook/react-vite
#   @arco-design/web-react  —— 实际组件库
#   react / react-dom / typescript / vite
```

**验证：**
```bash
ls node_modules/style-dictionary    # 应存在
ls node_modules/@storybook/react    # 应存在
```

### 步骤 1.2：运行 DTCG 包验证

```bash
npm run validate
# 预期输出：
#   Validation PASSED
#   Total tokens in index: 130
#   DTCG §8 ext violations: 0
#   Semantic layer violations: 0
#   Circular references: 0
#   Dangling references: 0
```

**如果失败：** 根据 ERROR 行修复 source/tokens/ 中的对应文件，再重跑。

---

## Phase 2 — Style Dictionary 多平台构建

### 步骤 2.1：执行构建

```bash
npm run build
# 构建来源：source/tokens/core/*.tokens.json
#           source/tokens/semantic/*.tokens.json
#           source/tokens/components/*.tokens.json
#
# 生成产物：
#   dist/css/arco.css              —— CSS 变量 :root
#   dist/css/arco-dark.css         —— 暗色主题覆盖
#   dist/scss/_arco-tokens.scss    —— SCSS 变量
#   dist/tailwind/arco-preset.js   —— Tailwind 主题扩展
#   dist/ts/arco.tokens.js         —— ES 模块
#   dist/json/arco.resolved.json   —— 完全解析的平铺 JSON
#   dist/ios/ArcoTokens.swift      —— Swift 常量
#   dist/android/arco_tokens.xml   —— Android XML 资源
```

**验证：**
```bash
# 检查所有必需产物存在且非空
for f in dist/css/arco.css dist/css/arco-dark.css dist/scss/_arco-tokens.scss \
          dist/ts/arco.tokens.js dist/json/arco.resolved.json; do
  echo "$(wc -c < $f) bytes — $f"
done

# 快速抽样检查 CSS 内容
head -30 dist/css/arco.css
# 应看到：:root { --palette-arcoblue-1: ...; }

# 检查暗色主题
head -10 dist/css/arco-dark.css
# 应看到：[data-theme="dark"], .arco-theme-dark { ...
```

**如果失败：**
- `Cannot find module 'style-dictionary'` → 重新运行 `npm install`
- `No tokens found` → 检查 source/tokens/ 路径是否存在（见 Phase 1）
- `Reference not found` → 运行 `npm run validate` 确认无悬空引用

### 步骤 2.2：更新 delivery-manifest.json 的 token 覆盖数

```bash
# 统计 dist/json/arco.resolved.json 中的实际 token 数
node -e "
const t = JSON.parse(require('fs').readFileSync('dist/json/arco.resolved.json','utf8'));
console.log('Resolved tokens:', Object.keys(t).length);
"
# 将输出的数字填入 release/delivery-manifest.json → tokenCoverage.totalTokensUsed
```

---

## Phase 3 — Production Gate 2（代码门）

### 步骤 3.1：运行代码门

```bash
node scripts/gates/gate-code.mjs
# 检查：
#   1. 无硬编码 #hex / rgb() / rgba() 出现在 .ts/.tsx/.css/.scss 中
#   2. dist/ 中无直接 palette.* 引用
#   3. 代码文件不直接 import source/tokens/
#
# 预期：
#   === Production Gate 2: Code Gate ===
#   PASS — no hardcoded values, no layer violations, no source imports
```

**如果出现 WARN `dist/ts/arco.tokens.js not found`：**
→ 先完成 Phase 2 再运行此 Gate。

---

## Phase 4 — Storybook 与 Production Gate 3（交付门）

### 步骤 4.1：启动 Storybook 开发服务器（视觉验证）

```bash
npm run storybook
# 打开 http://localhost:6006
# 应看到：
#   Components/Button — 14 个 story:
#     Primary / PrimarySmall / PrimaryLarge / PrimaryMini
#     Secondary / Outline / Text / Dashed
#     Danger / Warning / Success
#     Disabled / Loading
#
# 操作验证：
#   1. 右上角切换 light/dark 主题 —— token 颜色应响应切换
#   2. Controls 面板切换 type/status/size —— 样式应实时变化
#   3. Accessibility 标签页 —— 确认无 a11y 错误（按钮对比度）
```

### 步骤 4.2：运行交付门

```bash
node scripts/gates/gate-delivery.mjs
# 检查：
#   1. dist/ 必需产物全部存在且非空
#   2. release/delivery-manifest.json 字段完整
#   3. verification/storybook/Button.stories.tsx 存在且有 export
#
# 预期：
#   === Production Gate 3: Delivery Gate ===
#   PASS
#   WARN: delivery-manifest.json: figmaGate = SKIP (正常，待 Figma 访问后处理)
```

---

## Phase 5 — Production Gate 1（Figma 门，需 Figma 访问权限）

### 步骤 5.1：配置 Figma 访问

```bash
# 1. 在 Figma 账号设置 → Personal Access Tokens 生成 token
# 2. 在 Figma 文件 URL 中找到 file key：
#    https://www.figma.com/file/<FILE_KEY>/Design-System

export FIGMA_PAT=<your-personal-access-token>
export FIGMA_FILE_KEY=<your-file-key>

# 持久化（可选）
echo 'export FIGMA_PAT=xxx' >> ~/.zshrc
echo 'export FIGMA_FILE_KEY=yyy' >> ~/.zshrc
```

### 步骤 5.2：同步 Figma Variables → DTCG

```bash
# 先做 dry-run，不写文件，只查看映射结果
node figma/variables-sync/figma-to-dtcg.mjs --dry-run

# 确认映射正确后，实际写入
node figma/variables-sync/figma-to-dtcg.mjs
# 输出示例：
#   + Primitives/arcoblue/1 (color) → source/tokens/core/color.tokens.json
#   + Semantic/text/primary (color) → source/tokens/semantic/text.tokens.json
#   === 完成: 87 tokens synced to 4 files ===

# 同步后重新建立索引并验证
npm run index
npm run validate
```

**如果 collection 名称不匹配：**
→ 编辑 `figma/variables-sync/figma-to-dtcg.mjs` 中的 `COLLECTION_TO_FILE` 映射，
  将 Figma 实际 collection 名称对应到正确的 token 文件路径。

### 步骤 5.3：运行 Figma 门

```bash
node scripts/gates/gate-figma.mjs
# 检查：
#   1. 所有 semantic/component 层变量绑定 variable alias（非裸值）
#   2. 无变量直接绑定 palette/ 层
#
# 预期：
#   === Production Gate 1: Figma Gate ===
#   PASS — X variables, 0 bare color errors
```

---

## Phase 6 — 一键完整 Release 流程

```bash
# 运行所有门（无 Figma 访问时跳过 Gate 1）
bash scripts/run-production-gates.sh --skip-figma

# 有 Figma 访问时运行全部三个门
bash scripts/run-production-gates.sh

# 完整 release 命令（validate + build + gates）
npm run release
```

**预期最终输出：**
```
========================================
  Gate Results
========================================
  PASS  Gate 1: Figma Variable Binding Audit    ← 有 Figma 时
  SKIP  Gate 1: Figma Variable Binding Audit    ← --skip-figma 时
  PASS  Gate 2: No Hardcoded Values / Semantic Layer
  PASS  Gate 3: dist/ Artifacts + Manifest + Stories
========================================
  PASS: 2  FAIL: 0  SKIP: 1
========================================
ALL GATES PASSED
  Updated release/delivery-manifest.json
```

---

## Phase 7 — CI/CD 自动化验证

Push 到 GitHub 仓库后，`.github/workflows/token-ci.yml` 自动执行：

| Job | 触发条件 | 内容 |
|---|---|---|
| validate | 所有 push/PR | `validate_package.py` DTCG 全检查 |
| build | validate 通过后 | Style Dictionary 8 平台构建 |
| gate-code | build 成功后 | 无硬编码值检查 |
| gate-delivery | build 成功后 | dist 产物 + manifest + stories |
| storybook | main 分支 push | Storybook 静态构建 + 上传 artifact |

```bash
# 验证 CI 配置语法
cat .github/workflows/token-ci.yml | python3 -c "import sys,yaml; yaml.safe_load(sys.stdin); print('YAML valid')"
# 需要 pip install pyyaml
```

---

## 快速排障手册

| 症状 | 原因 | 修复 |
|---|---|---|
| `style-dictionary: command not found` | 未安装依赖 | `npm install` |
| `No tokens found matching source` | source/tokens/ 路径不存在 | 确认 `ls source/tokens/core/` 有文件 |
| `Reference not found: {xxx}` | 悬空引用 | `npm run validate` 查看具体路径 |
| Gate 2 `Hardcoded color in xxx` | 代码中有裸色值 | 替换为 `var(--token-name)` |
| Gate 3 `Missing required dist artifact` | 未构建 | `npm run build` |
| Figma API `403` | PAT 无效或过期 | 重新生成 Personal Access Token |
| Figma API `404` | FILE_KEY 错误 | 从 Figma URL 重新获取文件 Key |
| Storybook 白屏 | `dist/css/arco.css` 不存在 | `npm run build` 后再启动 Storybook |
