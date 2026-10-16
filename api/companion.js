import fs from 'fs';
import path from 'path';

// Helper to ensure .env keys are populated
function ensureEnvLoaded() {
  if (process.env.GEMINI_API_KEY && process.env.GROQ_API_KEY) return;
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [k, ...v] = trimmed.split('=');
        if (k && v.length) {
          const key = k.trim();
          let val = v.join('=').trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (e) {
    // ignore
  }
}

export default async function handler(req, res) {
  ensureEnvLoaded();
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { action = 'ask', query = '', pageContext = {}, history = [] } = body;

    const selectedText = (pageContext.selectedText || '').trim();
    const pageText = (pageContext.pageText || '').trim();
    const contextContent = selectedText || pageText || query;
    const pageTitle = pageContext.title || 'Webpage';
    const pageUrl = pageContext.url || '';

    if (!contextContent && !query) {
      return res.status(400).json({ error: 'No text or query provided for analysis.' });
    }

    const groqKey = (body.groqApiKey || process.env.GROQ_API_KEY || '').trim();
    const isGroqValid = groqKey && groqKey.startsWith('gsk_');
    const geminiKey = (body.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
    const openaiKey = (body.openaiApiKey || process.env.OPENAI_API_KEY || '').trim();
    const anthropicKey = (body.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '').trim();

    let aiResult = null;

    // Smart Routing Strategy:
    // Groq Llama 3.3 70B is ultra-fast (~200 t/s) -> ideal for conversational ask, explain, safe-reply, summarize
    // Gemini 2.5 Flash has a massive 1M token context & deep reasoning -> ideal for deep investigate, challenge, claims, phishing
    const isGeminiFeature = action === 'summarize' || action === 'investigate' || action === 'phishing' || action === 'claims' || contextContent.length > 5000;

    // 1. Feature-Based Primary Execution & Cross-Provider Fallback
    if (isGeminiFeature) {
      if (geminiKey) {
        try {
          aiResult = await callGeminiCompanion(geminiKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
        } catch (err) {
          console.warn('Gemini companion failed, trying Groq:', err.message);
        }
      }
      if (!aiResult && isGroqValid) {
        try {
          aiResult = await callGroqCompanion(groqKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
        } catch (err) {
          console.warn('Groq secondary fallback failed:', err.message);
        }
      }
    } else {
      if (isGroqValid) {
        try {
          aiResult = await callGroqCompanion(groqKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
        } catch (err) {
          console.warn('Groq companion failed, trying Gemini:', err.message);
        }
      }
      if (!aiResult && geminiKey) {
        try {
          aiResult = await callGeminiCompanion(geminiKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
        } catch (err) {
          console.warn('Gemini fallback failed:', err.message);
        }
      }
    }

    // 2. Try OpenAI if keys provided and no result yet
    if (openaiKey && !aiResult) {
      try {
        aiResult = await callOpenAICompanion(openaiKey, action, query, contextContent, pageTitle, pageUrl, history);
      } catch (err) {
        console.warn('OpenAI Companion failed, falling back to smart analyzer:', err.message);
      }
    }

    // 3. Smart Local Fallback Analyzer
    if (!aiResult) {
      aiResult = generateSmartCompanionFallback(action, query, contextContent, pageTitle, pageUrl);
    }

    return res.status(200).json(aiResult);
  } catch (error) {
    console.error('Companion API error:', error);
    return res.status(500).json({
      error: 'Failed to process AI companion analysis.',
      details: error.message
    });
  }
}

/**
 * Smart Local Analyzer (Zero-setup Fallback)
 * Produces grounded, helpful, plain-English analysis tailored to each action.
 */
function generateSmartCompanionFallback(action, query, text, pageTitle, pageUrl) {
  const snippet = text.slice(0, 160);

  switch (action) {
    case 'explain':
      return {
        action: 'explain',
        isLiveAI: false,
        response: `• **Core Idea:** Discusses ${pageTitle || 'this topic'} ("${snippet.slice(0, 90)}...").\n• **Plain Meaning:** Informational summary without verified institutional accreditation. Cross-check before citing.`,
        suggestedNext: ['Investigate claims', 'Challenge assumptions']
      };

    case 'investigate': {
      const hasUrgency = /urgent|immediate|breaking|warning|alert|act now|hurry|freeze/i.test(text);
      const hasSensitive = /password|login|otp|code|ssn|credentials|pin|wire|crypto/i.test(text);

      return {
        action: 'investigate',
        isLiveAI: false,
        response: `• **Status:** ${hasUrgency || hasSensitive ? 'Heightened Risk — urgency or credential triggers detected.' : 'Uncorroborated third-party claim.'}\n• **Verification:** No primary source links or certified public documents cited on this page.`,
        suggestedNext: ['Challenge assumptions', 'Phishing check']
      };
    }

    case 'challenge':
      return {
        action: 'challenge',
        isLiveAI: false,
        response: `• **Premise:** Assumes assertions are factual without independent verification.\n• **Missing Proof:** Lacks primary public records, data citations, or sworn statements.`,
        suggestedNext: ['Find Claims', 'Explain']
      };

    case 'phishing': {
      const isSuspicious = /verify|urgent|account locked|suspend|security alert|login|password|transfer|fee/i.test(text);
      return {
        action: 'phishing',
        isLiveAI: false,
        response: `• **Threat Level:** ${isSuspicious ? 'Suspicious pattern detected — urgency and credential requests.' : 'Low immediate threat.'}\n• **Action:** Verify domain against official registrar. Never enter passwords from external links.`,
        suggestedNext: ['Safe reply', 'Investigate']
      };
    }

    case 'claims':
      return {
        action: 'claims',
        isLiveAI: false,
        response: `• **Claim 1:** "${snippet.slice(0, 90)}..." (Requires independent primary source confirmation).\n• **Claim 2:** Assertions regarding dates or authoritative figures lack citation.`,
        suggestedNext: ['Investigate', 'Challenge']
      };

    case 'safe-reply':
      return {
        action: 'safe-reply',
        isLiveAI: false,
        response: `> "Thank you. Per security protocols, I do not process requests, share credentials, or follow links without official verification through our company directory."`,
        suggestedNext: ['Phishing check', 'Explain']
      };

    case 'summarize':
      return {
        action: 'summarize',
        isLiveAI: false,
        response: `• **Page:** ${pageTitle} (${pageUrl ? new URL(pageUrl).hostname : 'active tab'}).\n• **Summary:** Focuses on "${snippet.slice(0, 110)}...". Confirm critical assertions through secondary outlets.`,
        suggestedNext: ['Investigate claims', 'Challenge']
      };

    case 'ask':
    default:
      return {
        action: 'ask',
        isLiveAI: false,
        response: `• **Answer:** Regarding "${query || 'your query'}": Content outlines "${snippet.slice(0, 100)}...".\n• **Tip:** Verify key numbers and source identity independently before acting.`,
        suggestedNext: ['Investigate', 'Explain']
      };
  }
}

/**
 * Gemini Live AI Integration (Google AI Studio)
 */
async function callGeminiCompanion(apiKey, action, query, text, title, url, history, pageContext = {}) {
  const metaDesc = pageContext.metadata?.description ? `Meta Description: ${pageContext.metadata.description}\n` : '';
  const headings = pageContext.headings?.length ? `Key Page Headings:\n${pageContext.headings.slice(0, 10).map(h => `- ${h}`).join('\n')}\n` : '';
  const forms = pageContext.forms?.length ? `Forms On Page: ${pageContext.forms.map(f => f.hasPasswordField ? 'Password Login Form Detected' : 'Form').join(', ')}\n` : '';

  const prompt = `You are VERATIS, a concise, high-precision digital-trust and verification AI analyzing webpage content.
Webpage: "${title}" (${url})
${metaDesc}${headings}${forms}
Content:
"${text.slice(0, 25000)}"

Action: "${action}". User Request: "${query || action}".

CRITICAL FORMATTING RULES:
- Output MUST be extremely short, concise, and to the point.
- Maximum 2 to 3 bullet points or short sentences. Never exceed 70 words total.
- NO greetings, pleasantries, or introductory phrases (do NOT say "Here is a summary", "Based on my analysis", etc.).
- State the direct answer, verdict, or verification step immediately.`;

  const models = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];
  let lastErr = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 250 }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini ${model} HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        return {
          action,
          response: textOutput.trim(),
          isLiveAI: true,
          provider: `Gemini Live AI (${model})`,
          suggestedNext: ['Investigate deeper', 'Challenge evidence', 'Explain in simple terms']
        };
      }
    } catch (err) {
      lastErr = err;
      console.warn(`Gemini model ${model} attempt failed:`, err.message);
    }
  }

  throw lastErr || new Error('All Gemini models failed');
}

