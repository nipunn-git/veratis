/**
 * VERATIS Companion - Side Panel Controller
 * Handles context extraction, action chips, real-time AI API integration,
 * voice speech-to-text dictation, and text-to-speech audio playback.
 */

// Global State
let currentTab = null;
let currentContext = {
  selectedText: '',
  pageText: '',
  title: '',
  url: ''
};
let conversationHistory = [];
let speechRecognition = null;
let isRecordingVoice = false;
let currentUtterance = null;

// Settings (persisted in chrome.storage.local)
let settings = {
  apiUrl: 'http://localhost:5173/api/companion',
  opMode: 'auto', // 'auto' | 'demo'
  ttsRate: 1.0
};

// DOM Elements
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
const testApiBtn = document.getElementById('testApiBtn');
const apiStatusMessage = document.getElementById('apiStatusMessage');
const ttsRateSlider = document.getElementById('ttsRateSlider');
const ttsRateVal = document.getElementById('ttsRateVal');
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
});

// Load settings from storage
async function loadSettings() {
  try {
    const stored = await chrome.storage.local.get(['veratis_settings']);
    if (stored.veratis_settings) {
      settings = { ...settings, ...stored.veratis_settings };
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }

  apiUrlInput.value = settings.apiUrl;
  ttsRateSlider.value = settings.ttsRate;
  ttsRateVal.textContent = `${settings.ttsRate}x`;
  
  const radio = document.querySelector(`input[name="opMode"][value="${settings.opMode}"]`);
  if (radio) radio.checked = true;
}

// Refresh active browser tab information
async function refreshActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs[0]) {
      currentTab = tabs[0];
      const domain = currentTab.url ? new URL(currentTab.url).hostname : 'Webpage';
      pageTitleLabel.textContent = `${domain} · ${currentTab.title || 'Active Tab'}`;
      currentContext.title = currentTab.title || '';
      currentContext.url = currentTab.url || '';
    } else {
      pageTitleLabel.textContent = 'No active tab detected';
    }
  } catch (e) {
    pageTitleLabel.textContent = 'Active tab protected or restricted';
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
      const data = await res.json();
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
    modeText.textContent = 'DEMO MODE';
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

async function extractFromTab(actionType) {
  if (!currentTab || !currentTab.id) {
    await refreshActiveTab();
  }
  if (!currentTab || !currentTab.id) {
    addMessage('assistant', '⚠️ Could not access the active tab. Please make sure a normal webpage is open.');
    return;
  }

  // Attempt message passing first
  try {
    chrome.tabs.sendMessage(currentTab.id, { action: actionType }, (response) => {
      if (chrome.runtime.lastError || !response) {
        // Fallback: inject content script via scripting API
        injectAndExtract(actionType);
      } else {
        handleExtractionResponse(response, actionType);
      }
    });
  } catch (e) {
    injectAndExtract(actionType);
  }
}

async function injectAndExtract(actionType) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      files: ['content.js']
    });

    chrome.tabs.sendMessage(currentTab.id, { action: actionType }, (response) => {
      if (response) {
        handleExtractionResponse(response, actionType);
      } else {
        addMessage('assistant', 'ℹ️ No text found or page is restricted (e.g. chrome:// internal pages).');
      }
    });
  } catch (err) {
    console.warn('Script injection failed:', err);
    addMessage('assistant', '⚠️ Cannot read this webpage due to browser security restrictions on internal pages.');
  }
}

