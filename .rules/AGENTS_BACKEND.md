# AGENTS_BACKEND.md (后端法典)

版本号: v1.0
生效时间: 2026-05-14
适用对象: Service Worker 与 Chrome Extension API 调用

## 1. 适用范围 (Scope)
所有 `service-worker.js` 修改及 Chrome Extension API 调用。

## 2. 强制规则 (MUST)
- **接口隔离**：消息协议（action 字段）一经定义不得随意修改；新增 action 可，改已有 action 不可。
- **错误码规范**：所有 `sendResponse` 必须包含 `{ success: boolean }`。
- **日志链路**：关键操作（toggle/广播/注入）应在 console 记录。
- **零信任输入**：消息 payload 必须校验字段存在性（`msg.action` 等）。
- **幂等性设计**：toggle 消息多次发送行为一致（激活态不再重复激活）。

## 3. 禁止行为 (MUST NOT)
- 禁止为前端需求随意变更消息协议。
- 禁止在生产环境打印敏感信息。
- 禁止在 service-worker 中执行同步阻塞操作。

## 4. 允许例外 (EXCEPTION)
- 紧急热修复需负责人授权，并记录在 MEMORY.md。

## 5. 违规处理 (ENFORCEMENT)
- 如需修改已发布消息协议：
  1. 新增 action 名称
  2. 更新 API.md
  3. 记录 CHANGELOG
  4. 通知所有 content script 消费者
