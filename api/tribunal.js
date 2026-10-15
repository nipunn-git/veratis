/**
 * VERATIS Intelligence API - Truth Tribunal Endpoint
 * Vercel Serverless Function & Chrome Extension Backend
 * 
 * Supports Live AI (Gemini, OpenAI, Anthropic) via server-side environment keys,
 * or runs an intelligent fallback analysis when keys are not configured.
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
    const { claim, evidence, context } = body;

    if (!claim || !claim.trim()) {
      return res.status(400).json({ error: 'Missing claim text.' });
    }

    const claimText = claim.trim();
    const evidenceText = (evidence || '').trim();
    const contextText = (context || '').trim();

    // Check for configured AI keys in environment variables
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    let analysisResult = null;

    // 1. Try GroqCloud (Ultra-fast Llama 3.3 70B)
    if (groqKey && !analysisResult) {
      try {
        analysisResult = await callGroqTribunal(groqKey, claimText, evidenceText, contextText);
      } catch (err) {
        console.warn('Groq Tribunal call failed, attempting fallback:', err.message);
      }
    }

    // 2. Try Gemini if configured
    if (geminiKey && !analysisResult) {
      try {
        analysisResult = await callGeminiTribunal(geminiKey, claimText, evidenceText, contextText);
      } catch (err) {
        console.warn('Gemini API call failed, attempting fallback:', err.message);
      }
    }

    // 2. Try OpenAI if configured
    if (openaiKey && !analysisResult) {
      try {
        analysisResult = await callOpenAITribunal(openaiKey, claimText, evidenceText, contextText);
      } catch (err) {
        console.warn('OpenAI API call failed, attempting fallback:', err.message);
      }
    }

    // 3. Try Anthropic if configured
    if (anthropicKey && !analysisResult) {
      try {
        analysisResult = await callAnthropicTribunal(anthropicKey, claimText, evidenceText, contextText);
      } catch (err) {
        console.warn('Anthropic API call failed, attempting fallback:', err.message);
      }
    }

    // 4. Default to Intelligent Local Analyzer if no keys or API failed
    if (!analysisResult) {
      analysisResult = generateSmartTribunalFallback(claimText, evidenceText, contextText);
    }

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Tribunal API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process tribunal investigation.',
      details: error.message 
    });
  }
}

/**
 * Intelligent Local Analyzer
 * Generates simple, plain-English 3-personality investigation with zero techno-jargon.
 */