function handleExtractionResponse(response, actionType) {
  currentContext.title = response.title || currentTab.title || 'Page';
  currentContext.url = response.url || currentTab.url || '';

  if (actionType === 'GET_SELECTION') {
    if (response.selectedText && response.selectedText.trim()) {
      setCapturedContext(response.selectedText, 'selection');
    } else {
      addMessage('assistant', 'ℹ️ No text is currently highlighted on the webpage. Highlight some text with your mouse and click "Get Selection", or click "Read Page".');
    }
  } else {
    if (response.pageText && response.pageText.trim()) {
      setCapturedContext(response.pageText, 'page');
    } else {
      addMessage('assistant', 'ℹ️ Could not find readable main content on this page.');
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
  snippetText.textContent = text;
  contextSnippet.classList.remove('hidden');

  composerContextTag.classList.remove('hidden');
  composerContextLabel.textContent = `${type === 'selection' ? 'Selected' : 'Page'}: ${wordCount} words`;
}

function clearCapturedContext() {
  currentContext.selectedText = '';
  currentContext.pageText = '';
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
    apiStatusMessage.textContent = 'Testing...';
    apiStatusMessage.className = 'api-status-msg';

    try {
      const url = apiUrlInput.value.trim().replace('/companion', '/health');
      const res = await fetch(url);
      if (res.ok) {
        apiStatusMessage.textContent = '✓ Connected successfully!';
        apiStatusMessage.className = 'api-status-msg success';
      } else {
        apiStatusMessage.textContent = `✗ HTTP Error ${res.status}`;
        apiStatusMessage.className = 'api-status-msg error';
      }
    } catch (e) {
      apiStatusMessage.textContent = '✗ Connection failed (offline)';
      apiStatusMessage.className = 'api-status-msg error';
    } finally {
      testApiBtn.disabled = false;
    }
  });

  saveSettingsBtn.addEventListener('click', async () => {
    const selectedMode = document.querySelector('input[name="opMode"]:checked')?.value || 'auto';
    settings.apiUrl = apiUrlInput.value.trim() || 'http://localhost:5173/api/companion';
    settings.opMode = selectedMode;
    settings.ttsRate = parseFloat(ttsRateSlider.value) || 1.0;

    await chrome.storage.local.set({ veratis_settings: settings });
    settingsModal.classList.add('hidden');
    checkBackendHealth();
  });
}

function openSettingsModal() {
  apiUrlInput.value = settings.apiUrl;
  ttsRateSlider.value = settings.ttsRate;
  ttsRateVal.textContent = `${settings.ttsRate}x`;
  apiStatusMessage.textContent = '';
  settingsModal.classList.remove('hidden');
}

/* ==========================================================================
   Action & Messaging Flow
   ========================================================================== */

