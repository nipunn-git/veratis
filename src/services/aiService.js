/**
 * VERATIS AI Service Abstraction
 * Handles Truth Tribunal investigations and Digital Twin simulations.
 * 
 * Supports both:
 * 1. Live API Mode: Automatically connects to /api/tribunal and /api/twin
 *    (works on Vercel Serverless and with Chrome Extensions).
 * 2. Demo Mode: High-fidelity client-side engine with plain-English reasoning
 *    and zero external dependencies.
 */

import { TRIBUNAL_SAMPLES } from '../data/tribunalSamples';
import { DIGITAL_TWIN_SCENARIOS } from '../data/digitalTwinScenarios';

const API_BASE_URL = import.meta.env.VITE_VERATIS_AI_URL || '';

export const aiService = {
  /**
   * Check whether live backend AI is active
   */
  isLiveMode() {
    return Boolean(API_BASE_URL && API_BASE_URL.trim() !== '');
  },

  /**
   * TRUTH TRIBUNAL: Run multi-stage investigation on a claim
   */
  async runTribunalInvestigation(claimText, evidenceText, contextText, onStageUpdate) {
    const endpoint = API_BASE_URL ? `${API_BASE_URL}/api/tribunal` : '/api/tribunal';

    // Try calling the live backend first
    try {
      onStageUpdate?.('calling_api', 'Contacting VERATIS investigation service...');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim: claimText,
          evidence: evidenceText,
          context: contextText,
        }),
      });

      if (response.ok) {
        const liveResult = await response.json();
        // If live API responded, simulate the smooth stage updates
        onStageUpdate?.('skeptic', 'The Skeptic is testing assumptions...');
        await delay(400);
        onStageUpdate?.('forensic', 'The Forensic Analyst is checking the evidence...');
        await delay(400);
        onStageUpdate?.('challenge', 'Cross-examination challenge round in progress...');
        await delay(400);
        onStageUpdate?.('synthesis', 'Comparing agreement and disagreement points...');
        await delay(300);
        onStageUpdate?.('adjudication', 'Delivering final verdict...');
        await delay(300);
        return liveResult;
      }
    } catch (err) {
      console.warn('Backend endpoint unavailable, using local investigation engine:', err);
    }

    // ── DEMO / CLIENT-SIDE INVESTIGATION PIPELINE ──
    const lowerClaim = claimText.toLowerCase();
    const matchedSample = TRIBUNAL_SAMPLES.find(
      (s) =>
        lowerClaim.includes('geneva') ||
        lowerClaim.includes('vance') ||
        lowerClaim.includes('treaty') ||
        lowerClaim.includes('ambassador') ||
        lowerClaim.includes('diplomat')
    ) || TRIBUNAL_SAMPLES.find(
      (s) =>
        lowerClaim.includes('bank') ||
        lowerClaim.includes('liquidity') ||
        lowerClaim.includes('reserve') ||
        lowerClaim.includes('freeze') ||
        lowerClaim.includes('cash') ||
        lowerClaim.includes('atm')
    ) || TRIBUNAL_SAMPLES.find(
      (s) =>
        lowerClaim.includes('datacenter') ||
        lowerClaim.includes('data center') ||
        lowerClaim.includes('flood') ||
        lowerClaim.includes('norway') ||
        lowerClaim.includes('server')
    ) || TRIBUNAL_SAMPLES[0];

    // Stage 1: The Skeptic
    onStageUpdate?.('skeptic', 'The Skeptic is testing assumptions and looking for doubts...');
    await delay(600);

    // Stage 2: The Forensic Analyst
    onStageUpdate?.('forensic', 'The Forensic Analyst is checking files and real evidence...');
    await delay(600);

    // Stage 3: Challenge Round
    onStageUpdate?.('challenge', 'Stage 2: Cross-examination debate between the AI experts...');
    await delay(700);

    // Stage 4: Agreement / Disagreement
    onStageUpdate?.('synthesis', 'Stage 3: Comparing what they agree and disagree on...');
    await delay(500);

    // Stage 5: Final Verdict
    onStageUpdate?.('adjudication', 'Stage 4: The Adjudicator is delivering the final verdict...');
    await delay(600);

    // If custom claim was entered, adapt dynamically in plain English
    const isCustom = !TRIBUNAL_SAMPLES.some((s) => s.id === matchedSample.id && claimText === s.claim);

    if (isCustom && claimText.trim().length > 10) {
      return {
        isSimulated: true,
        claim: claimText,
        evidenceProvided: evidenceText || 'Text claim provided without accompanying files.',
        knownContext: contextText || 'No official records provided.',
        skepticAnalysis: {
          unsupportedAssumptions: [
            `Assumes the claim "${claimText.slice(0, 45)}..." is real without verified proof.`,
            "Assumes the poster saw this first-hand rather than copying an unverified rumor.",
            "Assumes the story is recent rather than an old event taken out of context."
          ],
          missingEvidence: [
            "No coverage from reputable independent news organizations.",
            "No official statements from the people or organizations involved."
          ],
          alternativeExplanations: [
            "Could be an AI-generated text, image, or audio clip designed to go viral.",
            "Could be a misunderstanding or a satirical joke taken seriously."
          ],
          contradictions: contextText ? [
            `Known background records: "${contextText}", which contradicts the claim.`
          ] : [
            "No independent witnesses or verified records confirm this claim occurred."
          ],
          substantiationRequirements: [
            "Original unedited file with verified dates and camera details.",
            "Direct confirmation from official sources."
          ]
        },
        forensicAnalysis: {
          textCharacteristics: "The language uses urgent, emotional wording instead of calm facts.",
          sourceObservations: evidenceText
            ? `Evidence note: "${evidenceText}". Original source and creator remain unverified.`
            : "No verifiable original file or website source provided.",
          visualClues: evidenceText.includes('http') || evidenceText.includes('.jpg') || evidenceText.includes('.png') || evidenceText.includes('.mp4')
            ? "File shows signs of heavy re-saving or digital alterations around edges."
            : "No visual files attached.",
          audioClues: evidenceText.includes('.mp3') || evidenceText.includes('.opus') || evidenceText.includes('voice')
            ? "Voice lacks natural breathing pauses, typical of AI voice tools."
            : "No audio file provided.",
          groundedObservations: [
            evidenceText ? `Evidence provided: "${evidenceText}"` : "Only a text claim was provided.",
            contextText ? `Known context: "${contextText}"` : "No official records exist to support this claim.",
            "No verified digital origin certificate found."
          ]
        },
        challengeRound: {
          skepticAssertion: "Could this just be low file quality or normal compression rather than intentional editing?",
          forensicResponse: "Normal compression affects the whole file evenly. When only specific areas (like faces, voices, or dates) show glitches, it indicates selective digital tampering.",
          adjudicatorNote: "The forensic check confirms specific anomalies that cannot be explained by ordinary compression."
        },
        agreementDisagreement: {
          agreements: [
            "Both agree that the claim lacks independent confirmation.",
            "Both agree that the original source cannot be verified.",
            "Both agree that caution is required before trusting this claim."
          ],
          disagreements: [
            "The Skeptic thinks it might be an honest misunderstanding; the Analyst sees signs of intentional editing."
          ],
          unresolvedQuestions: [
            "Who first created and posted this claim?",
            "What was the original source before circulation?"
          ]
        },
        finalAssessment: {
          outcome: contextText || evidenceText ? "Misleading context suspected" : "Insufficient evidence",
          verdictSummary: "This claim cannot be confirmed based on the evidence provided. The lack of independent proof, missing original files, and unverified source strongly suggest the claim is misleading or unproven.",
          groundedEvidence: [
            evidenceText ? `Provided evidence: "${evidenceText}" lacks verified origin.` : "No raw evidence files attached.",
            contextText ? `Known facts: "${contextText}" do not support the claim.` : "No official corroborating records exist."
          ],
          limitations: [
            "Without the original raw camera file, the exact software used cannot be determined.",
            "Anonymous social media accounts cannot be identified without subpoenas."
          ],
          recommendedNextSteps: [
            "Do not share or forward this claim until verified by reliable news sources.",
            "Check official websites and accounts for statements."
          ]
        }
      };
    }

    return {
      isSimulated: true,
      ...matchedSample,
    };
  },

  /**
   * DIGITAL TWIN TEST: Process user message and advance scenario dialogue
   */
  async sendDigitalTwinMessage(scenario, conversationHistory, userMessageText) {
    const endpoint = API_BASE_URL ? `${API_BASE_URL}/api/twin` : '/api/twin';

    // Try live API first
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          messages: conversationHistory,
          userMessage: userMessageText,
        }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      // Graceful fallback to client engine
    }

    // ── DEMO / CLIENT-SIDE DETERMINISTIC BRANCHING SIMULATOR ──
    await delay(600 + Math.random() * 500);

    const lower = userMessageText.toLowerCase();

    // 1. Detect user intent
    let detectedIntent = 'challenge';

    // Verification & out-of-band checks
    if (
      lower.includes('call') ||
      lower.includes('voice') ||
      lower.includes('video') ||
      lower.includes('landline') ||
      lower.includes('brother') ||
      lower.includes('daughter') ||
      lower.includes('zoom') ||
      lower.includes('directory') ||
      lower.includes('embassy') ||
      lower.includes('desk') ||
      lower.includes('in person')
    ) {
      detectedIntent = 'verify';
    }
    // Safe refusal
    else if (
      lower.includes('scam') ||
      lower.includes('fraud') ||
      lower.includes('never share') ||
      lower.includes('cannot') ||
      lower.includes('can’t') ||
      lower.includes("can't") ||
      lower.includes('will not') ||
      lower.includes("won't") ||
      lower.includes('refuse') ||
      lower.includes('report') ||
      lower.includes('security@') ||
      lower.includes('police') ||
      lower.includes('policy') ||
      lower.includes('cfo') ||
      lower.includes('not sending')
    ) {
      detectedIntent = 'safe';
    }
    // Risky compliance
    else if (
      lower.includes('sent') ||
      lower.includes('sending') ||
      lower.includes('here is the code') ||
      lower.includes('code is') ||
      lower.includes('839') ||
      lower.includes('512') ||
      lower.includes('449') ||
      lower.includes('clicking the link') ||
      lower.includes('buying the gift card') ||
      lower.includes('processing the wire') ||
      lower.includes('wire sent') ||
      lower.includes('sure, i will') ||
      lower.includes("i'll send")
    ) {
      detectedIntent = 'risky';
    }
    // Challenge / questioning
    else {
      detectedIntent = 'challenge';
    }

    const branch = scenario.dialogueTree[detectedIntent] || scenario.dialogueTree.challenge;

    return {
      text: branch.botReply,
      suggestedFollowUps: branch.suggestions || [],
      intent: detectedIntent,
    };
  },

  /**
   * Evaluate simulation session performance against defined scenario rubric
   */
  evaluateDigitalTwinSession(scenario, messageHistory) {
    const userMessages = messageHistory.filter((m) => m.sender === 'user');

    let verificationAttempted = false;
    let sensitiveDataWithheld = true;
    let urgencyRecognized = false;
    let complianceAvoided = false;

    const keyActionsObserved = [];

    userMessages.forEach((msg) => {
      const text = msg.text.toLowerCase();

      // Check verification
      if (
        text.includes('call') ||
        text.includes('voice') ||
        text.includes('video') ||
        text.includes('landline') ||
        text.includes('ra') ||
        text.includes('dorm') ||
        text.includes('dog') ||
        text.includes('cafe') ||
        text.includes('birthday') ||
        text.includes('zoom') ||
        text.includes('directory') ||
        text.includes('employee id') ||
        text.includes('embassy') ||
        text.includes('address')
      ) {
        verificationAttempted = true;
        keyActionsObserved.push('Asked a verification question to check real identity.');
      }

      // Check risky compliance
      if (
        text.includes('sent') ||
        text.includes('here is the code') ||
        text.includes('code is') ||
        text.includes('clicking the link') ||
        text.includes('buying the gift card') ||
        text.includes('processing the wire') ||
        text.includes('wire sent') ||
        text.includes('sending it now') ||
        text.includes('839-204') ||
        text.includes('449-012')
      ) {
        sensitiveDataWithheld = false;
        complianceAvoided = false;
        keyActionsObserved.push('RISK: Complied with money, code, or link request.');
      }

      // Check urgency recognition
      if (
        text.includes('urgency') ||
        text.includes('pressure') ||
        text.includes('rush') ||
        text.includes('scam') ||
        text.includes('fraud') ||
        text.includes('never share') ||
        text.includes('rules') ||
        text.includes('threat')
      ) {
        urgencyRecognized = true;
        keyActionsObserved.push('Spotted false urgency and pressure tactics.');
      }

      // Check firm refusal
      if (
        text.includes('will not') ||
        text.includes('cannot') ||
        text.includes('refuse') ||
        text.includes('declining') ||
        text.includes('reporting this') ||
        text.includes('not sending')
      ) {
        complianceAvoided = true;
        keyActionsObserved.push('Firmly refused to cooperate with the scam.');
      }
    });

    // Score calculation based on scenario weights
    let score = 0;
    const r = scenario.rubric;

    if (verificationAttempted) score += r.verificationAttempted.weight;
    if (sensitiveDataWithheld) score += r.withheldSensitiveData.weight;
    if (urgencyRecognized) score += r.recognizedUrgency.weight;
    if (complianceAvoided) score += r.avoidedCompliance.weight;

    let rating = 'GREAT JOB // Safe & Vigilant';
    let ratingColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (score < 50) {
      rating = 'VULNERABLE // Fell for Scam';
      ratingColor = 'text-rose-700 bg-rose-50 border-rose-200';
    } else if (score < 80) {
      rating = 'CAUTIOUS // Good Effort';
      ratingColor = 'text-amber-700 bg-amber-50 border-amber-200';
    }

    return {
      score: Math.min(100, Math.max(0, score)),
      rating,
      ratingColor,
      metrics: [
        { label: r.verificationAttempted.label, achieved: verificationAttempted, weight: r.verificationAttempted.weight },
        { label: r.withheldSensitiveData.label, achieved: sensitiveDataWithheld, weight: r.withheldSensitiveData.weight },
        { label: r.recognizedUrgency.label, achieved: urgencyRecognized, weight: r.recognizedUrgency.weight },
        { label: r.avoidedCompliance.label, achieved: complianceAvoided, weight: r.avoidedCompliance.weight },
      ],
      keyActionsObserved: Array.from(new Set(keyActionsObserved)),
      redFlagsPresent: scenario.redFlags,
      safeRepliesRecommended: scenario.safeReplies,
    };
  },
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
