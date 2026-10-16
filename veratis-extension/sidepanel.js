/**
 * VERATIS Companion - Side Panel Controller
 * Minimal, White & Matte Grey Editorial Design
 * Handles context extraction, action chips, real-time AI API integration,
 * voice speech-to-text dictation, and text-to-speech audio playback.
 */

// Global State
let currentTab = null;
let currentContext = {
  selectedText: '',
  pageText: '',
  title: '',
  url: '',
  domain: '',
  wordCount: 0,
  metadata: {},
  headings: [],
  links: [],
  forms: []
};
let conversationHistory = [];
let speechRecognition = null;
let isRecordingVoice = false;
let currentUtterance = null;

// Settings (persisted in chrome.storage.local)
let settings = {
  apiUrl: 'http://localhost:5173/api/companion',
  opMode: 'auto', // 'auto' | 'demo'
  geminiApiKey: '',
  groqApiKey: '',
  ttsRate: 1.0
};

// DOM Elements
const overlayToggleBtn = document.getElementById('overlayToggleBtn');
const modeBadge = document.getElementById('modeBadge');
const modeText = document.getElementById('modeText');
const clearChatBtn = document.getElementById('clearChatBtn');
const settingsBtn = document.getElementById('settingsBtn');

const pageTitleLabel = document.getElementById('pageTitleLabel');
const captureSelectionBtn = document.getElementById('captureSelectionBtn');
const capturePageBtn = document.getElementById('capturePageBtn');
const clearContextBtn = document.getElementById('clearContextBtn');
const contextSnippet = document.getElementById('contextSnippet');
const snippetText = document.getElementById('snippetText');
const wordCountLabel = document.getElementById('wordCountLabel');

const chatContainer = document.getElementById('chatContainer');
const welcomeState = document.getElementById('welcomeState');
const messagesList = document.getElementById('messagesList');
const typingIndicator = document.getElementById('typingIndicator');

const speechBanner = document.getElementById('speechBanner');
const stopSpeechBtn = document.getElementById('stopSpeechBtn');

const composerContextTag = document.getElementById('composerContextTag');
const composerContextLabel = document.getElementById('composerContextLabel');
const removeContextTagBtn = document.getElementById('removeContextTagBtn');
const messageInput = document.getElementById('messageInput');
const voiceBtn = document.getElementById('voiceBtn');
const sendBtn = document.getElementById('sendBtn');

// Settings Modal Elements
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const apiUrlInput = document.getElementById('apiUrlInput');
const groqKeyInput = document.getElementById('groqKeyInput');
const geminiKeyInput = document.getElementById('geminiKeyInput');
const testApiBtn = document.getElementById('testApiBtn');
const apiStatusMessage = document.getElementById('apiStatusMessage');
const ttsRateSlider = document.getElementById('ttsRateSlider');
const ttsRateVal = document.getElementById('ttsRateVal');
const overlayModalToggle = document.getElementById('overlayModalToggle');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await refreshActiveTab();
  setupEventListeners();
  checkPendingAction();
  initVoiceRecognition();
  checkBackendHealth();

  // Listen for tab switching and updates
  if (chrome.tabs) {
    chrome.tabs.onActivated?.addListener(async () => {
      await refreshActiveTab();
    });
    chrome.tabs.onUpdated?.addListener(async (tabId, changeInfo, tab) => {
      if (tab?.active) {
        await refreshActiveTab();
      }
    });
  }
});

function isRestrictedUrl(url) {
  if (!url) return false;
  return url.startsWith('chrome://') || 
         url.startsWith('chrome-extension://') || 
         url.startsWith('edge://') || 
         url.startsWith('about:') || 
         url.includes('chrome.google.com/webstore');
}

// Load settings from storage
async function loadSettings() {
  try {
    const stored = await chrome.storage.local.get(['veratis_settings', 'overlayEnabled']);
    if (stored.veratis_settings) {
      settings = { ...settings, ...stored.veratis_settings };
    }
    const isOverlayOn = stored.overlayEnabled !== false;
    updateOverlayToggleUI(isOverlayOn);
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }

  apiUrlInput.value = settings.apiUrl;
  if (groqKeyInput) {
    groqKeyInput.value = settings.groqApiKey || '';
  }
  if (geminiKeyInput) {
    geminiKeyInput.value = settings.geminiApiKey || '';
  }
  ttsRateSlider.value = settings.ttsRate;
  ttsRateVal.textContent = `${settings.ttsRate}x`;
  
  const radio = document.querySelector(`input[name="opMode"][value="${settings.opMode}"]`);
  if (radio) radio.checked = true;
}

