/**
 * ElementSnap - Popup Logic
 */
(function () {
  'use strict';

  var toggleBtn = document.getElementById('toggleBtn');
  var statusEl = document.getElementById('status');
  var formatRadios = document.querySelectorAll('input[name="format"]');
  var isActive = false;

  // ── Get current tab ID ─────────────────────────────
  function getCurrentTab() {
    return new Promise(function (resolve) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        resolve(tabs[0]);
      });
    });
  }

  // ── Get all frame IDs for a tab ────────────────────
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

  // ── Send message to a specific frame ───────────────
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

  // ── Send to all frames ─────────────────────────────
  async function broadcastToTab(tabId, msg, skipFrameId) {
    var frameIds = await getAllFrameIds(tabId);
    var results = [];
    for (var i = 0; i < frameIds.length; i++) {
      if (skipFrameId !== undefined && frameIds[i] === skipFrameId) continue;
      var resp = await sendToFrame(tabId, frameIds[i], msg);
      results.push(resp);
    }
    return results;
  }

  // ── Init ───────────────────────────────────────────
  async function init() {
    // Load saved format
    chrome.storage.local.get(['outputFormat'], function (result) {
      if (result.outputFormat) {
        var radio = document.querySelector('input[name="format"][value="' + result.outputFormat + '"]');
        if (radio) radio.checked = true;
      }
    });

    // Check current state
    var tab = await getCurrentTab();
    if (!tab || !tab.id) return;
    var resp = await sendToFrame(tab.id, 0, { action: 'getState' });
    if (resp && resp.active) {
      setActiveState(true);
    }
  }

  // ── Toggle ─────────────────────────────────────────
  toggleBtn.addEventListener('click', async function () {
    var tab = await getCurrentTab();
    if (!tab || !tab.id) return;

    // Try main frame first
    var resp = await sendToFrame(tab.id, 0, { action: 'toggle' });

    // If not injected yet, inject everywhere
    if (!resp || !resp.success) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          files: ['utils/selector.js', 'content/content.js']
        });
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id, allFrames: true },
          files: ['content/content.css']
        });
        resp = await sendToFrame(tab.id, 0, { action: 'toggle' });
      } catch (e) {
        alert('Cannot activate on this page (e.g., chrome:// URLs are restricted).');
        return;
      }
    }

    // Broadcast to all frames (skip main frame — already toggled)
    var results = await broadcastToTab(tab.id, { action: 'toggle' }, 0);
    var anyActive = results.some(function (r) { return r && r.state === 'active'; });

    // Also check main frame
    if (resp && resp.state === 'active') anyActive = true;

    if (anyActive) {
      setActiveState(true);
    } else {
      setActiveState(false);
    }
  });

  // ── Format change ──────────────────────────────────
  formatRadios.forEach(function (radio) {
    radio.addEventListener('change', async function () {
      var format = this.value;
      chrome.storage.local.set({ outputFormat: format });

      var tab = await getCurrentTab();
      if (tab && tab.id) {
        broadcastToTab(tab.id, { action: 'formatChanged', format: format });
      }
    });
  });

  // ── UI State ───────────────────────────────────────
  function setActiveState(active) {
    isActive = active;
    if (active) {
      toggleBtn.classList.add('active');
      toggleBtn.querySelector('.btn-label').textContent = 'Stop Picking';
      toggleBtn.querySelector('.btn-icon').textContent = '⏹';
      statusEl.className = 'status status-active';
      statusEl.querySelector('.status-text').textContent = 'Active — hover and click an element';
    } else {
      toggleBtn.classList.remove('active');
      toggleBtn.querySelector('.btn-label').textContent = 'Start Picking';
      toggleBtn.querySelector('.btn-icon').textContent = '🎯';
      statusEl.className = 'status status-inactive';
      statusEl.querySelector('.status-text').textContent = 'Ready — click button or press ⌘⇧E';
    }
  }

  // ── Start ──────────────────────────────────────────
  init();
})();