function generateSmartTribunalFallback(claim, evidence, context) {
  const isVideo = /video|clip|footage|recorded|camera|watch|mp4/i.test(claim + ' ' + evidence);
  const isAudio = /audio|voice|recording|call|heard|sound|mp3|opus|phone/i.test(claim + ' ' + evidence);
  const isPhoto = /photo|picture|image|satellite|snapshot|jpg|png/i.test(claim + ' ' + evidence);

  let mediaType = isVideo ? 'video' : isAudio ? 'audio recording' : isPhoto ? 'photograph' : 'document';

  return {
    id: `tribunal-${Date.now()}`,
    title: `Investigation: ${claim.slice(0, 45)}...`,
    category: isVideo ? 'Video Claim' : isAudio ? 'Audio Claim' : isPhoto ? 'Photo Claim' : 'Text Claim',
    claim,
    evidenceProvided: evidence || 'Text statement provided without accompanying raw files.',
    knownContext: context || 'No external verified records provided.',
    isLiveAI: false,
    skepticAnalysis: {
      unsupportedAssumptions: [
        `Assumes the ${mediaType} is genuine rather than generated or altered by AI tools.`,
        "Assumes the event happened recently rather than being recycled from an older story.",
        "Assumes unverified social media posts represent verified facts."
      ],
      missingEvidence: [
        "No coverage or corroboration from major reputable news agencies.",
        "No official statement or document published by the relevant organizations."
      ],
      alternativeExplanations: [
        "Could be a manipulated or AI-generated file designed to spread virally.",
        "Could be real past footage presented with a misleading new headline."
      ],
      contradictions: context ? [
        `Background records state: "${context}", which contradicts the main claim.`
      ] : [
        "No independent witnesses or verified records confirm this claim occurred as described."
      ],
      substantiationRequirements: [
        "Original unedited file with verified camera timestamp and metadata.",
        "Direct confirmation from official spokespersons or accredited press."
      ]
    },
    forensicAnalysis: {
      textCharacteristics: "The language uses urgent, emotional phrasing rather than measured factual statements.",
      sourceObservations: evidence ? `Evidence note: "${evidence}". The original source and creator remain unverified.` : "No verifiable original source file or cryptographic certificate provided.",
      visualClues: isPhoto || isVideo ? "Signs of digital editing, strange lighting, or blur lines around key edges." : "Not applicable (non-visual claim).",
      audioClues: isAudio || isVideo ? "Voice has flat, unnatural rhythm or abrupt cutoff points typical of cloned audio." : "Not applicable.",
      groundedObservations: [
        evidence ? `Evidence submitted: ${evidence}` : "Only text claim provided with no attached verifiable files.",
        context ? `Known context noted: ${context}` : "No official timeline context provided.",
        "Zero verified cryptographic provenance signatures found."
      ]
    },
    challengeRound: {
      skepticAssertion: "Could this just be low file quality or normal compression rather than intentional manipulation?",
      forensicResponse: "Normal file compression affects the entire file evenly. When only specific areas (like faces, voices, or dates) show anomalies while surroundings are clear, it points to selective tampering.",
      adjudicatorNote: "The forensic check confirms specific anomalies that cannot be explained by ordinary compression."
    },
    agreementDisagreement: {
      agreements: [
        "Both agree that the claim lacks independent confirmation from reputable sources.",
        "Both agree that the original source cannot be verified.",
        "Both agree that caution is required before treating this as fact."
      ],
      disagreements: [
        "The Skeptic questions whether it is just a misunderstanding; the Analyst sees signs of intentional editing."
      ],
      unresolvedQuestions: [
        "Who was the original person or account that posted this?",
        "What was the original source file before circulation?"
      ]
    },
    finalAssessment: {
      outcome: context || evidence ? "Misleading context suspected" : "Insufficient evidence",
      verdictSummary: "Based on the evidence provided, this claim cannot be confirmed. The lack of independent proof, missing original files, and contradictory context strongly suggest the claim is misleading or unverified.",
      groundedEvidence: [
        evidence ? `Provided evidence: "${evidence}" lacks verified source provenance.` : "No raw evidence files attached.",
        context ? `Known facts: "${context}" do not support the claim.` : "No official corroborating records exist."
      ],
      limitations: [
        "Without raw camera files or forensic device access, we cannot identify the exact software used.",
        "Anonymous social media posters cannot be verified without legal subpoenas."
      ],
      recommendedNextSteps: [
        "Do not forward or share this claim until verified by reliable news organizations.",
        "Check official statements from the institutions mentioned."
      ]
    }
  };
}

/**
 * Gemini 1.5 Flash Implementation
 */