// Update circular overlay toggle UI in header and settings
function updateOverlayToggleUI(isOn) {
  if (overlayToggleBtn) {
    overlayToggleBtn.classList.toggle('active', isOn);
    overlayToggleBtn.title = isOn 
      ? 'Page Quick-Access Overlay: ON (Click to turn OFF)' 
      : 'Page Quick-Access Overlay: OFF (Click to turn ON)';
  }
  if (overlayModalToggle) {
    overlayModalToggle.classList.toggle('active', isOn);
  }
}

// Toggle page overlay state and broadcast to all tabs
async function toggleOverlaySetting(forcedState) {
  try {
    const current = await chrome.storage.local.get(['overlayEnabled']);
    const isCurrentlyOn = current.overlayEnabled !== false;
    const newState = forcedState !== undefined ? forcedState : !isCurrentlyOn;

    await chrome.storage.local.set({ overlayEnabled: newState });
    updateOverlayToggleUI(newState);

    // Notify all active tabs immediately so the button appears/disappears live
    if (chrome.tabs) {
      chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'SET_OVERLAY_VISIBILITY',
              enabled: newState
            }).catch(() => {});
          }
        }
      });
    }
  } catch (err) {
    console.warn('Failed to toggle overlay setting:', err);
  }
}

// Refresh active browser tab information & auto-extract page data
async function refreshActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
      currentTab = tabs[0];
      const isRestricted = isRestrictedUrl(currentTab.url);
      if (isRestricted) {
        pageTitleLabel.textContent = 'Chrome system page (open any website to analyze)';
        clearCapturedContext();
      } else {
        const domain = currentTab.url ? new URL(currentTab.url).hostname : 'Webpage';
        pageTitleLabel.textContent = `${domain} · ${currentTab.title || 'Active Tab'}`;
        currentContext.title = currentTab.title || '';
        currentContext.url = currentTab.url || '';
        currentContext.domain = domain;

        // Automatically give the extension access to the active page content!
        autoExtractPageData();
      }
    } else {
      pageTitleLabel.textContent = 'No active tab detected';
    }
  } catch (e) {
    pageTitleLabel.textContent = 'Active tab protected or restricted';
  }
}

// Automatically extract page content in the background without user intervention
async function autoExtractPageData() {
  if (!currentTab || !currentTab.id || isRestrictedUrl(currentTab.url)) return;
  try {
    chrome.tabs.sendMessage(currentTab.id, { action: 'GET_PAGE_DATA' }, async (response) => {
      if (chrome.runtime.lastError || !response) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content.js']
          });
          chrome.tabs.sendMessage(currentTab.id, { action: 'GET_PAGE_DATA' }, (retryRes) => {
            if (retryRes && (retryRes.pageText || retryRes.title)) {
              applyAutoExtractedData(retryRes);
            }
          });
        } catch (e) {
          // Ignored for internal or protected tabs
        }
      } else if (response && (response.pageText || response.title)) {
        applyAutoExtractedData(response);
      }
    });
  } catch (err) {
    console.debug('Auto page extraction skipped:', err);
  }
}

function applyAutoExtractedData(response) {
  currentContext.title = response.title || currentTab?.title || 'Page';
  currentContext.url = response.url || currentTab?.url || '';
  currentContext.domain = response.domain || (currentTab?.url ? new URL(currentTab.url).hostname : '');
  currentContext.pageText = response.pageText || '';
  currentContext.wordCount = response.wordCount || (response.pageText ? response.pageText.split(/\s+/).length : 0);
  currentContext.metadata = response.metadata || {};
  currentContext.headings = response.headings || [];
  currentContext.links = response.links || [];
  currentContext.forms = response.forms || [];

  const wordCount = currentContext.wordCount;
  if (wordCount > 0 && !currentContext.selectedText) {
    const domain = currentContext.domain || 'Page';
    pageTitleLabel.textContent = `${domain} · ${currentContext.title.slice(0, 35)} (${wordCount.toLocaleString()} words)`;
    composerContextTag.classList.remove('hidden');
    composerContextLabel.textContent = `Page attached: ${wordCount.toLocaleString()} words`;
  }
}