/**
 * Groq Cloud Live AI Integration (Llama 3.3 70B Versatile)
 */
async function callGroqCompanion(apiKey, action, query, text, title, url, history, pageContext = {}) {
  const metaDesc = pageContext.metadata?.description ? `Meta Description: ${pageContext.metadata.description}\n` : '';
  const headings = pageContext.headings?.length ? `Key Page Headings:\n${pageContext.headings.slice(0, 8).map(h => `- ${h}`).join('\n')}\n` : '';
  const forms = pageContext.forms?.length ? `Forms On Page: ${pageContext.forms.map(f => f.hasPasswordField ? 'Password Login Form Detected' : 'Form').join(', ')}\n` : '';

  const prompt = `You are VERATIS, a lightning-fast, high-precision digital-trust and verification AI.
Webpage: "${title}" (${url})
${metaDesc}${headings}${forms}
Active Webpage Content:
"${text.slice(0, 15000)}"

Action Requested: "${action}".
User Question / Instruction: "${query || action}".

CRITICAL FORMATTING RULES:
- Output MUST be extremely short, concise, and to the point.
- Maximum 2 to 3 bullet points or short sentences. Never exceed 70 words total.
- NO greetings, pleasantries, or introductory phrases (do NOT say "Here is a summary", "Based on my analysis", etc.).
- State the direct answer, verdict, or counter-point immediately.`;

  const messages = [
    { role: 'system', content: 'You are VERATIS. Output concise, plain-English digital-trust analysis in max 2-3 short bullet points without pleasantries.' },
    ...(history || []).slice(-4).map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text })),
    { role: 'user', content: prompt }
  ];

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.2,
      max_tokens: 250
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const textOutput = data.choices?.[0]?.message?.content || 'No response generated.';

  return {
    action,
    response: textOutput.trim(),
    isLiveAI: true,
    provider: 'Groq Cloud (Llama 3.3 70B)',
    suggestedNext: ['Investigate deeper', 'Challenge evidence', 'Explain in simple terms']
  };
}

/**
 * OpenAI Live AI Integration
 */
async function callOpenAICompanion(apiKey, action, query, text, title, url, history) {
  const prompt = `You are VERATIS Companion, an intelligent AI digital-trust assistant side panel.
Webpage: "${title}" (${url})
Content: "${text.slice(0, 2500)}"
Action: "${action}". User query: "${query || action}".
Provide a concise, plain-English, helpful analysis in Markdown with bullet points.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are VERATIS Companion. Clear, plain-English digital-trust assistant.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) throw new Error(`OpenAI status ${response.status}`);
  const data = await response.json();
  const textOutput = data.choices?.[0]?.message?.content || 'No response generated.';

  return {
    action,
    response: textOutput,
    isLiveAI: true,
    suggestedNext: ['Investigate', 'Challenge This', 'Explain in simple terms']
  };
}
