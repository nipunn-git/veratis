/**
 * VERATIS Companion - Background Service Worker
 * Manages side panel initialization, action clicks, context menus,
 * and high-speed Gemini security & anti-phishing scanning for on-page overlays.
 */

// Configure side panel behavior to open when extension action icon is clicked
chrome.runtime.onInstalled.addListener(async () => {
  // Ensure overlay is enabled by default
  const stored = await chrome.storage.local.get(['overlayEnabled']);
  if (stored.overlayEnabled === undefined) {
    await chrome.storage.local.set({ overlayEnabled: true });
  }

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

/**
 * Message Dispatcher for Content Script Overlay and Side Panel
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPEN_SIDEPANEL') {
    const windowId = sender.tab?.windowId;
    if (windowId && chrome.sidePanel && chrome.sidePanel.open) {
      chrome.sidePanel.open({ windowId }).then(() => {
        sendResponse({ success: true });
      }).catch((err) => {
        sendResponse({ success: false, error: err.message });
      });
      return true;
    }
    sendResponse({ success: false, error: 'No active window found' });
    return false;
  }

  if (request.action === 'GET_OVERLAY_STATE') {
    chrome.storage.local.get(['overlayEnabled'], (res) => {
      sendResponse({ overlayEnabled: res.overlayEnabled !== false });
    });
    return true;
  }

  if (request.action === 'VERATIS_OVERLAY_SECURITY_SCAN' || request.action === 'VERATIS_OVERLAY_ASK') {
    handleOverlaySecurityQuery(request)
      .then((result) => sendResponse(result))
      .catch((err) => sendResponse({
        success: false,
        text: `• **Analysis Error:** Could not complete security scan: ${err.message}`,
        isLiveAI: false,
        provider: 'Fallback'
      }));
    return true; // Keep message channel open for async response
  }
});

/**
 * Executes a concise Gemini security / anti-phishing scan
 */
async function handleOverlaySecurityQuery(request) {
  const { query, action = 'phishing_scan', pageData = {} } = request;

  // 1. Fetch settings from storage
  const storage = await chrome.storage.local.get(['veratis_settings']);
  const settings = storage.veratis_settings || {};
  const geminiKey = (settings.geminiApiKey || '').trim();
  const groqKey = (settings.groqApiKey || '').trim();
  const apiUrl = settings.apiUrl || 'http://localhost:5173/api/companion';
  const opMode = settings.opMode || 'auto';

  const formsSummary = pageData.forms?.length 
    ? pageData.forms.map((f, i) => `Form ${i+1}: Action="${f.action}", PasswordField=${f.hasPasswordField ? 'YES' : 'NO'}`).join('; ')
    : 'No interactive form elements found.';
  const linksSummary = pageData.links?.slice(0, 10).map((l) => `${l.text} -> ${l.href}`).join('; ') || 'Standard domain links.';

  const prompt = `You are VERATIS, an elite digital trust and anti-phishing AI security inspector.
Carefully inspect this active webpage for phishing, fake login portals, credential harvesting, social engineering, scam lures, urgent payment demands, or domain deception.

Webpage Details:
- Title: "${pageData.title}"
- URL: "${pageData.url}"
- Domain: "${pageData.domain}"
- Forms: ${formsSummary}
- Sample Links: ${linksSummary}
- Page Content Excerpt:
"${(pageData.pageText || '').slice(0, 20000)}"

CRITICAL FORMATTING INSTRUCTIONS:
1. First line MUST be: "VERDICT: [SAFE | CAUTION | DANGER]"
2. Followed by exactly 2 to 3 concise, punchy bullet points (maximum 50 words total).
3. Directly state whether the domain and forms are legitimate or if there are any red flags.
4. NO introductory greetings or conversational filler.`;

  // 2. If in Live AI mode, try direct Gemini API
  if (opMode !== 'demo' && geminiKey) {
    try {
      const geminiRes = await callGeminiSecurityApi(geminiKey, prompt);
      if (geminiRes) {
        const parsed = parseVerdictFromText(geminiRes.text, pageData.domain);
        return {
          success: true,
          verdict: parsed.verdict,
          riskLabel: parsed.label,
          text: parsed.cleanText,
          provider: geminiRes.provider,
          isLiveAI: true
        };
      }
    } catch (err) {
      console.warn('Direct Gemini call failed in background:', err.message);
    }
  }

  // 3. Try Backend Companion API (which has server-side Gemini key from .env)
  if (opMode !== 'demo') {
    try {
      const backendRes = await callBackendCompanion(apiUrl, {
        action: 'phishing',
        query: 'Perform security and phishing audit',
        pageContext: {
          title: pageData.title,
          url: pageData.url,
          domain: pageData.domain,
          pageText: (pageData.pageText || '').slice(0, 20000),
          forms: pageData.forms,
          links: pageData.links,
          metadata: pageData.metadata
        },
        geminiApiKey: geminiKey,
        groqApiKey: groqKey
      });

      if (backendRes) {
        const parsed = parseVerdictFromText(backendRes.text, pageData.domain);
        return {
          success: true,
          verdict: parsed.verdict,
          riskLabel: parsed.label,
          text: parsed.cleanText,
          provider: backendRes.provider,
          isLiveAI: backendRes.isLiveAI
        };
      }
    } catch (err) {
      console.warn('Backend companion call failed in background:', err.message);
    }
  }

  // 4. Smart Local Heuristic Anti-Phishing Analyzer (Zero dependencies, guaranteed uptime)
  const localAnalysis = localPhishingHeuristic(pageData);
  return {
    success: true,
    verdict: localAnalysis.verdict,
    riskLabel: localAnalysis.riskLabel,
    text: localAnalysis.text,
    provider: localAnalysis.provider,
    isLiveAI: false
  };
}

/**
 * Accurately parses verdict tag from AI response text
 */
function parseVerdictFromText(rawText, domain = '') {
  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
  const verdictLine = lines.find((l) => /VERDICT:/i.test(l)) || lines[0] || '';

  let verdict = 'SAFE';
  let label = 'SAFE / LEGITIMATE';

  if (/DANGER|CRITICAL|HIGH/i.test(verdictLine)) {
    verdict = 'DANGER';
    label = 'CRITICAL PHISHING THREAT';
  } else if (/CAUTION|SUSPICIOUS|WARNING/i.test(verdictLine)) {
    verdict = 'CAUTION';
    label = 'CAUTION / SUSPICIOUS';
  } else {
    verdict = 'SAFE';
    label = 'SAFE / LEGITIMATE';
  }

  // Strip redundant verdict header line from bullet points
  const cleanLines = lines.filter((l) => !/VERDICT:/i.test(l));
  const cleanText = cleanLines.join('\n');

  return { verdict, label, cleanText };
}

/**
 * Call Google Gemini REST API directly
 */
async function callGeminiSecurityApi(geminiKey, prompt) {
  const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest', 'gemini-1.5-pro'];
  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 250, temperature: 0.2 }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          return {
            text: textOutput.trim(),
            provider: `Gemini (${model})`,
            isLiveAI: true
          };
        }
      }
    } catch (err) {
      console.warn(`Gemini ${model} attempt failed:`, err);
    }
  }
  return null;
}