// Check if side panel was launched via context menu
async function checkPendingAction() {
  try {
    const { pendingAction } = await chrome.storage.local.get(['pendingAction']);
    if (pendingAction && (Date.now() - pendingAction.timestamp < 30000)) {
      await chrome.storage.local.remove(['pendingAction']);
      
      if (pendingAction.selectedText) {
        setCapturedContext(pendingAction.selectedText, 'selection');
      }
      
      triggerAction(pendingAction.action);
    }
  } catch (e) {
    console.warn('Pending action check failed:', e);
  }
}

// Test backend health and update status badge
async function checkBackendHealth() {
  if (settings.opMode === 'demo') {
    updateModeBadge(false);
    return;
  }

  try {
    const healthUrl = settings.apiUrl.replace('/companion', '/health');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(healthUrl, { signal: controller.signal });
    clearTimeout(timer);

    if (res.ok) {
      updateModeBadge(true);
    } else {
      updateModeBadge(false);
    }
  } catch (e) {
    updateModeBadge(false);
  }
}

function updateModeBadge(isLive) {
  if (isLive && settings.opMode !== 'demo') {
    modeBadge.className = 'mode-badge live';
    modeText.textContent = 'LIVE AI';
  } else {
    modeBadge.className = 'mode-badge demo';
    modeText.textContent = 'DEMO';
  }
}

/* ==========================================================================
   Page Text & Selection Extraction
   ========================================================================== */

captureSelectionBtn.addEventListener('click', async () => {
  await extractFromTab('GET_SELECTION');
});

capturePageBtn.addEventListener('click', async () => {
  await extractFromTab('GET_PAGE_TEXT');
});

clearContextBtn.addEventListener('click', () => {
  clearCapturedContext();
});

removeContextTagBtn.addEventListener('click', () => {
  clearCapturedContext();
});

function extractFromTab(actionType) {
  return new Promise(async (resolve) => {
    if (!currentTab || !currentTab.id) {
      await refreshActiveTab();
    }
    if (!currentTab || !currentTab.id) {
      addMessage('assistant', 'Could not access the active tab. Please make sure a normal webpage is open.');
      return resolve(null);
    }

    // Check if current tab is a restricted system page
    if (isRestrictedUrl(currentTab.url)) {
      addMessage(
        'assistant',
        'Chrome restricts extensions from accessing internal system pages (chrome://) for security reasons.\n\nTo analyze webpage text, switch to any normal website (such as Wikipedia, news, or your local web app), highlight text, and click Get Selection.\n\nYou can also type or paste content directly in the composer below.'
      );
      return resolve(null);
    }

    // 1. Send direct message to the content script
    chrome.tabs.sendMessage(currentTab.id, { action: actionType }, async (response) => {
      if (chrome.runtime.lastError || !response) {
        // 2. If content script was not already listening, inject it dynamically
        try {
          await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['content.js']
          });

          chrome.tabs.sendMessage(currentTab.id, { action: actionType }, (retryResponse) => {
            if (retryResponse) {
              handleExtractionResponse(retryResponse, actionType);
              resolve(retryResponse);
            } else {
              addMessage('assistant', 'Could not read text from this tab. Please highlight text directly on the page or paste it in the composer below.');
              resolve(null);
            }
          });
        } catch (err) {
          console.warn('Script injection failed:', err);
          addMessage('assistant', 'Unable to inspect this page. Please enter or paste text in the composer below.');
          resolve(null);
        }
      } else {
        handleExtractionResponse(response, actionType);
        resolve(response);
      }
    });
  });
}

