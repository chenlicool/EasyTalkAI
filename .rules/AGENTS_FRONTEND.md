# AGENTS_FRONTEND.md (前端法典)

版本号: v1.1
生效时间: 2026-05-14
适用对象: 前端代码与 UI 交互修改

## 1. 适用范围 (Scope)
所有 `.js`, `.css`, `.html` 及 UI 交互逻辑的修改。

## 2. 强制规则 (MUST)
- **组件分层**：content.js（核心逻辑）/ popup.js（UI 控制）/ selector.js（工具函数），不得越级引用。
- **Token 语义化**：颜色/间距/字号优先使用 CSS Variables；注入样式必须加 `elementsnap-` 前缀避免污染。
- **国际化优先**：用户可见文案集中管理；当前无 i18n，记录为待办。
- **函数式组件**：所有逻辑必须为纯函数式，避免类。
- **数据层隔离**：数据存取统一走 `chrome.storage.local`，不直接操作全局变量跨模块通信。
- **防御性编程**：DOM 操作前必须做 null 检查；API 调用必须 try-catch。
- **可访问性基线**：overlay 和 tooltip 必须 pointer-events: none，不阻断页面交互。

## 3. 禁止行为 (MUST NOT)
- 禁止硬编码颜色值（如 `#FFF`），必须使用已定义的 CSS 变量或语义化色值。
- 禁止在 content.js 中使用 ES6+ 语法（箭头函数/模板字符串/const/let 视兼容性降级为 var）。
- 禁止为 UI 直接改消息协议。

## 4. 允许例外 (EXCEPTION)
- `1px` 边框允许直接使用 px。
- 临时调试允许 `console.log`，但提交前必须删除。

## 5. 违规处理 (ENFORCEMENT)
- 发现硬编码颜色、注入样式无前缀、破坏可访问性基线时必须拒绝修改并回滚。
