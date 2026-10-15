/**
 * VERATIS - Comprehensive Webpage Content & Metadata Extractor
 * Reads all data on the active webpage safely without modifying live DOM
 * or transmitting sensitive credentials.
 */

(() => {
  // Listen for extraction requests from sidepanel
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
})();