function handleExtractionResponse(response, actionType) {
  currentContext.title = response.title || currentTab?.title || 'Page';
  currentContext.url = response.url || currentTab?.url || '';
  currentContext.domain = response.domain || '';
  currentContext.wordCount = response.wordCount || 0;
  currentContext.metadata = response.metadata || {};
  currentContext.headings = response.headings || [];
  currentContext.links = response.links || [];
  currentContext.forms = response.forms || [];

  if (actionType === 'GET_SELECTION') {
    if (response.selectedText && response.selectedText.trim()) {
      setCapturedContext(response.selectedText, 'selection');
    } else {
      addMessage('assistant', 'No text is currently highlighted on the webpage. Highlight text with your mouse and click Get Selection, or click Read Page to inspect the whole page.');
    }
  } else {
    if (response.pageText && response.pageText.trim()) {
      setCapturedContext(response.pageText, 'page');
    } else {
      addMessage('assistant', 'Could not find readable main content on this page.');
    }
  }
}

function setCapturedContext(text, type) {
  if (type === 'selection') {
    currentContext.selectedText = text;
  } else {
    currentContext.pageText = text;
  }

  const wordCount = text.trim().split(/\s+/).length;
  currentContext.wordCount = wordCount;
  snippetText.textContent = text;
  if (wordCountLabel) {
    wordCountLabel.textContent = `${wordCount} words`;
  }
  contextSnippet.classList.remove('hidden');

  composerContextTag.classList.remove('hidden');
  composerContextLabel.textContent = `${type === 'selection' ? 'Selected' : 'Page'}: ${wordCount} words`;
}

function clearCapturedContext() {
  currentContext.selectedText = '';
  currentContext.pageText = '';
  currentContext.wordCount = 0;
  currentContext.metadata = {};
  currentContext.headings = [];
  currentContext.links = [];
  currentContext.forms = [];
  contextSnippet.classList.add('hidden');
  composerContextTag.classList.add('hidden');
}

/* ==========================================================================
   Action Chips & Suggested Prompts
   ========================================================================== */

function setupEventListeners() {
  // Action Chips
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const action = chip.getAttribute('data-action');
      triggerAction(action);
    });
  });

  // Suggested Prompts
  document.querySelectorAll('.prompt-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      messageInput.value = prompt;
      handleSendMessage();
    });
  });

  // Composer Input
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  sendBtn.addEventListener('click', () => {
    handleSendMessage();
  });

  // Circular Overlay Toggle in Header Bar
  overlayToggleBtn?.addEventListener('click', () => {
    toggleOverlaySetting();
  });

  // Circular Switch in Settings Modal
  overlayModalToggle?.addEventListener('click', () => {
    toggleOverlaySetting();
  });

  // Clear Chat
  clearChatBtn.addEventListener('click', () => {
    conversationHistory = [];
    messagesList.innerHTML = '';
    welcomeState.classList.remove('hidden');
    stopSpeech();
  });

  // Mode Badge Click -> Open Settings
  modeBadge.addEventListener('click', () => {
    openSettingsModal();
  });

  settingsBtn.addEventListener('click', () => {
    openSettingsModal();
  });

  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  // Stop Speech Button
  stopSpeechBtn.addEventListener('click', () => {
    stopSpeech();
  });

  // Settings Actions
  ttsRateSlider.addEventListener('input', (e) => {
    ttsRateVal.textContent = `${e.target.value}x`;
  });

  testApiBtn.addEventListener('click', async () => {
    testApiBtn.disabled = true;
    apiStatusMessage.textContent = 'Testing connection...';
    apiStatusMessage.className = 'api-status-msg';

    try {
      const url = apiUrlInput.value.trim().replace('/companion', '/health');
      const res = await fetch(url);
      if (res.ok) {
        apiStatusMessage.textContent = 'Backend connected successfully (Live AI ready)';
        apiStatusMessage.className = 'api-status-msg success';
        updateModeBadge(true);
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      const directGroq = groqKeyInput?.value.trim() || settings.groqApiKey;
      const directGemini = geminiKeyInput?.value.trim() || settings.geminiApiKey;
      if (directGroq || directGemini) {
        const providers = [directGroq ? 'Groq' : '', directGemini ? 'Gemini' : ''].filter(Boolean).join(' + ');
        apiStatusMessage.textContent = `Backend offline. Direct AI active (${providers}).`;
        apiStatusMessage.className = 'api-status-msg success';
        updateModeBadge(true);
      } else {
        apiStatusMessage.textContent = 'Server offline. Enter Groq or Gemini Key for Direct AI.';
        apiStatusMessage.className = 'api-status-msg error';
        updateModeBadge(false);
      }
    } finally {
      testApiBtn.disabled = false;
    }
  });

  saveSettingsBtn.addEventListener('click', async () => {
    const selectedMode = document.querySelector('input[name="opMode"]:checked')?.value || 'auto';
    settings.apiUrl = apiUrlInput.value.trim() || 'http://localhost:5173/api/companion';
    settings.groqApiKey = groqKeyInput ? groqKeyInput.value.trim() : '';
    settings.geminiApiKey = geminiKeyInput ? geminiKeyInput.value.trim() : '';
    settings.opMode = selectedMode;
    settings.ttsRate = parseFloat(ttsRateSlider.value) || 1.0;

    await chrome.storage.local.set({ veratis_settings: settings });
    settingsModal.classList.add('hidden');
    checkBackendHealth();
  });
}

