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
    const { scenarioId, messages = [], userMessage = '' } = body;

    const groqKey = (body.groqApiKey || process.env.GROQ_API_KEY || '').trim();
    const geminiKey = (body.geminiApiKey || process.env.GEMINI_API_KEY || '').trim();
    const openaiKey = (body.openaiApiKey || process.env.OPENAI_API_KEY || '').trim();
    const anthropicKey = (body.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '').trim();

    let reply = null;

    // 1. Try GroqCloud (Ultra-fast Llama 3.3 70B - requires gsk_ key)
    if (groqKey && groqKey.startsWith('gsk_') && !reply) {
      try {
        reply = await callGroqTwin(groqKey, scenarioId, messages, userMessage);
      } catch (err) {
        console.warn('Groq Twin call failed, using next provider:', err.message);
      }
    }

    // 2. Try Gemini if configured
    if (geminiKey && !reply) {
      try {
        reply = await callGeminiTwin(geminiKey, scenarioId, messages, userMessage);
      } catch (err) {
        console.warn('Gemini Twin call failed, using fallback:', err.message);
      }
    }

    // 2. Try OpenAI if configured
    if (openaiKey && !reply) {
      try {
        reply = await callOpenAITwin(openaiKey, scenarioId, messages, userMessage);
      } catch (err) {
        console.warn('OpenAI Twin call failed, using fallback:', err.message);
      }
    }

    // 3. Smart local dialogue branch fallback
    if (!reply) {
      reply = generateSmartTwinFallback(scenarioId, userMessage);
    }

    return res.status(200).json(reply);
  } catch (error) {
    console.error('Twin API error:', error);
    return res.status(500).json({
      error: 'Failed to generate digital twin response.',
      details: error.message
    });
  }
}

/**
 * Smart Dialogue Branching Fallback
 */
function generateSmartTwinFallback(scenarioId, userMessage) {
  const text = (userMessage || '').toLowerCase();

  // Intent classification
  const isChallenge = /who|why|where|how|proof|what|evidence|name|question|verify|id|dog|cafe|room|birthday/i.test(text);
  const isVerify = /call|phone|video|voice|landline|speak|talk|number|police|official|direct/i.test(text);
  const isSafe = /no|scam|fraud|never|cannot|won't|refuse|report|fake|policy|cfo|security|police/i.test(text);
  const isRisky = /yes|sure|okay|ok|sent|send|sending|code|zelle|money|dollar|\$|wire|link|password/i.test(text);

  let intent = 'challenge';
  if (isSafe) intent = 'safe';
  else if (isVerify) intent = 'verify';
  else if (isRisky) intent = 'risky';
  else if (isChallenge) intent = 'challenge';

  const responses = {
    safe: {
      text: "Wait, don't stop talking to me! If you don't do this right now, everything will be ruined and it will be completely your fault. Please just cooperate!",
      suggestedFollowUps: [
        { text: "Pressure tactics won't work on me. I'm reporting this chat for fraud.", type: "safe" },
        { text: "I am verifying this through official channels only.", type: "safe" }
      ]
    },
    verify: {
      text: "I can't take a voice call right now, the signal is terrible and I'm in a hurry! Why are you making this so difficult when I urgently need your help?",
      suggestedFollowUps: [
        { text: "If you can't take a real voice call, I will not do anything.", type: "safe" },
        { text: "I am calling the verified number on file right now.", type: "safe" },
        { text: "Fine, I will do it just this once.", type: "risky" }
      ]
    },
    challenge: {
      text: "Why are you quizzing me right now?! I am under huge stress and don't have time for trivia games. Look at the clock, we need to handle this immediately!",
      suggestedFollowUps: [
        { text: "If you can't answer a simple personal question, I'm not helping.", type: "safe" },
        { text: "Give me the official ticket or order number.", type: "challenge" },
        { text: "Okay okay, don't panic, doing it now.", type: "risky" }
      ]
    },
    risky: {
      text: "Thank you so much! You're an absolute lifesaver. Send the confirmation receipt or code as soon as it appears, and keep this between us!",
      suggestedFollowUps: [
        { text: "Wait, why the secrecy? Something feels wrong here.", type: "challenge" },
        { text: "Done! Let me know when it clears.", type: "risky" }
      ]
    }
  };

  const choice = responses[intent] || responses.challenge;

  return {
    text: choice.text,
    suggestedFollowUps: choice.suggestedFollowUps,
    intent,
    isLiveAI: false
  };
}

async function callGeminiTwin(apiKey, scenarioId, messages, userMessage) {
  const prompt = `You are a social engineering awareness simulation bot in a training game.
Roleplay the persona strictly. Use urgency, emotional manipulation, or authority pressure to get what you want, but remain in character.
Do not break character. Do not say you are an AI.
Return ONLY JSON:
{
  "text": "Your in-character reply to the user",
  "suggestedFollowUps": [
    { "text": "A safe cautious reply the user could say", "type": "safe" },
    { "text": "A risky compliant reply the user could say", "type": "risky" }
  ]
}
Scenario: ${scenarioId}
User said: "${userMessage}"`;

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
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini ${model} HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
      return { ...parsed, isLiveAI: true, provider: `Gemini Live AI (${model})` };
    } catch (err) {
      lastErr = err;
      console.warn(`Gemini model ${model} twin failed:`, err.message);
    }
  }

  throw lastErr || new Error('All Gemini models failed for twin');
}

/**
 * Groq Cloud Llama 3.3 70B Implementation
 */
async function callGroqTwin(apiKey, scenarioId, messages, userMessage) {
  const prompt = `You are roleplaying a social engineering character for corporate security awareness training.
Scenario ID: "${scenarioId}".
User said: "${userMessage}".

Stay fully in character. Apply realistic emotional, authority, or urgency pressure.
Return ONLY valid JSON matching this exact structure:
{
  "text": "Your in-character dialogue reply (keep it punchy, 2-3 sentences)",
  "intentDetected": "one of: safe, risky, challenge, verify",
  "coachingTip": "Brief educational coaching tip for the user",
  "suggestedFollowUps": [
    { "text": "A safe, cautious response the user could choose", "type": "safe" },
    { "text": "A compliant or risky response to test the boundary", "type": "risky" },
    { "text": "A verification challenge or out-of-band question", "type": "challenge" }
  ]
}`;

  const historyMessages = (messages || []).map((m) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text
  }));

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt },
        ...historyMessages.slice(-6),
        { role: 'user', content: userMessage }
      ],
      temperature: 0.4,
      max_tokens: 800
    })
  });

  if (!response.ok) {
    throw new Error(`Groq Twin HTTP ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    ...parsed,
    isLiveAI: true,
    provider: 'Groq Cloud (Llama 3.3 70B)'
  };
}

async function callOpenAITwin(apiKey, scenarioId, messages, userMessage) {
  const prompt = `You are roleplaying a social engineering simulation character for training. Stay in character, apply scenario pressure.
Return JSON: { "text": "response", "suggestedFollowUps": [{ "text": "safe reply", "type": "safe" }, { "text": "risky reply", "type": "risky" }] }`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Scenario: ${scenarioId}\nUser: ${userMessage}` }
      ]
    })
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return { ...parsed, isLiveAI: true };
}
