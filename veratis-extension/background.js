/**
 * VERATIS Companion - Background Service Worker
 * Manages side panel initialization, action clicks, and context menu shortcuts.
 */

// Configure side panel behavior to open when extension action icon is clicked
chrome.runtime.onInstalled.addListener(() => {
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((err) => {
      console.warn('Could not set side panel behavior:', err);
    });
  }

  // Set up context menus for quick webpage text analysis
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'veratis-investigate',
      title: 'VERATIS: Investigate with Truth Tribunal',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'veratis-explain',
      title: 'VERATIS: Explain simply',
      contexts: ['selection']
    });

    chrome.contextMenus.create({
      id: 'veratis-phishing',
      title: 'VERATIS: Check for Phishing / Scam',
      contexts: ['selection']
    });
  }
});

// Handle context menu clicks
chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
  if (!tab || !tab.id) return;

  const actionMap = {
    'veratis-investigate': 'investigate',
    'veratis-explain': 'explain',
    'veratis-phishing': 'phishing'
  };

  const action = actionMap[info.menuItemId] || 'investigate';
  const selectedText = info.selectionText || '';

  // Store pending action for the sidepanel to pick up
  await chrome.storage.local.set({
    pendingAction: {
      action,
      selectedText,
      pageTitle: tab.title || '',
      pageUrl: tab.url || '',
      timestamp: Date.now()
    }
  });

  // Open the side panel for this window
  if (chrome.sidePanel && chrome.sidePanel.open) {
    chrome.sidePanel.open({ windowId: tab.windowId }).catch((e) => {
      console.warn('Could not open side panel:', e);
    });
  }
});

// Fallback action click handler if openPanelOnActionClick is unsupported
chrome.action?.onClicked.addListener(async (tab) => {
  if (!tab || !tab.windowId) return;
  if (chrome.sidePanel && chrome.sidePanel.open) {
    chrome.sidePanel.open({ windowId: tab.windowId }).catch((err) => {
      console.warn('Failed to open side panel on click:', err);
    });
  }
});