function openSettingsModal() {
  apiUrlInput.value = settings.apiUrl;
  if (groqKeyInput) groqKeyInput.value = settings.groqApiKey || '';
  if (geminiKeyInput) geminiKeyInput.value = settings.geminiApiKey || '';
  ttsRateSlider.value = settings.ttsRate;
  ttsRateVal.textContent = `${settings.ttsRate}x`;
  apiStatusMessage.textContent = '';

  chrome.storage.local.get(['overlayEnabled'], (res) => {
    const isOverlayOn = res.overlayEnabled !== false;
    updateOverlayToggleUI(isOverlayOn);
  });

  settingsModal.classList.remove('hidden');
}

/* ==========================================================================
   Action & Messaging Flow
   ========================================================================== */

async function triggerAction(actionName) {
  // If user typed something in composer, use that as input
  if (!currentContext.selectedText && !currentContext.pageText) {
    if (messageInput.value.trim()) {
      currentContext.selectedText = messageInput.value.trim();
      messageInput.value = '';
    } else if (!isRestrictedUrl(currentTab?.url)) {
      await extractFromTab('GET_SELECTION');
      if (!currentContext.selectedText) {
        await extractFromTab('GET_PAGE_TEXT');
      }
    }
  }

  // If still empty on a restricted page, guide the user cleanly
  if (!currentContext.selectedText && !currentContext.pageText && isRestrictedUrl(currentTab?.url)) {
    addMessage(
      'assistant',
      'You are currently on a Chrome system page (chrome://). Please switch to a regular website (like Wikipedia or BBC) to analyze page text, or enter text directly in the box below.'
    );
    return;
  }

  const actionLabels = {
    investigate: 'Investigate this content',
    explain: 'Explain in simple terms',
    challenge: 'Challenge assumptions and evidence',
    phishing: 'Check for phishing and scam indicators',
    claims: 'Find verifiable claims',
    'safe-reply': 'Draft a safe reply',
    summarize: 'Summarize this page'
  };

  const label = actionLabels[actionName] || actionName;
  addMessage('user', label);
  await executeAIRequest(actionName, '');
}

async function handleSendMessage() {
  const query = messageInput.value.trim();
  if (!query) return;

  messageInput.value = '';
  addMessage('user', query);
  await executeAIRequest('ask', query);
}

