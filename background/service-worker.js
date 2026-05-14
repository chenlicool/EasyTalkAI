/**
 * ElementSnap - Background Service Worker
 * Handles keyboard shortcut (Cmd/Ctrl+Shift+E) and coordinates with content scripts.
 * Supports iframes by broadcasting messages to all frames in a tab.
 */

// ── Track per-tab active state ──────────────────────
var tabStates = {};

// ── Keyboard shortcut ───────────────────────────────
chrome.commands.onCommand.addListener(async function (command) {
  if (command === 'toggle-picker') {
    var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    var tab = tabs[0];
    if (!tab || !tab.id) return;

    togglePicker(tab);
  }
});

// ── Extension icon click (fallback) ─────────────────
chrome.action.onClicked.addListener(async function (tab) {
  togglePicker(tab);
});

// ── Message from content script ─────────────────────
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === 'contentScriptReady' && sender.tab) {
    tabStates[sender.tab.id] = false;
    sendResponse({ success: true });
  }

  // Relay: any frame can request broadcast to all frames
  if (msg.action === 'broadcastToAllFrames') {
    if (sender.tab && sender.tab.id) {
      broadcastToTab(sender.tab.id, msg.payload).then(function () {
        sendResponse({ success: true });
      });
      return true; // async
    }
  }
});

// ── Get all frame IDs for a tab ─────────────────────
function getAllFrameIds(tabId) {
  return new Promise(function (resolve) {
    chrome.webNavigation.getAllFrames({ tabId: tabId }, function (frames) {
      if (chrome.runtime.lastError || !frames) {
        resolve([]);
      } else {
        resolve(frames.map(function (f) { return f.frameId; }));
      }
    });
  });
}

// ── Send message to a specific frame ────────────────
function sendToFrame(tabId, frameId, msg) {
  return new Promise(function (resolve) {
    chrome.tabs.sendMessage(tabId, msg, { frameId: frameId }, function (response) {
      if (chrome.runtime.lastError) {
        resolve({ success: false, error: chrome.runtime.lastError.message });
      } else {
        resolve(response || { success: false });
      }
    });
  });
}

// ── Broadcast to all frames in a tab ────────────────
async function broadcastToTab(tabId, msg) {
  var frameIds = await getAllFrameIds(tabId);
  var results = [];
  for (var i = 0; i < frameIds.length; i++) {
    var resp = await sendToFrame(tabId, frameIds[i], msg);
    results.push(resp);
  }
  return results;
}

// ── Toggle logic ────────────────────────────────────
async function togglePicker(tab) {
  try {
    // Try sending to main frame first
    var resp = await sendToFrame(tab.id, 0, { action: 'toggle' });

    // If content script not yet injected into main frame, inject everywhere
    if (!resp || !resp.success) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['utils/selector.js', 'content/content.js']
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id, allFrames: true },
        files: ['content/content.css']
      });
      resp = await sendToFrame(tab.id, 0, { action: 'toggle' });
    }

    // Broadcast to all frames (main + iframes)
    var frameIds = await getAllFrameIds(tab.id);
    var anyActive = false;
    var anySuccess = false;

    for (var i = 0; i < frameIds.length; i++) {
      // skip frame 0 if we already toggled it above
      if (frameIds[i] === 0) {
        if (resp && resp.state === 'active') anyActive = true;
        if (resp && resp.success) anySuccess = true;
        continue;
      }
      var fResp = await sendToFrame(tab.id, frameIds[i], { action: 'toggle' });
      if (fResp && fResp.state === 'active') anyActive = true;
      if (fResp && fResp.success) anySuccess = true;
    }

    // If main frame toggle failed but iframe toggles succeeded
    if (!resp || !resp.success) {
      resp = { success: anySuccess, state: anyActive ? 'active' : 'inactive' };
    }

    var active = resp && resp.state === 'active';
    tabStates[tab.id] = active;
    updateIcon(tab.id, active);
  } catch (e) {
    console.warn('ElementSnap: Cannot toggle on this page', e.message);
  }
}

// ── Update extension icon based on state ────────────
function updateIcon(tabId, active) {
  var path = active ? 'icons/icon128-active.png' : 'icons/icon128.png';
  chrome.action.setIcon({ tabId: tabId, path: { 128: path } }).catch(function () {});
}

// ── Tab close cleanup ───────────────────────────────
chrome.tabs.onRemoved.addListener(function (tabId) {
  delete tabStates[tabId];
});
