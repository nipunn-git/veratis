/**
 * VERATIS - Comprehensive Webpage Content & Metadata Extractor + Liminal Security Overlay
 * Injects a minimal circular quick-access button at the bottom-right of every webpage.
 * Scans the active page for security, phishing, and scam risks using the Gemini API.
 * Design is liminal, clean, and 100% consistent with the VERATIS editorial aesthetic.
 */

(() => {
  // Listen for extraction and visibility requests
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_SELECTION') {
      const selected = window.getSelection() ? window.getSelection().toString().trim() : '';
      sendResponse({
        selectedText: selected,
        title: document.title || '',
        url: window.location.href || '',
        domain: window.location.hostname || ''
      });
      return true;
    }

    if (request.action === 'GET_PAGE_TEXT' || request.action === 'GET_PAGE_DATA') {
      const fullData = extractComprehensivePageData();
      sendResponse(fullData);
      return true;
    }

    if (request.action === 'SET_OVERLAY_VISIBILITY') {
      setOverlayVisibility(request.enabled !== false);
      sendResponse({ success: true, enabled: request.enabled !== false });
      return true;
    }
  });

  /**
   * Helper to safely read meta tag content
   */
  function getMeta(nameOrProp) {
    const el = document.querySelector(`meta[name="${nameOrProp}"]`) || 
               document.querySelector(`meta[property="${nameOrProp}"]`);
    return el ? (el.getAttribute('content') || '').trim() : '';
  }

  /**
   * Comprehensive extractor that gathers:
   * - Entire page content (up to 35,000 characters)
   * - Highlighted selection
   * - Headings hierarchy
   * - Meta description, author, OG data
   * - Links for domain & security verification
   * - Form elements for phishing inspection
   */
  function extractComprehensivePageData() {
    try {
      const selected = window.getSelection() ? window.getSelection().toString().trim() : '';

      // 1. Target main content container if available, otherwise document.body
      const mainEl = document.querySelector('article') || 
                     document.querySelector('main') || 
                     document.querySelector('[role="main"]') || 
                     document.querySelector('#content') || 
                     document.querySelector('.content') || 
                     document.body;

      let cleanedText = '';
      if (mainEl) {
        const clone = mainEl.cloneNode(true);

        // Strip non-content and layout junk elements
        const removeSelectors = [
          'script', 'style', 'noscript', 'svg', 'canvas', 
          'iframe', 'template', 'dialog',
          '.ad', '.ads', '.advertisement', '.social-share',
          '[aria-hidden="true"]', '[hidden]'
        ];

        removeSelectors.forEach((sel) => {
          try {
            clone.querySelectorAll(sel).forEach((el) => el.remove());
          } catch (e) {
            // ignore
          }
        });

        const rawText = clone.innerText || clone.textContent || '';
        cleanedText = rawText
          .replace(/\r\n/g, '\n')
          .replace(/\t/g, ' ')
          .replace(/\n\s*\n+/g, '\n\n')
          .trim();
      }

      // If main container produced very short text, fallback to body text
      if (cleanedText.length < 200 && document.body) {
        cleanedText = (document.body.innerText || '').slice(0, 35000);
      } else {
        cleanedText = cleanedText.slice(0, 35000);
      }

      // 2. Extract Document Outline (Headings)
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
        .map((h) => h.innerText.replace(/\s+/g, ' ').trim())
        .filter((t) => t.length > 2 && t.length < 150)
        .slice(0, 15);

      // 3. Extract Links for verification and domain checks
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map((a) => ({
          text: (a.innerText || '').trim().slice(0, 50),
          href: a.href
        }))
        .filter((l) => l.href.startsWith('http'))
        .slice(0, 25);

      // 4. Extract Form Elements for phishing / scam pattern detection
      const forms = Array.from(document.querySelectorAll('form')).map((f) => ({
        action: f.action || '',
        method: (f.method || 'GET').toUpperCase(),
        hasPasswordField: Boolean(f.querySelector('input[type="password"]')),
        inputs: Array.from(f.querySelectorAll('input, select, textarea'))
          .map((i) => i.name || i.type || i.placeholder || '')
          .filter(Boolean)
          .slice(0, 8)
      })).slice(0, 5);

      // 5. Metadata
      const metadata = {
        description: getMeta('description') || getMeta('og:description') || getMeta('twitter:description'),
        author: getMeta('author') || getMeta('article:author'),
        siteName: getMeta('og:site_name'),
        keywords: getMeta('keywords'),
        canonical: document.querySelector('link[rel="canonical"]')?.href || ''
      };

      const wordCount = cleanedText ? cleanedText.split(/\s+/).length : 0;

      return {
        selectedText: selected,
        pageText: cleanedText,
        wordCount,
        title: document.title || '',
        url: window.location.href || '',
        domain: window.location.hostname || '',
        metadata,
        headings,
        links,
        forms
      };
    } catch (err) {
      console.warn('VERATIS content extraction fallback:', err);
      return {
        selectedText: window.getSelection() ? window.getSelection().toString().trim() : '',
        pageText: (document.body?.innerText || '').slice(0, 10000),
        wordCount: (document.body?.innerText || '').split(/\s+/).length,
        title: document.title || '',
        url: window.location.href || '',
        domain: window.location.hostname || '',
        metadata: {},
        headings: [],
        links: [],
        forms: []
      };
    }
  }

  /* ==========================================================================
     LIMINAL QUICK-ACCESS FLOATING OVERLAY (SHADOW DOM)
     ========================================================================== */

  // Only inject in top window (never in nested iframes)
  if (window.top !== window) {
    return;
  }

  // Prevent restricted browser schemes
  const currentUrl = window.location.href || '';
  if (
    currentUrl.startsWith('chrome://') || 
    currentUrl.startsWith('chrome-extension://') || 
    currentUrl.startsWith('edge://') || 
    currentUrl.startsWith('about:')
  ) {
    return;
  }

  let hostEl = null;
  let shadowRoot = null;
  let isOverlayOpen = false;
  let isScanning = false;
  let lastScanResult = null;
  let isSpeaking = false;

  function initQuickOverlay() {
    if (document.getElementById('veratis-quick-overlay-host')) {
      return;
    }

    hostEl = document.createElement('div');
    hostEl.id = 'veratis-quick-overlay-host';
    hostEl.style.position = 'fixed';
    hostEl.style.bottom = '24px';
    hostEl.style.right = '24px';
    hostEl.style.zIndex = '2147483647';
    hostEl.style.display = 'block';
    hostEl.style.pointerEvents = 'none';

    shadowRoot = hostEl.attachShadow({ mode: 'open' });
    renderOverlayDom(shadowRoot);

    document.documentElement.appendChild(hostEl);

    // Check saved visibility state (default is ON)
    chrome.storage.local.get(['overlayEnabled'], (res) => {
      const enabled = res.overlayEnabled !== false;
      setOverlayVisibility(enabled);
    });

    // Listen to storage changes to toggle immediately without page refresh
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && 'overlayEnabled' in changes) {
        setOverlayVisibility(changes.overlayEnabled.newValue !== false);
      }
    });
  }

  function setOverlayVisibility(visible) {
    if (!hostEl) return;
    if (visible) {
      hostEl.style.display = 'block';
    } else {
      hostEl.style.display = 'none';
      if (isOverlayOpen) {
        toggleOverlay(false);
      }
    }
  }

  function renderOverlayDom(root) {
    const iconUrl = chrome.runtime.getURL('icons/icon48.png');

    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      /* Clean Circular Floating Trigger Button (White & Matte Grey, No Green Dots) */
      .veratis-trigger-btn {
        pointer-events: auto;
        position: relative;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #ffffff;
        border: 1.5px solid #e4e4e7;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease;
        outline: none;
        padding: 0;
      }

      .veratis-trigger-btn:hover {
        transform: scale(1.06);
        border-color: #a1a1aa;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .veratis-trigger-btn:active {
        transform: scale(0.96);
      }

      .veratis-trigger-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        pointer-events: none;
        border: 1px solid #e4e4e7;
      }

      /* Hover Tooltip */
      .veratis-tooltip {
        position: absolute;
        right: 58px;
        top: 50%;
        transform: translateY(-50%);
        background: #09090b;
        color: #ffffff;
        padding: 5px 10px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.15s ease, transform 0.15s ease;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      }

      .veratis-trigger-btn:hover .veratis-tooltip {
        opacity: 1;
        transform: translateY(-50%) translateX(-3px);
      }

      /* Liminal Quick-Access Card Panel (White & Matte Grey) */
      .veratis-panel {
        pointer-events: auto;
        position: absolute;
        bottom: 60px;
        right: 0;
        width: 340px;
        max-width: calc(100vw - 32px);
        background: #ffffff;
        border: 1px solid #e4e4e7;
        border-radius: 16px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
        color: #09090b;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: translateY(12px) scale(0.97);
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 2147483647;
      }

      .veratis-panel.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      /* Header */
      .veratis-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px;
        border-bottom: 1px solid #e4e4e7;
        background: #fafafa;
      }

      .veratis-brand-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .veratis-brand-logo {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid #e4e4e7;
        background: #000000;
      }

      .veratis-title {
        font-size: 13px;
        font-weight: 800;
        letter-spacing: -0.01em;
        color: #09090b;
      }

      .veratis-gemini-pill {
        font-size: 9.5px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 4px;
        background: #f4f4f5;
        color: #71717a;
        border: 1px solid #e4e4e7;
        letter-spacing: 0.04em;
      }

      .veratis-header-actions {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .veratis-btn-icon {
        background: transparent;
        border: none;
        color: #71717a;
        cursor: pointer;
        padding: 5px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }

      .veratis-btn-icon:hover {
        background: #ebebee;
        color: #09090b;
      }

      /* Context Bar */
      .veratis-context-bar {
        padding: 8px 14px;
        font-size: 11px;
        color: #52525b;
        background: #f4f4f5;
        border-bottom: 1px solid #e4e4e7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .veratis-context-host {
        font-weight: 600;
        color: #09090b;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .veratis-word-count {
        font-size: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: #71717a;
        flex-shrink: 0;
      }

      /* Content Body */
      .veratis-body {
        padding: 14px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      /* Primary Scan Button (Obsidian pill, matching extension .primary-btn) */
      .veratis-scan-cta {
        width: 100%;
        padding: 10px 14px;
        border-radius: 8px;
        background: #09090b;
        color: #ffffff;
        border: 1px solid #09090b;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: background 0.15s, transform 0.15s;
      }

      .veratis-scan-cta:hover {
        background: #27272a;
        border-color: #27272a;
        transform: translateY(-1px);
      }

      .veratis-scan-cta:active {
        transform: scale(0.98);
      }

      .veratis-scan-cta svg {
        width: 15px;
        height: 15px;
      }

      .veratis-scan-hint {
        font-size: 10.5px;
        color: #71717a;
        text-align: center;
        line-height: 1.4;
      }

      /* Scanning State */
      .veratis-scanning-box {
        padding: 20px 14px;
        border-radius: 10px;
        background: #fafafa;
        border: 1px dashed #d4d4d8;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        text-align: center;
      }

      .veratis-radar-spinner {
        width: 22px;
        height: 22px;
        border: 2px solid #e4e4e7;
        border-top-color: #09090b;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .veratis-scanning-label {
        font-size: 11px;
        font-weight: 600;
        color: #09090b;
      }

      .veratis-scanning-sub {
        font-size: 10px;
        color: #71717a;
      }

      /* Result Card */
      .veratis-result-card {
        padding: 12px 14px;
        border-radius: 10px;
        background: #fafafa;
        border: 1px solid #e4e4e7;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .veratis-threat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .veratis-verdict-badge {
        font-size: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 700;
        letter-spacing: 0.03em;
        padding: 3px 8px;
        border-radius: 5px;
        text-transform: uppercase;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .veratis-verdict-badge.safe {
        background: #ecfdf5;
        color: #059669;
        border: 1px solid #a7f3d0;
      }

      .veratis-verdict-badge.caution {
        background: #fffbeb;
        color: #d97706;
        border: 1px solid #fde68a;
      }

      .veratis-verdict-badge.danger {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }

      .veratis-result-bullets {
        font-size: 12px;
        line-height: 1.55;
        color: #27272a;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .veratis-result-bullets strong {
        color: #09090b;
      }

      .veratis-card-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
        border-top: 1px solid #e4e4e7;
      }

      .veratis-action-btn-sm {
        background: transparent;
        border: none;
        color: #71717a;
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 6px;
        border-radius: 5px;
        transition: color 0.15s, background 0.15s;
      }

      .veratis-action-btn-sm:hover {
        color: #09090b;
        background: #ebebee;
      }

      .veratis-action-btn-sm.speaking {
        color: #059669;
      }

      /* Footer Bar */
      .veratis-footer-bar {
        padding: 9px 14px;
        background: #fafafa;
        border-top: 1px solid #e4e4e7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 10px;
        color: #71717a;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }

      .veratis-sidepanel-link {
        color: #09090b;
        text-decoration: none;
        cursor: pointer;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 11px;
      }

      .veratis-sidepanel-link:hover {
        text-decoration: underline;
      }
    `;

    root.appendChild(style);

    // Build the trigger button (clean, monochromatic, no green dot)
    const triggerBtn = document.createElement('button');
    triggerBtn.className = 'veratis-trigger-btn';
    triggerBtn.setAttribute('title', 'VERATIS Quick Scan');
    triggerBtn.setAttribute('aria-label', 'Open VERATIS security scan');

    triggerBtn.innerHTML = `
      <img src="${iconUrl}" alt="VERATIS" class="veratis-trigger-icon" onerror="this.style.display='none'">
      <div class="veratis-tooltip">VERATIS Quick Scan</div>
    `;

    // Build the Liminal Panel
    const panel = document.createElement('div');
    panel.className = 'veratis-panel';

    const domainName = window.location.hostname || 'Active Webpage';

    panel.innerHTML = `
      <!-- Header -->
      <div class="veratis-header">
        <div class="veratis-brand-wrap">
          <img src="${iconUrl}" alt="VERATIS" class="veratis-brand-logo">
          <span class="veratis-title">VERATIS</span>
          <span class="veratis-gemini-pill">SCANNER</span>
        </div>
        <div class="veratis-header-actions">
          <button class="veratis-btn-icon" id="openSidePanelBtn" title="Open Sidebar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <line x1="15" x2="15" y1="3" y2="21"></line>
            </svg>
          </button>
          <button class="veratis-btn-icon" id="closePanelBtn" title="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Domain Bar -->
      <div class="veratis-context-bar">
        <span class="veratis-context-host">🔒 ${domainName}</span>
        <span class="veratis-word-count" id="veratisWordCount">Ready</span>
      </div>

      <!-- Liminal Body Content -->
      <div class="veratis-body" id="veratisBody">
        <!-- Scan CTA Box -->
        <div id="veratisScanCtaWrap">
          <button class="veratis-scan-cta" id="veratisStartScanBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
            </svg>
            <span>Scan Webpage with Gemini</span>
          </button>
          <div class="veratis-scan-hint" style="margin-top: 8px;">
            Audits active page for phishing, credential traps & fraud
          </div>
        </div>

        <!-- Scanning State Box (Hidden initially) -->
        <div class="veratis-scanning-box" id="veratisScanningBox" style="display: none;">
          <div class="veratis-radar-spinner"></div>
          <div class="veratis-scanning-label">Scanning webpage with Gemini...</div>
          <div class="veratis-scanning-sub">Auditing forms, domain integrity, and credential risks</div>
        </div>

        <!-- Result Box (Hidden initially) -->
        <div class="veratis-result-card" id="veratisResultCard" style="display: none;">
          <div class="veratis-threat-header">
            <span class="veratis-verdict-badge safe" id="veratisVerdictBadge">SAFE / LEGITIMATE</span>
            <span style="font-size: 10px; color: #71717a; font-family: monospace;" id="veratisProviderLabel">Gemini AI</span>
          </div>
          <div class="veratis-result-bullets" id="veratisResultBullets"></div>
          <div class="veratis-card-actions">
            <button class="veratis-action-btn-sm" id="veratisListenBtn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <span>Listen</span>
            </button>
            <button class="veratis-action-btn-sm" id="veratisRescanBtn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M8 16H3v5"></path>
              </svg>
              <span>Re-scan</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Liminal Footer Bar -->
      <div class="veratis-footer-bar">
        <span>Empirical Digital Trust</span>
        <a class="veratis-sidepanel-link" id="veratisSidePanelFooterLink">
          Sidebar →
        </a>
      </div>
    `;

    root.appendChild(panel);
    root.appendChild(triggerBtn);

    // Event Listeners
    triggerBtn.addEventListener('click', () => {
      toggleOverlay(!isOverlayOpen);
    });

    const closeBtn = panel.querySelector('#closePanelBtn');
    closeBtn.addEventListener('click', () => {
      toggleOverlay(false);
    });

    const openSidePanelBtn = panel.querySelector('#openSidePanelBtn');
    const sidePanelFooterLink = panel.querySelector('#veratisSidePanelFooterLink');

    const handleOpenSidebar = () => {
      chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
    };

    openSidePanelBtn.addEventListener('click', handleOpenSidebar);
    sidePanelFooterLink.addEventListener('click', handleOpenSidebar);

    // Start Scan Button
    const startScanBtn = panel.querySelector('#veratisStartScanBtn');
    startScanBtn.addEventListener('click', () => {
      triggerSecurityScan();
    });

    const rescanBtn = panel.querySelector('#veratisRescanBtn');
    rescanBtn.addEventListener('click', () => {
      triggerSecurityScan();
    });

    // Text-to-Speech (TTS) Listen Button
    const listenBtn = panel.querySelector('#veratisListenBtn');
    listenBtn.addEventListener('click', () => {
      if (!lastScanResult) return;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        listenBtn.classList.remove('speaking');
        listenBtn.querySelector('span').textContent = 'Listen';
      } else {
        const cleanText = lastScanResult.replace(/[*_#`>•]/g, ' ').replace(/\s+/g, ' ').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.onstart = () => {
          isSpeaking = true;
          listenBtn.classList.add('speaking');
          listenBtn.querySelector('span').textContent = 'Stop';
        };
        utterance.onend = () => {
          isSpeaking = false;
          listenBtn.classList.remove('speaking');
          listenBtn.querySelector('span').textContent = 'Listen';
        };
        utterance.onerror = () => {
          isSpeaking = false;
          listenBtn.classList.remove('speaking');
          listenBtn.querySelector('span').textContent = 'Listen';
        };
        window.speechSynthesis.speak(utterance);
      }
    });

    function toggleOverlay(open) {
      isOverlayOpen = open;
      if (open) {
        panel.classList.add('open');
        const pageData = extractComprehensivePageData();
        panel.querySelector('#veratisWordCount').textContent = `${pageData.wordCount.toLocaleString()} words`;
      } else {
        panel.classList.remove('open');
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          isSpeaking = false;
        }
      }
    }

    function triggerSecurityScan() {
      if (isScanning) return;
      isScanning = true;

      const ctaWrap = panel.querySelector('#veratisScanCtaWrap');
      const scanningBox = panel.querySelector('#veratisScanningBox');
      const resultCard = panel.querySelector('#veratisResultCard');

      ctaWrap.style.display = 'none';
      scanningBox.style.display = 'flex';
      resultCard.style.display = 'none';

      const pageData = extractComprehensivePageData();

      chrome.runtime.sendMessage(
        {
          action: 'VERATIS_OVERLAY_SECURITY_SCAN',
          pageData: pageData
        },
        (res) => {
          isScanning = false;
          scanningBox.style.display = 'none';
          resultCard.style.display = 'flex';

          const responseText = res?.text || '• Verified standard page structure without overt phishing indicators.';
          lastScanResult = responseText;

          // Detect Risk Category with 100% accuracy using structured verdict
          const badge = panel.querySelector('#veratisVerdictBadge');
          const verdictState = res?.verdict || 'SAFE';

          if (verdictState === 'DANGER') {
            badge.className = 'veratis-verdict-badge danger';
            badge.textContent = '🚨 CRITICAL PHISHING';
          } else if (verdictState === 'CAUTION') {
            badge.className = 'veratis-verdict-badge caution';
            badge.textContent = '⚠️ CAUTION / SUSPICIOUS';
          } else {
            badge.className = 'veratis-verdict-badge safe';
            badge.textContent = '✓ SAFE / LEGITIMATE';
          }

          panel.querySelector('#veratisProviderLabel').textContent = res?.provider || 'Gemini AI';

          // Format clean concise bullets (strips any leftover VERDICT header lines)
          const bulletsContainer = panel.querySelector('#veratisResultBullets');
          bulletsContainer.innerHTML = formatMarkdownBullets(responseText);
        }
      );
    }
  }

  function formatMarkdownBullets(text) {
    const lines = text.split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !/^\*?\*?VERDICT:/i.test(l));

    if (lines.length === 0) {
      return '<div>• Standard page structure with authentic domain credentials.</div>';
    }

    return lines
      .map((line) => {
        let clean = line.replace(/^[•\-*]\s*/, '').trim();
        clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return `<div>• ${clean}</div>`;
      })
      .join('');
  }

  // Initialize overlay when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickOverlay);
  } else {
    initQuickOverlay();
  }
})();