async function executeAIRequest(action, query) {
  welcomeState.classList.add('hidden');
  typingIndicator.classList.remove('hidden');
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const payload = {
    action,
    query,
    groqApiKey: settings.groqApiKey,
    geminiApiKey: settings.geminiApiKey,
    pageContext: {
      selectedText: currentContext.selectedText,
      pageText: currentContext.pageText,
      title: currentContext.title,
      url: currentContext.url,
      domain: currentContext.domain,
      wordCount: currentContext.wordCount,
      metadata: currentContext.metadata,
      headings: currentContext.headings,
      links: currentContext.links,
      forms: currentContext.forms
    },
    history: conversationHistory.slice(-4)
  };

  try {
    let result = null;

    if (settings.opMode !== 'demo') {
      // 1. Try local dev server or deployed backend
      try {
        const response = await fetch(settings.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          result = await response.json();
          updateModeBadge(result.isLiveAI);
        }
      } catch (networkErr) {
        console.warn('Backend call failed, trying direct Groq/Gemini fallback:', networkErr);
      }

      // 2. Direct client-side API fallback if backend is offline
      if (!result) {
        const isGroqKeyValid = settings.groqApiKey && settings.groqApiKey.startsWith('gsk_');
        const hasGeminiKey = Boolean(settings.geminiApiKey);
        const isGeminiFeature = action === 'summarize' || action === 'investigate' || action === 'phishing' || action === 'claims' || (currentContext.pageText && currentContext.pageText.length > 5000);

        if (isGeminiFeature) {
          // Gemini: Full-page scanning, form & link inspection, deep forensics
          if (hasGeminiKey) {
            try {
              result = await callDirectGemini(settings.geminiApiKey, action, query, currentContext);
            } catch (geminiErr) {
              console.warn('Direct Gemini call failed:', geminiErr);
            }
          }
          if (!result && isGroqKeyValid) {
            try {
              result = await callDirectGroq(settings.groqApiKey, action, query, currentContext);
            } catch (e) {
              console.warn('Direct Groq fallback failed:', e);
            }
          }
        } else {
          // Groq: Instant text explanation, skeptic challenges, safe replies, fast Q&A
          if (isGroqKeyValid) {
            try {
              result = await callDirectGroq(settings.groqApiKey, action, query, currentContext);
            } catch (e) {
              console.warn('Direct Groq call failed:', e);
            }
          }
          if (!result && hasGeminiKey) {
            try {
              result = await callDirectGemini(settings.geminiApiKey, action, query, currentContext);
            } catch (geminiErr) {
              console.warn('Direct Gemini fallback failed:', geminiErr);
            }
          }
        }

        if (result) {
          updateModeBadge(true);
        }
      }
    }

    // 3. Client-side deterministic fallback if all live AI options are unavailable
    if (!result) {
      result = clientFallbackAnalysis(action, query, currentContext);
      updateModeBadge(false);
    }

    typingIndicator.classList.add('hidden');
    addMessage('assistant', result.response);

  } catch (err) {
    typingIndicator.classList.add('hidden');
    addMessage('assistant', `An error occurred: ${err.message}. Operating in offline mode.`);
  }
}

/* ==========================================================================
   UI Message Rendering & Markdown Formatter
   ========================================================================== */

