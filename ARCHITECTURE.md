# EasyTalk AI 架构文档

## 1. 整体数据流

```mermaid
graph TD
    A[用户操作] --> B{触发方式}
    B -->|点击 Popup 按钮| C[Popup 弹出]
    B -->|Cmd+Shift+E 快捷键| D[Service Worker]
    C --> E[点击 Start Picking]
    D --> E
    E --> F[Content Script 激活]
    F --> G[iframe 检测 → 广播所有 frame]
    G --> H[mousemove → 蓝色高亮 + Tooltip]
    H --> I{用户操作}
    I -->|Click| J[元素识别模式 → 复制]
    I -->|Cmd+C| K[仿写模式 → 复制]
    I -->|Shift+Click| L[多选模式 → Enter 批量复制]
    I -->|Esc| M[退出]
```

## 2. 三种操作模式

```mermaid
graph LR
    subgraph 识别模式
        A1[Hover 元素] --> A2[Click]
        A2 --> A3[提取选择器+属性]
        A3 --> A4[复制到剪贴板 ✅]
    end
    
    subgraph 仿写模式
        B1[Hover 元素] --> B2[Cmd+C]
        B2 --> B3[提取视觉+动画+结构]
        B3 --> B4[生成设计规格书 ✅]
    end
    
    subgraph 多选模式
        C1[Hover 元素] --> C2[Shift+Click]
        C2 --> C3[彩色高亮+编号角标]
        C3 --> C4[Enter 批量复制 ✅]
    end
```

## 3. 仿写模式的 6 层数据提取

```mermaid
graph TD
    A[Cmd+C 触发] --> B[1. Visual Spec]
    A --> C[2. Interaction States]
    A --> D[3. CSS Animations]
    A --> E[4. HTML Structure Skeleton]
    A --> F[5. Layout Context]
    A --> G[6. Animation Library Detection]
    
    B --> B1["getComputedStyle<br/>30+ 核心属性"]
    C --> C1["Tailwind hover:* 解析<br/>+ stylesheet :hover 扫描"]
    D --> D1["@keyframes 规则提取<br/>+ animation-* 属性"]
    E --> E1["DOM 树精简<br/>SVG → [icon] 占位"]
    F --> F1["父容器布局<br/>兄弟元素关系"]
    G --> G1["framer-motion<br/>GSAP / AOS / Lottie"]
    
    B1 --> H[buildReplicatePrompt]
    C1 --> H
    D1 --> H
    E1 --> H
    F1 --> H
    G1 --> H
    
    H --> I["→ 粘贴到 AI 对话 → 生成代码"]
```

## 4. 选择器引擎优先级

```mermaid
graph LR
    A[DOM 元素] --> B{id 存在且唯一?}
    B -->|是| C["#submit-btn ✅"]
    B -->|否| D{data-testid 唯一?}
    D -->|是| E["[data-testid='submit'] ✅"]
    D -->|否| F{aria-label 唯一?}
    F -->|是| G["button[aria-label='提交'] ✅"]
    F -->|否| H{class 组合唯一?}
    H -->|是| I["button.btn.primary ✅"]
    H -->|否| J[nth-child 路径兜底]
```

## 5. iframe 通信架构

```mermaid
sequenceDiagram
    participant P as Parent Content Script
    participant I as iframe Content Script
    participant SW as Service Worker

    User->>SW: Cmd+Shift+E
    SW->>P: toggle (frameId: 0)
    SW->>I: toggle (frameId: 1, 2, ...)
    P->>P: activate overlay
    I->>I: activate overlay

    User->>I: mouse enters iframe
    P->>P: detect iframe, hide overlay
    I->>I: take over highlight

    User->>I: Click / Cmd+C
    I->>I: capture element, copy
```

## 6. 文件职责矩阵

| 文件 | 职责 | 大小 |
|------|------|------|
| `content/content.js` | 核心：高亮/捕获/复制/仿写/多选 | ~36KB |
| `content/content.css` | 注入样式：overlay/tooltip/toast/badge | ~5KB |
| `utils/selector.js` | 智能 CSS 选择器引擎 | ~5KB |
| `background/service-worker.js` | 快捷键 + 跨 frame 广播 | ~3KB |
| `popup/popup.html` | 弹出窗口 UI | ~2KB |
| `popup/popup.css` | 弹出窗口样式 | ~4KB |
| `popup/popup.js` | 弹出窗口逻辑 | ~5KB |
| `manifest.json` | 扩展声明 | ~1KB |

## 7. 关键技术决策

| 决策 | 原因 |
|------|------|
| ES5 / 无构建 | 免编译，直接加载到 Chrome |
| all_frames 注入 | 解决 iframe 内元素无法识别 |
| execCommand + Clipboard API 双轨 | 兼容 Permissions-Policy 限制 |
| 选择器优先级链 | id → testid → aria-label → class → path |
| 仿写离线 | 不依赖 API key，粘贴到任何 AI 都能用 |
| 空 then/catch 吞 Clipboard 错误 | 避免控制台红线污染 |
