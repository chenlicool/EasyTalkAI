# EasyTalkToAI 技术架构与实现文档

## 1. 项目概述
EasyTalkToAI 是一个 Chrome 浏览器扩展（Manifest V3），让用户通过悬停+点击网页元素，一键生成 AI 可理解的结构化描述。支持单元素识别、Shift 多选、Cmd+C 仿写规格书三种模式，覆盖 iframe 内元素。

## 2. 目录结构
```
EasyTalkToAI/
├── manifest.json              # 扩展声明（权限/脚本/图标）
├── background/
│   └── service-worker.js      # 后台服务：快捷键监听、多 frame 广播
├── popup/
│   ├── popup.html             # 弹出窗口 UI
│   ├── popup.css              # 弹出窗口样式（深色主题）
│   └── popup.js               # 弹出窗口逻辑（模式切换/状态同步）
├── content/
│   ├── content.js             # 核心注入脚本：高亮/捕获/复制/仿写
│   └── content.css            # 注入样式：浮层/tooltip/toast/多选 badge
├── utils/
│   └── selector.js            # 智能 CSS 选择器引擎
├── icons/                     # 扩展图标（16/48/128 + active 态）
├── .rules/                    # AI 编码规范（前端/后端/文档/测试）
├── WORKFLOWS/                 # 初始化与同步流程
├── AGENTS.md                  # AI 协作总纲
├── SOUL.md                    # AI 行为边界
├── STACK.md                   # 技术栈声明
├── ARCHITECTURE.md            # 本文档
├── API.md                     # Chrome Extension API 使用说明
├── CHANGELOG.md               # 版本变更记录
├── MEMORY.md                  # 项目记忆（时间倒序）
└── README.md                  # 项目说明
```

## 3. 技术栈
- **运行时**: Chrome Extension Manifest V3
- **语言**: JavaScript (ES5 兼容，无编译)
- **样式**: 原生 CSS（注入页面 + popup 深色主题）
- **存储**: chrome.storage.local（输出格式偏好）
- **权限**: activeTab, scripting, storage, clipboardWrite, webNavigation

## 4. 核心流程

### 4.1 元素识别模式（Click）
```
用户 Cmd+Shift+E → Service Worker → 广播 all frames → content.js 激活
→ mousemove 蓝色高亮 + tooltip
→ Click → ElementSnapSelector.generate() → formatOutput() → copyToClipboard
```

### 4.2 仿写模式（Cmd+C）
```
激活后 hover 元素 → Cmd+C
→ extractVisualSpec() + extractStateSpec() + buildStructureSkeleton()
  + extractContextSpec() + extractKeyframes() + detectAnimationLib()
→ buildReplicatePrompt() → copyToClipboard
```

### 4.3 多选模式（Shift+Click）
```
Shift+Click → addSelection() → 彩色 overlay + 编号 badge + X 按钮
→ Shift+Click 再次 → removeSelection()
→ Enter → batchCopy()
```

### 4.4 iframe 支持
```
all_frames: true → content.js 注入所有 frame
→ Service Worker / Popup 通过 webNavigation.getAllFrames() 广播 toggle
→ 主 frame 检测到 iframe hover 时隐藏 overlay，iframe 内 overlay 接管
```

## 5. 关键设计决策
- **ES5 不编译**: 避免构建链，直接加载到 Chrome
- **all_frames 注入**: 解决 iframe 内元素无法识别的问题
- **execCommand + Clipboard API 双轨复制**: 兼容 Permissions-Policy 限制
- **智能选择器优先级**: id → data-testid → aria-label → class combo → nth-path
- **仿写模式离线**: 不依赖 API key，纯 DOM 提取设计规格书

## 6. 风险与约束
- Manifest V3 限制: service-worker 非持久，需处理唤醒
- 跨域 iframe: content script 可注入但无法访问父 frame DOM
- Permissions-Policy: 某些网站禁用 Clipboard API，需 execCommand 兜底
- CSS @keyframes 提取: 跨域 stylesheet 无法读取（CORS）
