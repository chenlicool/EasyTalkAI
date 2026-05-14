# EasyTalkToAI 💬

> Click any element → AI understands it. Cmd+C → full component spec.

一个 Chrome 浏览器扩展，让你在网页上选中任意元素，一键生成 AI 可直接理解的描述。支持元素识别、样式仿写、批量多选。

## 快速启动

1. 打开 Chrome → `chrome://extensions/`
2. 打开**开发者模式**
3. 点击**加载已解压的扩展程序** → 选择本项目文件夹
4. 工具栏出现 💬 图标

## 三种模式

| 操作 | 输出 | 用途 |
|------|------|------|
| **Click** | CSS Selector + 属性 + 上下文 | "帮我把这个按钮改成蓝色" |
| **Cmd+C** | 完整设计规格书（视觉/动画/结构） | "照这个帮我做一个一样的" |
| **Shift+Click** | 批量选中 → Enter 批量复制 | "这3个元素分别改成..." |

## 功能特性

- 🎯 智能选择器引擎：id > testid > aria-label > class > nth-path
- 🎨 仿写模式：提取 computed styles + @keyframes + 交互状态
- 🔢 多选：Shift+Click 批量，彩色高亮 + 编号角标
- 🖼 iframe 支持：自动注入所有 frame，跨 frame 无缝切换
- 🎬 动画检测：自动识别 framer-motion / GSAP / AOS 等动画库
- ⌨️ 快捷键：Cmd+Shift+E 激活，Esc 退出
- 📋 多格式输出：YAML / JSON / Markdown

## 目录结构

```
EasyTalkToAI/
├── manifest.json              # 扩展声明
├── background/service-worker.js  # 快捷键 + 多 frame 广播
├── popup/                     # 弹出界面
├── content/                   # 核心注入脚本
├── utils/selector.js          # 选择器引擎
├── icons/                     # 扩展图标
├── .rules/                    # AI 编码规范
├── WORKFLOWS/                 # 工作流
└── AGENTS.md / SOUL.md / STACK.md ...
```

## 环境依赖

- Chrome 88+（Manifest V3）
- 无构建工具，纯原生 JavaScript

## 许可证

MIT