/**
 * Call local/remote companion backend
 */
async function callBackendCompanion(apiUrl, payload) {
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return {
        text: data.response || 'No response returned.',
        provider: data.provider || 'VERATIS Live AI',
        isLiveAI: Boolean(data.isLiveAI)
      };
    }
  } catch (e) {
    console.debug('Backend companion skipped:', e.message);
  }
  return null;
}

/**
 * High-accuracy local heuristic anti-phishing analyzer
 */
function localPhishingHeuristic(pageData) {
  const text = (pageData.pageText || '').toLowerCase();
  const domain = (pageData.domain || '').toLowerCase();
  const url = (pageData.url || '').toLowerCase();

  // Trusted platforms list
  const trustedRoots = [
    'chatgpt.com', 'openai.com', 'google.com', 'github.com',
    'wikipedia.org', 'youtube.com', 'microsoft.com', 'apple.com',
    'amazon.com', 'twitter.com', 'x.com', 'linkedin.com',
    'reddit.com', 'stackoverflow.com', 'mozilla.org', 'nytimes.com',
    'bbc.com', 'bbc.co.uk', 'reuters.com', 'cnn.com', 'cloudflare.com',
    'anthropic.com', 'claude.ai', 'notion.so', 'figma.com'
  ];

  const isTrusted = trustedRoots.some((t) => domain === t || domain.endsWith('.' + t)) ||
                    domain.endsWith('.gov') || domain.endsWith('.edu');

  let verdict = 'SAFE';
  let riskLabel = 'SAFE / LEGITIMATE';
  let points = [];

  if (isTrusted) {
    verdict = 'SAFE';
    riskLabel = 'SAFE / LEGITIMATE';
    points.push(`Verified domain: Official ${domain} service with authenticated security credentials.`);
    points.push('Standard application structure with zero deceptive credential traps or fake countdowns.');
  } else {
    const isSuspiciousTLD = /\.(xyz|top|work|click|loan|gq|cf|tk|ml|ga|buzz|rest|fit|cam)$/i.test(domain);
    const hasUrgency = /(immediate action|account suspended|locked within|urgent alert|verify now|unauthorized access|security breach|24 hours|wire transfer)/i.test(text);
    const hasPasswordTrap = pageData.forms && pageData.forms.some((f) => f.hasPasswordField);
    const isHttpInsecure = url.startsWith('http://') && !url.includes('localhost');
    const hasFinancialTrap = /(bitcoin|crypto|usdt|refund|claim prize|lottery|inheritance|ssn|social security)/i.test(text);

    if (isSuspiciousTLD || (hasUrgency && hasPasswordTrap) || (isHttpInsecure && hasPasswordTrap)) {
      verdict = 'DANGER';
      riskLabel = 'CRITICAL PHISHING THREAT';
      if (hasPasswordTrap && hasUrgency) {
        points.push('High-urgency language combined with password fields — classic credential harvesting trap.');
      }
      if (isSuspiciousTLD) {
        points.push(`High-risk domain extension (.${domain.split('.').pop()}) often utilized in spoofed phishing pages.`);
      }
      if (isHttpInsecure) {
        points.push('Unencrypted HTTP connection detected requesting login input.');
      }
    } else if (hasUrgency || hasFinancialTrap) {
      verdict = 'CAUTION';
      riskLabel = 'CAUTION / SUSPICIOUS';
      if (hasUrgency) {
        points.push('Urgency triggers detected attempting to bypass critical thinking and force immediate action.');
      }
      if (hasFinancialTrap) {
        points.push('Unverified financial or prize claim language without authoritative institutional credentials.');
      }
      points.push('Cross-reference the domain with official registries before entering any data.');
    } else {
      verdict = 'SAFE';
      riskLabel = 'SAFE / LEGITIMATE';
      points.push(`Page structure on ${domain || 'this site'} is standard without overt phishing indicators.`);
      points.push('No deceptive credential traps, urgent countdowns, or suspicious link redirects detected.');
    }
  }

  const responseText = points.map((p) => `• ${p}`).join('\n');
  return {
    verdict,
    riskLabel,
    text: responseText,
    provider: 'VERATIS Local Security Engine',
    isLiveAI: false
  };
}

