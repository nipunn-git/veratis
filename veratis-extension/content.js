/**
 * VERATIS Companion - Content Script
 * Safely extracts user-selected text or cleaned readable page content.
 * Never executes external code or transmits cookies/credentials.
 */

(() => {
  // Listen for extraction requests from sidepanel
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'GET_SELECTION') {
      const selected = window.getSelection() ? window.getSelection().toString().trim() : '';
      sendResponse({
        selectedText: selected,
        title: document.title || '',
        url: window.location.href || ''
      });
      return true;
    }

    if (request.action === 'GET_PAGE_TEXT') {
      const pageText = extractCleanPageText();
      const selected = window.getSelection() ? window.getSelection().toString().trim() : '';
      sendResponse({
        selectedText: selected,
        pageText,
        title: document.title || '',
        url: window.location.href || ''
      });
      return true;
    }
  });

  /**
   * Safely extract clean readable text from the active page,
   * removing scripts, navigation, footers, ads, and invisible elements.
   */
  function extractCleanPageText() {
    try {
      // Find main article or content container if available
      const mainEl = document.querySelector('article') || 
                     document.querySelector('main') || 
                     document.querySelector('[role="main"]') || 
                     document.body;

      if (!mainEl) return '';

      // Clone node to avoid modifying the live DOM
      const clone = mainEl.cloneNode(true);

      // Elements to strip out
      const removeSelectors = [
        'script', 'style', 'noscript', 'iframe', 'svg', 
        'nav', 'footer', 'header', 'aside',
        '.ad', '.advertisement', '.social-share', '#comments',
        '[aria-hidden="true"]'
      ];

      removeSelectors.forEach((sel) => {
        const els = clone.querySelectorAll(sel);
        els.forEach((el) => el.remove());
      });

      // Extract innerText or textContent
      const text = clone.innerText || clone.textContent || '';

      // Clean up whitespace and limit length to ~4,000 characters
      const cleaned = text
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, ' ')
        .replace(/\n\s*\n+/g, '\n\n')
        .trim();

      return cleaned.slice(0, 4000);
    } catch (e) {
      console.warn('VERATIS: Page text extraction fallback:', e);
      return (document.body?.innerText || '').slice(0, 3000);
    }
  }
})();
