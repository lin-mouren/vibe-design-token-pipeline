# Code Connect 可行性探针结果
# 探针日期：2026-03-30 | Figma 账户：lybory (Student/Starter plan)

## 结论：**路径 B（REST API 只读映射）**

---

## 探针测试结果

| 测试项 | 结果 | 说明 |
|--------|------|------|
| Figma PAT 有效性 | ✅ 有效 | `GET /v1/me` 返回 200，用户：lybory |
| REST API 读权限 | ✅ 可用 | 全计划可用 |
| Variables API 写权限 | ❌ 不可用 | Student plan 限制，需 Enterprise |
| Code Connect publish | ❌ 不可用 | 需要 Professional/Org/Enterprise + Dev Mode |
| `@figma/code-connect` CLI | ⚠️ 未安装 | 可安装但 publish 会返回 403 |

## 计划限制说明

Figma **Student/Education** 计划 = 免费计划 + 教育验证。
Code Connect 发布要求：
- Figma **Professional, Organization, 或 Enterprise** 计划
- **Dev Mode** 访问权限

Student 计划无以上权限，`figma connect publish` 会返回 `403 Forbidden`。

---

## 执行路径：Path B（无 SKIP）

### 核心思路
使用 `GET /v1/files/{key}/components` REST API（全计划可用）读取 Figma 组件结构，
生成本地 `figma-to-react-map.json` 作为设计-代码映射表。

### Phase 2 执行方案

```
1. 获取 Figma file key（从 Tokens Studio Git Sync 配置或用户提供）
2. GET /v1/files/{key}/components → 提取组件 variants 字典
3. 生成 figma-to-react-map.json：
   {
     "Button": {
       "figmaNodeId": "<node-id>",
       "variants": ["Primary", "Secondary", "Danger", "Ghost"],
       "props": ["size", "disabled", "loading"],
       "confidenceScore": 0.85,
       "mappingMethod": "rest-api-read",
       "mappedAt": "<ISO8601>"
     }
   }
4. 每个组件输出映射置信度分数（目标 80-85%）
5. 显式记录精度降级原因（非 SKIP）
```

### 置信度目标
- **目标**：80-85%（非路径A的95%，因缺少 Code Connect 语义注解）
- **提升方式**：结合 Figma MCP `get_design_context` 获取更丰富的组件信息

### 精度降级记录（诚实记录，禁止 SKIP）

| 组件 | 路径A置信度 | 路径B置信度 | 降级原因 |
|------|-----------|-----------|---------|
| Button | 95% | ~85% | 无 Code Connect prop 注解 |
| Input | 95% | ~80% | 状态变体需人工验证 |
| Card | 95% | ~85% | 槽结构无法自动映射 |
| Badge/Tag | 95% | ~85% | 颜色变体可通过 API 推断 |
| Toggle/Switch | 95% | ~80% | 布尔状态映射需人工确认 |

---

## 升级路径

| 计划升级 | 解锁能力 |
|---------|---------|
| Figma Professional | Code Connect 发布，置信度 → 95% |
| Figma Organization | Variables API 写权限 |
| Figma Enterprise | 全部能力 |

**当前 MVP 决策**：路径B足够验证 token 流转，不阻塞 Phase 2 目标。
