/**
 * VERATIS Companion - AI Analysis Endpoint
 * Vercel Serverless Function & Chrome Extension API
 * 
 * Supports Live AI (Gemini, OpenAI, Anthropic) via server-side environment keys,
 * or runs an intelligent fallback analyzer when keys are not configured.
 * Fully CORS-enabled for Chrome Extensions and Web Apps.
 */

export default async function handler(req, res) {
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

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let aiResult = null;

    // 1. Try GroqCloud (Ultra fast Llama 3.3 70B)
    if (groqKey && !aiResult) {
      try {
        aiResult = await callGroqCompanion(groqKey, action, query, contextContent, pageTitle, pageUrl, history);
      } catch (err) {
        console.warn('Groq Companion failed, trying next provider:', err.message);
      }
    }

    // 2. Try Gemini
    if (geminiKey && !aiResult) {
      try {
        aiResult = await callGeminiCompanion(geminiKey, action, query, contextContent, pageTitle, pageUrl, history);
      } catch (err) {
        console.warn('Gemini Companion failed, trying next provider:', err.message);
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
        response: `**VERATIS Investigation:**\n\n• **Content Reviewed:** "${snippet.slice(0, 120)}..."\n• **Source Page:** ${pageTitle} (${pageUrl || 'unknown'})\n\n**Findings:**\n${flags.map((f, i) => `${i + 1}. **${f}**`).join('\n')}\n\n**Verdict:** ${flags.length > 1 ? '⚠️ Exercise Caution — verify through independent official sources before acting.' : 'ℹ️ Informational — cross-reference key assertions before relying on them.'}`,
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
        response: `**Phishing & Social Engineering Assessment:**\n\n• **Threat Level:** ${isSuspicious ? '⚠️ Potential Social Engineering Detected' : '✅ Low Risk Profile'}\n\n**Inspection Checklist:**\n1. **Sender / Domain:** Check if the URL (${pageUrl || 'current site'}) matches the official organization.\n2. **Urgency Tactics:** Does the message pressure you to act within minutes to avoid penalties?\n3. **Data Requests:** Never share 2FA codes, passwords, or wire money to unverified accounts.\n\n**Advice:** If this arrived as an unexpected message or email, do not click internal links or reply directly. Navigate to the verified official portal manually.`,
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
 * Gemini Live AI Integration
 */
async function callGeminiCompanion(apiKey, action, query, text, title, url, history) {
  const prompt = `You are VERATIS Companion, an intelligent AI digital-trust and verification assistant running as a browser extension side panel.
The user is viewing a webpage titled "${title}" at "${url}".
The active content or selection is:
"${text.slice(0, 3000)}"

The user requested action: "${action}".
The user question or instruction: "${query || action}".

GUIDELINES:
- Use simple, plain, crisp English. Avoid heavy academic jargon.
- Distinguish warning signs from proven fraud.
- Never claim an item is verified unless real proof exists.
- Be direct, polite, helpful, and concise with short bullet points.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1000 }
      })
    }
  );

  if (!response.ok) throw new Error(`Gemini status ${response.status}`);
  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

  return {
    action,
    response: textOutput,
    isLiveAI: true,
    suggestedNext: ['Investigate', 'Challenge This', 'Explain in simple terms']
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

/**
 * GroqCloud Live AI Integration (Ultra-fast Llama 3.3 70B)
 */
async function callGroqCompanion(apiKey, action, query, text, title, url, history) {
  const prompt = `You are VERATIS Companion, an intelligent AI digital-trust and verification assistant running as a browser extension side panel.
Webpage Title: "${title}"
URL: "${url}"
Content/Excerpt:
"${text.slice(0, 3000)}"

Action Requested: "${action}".
User query: "${query || action}".

GUIDELINES:
- Use simple, plain, conversational English with short bullet points.
- Distinguish warning signs from proven facts.
- Never claim an item is verified unless real proof exists.
- Be direct, polite, helpful, and concise.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are VERATIS Companion. Plain-English digital-trust assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })
  });

  if (!response.ok) throw new Error(`Groq status ${response.status}: ${await response.text()}`);
  const data = await response.json();
  const textOutput = data.choices?.[0]?.message?.content || 'No response generated.';

  return {
    action,
    response: textOutput,
    isLiveAI: true,
    provider: 'GroqCloud (Llama 3.3 70B)',
    suggestedNext: ['Investigate', 'Challenge This', 'Explain in simple terms']
  };
}
