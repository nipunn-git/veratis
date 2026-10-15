/**
 * VERATIS Intelligence API - Digital Twin Test Endpoint
 * Vercel Serverless Function & Chrome Extension Backend
 * 
 * Supports Live AI roleplay via Gemini, OpenAI, Claude or smart intent branching.
 * Fully CORS-enabled for web app & Chrome Extension.
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
    const { scenarioId, messages = [], userMessage = '' } = body;

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let reply = null;

    // 1. Try GroqCloud (Ultra-fast Llama 3.3 70B)
    if (groqKey && !reply) {
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    }
  );

  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json();
  const parsed = JSON.parse(data.candidates[0].content.parts[0].text);
  return { ...parsed, isLiveAI: true };
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

async function callGroqTwin(apiKey, scenarioId, messages, userMessage) {
  const prompt = `You are roleplaying a social engineering simulation character for training in a cybersecurity awareness tool.
Stay in character strictly. Apply realistic scenario pressure, urgency, or authority.
Return ONLY valid JSON:
{
  "text": "Your in-character reply to the user",
  "suggestedFollowUps": [
    { "text": "A cautious safe reply the user could send", "type": "safe" },
    { "text": "A risky compliant reply the user could send", "type": "risky" }
  ]
}
Scenario: ${scenarioId}
User said: "${userMessage}"`;

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
        { role: 'user', content: userMessage }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) throw new Error(`Groq error: ${response.status}`);
  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return { ...parsed, isLiveAI: true, provider: 'GroqCloud (Llama 3.3 70B)' };
}
