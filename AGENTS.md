# AGENTS.md

适用于 EasyTalk AI 项目的 AI 编码规则。

## 强制规则

1. **ES5 兼容**：content.js / popup.js 用 `var` 不用 `const/let`，用 `function` 不用箭头函数。
2. **提交前必测 5 条核心路径**：Click 捕获 / Cmd+C 仿写 / Shift 多选 / iframe 识别 / Popup 切换。
3. **消息协议不可改**：action 字段已有定义不得修改，新增可。
4. **最小补丁**：不重写整段，不改到不需要动的地方。
5. **文档同步**：改代码必须在 MEMORY.md 记一行。

## 禁止

- 禁止硬编码颜色值（已定义 CSS 变量除外）
- 禁止在 content.js 里用 ES6+ 语法
- 禁止改 manifest.json 的 permissions 结构除非新功能必须
- 禁止未测就提交

## 文件职责速览

| 文件 | 职责 | 改它时注意 |
|------|------|-----------|
| `content/content.js` | 核心：高亮/捕获/复制/仿写 | 最复杂，改动影响最大 |
| `content/content.css` | 注入样式 | 必须 `elementsnap-` 前缀 |
| `utils/selector.js` | 选择器引擎 | 独立模块，不依赖 content |
| `background/service-worker.js` | 快捷键/广播 | Service Worker 非持久 |
| `popup/popup.js` | UI 控制 | 通过 Service Worker 中转消息 |
| `manifest.json` | 扩展声明 | Protected — 只加不删 |
