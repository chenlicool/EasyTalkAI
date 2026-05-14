# API 文档

## Base URL
无后端 — Chrome Extension 内部 API

## 通用约定
本扩展为纯客户端应用，无外部 API 调用。所有"接口"均为 Chrome Extension 内部消息通信。

## 内部协议说明

### Content Script <-> Service Worker
- `action: 'toggle'` — 切换元素选择模式
- `action: 'activate'` / `action: 'deactivate'` — 强制激活/关闭
- `action: 'getState'` — 查询当前状态
- `action: 'formatChanged', format: 'yaml'|'json'|'markdown'` — 切换输出格式
- `action: 'contentScriptReady'` — 脚本注入完成通知

### Content Script <-> Popup
- 通过 Service Worker 中转，不直接通信
- Popup 读取 `chrome.storage.local` 获取输出格式偏好

### 跨 Frame 通信
- `action: 'broadcastToAllFrames', payload` — 任意 frame 可请求广播到所有 frame
- Service Worker 通过 `chrome.webNavigation.getAllFrames()` 获取 frame 列表

## 错误码规范
无后端，不适用。异常通过 `chrome.runtime.lastError` 和 try-catch 处理。
