# EasyTalk AI 💬

> Click any element → AI understands it. Cmd+C → full component spec.

一个 Chrome 扩展，选中网页元素 → 生成 AI 可直接理解的结构化描述。

---

## 快速启动

1. Chrome → `chrome://extensions/` → 开启**开发者模式**
2. **加载已解压的扩展程序** → 选本项目文件夹
3. 工具栏出现 💬 图标

---

## 三种模式

| 操作 | 输出 | 用途 |
|------|------|------|
| **Click** | CSS Selector + 属性 + 上下文 | "把这个按钮改成蓝色" |
| **Cmd+C** | 完整设计规格书（视觉/动画/结构） | "照这个帮我做一样的" |
| **Shift+Click** | 批量选中 → Enter 复制 | "这3个元素分别改..." |

快捷键 `Cmd+Shift+E` 激活，`Esc` 退出。

---

## 架构

详见 [ARCHITECTURE.md](./ARCHITECTURE.md)，含 6 张 Mermaid 架构图：

- 整体数据流
- 三种操作模式
- 仿写模式 6 层数据提取
- 选择器引擎优先级
- iframe 通信时序
- 文件职责矩阵

---

## 技术栈

Chrome Extension Manifest V3 · 纯 JavaScript (ES5) · 原生 CSS · 无构建工具

---

## 版本历史

### v1.0.0 (2026-05-14)
- 元素识别模式：Click 捕获 CSS Selector + 属性 + 上下文
- 仿写模式：Cmd+C 生成完整设计规格书（视觉/动画/结构/@keyframes）
- 多选模式：Shift+Click 批量选中，Enter 批量复制
- iframe 支持：all_frames 注入 + 跨 frame 广播
- 动画库检测：framer-motion / GSAP / AOS / Lottie
- 三种输出格式：YAML / JSON / Markdown
- 智能选择器引擎：id → testid → aria-label → class → nth-path
- Cmd+Shift+E 快捷键

---

## 许可证

MIT