async function triggerAction(actionName) {
  // If no text is selected or captured yet, try grabbing selection or page first
  if (!currentContext.selectedText && !currentContext.pageText) {
    await extractFromTab('GET_SELECTION');
    if (!currentContext.selectedText) {
      await extractFromTab('GET_PAGE_TEXT');
    }
  }

  const actionLabels = {
    investigate: '🔍 Investigate this content',
    explain: '💡 Explain in simple terms',
    challenge: '⚔️ Challenge assumptions & proof',
    phishing: '🎣 Check for phishing & scam signals',
    claims: '📋 Find verifiable claims',
    'safe-reply': '🛡️ Draft a safe reply',
    summarize: '📄 Summarize this page'
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
    pageContext: {
      selectedText: currentContext.selectedText,
      pageText: currentContext.pageText,
      title: currentContext.title,
      url: currentContext.url
    },
    history: conversationHistory.slice(-4)
  };

  try {
    let result = null;

    if (settings.opMode !== 'demo') {
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
        console.warn('Backend call failed, using client fallback:', networkErr);
      }
    }

    // Client-side fallback if backend failed or in demo mode
    if (!result) {
      result = clientFallbackAnalysis(action, query, currentContext);
      updateModeBadge(false);
    }

    typingIndicator.classList.add('hidden');
    addMessage('assistant', result.response);

  } catch (err) {
    typingIndicator.classList.add('hidden');
    addMessage('assistant', `⚠️ An error occurred during analysis: ${err.message}. Running in offline fallback.`);
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
  senderTag.textContent = sender === 'user' ? 'YOU' : 'VERATIS COMPANION';

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
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>
    `;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(text);
      copyBtn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => copyBtn.querySelector('span').textContent = 'Copy', 1500);
    });

    // TTS Speaker Button
    const ttsBtn = document.createElement('button');
    ttsBtn.className = 'action-tool-btn';
    ttsBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

  speechRecognition.onstart = () => {
    isRecordingVoice = true;
    voiceBtn.classList.add('active');
    messageInput.placeholder = 'Listening... speak now';
  };

  speechRecognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    messageInput.value = transcript;
  };

  speechRecognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    stopRecording();
  };

  speechRecognition.onend = () => {
    stopRecording();
  };

  voiceBtn.addEventListener('click', () => {
    if (isRecordingVoice) {
      speechRecognition.stop();
    } else {
      try {
        speechRecognition.start();
      } catch (e) {
        console.warn('Speech start error:', e);
      }
    }
  });
}

function stopRecording() {
  isRecordingVoice = false;
  voiceBtn.classList.remove('active');
  messageInput.placeholder = 'Ask a question or select an action...';
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
   Client-Side Fallback Analysis (Demo Mode)
   ========================================================================== */

function clientFallbackAnalysis(action, query, ctx) {
  const text = (ctx.selectedText || ctx.pageText || query || '').trim();
  const title = ctx.title || 'the webpage';
  const snippet = text.slice(0, 160);

  switch (action) {
    case 'explain':
      return {
        isLiveAI: false,
        response: `**Simple Summary:**\n\nThis content is talking about: "${snippet}..."\n\n**Key Takeaways:**\n• **Main Point:** It provides information regarding ${title}.\n• **What to Know:** Written clearly without complex jargon.\n• **Context:** Make sure to cross-check claims with official sources.`
      };

    case 'investigate':
      return {
        isLiveAI: false,
        response: `**VERATIS Digital Trust Investigation:**\n\n• **Content Checked:** "${snippet}..."\n• **Page:** ${title}\n\n**Findings:**\n1. **Verification Status:** Unverified third-party content.\n2. **Language Check:** Look out for false urgency, extreme claims, or missing author names.\n3. **Recommendation:** Seek independent confirmation before sharing or making decisions.`
      };

    case 'challenge':
      return {
        isLiveAI: false,
        response: `**Skeptic's Challenge:**\n\n1. **Unproven Claims:** What evidence proves this statement is true?\n2. **Missing Proof:** No primary source links or verifiable public documents are cited.\n3. **Alternate Possibility:** This could be selective framing or unverified speculation.`
      };

    case 'phishing':
      return {
        isLiveAI: false,
        response: `**Phishing & Scam Check:**\n\n• **Safety Rule:** Never share 2FA codes, passwords, or send money to unverified contacts.\n• **Domain Check:** Verify that the website address in your browser bar is genuine.\n• **Urgency Alert:** Scammers often rush you with fake deadlines to prevent you from double-checking.`
      };

    case 'claims':
      return {
        isLiveAI: false,
        response: `**Claims Requiring Verification:**\n\n1. "${snippet}..."\n   ↳ *Check if official agencies or reputable news wires have reported this.*\n2. Look up any named people or numbers mentioned in the text.`
      };

    case 'safe-reply':
      return {
        isLiveAI: false,
        response: `**Recommended Safe Reply:**\n\n> "Thank you for reaching out. Per our security guidelines, I cannot process requests or click external links without verbal verification through our official company channels."`
      };

    case 'summarize':
      return {
        isLiveAI: false,
        response: `**Page Summary for ${title}:**\n\n• **Topic:** Discusses ${snippet}...\n• **Source:** Read from active tab.\n• **Advice:** Check the author and publication date for freshness.`
      };

    case 'ask':
    default:
      return {
        isLiveAI: false,
        response: `Regarding: *"${query || 'Analyze this content'}"*\n\nBased on **${title}** ("${snippet}..."): The content presents these details for consideration. Remember to confirm important actions through verified direct channels.`
      };
  }
}
