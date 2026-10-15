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
    const preferGroq = isGroqValid && (action === 'explain' || action === 'safe-reply' || action === 'ask' || action === 'summarize') && contextContent.length < 8000;

    // 1. Try Preferred Model First
    if (preferGroq) {
      try {
        aiResult = await callGroqCompanion(groqKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
      } catch (err) {
        console.warn('Groq companion failed, trying Gemini:', err.message);
      }
    } else if (geminiKey) {
      try {
        aiResult = await callGeminiCompanion(geminiKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
      } catch (err) {
        console.warn('Gemini companion failed, trying Groq:', err.message);
      }
    }

    // 2. Cross-Provider Fallback
    if (!aiResult && geminiKey) {
      try {
        aiResult = await callGeminiCompanion(geminiKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
      } catch (err) {
        console.warn('Gemini secondary fallback failed:', err.message);
      }
    }

    if (!aiResult && isGroqValid) {
      try {
        aiResult = await callGroqCompanion(groqKey, action, query, contextContent, pageTitle, pageUrl, history, pageContext);
      } catch (err) {
        console.warn('Groq secondary fallback failed:', err.message);
      }
    }

    // 3. Try OpenAI
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
  const snippet = text.slice(0, 300);
  const words = text.split(/\s+/).length;

  switch (action) {
    case 'explain':
      return {
        action: 'explain',
        isLiveAI: false,
        response: `**Simple Summary:**\n\nThis content is talking about: "${snippet.slice(0, 150)}..."\n\n**Key Takeaways in Plain English:**\n1. **Core Idea:** It discusses ${pageTitle || 'the topic'} in terms of why it matters to the reader.\n2. **Context:** The text spans about ${words} words from ${pageUrl ? new URL(pageUrl).hostname : 'this page'}.\n3. **Practical Meaning:** No complex jargon—essentially, it describes an update, announcement, or perspective that should be weighed with normal common sense.`,
        suggestedNext: ['Investigate claims', 'Challenge assumptions', 'Ask a question']
      };

    case 'investigate': {
      const hasUrgency = /urgent|immediate|breaking|warning|alert|act now|hurry|freeze/i.test(text);
      const hasMoney = /money|dollar|\$|wire|transfer|crypto|bitcoin|fee|payment|zelle/i.test(text);
      const hasSensitive = /password|login|otp|code|ssn|credentials|pin/i.test(text);

      const flags = [];
      if (hasUrgency) flags.push("Uses high-urgency or panic-inducing words.");
      if (hasMoney) flags.push("Mentions financial transfers, payments, or cryptocurrency.");
      if (hasSensitive) flags.push("References sensitive credentials, codes, or login details.");
      if (flags.length === 0) flags.push("No immediate high-risk scam triggers, but claims should still be verified.");

      return {
        action: 'investigate',
        isLiveAI: false,
        response: `**Investigation Assessment:**\n\n• **Content Reviewed:** "${snippet.slice(0, 120)}..."\n• **Source Page:** ${pageTitle} (${pageUrl || 'unknown'})\n\n**Findings:**\n${flags.map((f, i) => `${i + 1}. **${f}**`).join('\n')}\n\n**Verdict:** ${flags.length > 1 ? 'Exercise Caution — verify through independent official sources before acting.' : 'Informational — cross-reference key assertions before relying on them.'}`,
        suggestedNext: ['Challenge This', 'Find Claims', 'Check Phishing']
      };
    }

    case 'challenge':
      return {
        action: 'challenge',
        isLiveAI: false,
        response: `**Skeptic's Challenge & Missing Evidence:**\n\n1. **Unproven Assumptions:** What proof is provided that the events described actually occurred on this date?\n2. **Missing Evidence:** Are there direct quotes from named, accredited sources or verified public documents?\n3. **Alternative Possibility:** Could this be sponsored marketing, selective framing, or an uncorroborated rumor?\n\n**To substantiate this:** Seek verification from primary government, regulatory, or accredited news archives.`,
        suggestedNext: ['Find Claims', 'Explain in simple terms']
      };

    case 'phishing': {
      const isSuspicious = /verify|urgent|account locked|suspend|security alert|login|password|transfer|fee/i.test(text);
      return {
        action: 'phishing',
        isLiveAI: false,
        response: `**Phishing & Social Engineering Assessment:**\n\n• **Threat Level:** ${isSuspicious ? 'Potential Social Engineering Detected' : 'Low Risk Profile'}\n\n**Inspection Checklist:**\n1. **Sender / Domain:** Check if the URL (${pageUrl || 'current site'}) matches the official organization.\n2. **Urgency Tactics:** Does the message pressure you to act within minutes to avoid penalties?\n3. **Data Requests:** Never share 2FA codes, passwords, or wire money to unverified accounts.\n\n**Advice:** If this arrived as an unexpected message or email, do not click internal links or reply directly. Navigate to the verified official portal manually.`,
        suggestedNext: ['Draft Safe Reply', 'Investigate Content']
      };
    }

    case 'claims':
      return {
        action: 'claims',
        isLiveAI: false,
        response: `**Factual Claims Requiring Verification:**\n\n1. Claim: "${snippet.slice(0, 100)}..."\n   ↳ *Verification Need: Check official press registry or primary corporate filing.*\n2. Claim: Specific dates, numbers, or actions attributed to people mentioned.\n   ↳ *Verification Need: Look for secondary coverage on Reuters, AP, or official portals.*`,
        suggestedNext: ['Investigate these claims', 'Challenge assumptions']
      };

    case 'safe-reply':
      return {
        action: 'safe-reply',
        isLiveAI: false,
        response: `**Recommended Safe Counter-Replies:**\n\n*Option 1 (Cautious & Professional):*\n> "Thank you for reaching out. Per our security guidelines, I cannot process requests or click external links without verbal verification through our official company directory."\n\n*Option 2 (Firm Verification):*\n> "I will review this request through the official customer support portal directly. Please provide a verified ticket reference number."\n\n*Option 3 (Refusal):*\n> "I do not share verification codes or execute transfers over direct messaging. I am closing this conversation."`,
        suggestedNext: ['Check Phishing', 'Explain in simple terms']
      };

    case 'summarize':
      return {
        action: 'summarize',
        isLiveAI: false,
        response: `**Page Summary: ${pageTitle}**\n\n• **Overview:** This page covers "${snippet.slice(0, 140)}..."\n• **Context:** Originates from ${pageUrl ? new URL(pageUrl).hostname : 'the active tab'}.\n• **Key Takeaway:** The core message focuses on providing information or instructions to the user. Always confirm sensitive or financial demands through an independent channel.`,
        suggestedNext: ['Investigate claims', 'Challenge This']
      };

    case 'ask':
    default:
      return {
        action: 'ask',
        isLiveAI: false,
        response: `Based on **${pageTitle}**:\n\nRegarding your question: *"${query || 'Analyze this content'}"*\n\nThe content states: "${snippet.slice(0, 180)}..."\n\n**Key Takeaway:** Remember to verify critical facts, double-check URLs, and never supply sensitive personal details without out-of-band confirmation.`,
        suggestedNext: ['Investigate', 'Challenge This', 'Explain']
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

  const prompt = `You are VERATIS, an advanced AI digital-trust and verification assistant.
The user is viewing a webpage titled "${title}" at "${url}".
${metaDesc}${headings}${forms}
Active Webpage Content:
"${text.slice(0, 25000)}"

Action Requested: "${action}".
User Question / Instruction: "${query || action}".

GUIDELINES:
- Use simple, plain, conversational English with short bullet points.
- Distinguish warning signs from proven fraud.
- Never claim an item is verified unless real proof exists.
- Be direct, polite, helpful, and concise.`;

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
            generationConfig: { maxOutputTokens: 1200 }
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
          response: textOutput,
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

  const prompt = `You are VERATIS, an advanced AI digital-trust and verification assistant.
The user is viewing a webpage titled "${title}" at "${url}".
${metaDesc}${headings}${forms}
Active Webpage Content:
"${text.slice(0, 15000)}"

Action Requested: "${action}".
User Question / Instruction: "${query || action}".

GUIDELINES:
- Use simple, plain, conversational English with short bullet points.
- Distinguish warning signs from proven fraud.
- Highlight specific claims that require independent verification.
- Be direct, polite, helpful, and concise.`;

  const messages = [
    { role: 'system', content: 'You are VERATIS, a trusted, plain-English digital-trust and media verification AI.' },
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
      max_tokens: 1200
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
    response: textOutput,
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