function addMessage(sender, text) {
  welcomeState.classList.add('hidden');

  const msgItem = document.createElement('div');
  msgItem.className = `message-item ${sender}`;

  const senderTag = document.createElement('span');
  senderTag.className = 'message-sender';
  senderTag.textContent = sender === 'user' ? 'YOU' : 'VERATIS';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerHTML = formatMarkdown(text);

  msgItem.appendChild(senderTag);
  msgItem.appendChild(bubble);

  // Add action tools for assistant messages
  if (sender === 'assistant') {
    const actionsRow = document.createElement('div');
    actionsRow.className = 'message-actions';

    // Copy Button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-tool-btn';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>
    `;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(text);
      copyBtn.querySelector('span').textContent = 'Copied';
      setTimeout(() => copyBtn.querySelector('span').textContent = 'Copy', 1500);
    });

    // TTS Speaker Button
    const ttsBtn = document.createElement('button');
    ttsBtn.className = 'action-tool-btn';
    ttsBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
      <span>Listen</span>
    `;
    ttsBtn.addEventListener('click', () => {
      speakText(text);
    });

    actionsRow.appendChild(copyBtn);
    actionsRow.appendChild(ttsBtn);
    msgItem.appendChild(actionsRow);
  }

  messagesList.appendChild(msgItem);
  conversationHistory.push({ sender, text });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Simple safe Markdown parser for assistant responses
function formatMarkdown(raw) {
  let html = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Blockquotes
  html = html.replace(/^>\s*(.*?)$/gm, '<blockquote>$1</blockquote>');

  // Unordered list items
  html = html.replace(/^[•*-]\s*(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

  // Line breaks to paragraphs
  const paragraphs = html.split(/\n\n+/);
  return paragraphs.map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
}

/* ==========================================================================
   Voice Dictation (STT) & Speech Playback (TTS)
   ========================================================================== */

function initVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceBtn.title = 'Voice dictation not supported in this browser';
    voiceBtn.style.opacity = '0.4';
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.interimResults = true;
  speechRecognition.lang = 'en-US';

  let baseInput = '';

  speechRecognition.onstart = () => {
    isRecordingVoice = true;
    baseInput = messageInput.value ? messageInput.value.trim() + ' ' : '';
    voiceBtn.classList.add('active');
    voiceBtn.title = 'Listening... Click to stop';
    messageInput.placeholder = 'Listening... Speak now';
  };

  speechRecognition.onresult = (event) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const res = event.results[i];
      if (res.isFinal) {
        final += res[0].transcript + ' ';
      } else {
        interim += res[0].transcript;
      }
    }
    if (final) {
      baseInput += final;
    }
    messageInput.value = (baseInput + interim).trimStart();
  };

  speechRecognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (event.error === 'not-allowed') {
      addMessage('assistant', 'Microphone access was denied. Please allow microphone permissions for the extension in your browser settings.');
    }
    stopRecording();
  };

  speechRecognition.onend = () => {
    stopRecording();
  };

  voiceBtn.addEventListener('click', async () => {
    if (isRecordingVoice) {
      if (speechRecognition) speechRecognition.stop();
      stopRecording();
    } else {
      try {
        // Request microphone permission first if mediaDevices is supported
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((t) => t.stop());
          } catch (micErr) {
            console.warn('Microphone permission error:', micErr);
            addMessage('assistant', 'Microphone access is required for voice dictation. Please allow microphone access in Chrome.');
            return;
          }
        }
        speechRecognition.start();
      } catch (e) {
        console.warn('Speech start error:', e);
        stopRecording();
      }
    }
  });
}

function stopRecording() {
  isRecordingVoice = false;
  voiceBtn.classList.remove('active');
  messageInput.placeholder = 'Ask a question or enter text to analyze...';
}

