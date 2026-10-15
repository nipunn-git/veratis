/**
 * VERATIS AI Service Abstraction
 * Handles Truth Tribunal multi-personality deliberation and Digital Twin impersonation simulator.
 * 
 * Supports two operating modes:
 * 1. Live AI Mode: Connects to a backend service (e.g. VITE_VERATIS_AI_URL or /api)
 * 2. Demo Mode: Client-side deterministic reasoning engine with branching dialogue,
 *    live simulation stages, and rubric-based security scoring.
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
    if (this.isLiveMode()) {
      try {
        onStageUpdate?.('calling_api', 'Dispatching claim to Veratis AI Enclave...');
        const response = await fetch(`${API_BASE_URL}/api/tribunal/investigate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            claim: claimText,
            evidence: evidenceText,
            context: contextText,
          }),
        });
        if (!response.ok) throw new Error(`AI API returned status ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Live AI endpoint unreachable, falling back to simulated engine:', err);
        // Fall back gracefully to demo mode below
      }
    }

    // ── DEMO / CLIENT-SIDE SIMULATED INVESTIGATION PIPELINE ──
    // Check if input matches one of our rich reference cases
    const lowerClaim = claimText.toLowerCase();
    const matchedSample = TRIBUNAL_SAMPLES.find(
      (s) =>
        lowerClaim.includes('geneva') ||
        lowerClaim.includes('vance') ||
        lowerClaim.includes('treaty') ||
        lowerClaim.includes('ambassador')
    ) || TRIBUNAL_SAMPLES.find(
      (s) =>
        lowerClaim.includes('bank') ||
        lowerClaim.includes('liquidity') ||
        lowerClaim.includes('reserve') ||
        lowerClaim.includes('moratorium')
    ) || TRIBUNAL_SAMPLES.find(
      (s) =>
        lowerClaim.includes('datacenter') ||
        lowerClaim.includes('data center') ||
        lowerClaim.includes('flood') ||
        lowerClaim.includes('norway')
    ) || TRIBUNAL_SAMPLES[0];

    // Stage 1: Independent Personality Decomposition
    onStageUpdate?.('skeptic', 'Personality A (The Skeptic) identifying unsupported assumptions...');
    await delay(700);

    onStageUpdate?.('forensic', 'Personality B (Forensic Analyst) inspecting bitstream and contextual anomalies...');
    await delay(700);

    // Stage 2: Challenge Round Cross-Examination
    onStageUpdate?.('challenge', 'Initiating Challenge Round: The Skeptic interrogates Forensic assertions...');
    await delay(800);

    // Stage 3: Agreement / Disagreement Synthesis
    onStageUpdate?.('synthesis', 'Compiling consensus points and conflicting interpretations...');
    await delay(600);

    // Stage 4: Adjudicator Final Deliberation
    onStageUpdate?.('adjudication', 'The Adjudicator delivering evidence-grounded final assessment...');
    await delay(700);

    // If custom claim was entered that doesn't match sample titles, adapt the report dynamically
    const isCustom = !TRIBUNAL_SAMPLES.some((s) => s.id === matchedSample.id && claimText === s.claim);

    if (isCustom && claimText.trim().length > 10) {
      return {
        isSimulated: true,
        claim: claimText,
        evidence: evidenceText || 'User-submitted unverified bitstream or textual claim.',
        skepticAnalysis: {
          unsupportedAssumptions: [
            `Assumes the primary assertion in "${claimText.slice(0, 50)}..." is authentic without verified cryptographic provenance.`,
            "Assumes the reporting channel has direct first-hand verification rather than repeating secondary viral commentary.",
            "Assumes context has not been cherry-picked or temporally relocated from an earlier event."
          ],
          missingEvidence: [
            "Lack of cryptographically signed C2PA provenance metadata or camera device attestation.",
            "No corroborating independent confirmation from verified public registries or accredited observers.",
            "Absence of unedited raw source material for sensor noise analysis."
          ],
          alternativeExplanations: [
            "Coordinated viral engagement farming utilizing sensational framing.",
            "Synthetic or semi-automated text/audio generation designed to provoke immediate public reaction."
          ],
          contradictions: [
            "Contextual timeline discrepancies observed against primary official registries.",
            "Lacks verifiable institutional corroboration."
          ],
          substantiationRequirements: [
            "Cryptographic proof of origin or multi-sensor independent validation.",
            "Confirmation from official primary source entity."
          ]
        },
        forensicAnalysis: {
          textCharacteristics: "The submitted claim employs urgent, emotionally heightened lexical tokens designed to bypass critical analytical hesitation.",
          sourceObservations: "Delivered through an unverified client submission channel without an unbroken chain of custody.",
          visualClues: evidenceText.includes('http') || evidenceText.includes('.jpg') || evidenceText.includes('.png')
            ? "Optical inspection indicates compression quantization consistent with re-encoded web imagery."
            : "No direct raw image bitstream provided for discrete frequency analysis.",
          audioClues: "No acoustic recording provided for formant frequency evaluation.",
          groundedObservations: [
            "Observed: The claim lacks an authenticated cryptographic digital signature.",
            "Observed: The phrasing relies on uncorroborated third-party testimony.",
            "Observed: Information cannot be corroborated in authoritative public archives."
          ]
        },
        challengeRound: {
          skepticAssertion: "Does the lack of cryptographic signatures immediately indicate malicious intent, or could this simply be organic information shared by a citizen observer without technical verification tools?",
          forensicResponse: "Lack of signature alone does not prove malicious intent, but the presence of coordinated linguistic amplification markers and absent corroboration substantially elevates the deception risk profile.",
          adjudicatorNote: "The Forensic Analyst rightly distinguishes between unproven assertions and proven malicious fabrication, preserving epistemic humility."
        },
        agreementDisagreement: {
          agreements: [
            "Both agree that the provided evidence is currently insufficient to substantiate the claim as factual.",
            "Both agree that independent corroboration from primary sources is mandatory before publication."
          ],
          disagreements: [
            "The Skeptic leans toward an assumption of opportunistic misinterpretation, while the Forensic Analyst flags structural patterns of deliberate viral engineering."
          ],
          unresolvedQuestions: [
            "Who was the original author of the initial assertion?",
            "What physical evidence exists beyond secondary narrative retelling?"
          ]
        },
        finalAssessment: {
          outcome: "Insufficient evidence",
          verdictSummary: "The submitted claim is categorized as UNVERIFIED WITH INSUFFICIENT EVIDENCE. While manipulation indicators exist, available data cannot definitively substantiate or disprove the assertion without primary source access.",
          groundedEvidence: [
            "Direct user submission lacking authenticated C2PA chain of custody.",
            "Absence of independent corroborating telemetry in public verification indexes."
          ],
          limitations: [
            "Investigation performed strictly on user-provided excerpt without live network scraping."
          ],
          recommendedNextSteps: [
            "Do not amplify or re-publish the assertion without primary source attestation.",
            "Submit high-resolution original media or raw document files to Evidence Autopsy.",
            "Monitor official institutional communications for formal acknowledgments."
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
    if (this.isLiveMode()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/digital-twin/respond`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId: scenario.id,
            history: conversationHistory,
            message: userMessageText,
          }),
        });
        if (!response.ok) throw new Error(`Live AI status ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn('Live AI unavailable for Digital Twin, using local branch engine:', err);
      }
    }

    // ── DEMO / CLIENT-SIDE DETERMINISTIC BRANCHING SIMULATOR ──
    await delay(800 + Math.random() * 600); // Simulate realistic human/bot typing cadence

    const lower = userMessageText.toLowerCase();

    // 1. Detect user intent
    let detectedIntent = 'challenge';

    // Patterns for verification & out-of-band checks
    if (
      lower.includes('call') ||
      lower.includes('voice') ||
      lower.includes('video') ||
      lower.includes('landline') ||
      lower.includes('brother') ||
      lower.includes('daughter') ||
      lower.includes('zoom') ||
      lower.includes('meet') ||
      lower.includes('directory') ||
      lower.includes('embassy') ||
      lower.includes('desk') ||
      lower.includes('contact') ||
      lower.includes('authenticat')
    ) {
      detectedIntent = 'verify';
    } 
    // Patterns for safe refusal & policy citations
    else if (
      lower.includes('no') ||
      lower.includes("won't") ||
      lower.includes("can't") ||
      lower.includes('cannot') ||
      lower.includes('policy') ||
      lower.includes('refuse') ||
      lower.includes('scam') ||
      lower.includes('fraud') ||
      lower.includes('report') ||
      lower.includes('never share') ||
      lower.includes('forbid') ||
      lower.includes('illegal') ||
      lower.includes('ciso') ||
      lower.includes('security')
    ) {
      detectedIntent = 'safe';
    }
    // Patterns for risky compliance / giving into demands
    else if (
      lower.includes('sent') ||
      lower.includes('code is') ||
      lower.includes('here is the') ||
      lower.includes('transfer') ||
      lower.includes('ok i will') ||
      lower.includes('okay i will') ||
      lower.includes('clicking') ||
      lower.includes('zelle') ||
      lower.includes('crypto') ||
      lower.includes('sending') ||
      lower.includes('csv') ||
      lower.includes('email it') ||
      lower.includes('deposit') ||
      lower.includes('password')
    ) {
      detectedIntent = 'risky';
    }
    // Questions and challenges
    else if (
      lower.includes('why') ||
      lower.includes('who') ||
      lower.includes('what') ||
      lower.includes('how') ||
      lower.includes('where') ||
      lower.includes('prove')
    ) {
      detectedIntent = 'challenge';
    }

    // Fetch scenario dialogue branch
    const branch = scenario.dialogueTree[detectedIntent] || scenario.dialogueTree.challenge;

    return {
      isSimulated: true,
      text: branch.botReply,
      detectedIntent,
      suggestedFollowUps: branch.suggestions || [],
    };
  },

  /**
   * DIGITAL TWIN TEST: Evaluate complete conversation against scenario rubric
   */
  evaluateDigitalTwinSession(scenario, history) {
    let verificationAttempted = false;
    let sensitiveDataWithheld = true;
    let urgencyRecognized = false;
    let complianceAvoided = true;
    const keyActionsObserved = [];

    // Analyze full exchange
    history.forEach((msg) => {
      if (msg.sender === 'user') {
        const text = msg.text.toLowerCase();

        // 1. Verification checks
        if (
          text.includes('call') ||
          text.includes('voice') ||
          text.includes('landline') ||
          text.includes('video') ||
          text.includes('embassy') ||
          text.includes('directory') ||
          text.includes('zoom') ||
          text.includes('personal') ||
          text.includes('dorm') ||
          text.includes('birthday') ||
          text.includes('id') ||
          text.includes('ciso')
        ) {
          verificationAttempted = true;
          keyActionsObserved.push('Attempted independent or out-of-band verification.');
        }

        // 2. Sensitive data withholding checks
        if (
          text.includes('code is') ||
          text.includes('839') ||
          text.includes('sent the money') ||
          text.includes('sending the transfer') ||
          text.includes('exporting the raw') ||
          text.includes('here is the csv') ||
          text.includes('password is')
        ) {
          sensitiveDataWithheld = false;
          complianceAvoided = false;
          keyActionsObserved.push('CRITICAL VULNERABILITY: User complied with sensitive data / transfer request.');
        }

        // 3. Urgency / policy recognition
        if (
          text.includes('urgency') ||
          text.includes('pressure') ||
          text.includes('policy') ||
          text.includes('scam') ||
          text.includes('fraud') ||
          text.includes('never share') ||
          text.includes('sec-') ||
          text.includes('rules') ||
          text.includes('threat')
        ) {
          urgencyRecognized = true;
          keyActionsObserved.push('Explicitly recognized artificial urgency or policy bypass attempt.');
        }

        // 4. Firm refusal
        if (
          text.includes('will not') ||
          text.includes('cannot') ||
          text.includes('refuse') ||
          text.includes('declining') ||
          text.includes('reporting this')
        ) {
          complianceAvoided = true;
          keyActionsObserved.push('Firmly refused compliance with unauthorized demand.');
        }
      }
    });

    // Score calculation based on scenario weights
    let score = 0;
    const r = scenario.rubric;

    if (verificationAttempted) score += r.verificationAttempted.weight;
    if (sensitiveDataWithheld) score += r.withheldSensitiveData.weight;
    if (urgencyRecognized) score += r.recognizedUrgency.weight;
    if (complianceAvoided) score += r.avoidedCompliance.weight;

    let rating = 'RESILIENT // High Security Vigilance';
    let ratingColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (score < 50) {
      rating = 'COMPROMISED // High Risk Compliance';
      ratingColor = 'text-rose-700 bg-rose-50 border-rose-200';
    } else if (score < 80) {
      rating = 'CAUTIOUS // Partial Defense';
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