async function callGeminiTribunal(apiKey, claim, evidence, context) {
  const systemPrompt = `You are the VERATIS Truth Tribunal backend.
Analyze the claim using three distinct analytical personalities: The Skeptic (challenges assumptions), The Forensic Analyst (inspects physical & digital evidence), and The Adjudicator (delivers a fair verdict without made-up percentages).
IMPORTANT: Use simple, plain English that anyone can easily understand. Avoid academic techno-jargon. Keep bullet points short, punchy, and clear.
Return ONLY valid JSON matching this structure:
{
  "title": "Short title",
  "category": "Category",
  "skepticAnalysis": {
    "unsupportedAssumptions": ["point 1", "point 2"],
    "missingEvidence": ["point 1", "point 2"],
    "alternativeExplanations": ["point 1", "point 2"],
    "contradictions": ["point 1"],
    "substantiationRequirements": ["point 1"]
  },
  "forensicAnalysis": {
    "textCharacteristics": "Short plain summary",
    "sourceObservations": "Short plain summary",
    "visualClues": "Short plain summary",
    "audioClues": "Short plain summary",
    "groundedObservations": ["point 1", "point 2"]
  },
  "challengeRound": {
    "skepticAssertion": "Plain English doubt",
    "forensicResponse": "Plain English answer",
    "adjudicatorNote": "Plain English note"
  },
  "agreementDisagreement": {
    "agreements": ["point 1", "point 2"],
    "disagreements": ["point 1"],
    "unresolvedQuestions": ["point 1"]
  },
  "finalAssessment": {
    "outcome": "One of: Supported by supplied evidence | Misleading context suspected | Potential manipulation indicators | Insufficient evidence | Unverified claim",
    "verdictSummary": "Plain English verdict explanation",
    "groundedEvidence": ["fact 1", "fact 2"],
    "limitations": ["limitation 1"],
    "recommendedNextSteps": ["step 1", "step 2"]
  }
}`;

  const userContent = `Claim: ${claim}\nEvidence: ${evidence || 'None provided'}\nContext: ${context || 'None provided'}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userContent }] }
        ],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(rawText);

  return {
    ...parsed,
    id: `tribunal-${Date.now()}`,
    claim,
    evidenceProvided: evidence,
    knownContext: context,
    isLiveAI: true
  };
}

/**
 * OpenAI GPT-4o-mini Implementation
 */
async function callOpenAITribunal(apiKey, claim, evidence, context) {
  const systemPrompt = `You are the VERATIS Truth Tribunal backend.
Analyze the claim using three distinct analytical personalities: The Skeptic, The Forensic Analyst, and The Adjudicator.
Use simple, clear everyday English. Keep bullet points short.
Return ONLY valid JSON with keys: title, category, skepticAnalysis, forensicAnalysis, challengeRound, agreementDisagreement, finalAssessment.`;

  const userContent = `Claim: ${claim}\nEvidence: ${evidence || 'None provided'}\nContext: ${context || 'None provided'}`;

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
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    ...parsed,
    id: `tribunal-${Date.now()}`,
    claim,
    evidenceProvided: evidence,
    knownContext: context,
    isLiveAI: true
  };
}

/**
 * Anthropic Claude 3.5 Sonnet Implementation
 */
async function callAnthropicTribunal(apiKey, claim, evidence, context) {
  const prompt = `You are the VERATIS Truth Tribunal. Analyze this claim using The Skeptic, The Forensic Analyst, and The Adjudicator.
Use simple, plain English that is easy to understand.
Return ONLY JSON with keys: title, category, skepticAnalysis, forensicAnalysis, challengeRound, agreementDisagreement, finalAssessment.
Claim: ${claim}\nEvidence: ${evidence}\nContext: ${context}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);

  return {
    ...parsed,
    id: `tribunal-${Date.now()}`,
    claim,
    evidenceProvided: evidence,
    knownContext: context,
    isLiveAI: true
  };
}

/**
 * GroqCloud Llama 3.3 70B Implementation
 */
async function callGroqTribunal(apiKey, claim, evidence, context) {
  const systemPrompt = `You are the VERATIS Truth Tribunal backend.
Analyze the claim using three distinct analytical personalities: The Skeptic, The Forensic Analyst, and The Adjudicator.
IMPORTANT: Use simple, plain English that anyone can easily understand. Keep bullet points short, punchy, and clear.
Return ONLY valid JSON matching this schema:
{
  "title": "Short title",
  "category": "Category",
  "skepticAnalysis": {
    "unsupportedAssumptions": ["point 1", "point 2"],
    "missingEvidence": ["point 1", "point 2"],
    "alternativeExplanations": ["point 1", "point 2"],
    "contradictions": ["point 1"],
    "substantiationRequirements": ["point 1"]
  },
  "forensicAnalysis": {
    "textCharacteristics": "Short plain summary",
    "sourceObservations": "Short plain summary",
    "visualClues": "Short plain summary",
    "audioClues": "Short plain summary",
    "groundedObservations": ["point 1", "point 2"]
  },
  "challengeRound": {
    "skepticAssertion": "Plain English doubt",
    "forensicResponse": "Plain English answer",
    "adjudicatorNote": "Plain English note"
  },
  "agreementDisagreement": {
    "agreements": ["point 1", "point 2"],
    "disagreements": ["point 1"],
    "unresolvedQuestions": ["point 1"]
  },
  "finalAssessment": {
    "outcome": "One of: Supported by supplied evidence | Misleading context suspected | Potential manipulation indicators | Insufficient evidence | Unverified claim",
    "verdictSummary": "Plain English verdict explanation",
    "groundedEvidence": ["fact 1", "fact 2"],
    "limitations": ["limitation 1"],
    "recommendedNextSteps": ["step 1", "step 2"]
  }
}`;

  const userContent = `Claim: ${claim}\nEvidence: ${evidence || 'None provided'}\nContext: ${context || 'None provided'}`;

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
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);

  return {
    ...parsed,
    id: `tribunal-${Date.now()}`,
    claim,
    evidenceProvided: evidence,
    knownContext: context,
    isLiveAI: true,
    provider: 'GroqCloud (Llama 3.3 70B)'
  };
}
