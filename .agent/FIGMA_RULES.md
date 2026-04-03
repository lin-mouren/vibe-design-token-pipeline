# Figma to Code Mapping Rules

## Component Mapping
- Auto Layout → Flexbox (layoutMode=HORIZONTAL → flex-direction: row)
- Variants → React props (Type → type, Size → size, State → disabled/status)
- Slots → React children / render props
- Component instances → Import from @arco-design/web-react

## Variable Mapping
- Color Variables (Semantic Colors) → CSS custom properties `var(--semantic-color-*)`
- Spacing Variables → spacing tokens `var(--core-space-*)`
- Typography Variables → font size/weight/line-height tokens
- Boolean Variables → conditional display / disabled states

## Token Layer Rules
- Core → 不直接在组件中使用，仅通过 semantic 引用
- Semantic → 组件消费的主层
- Component → 特定组件覆盖

## Multi-platform Output
- get_design_context 默认 React+Tailwind
- Code Connect 覆盖: React (@arco-design/web-react)
- 可指定 Vue / plain HTML+CSS / iOS 输出

## Figma File
- Design System: qtbgJ5T34iWfFx634uUXto
- Collections: Core Colors, Semantic Colors (Light+Dark), Spacing, Typography