function speakText(text) {
  if (!window.speechSynthesis) return;

  stopSpeech();

  // Strip markdown formatting characters for clean speech
  const cleanSpeech = text
    .replace(/[*_#`>•]/g, ' ')
    .replace(/https?:\/\/\S+/g, 'link')
    .replace(/\s+/g, ' ')
    .trim();

  currentUtterance = new SpeechSynthesisUtterance(cleanSpeech);
  currentUtterance.rate = settings.ttsRate || 1.0;

  currentUtterance.onstart = () => {
    speechBanner.classList.remove('hidden');
  };

  currentUtterance.onend = () => {
    speechBanner.classList.add('hidden');
  };

  currentUtterance.onerror = () => {
    speechBanner.classList.add('hidden');
  };

  window.speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  speechBanner.classList.add('hidden');
}

/* ==========================================================================
   Direct Groq & Gemini Live AI Integration (Client-Side Backup)
   ========================================================================== */

async function callDirectGroq(apiKey, action, query, ctx) {
  const text = (ctx.selectedText || ctx.pageText || query || '').trim();
  if (!text) return null;

  const headingsText = ctx.headings?.length ? `Headings:\n${ctx.headings.slice(0, 6).map(h => `- ${h}`).join('\n')}\n` : '';
  const metaDesc = ctx.metadata?.description ? `Meta Description: ${ctx.metadata.description}\n` : '';

  const prompt = `You are VERATIS, a lightning-fast, high-precision digital-trust and verification AI.
Webpage: "${ctx.title || 'Webpage'}" (${ctx.url || ''})
${metaDesc}${headingsText}
Excerpt:
"${text.slice(0, 10000)}"

Action: "${action}". User query: "${query || action}".

CRITICAL FORMATTING RULES:
- Output MUST be extremely short, concise, and to the point.
- Maximum 2 to 3 bullet points or short sentences. Never exceed 70 words total.
- NO greetings, pleasantries, or introductory phrases.
- State the direct answer, verdict, or counter-point immediately.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are VERATIS. Output concise, plain-English digital-trust analysis in max 2-3 short bullet points without pleasantries.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 250
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const textOut = data.choices?.[0]?.message?.content;
  if (textOut) {
    return {
      response: textOut.trim(),
      isLiveAI: true,
      provider: 'Groq Direct (Llama 3.3 70B)'
    };
  }
  return null;
}

async function callDirectGemini(apiKey, action, query, ctx) {
  const text = (ctx.selectedText || ctx.pageText || query || '').trim();
  if (!text) return null;

  const headingsText = ctx.headings?.length ? `Headings:\n${ctx.headings.slice(0, 10).map(h => `- ${h}`).join('\n')}\n` : '';
  const metaDesc = ctx.metadata?.description ? `Meta Description: ${ctx.metadata.description}\n` : '';
  const formsText = ctx.forms?.length ? `Forms Detected: ${ctx.forms.map(f => f.hasPasswordField ? 'Login Password Form' : 'Input Form').join(', ')}\n` : '';

  const prompt = `You are VERATIS, a concise, high-precision digital-trust and verification AI analyzing webpage content.
Webpage: "${ctx.title || 'Webpage'}" (${ctx.url || ''})
${metaDesc}${headingsText}${formsText}
Content:
"${text.slice(0, 25000)}"

Action: "${action}". User query: "${query || action}".

CRITICAL FORMATTING RULES:
- Output MUST be extremely short, concise, and to the point.
- Maximum 2 to 3 bullet points or short sentences. Never exceed 70 words total.
- NO greetings, pleasantries, or introductory phrases.
- State the direct answer, verdict, or verification step immediately.`;

  const models = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 250 }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const textOut = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOut) {
          return {
            response: textOut.trim(),
            isLiveAI: true,
            provider: `Gemini Direct (${model})`
          };
        }
      }
    } catch (e) {
      console.warn(`Direct Gemini model ${model} failed:`, e);
    }
  }
  return null;
}

/* ==========================================================================
   Client-Side Fallback Analysis (Demo Mode) - Zero Emojis, Minimal, Crisp
   ========================================================================== */

function clientFallbackAnalysis(action, query, ctx) {
  const text = (ctx.selectedText || ctx.pageText || query || '').trim();
  const title = ctx.title || 'the webpage';
  const snippet = text.slice(0, 160);

  switch (action) {
    case 'explain':
      return {
        isLiveAI: false,
        response: `• **Core Idea:** Discusses ${title} ("${snippet.slice(0, 80)}...").\n• **Plain Meaning:** Descriptive overview without verified institutional accreditation.`
      };

    case 'investigate':
      return {
        isLiveAI: false,
        response: `• **Status:** Unverified third-party content from ${title}.\n• **Verification:** Lacks primary source citations, official datasets, or certified public records.`
      };

    case 'challenge':
      return {
        isLiveAI: false,
        response: `• **Premise:** Assumes assertions are factual without independent verification.\n• **Missing Proof:** No primary records or verifiable audit trails provided.`
      };

    case 'phishing':
      return {
        isLiveAI: false,
        response: `• **Threat Level:** Evaluated for urgent deadlines and credential harvesting.\n• **Action:** Verify domain against official registrar. Never enter credentials via external links.`
      };

    case 'claims':
      return {
        isLiveAI: false,
        response: `• **Claim 1:** "${snippet.slice(0, 90)}..." (Requires independent validation).\n• **Claim 2:** Assertions regarding specific figures lack secondary corroboration.`
      };

    case 'safe-reply':
      return {
        isLiveAI: false,
        response: `> "Thank you. Per security protocols, I cannot process requests or access external links without official verification through our company directory."`
      };

    case 'summarize':
      return {
        isLiveAI: false,
        response: `• **Page:** ${title}.\n• **Overview:** Covers "${snippet.slice(0, 100)}...". Confirm critical assertions via independent outlets.`
      };

    case 'ask':
    default:
      return {
        isLiveAI: false,
        response: `• **Answer:** Regarding "${query || 'Analysis'}": Content discusses "${snippet.slice(0, 90)}...".\n• **Tip:** Verify key numbers and source identity independently before acting.`
      };
  }
}
