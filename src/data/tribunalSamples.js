/**
 * Sample Investigation Claims for Truth Tribunal
 * Realistic, high-stakes synthetic media, leaked document, and deceptive claim scenarios.
 */
export const TRIBUNAL_SAMPLES = [
  {
    id: "sample-geneva-peace",
    title: "Geneva Closed-Door Peace Treaty Withdrawal",
    category: "Diplomatic Disinformation",
    claim: "Leaked video shows European Ambassador Vance announcing immediate unilateral withdrawal from the bilateral security treaty during an emergency press briefing in Geneva.",
    evidenceProvided: "A 48-second video clip uploaded to an anonymous Telegram relay at 14:02 UTC. The clip shows Ambassador Vance speaking at a podium bearing the UN Geneva emblem, with active press photographers in the background.",
    knownContext: "Ambassador Vance was scheduled to travel from Bern to Zurich on that day. Swiss Federal Council records show the protocol lapel pin worn in the clip was retired in 2024. The bilateral treaty codex A/78/304 does not contain the clause read aloud.",
    skepticAnalysis: {
      unsupportedAssumptions: [
        "Assumes the speaker in the footage is genuinely Ambassador Vance rather than a neural face-swap synthesis.",
        "Assumes the event took place on the claimed date (Oct 14, 2026) rather than repurposed 2023 stock archival footage.",
        "Assumes an ambassador has constitutional authority to unilaterally dissolve a ratified bilateral treaty without parliamentary assent."
      ],
      missingEvidence: [
        "Zero independent press pool verification or raw camera feeds from accredited journalists present in the room.",
        "Absence of official diplomatic cables, press office advisories, or UN depository notifications.",
        "No matching audio track on official UN WebTV broadcasting logs for Geneva Hall 4."
      ],
      alternativeExplanations: [
        "A sophisticated synthetic face-swap and voice-clone applied over genuine 2023 press conference footage to trigger financial market panic.",
        "A coordinated geopolitical deception operation timed during market trading hours."
      ],
      contradictions: [
        "Flight transponder records from the Swiss Air Force confirm Ambassador Vance's transport was airborne over Zurich at the exact 14:00 CET timestamp cited in the video.",
        "Visual inspection confirms the lapel pin design was officially decommissioned 22 months ago."
      ],
      substantiationRequirements: [
        "Cryptographically signed camera hardware attestation (C2PA) from the recording device.",
        "Official Swiss Department of Foreign Affairs confirmation of a special session."
      ]
    },
    forensicAnalysis: {
      textCharacteristics: "Syntax in the statement exhibits unnatural grammatical calques characteristic of automated translation engines. Phrasing deviates from formal diplomatic treaty dissolution language.",
      sourceObservations: "First seed originated on Telegram relay channel 'Channel_8092_Leaks' (account created < 72 hours prior to upload). Metadata headers completely stripped; no EXIF, GPS, or camera sensor signatures.",
      visualClues: "Sub-surface skin scattering inconsistency detected around zygomatic arc; localized 64px tiling boundary along mandibular margin. Corneal specular reflections show light source divergence > 41 degrees.",
      audioClues: "Spectrogram analysis reveals absence of room reverberation harmonics above 8.2 kHz, consistent with neural vocoder synthesis (voice cloning) overdubbed on muffled ambient noise.",
      groundedObservations: [
        "Observed: The video file lacks original camera metadata and shows re-quantization at 88% JPEG/MPEG compression.",
        "Observed: The audio frequency distribution displays synthetic cutoff at 16kHz typical of standard consumer text-to-speech models.",
        "Observed: Podium seal geometry matches 2023 press room configuration, not current 2026 renovated dais."
      ]
    },
    challengeRound: {
      skepticAssertion: "The forensic analyst highlights a 64px jawline blend line as proof of deepfake face-swapping. However, aggressive social media re-compression and downsampling on Telegram can introduce boundary blockiness without malicious intent. Can we distinguish compression artifacts from neural boundary masking?",
      forensicResponse: "Yes. When an authentic image undergoes standard video transcoding, the Discrete Cosine Transform (DCT) quantization error is uniform across the entire frame. In this specimen, high-frequency noise variance drops by 37% strictly inside the mandibular polygon while remaining natural across the collar and background. This localized step-function drop cannot be produced by global codec compression.",
      adjudicatorNote: "The Forensic Analyst successfully demonstrates localized variance inconsistency, ruling out benign platform compression."
    },
    agreementDisagreement: {
      agreements: [
        "Both agree that the video file has zero authentic provenance and originated from an unverified relay node.",
        "Both agree that the flight transponder timeline directly contradicts the claimed time and physical presence of the speaker.",
        "Both agree that no corroborating international diplomatic records substantiate the claim."
      ],
      disagreements: [
        "The Skeptic argues the entire scene might be an actor with practical prosthetic makeup, whereas the Forensic Analyst identifies digital neural latent inpainting boundaries.",
        "The Skeptic questions whether the audio was an actual impersonator rather than an AI model; Forensic analysis demonstrates vocoder frequency cutoff."
      ],
      unresolvedQuestions: [
        "Who commissioned the generation and distribution of the synthetic asset?",
        "Was the original base footage recorded with an authentic camera in 2023 or generated through text-to-video diffusion?"
      ]
    },
    finalAssessment: {
      outcome: "Potential manipulation indicators",
      verdictSummary: "The submitted claim is categorized as SYNTHETICALLY FABRICATED with High Confidence. Physical flight telemetry renders the speaker's presence impossible, while multi-spectral forensic analysis reveals localized neural boundary discontinuities and vocal cloning harmonics.",
      groundedEvidence: [
        "Swiss Air Force flight logs showing Ambassador Vance was airborne at claimed timestamp.",
        "Localized 37% noise variance drop and 64px tiling along jawline.",
        "Historical mismatch of decommissioned 2024 diplomatic lapel insignia.",
        "Complete absence of C2PA provenance signatures or corroborating diplomatic records."
      ],
      limitations: [
        "Without the uncompressed raw camera recording, absolute mathematical proof of the exact deepfake model weights cannot be determined.",
        "Source attribution beyond the primary Telegram relay node remains cryptographically obfuscated."
      ],
      recommendedNextSteps: [
        "Issue cryptographic provenance alert to international news wires referencing Swiss transponder logs.",
        "Request subpoena on Telegram ingress IP and infrastructure hosting the relay node.",
        "Cross-reference base footage against the 2023 UN Geneva audio/video archival library."
      ]
    }
  },
  {
    id: "sample-bank-liquidity",
    title: "Central Bank Emergency Liquidity Freeze",
    category: "Financial System Deception",
    claim: "Audio recording circulating on WhatsApp claims Federal Reserve Vice Chair announced an immediate 48-hour moratorium on interbank transfers and domestic retail withdrawals.",
    evidenceProvided: "A 32-second voice note (.opus format) forwarded 'frequently' on private messaging groups. Audio quality is clear with faint background air conditioning hum.",
    knownContext: "Federal Reserve Board meeting calendar shows open market operations are normal. Interbank Fedwire and ACH status dashboards indicate 100% operational uptime.",
    skepticAnalysis: {
      unsupportedAssumptions: [
        "Assumes an announcement of this magnitude would be communicated through a low-bitrate voice memo rather than a public press conference on federalreserve.gov.",
        "Assumes emergency capital controls can be declared verbally by an individual official without executive presidential directive or FOMC resolution."
      ],
      missingEvidence: [
        "Absence of Federal Register notice, official press release, or emergency regulatory order.",
        "No matching wire reports on Bloomberg Terminal, Reuters, or financial regulatory registries.",
        "No corroborating banking distress signals in overnight repo or SOFR borrowing rates."
      ],
      alternativeExplanations: [
        "A synthetic voice clone generated via zero-shot voice cloning tools designed to trigger coordinated bank run panic or crypto volatility.",
        "A voice actor practicing a hypothetical scenario or tabletop crisis exercise leaked out of context."
      ],
      contradictions: [
        "Real-time Fedwire, FedNow, and CHIPS payment networks are processing transactions in continuous real time.",
        "The Vice Chair was speaking at an open academic symposium in Chicago during the alleged recording window."
      ],
      substantiationRequirements: [
        "Official publication on the Federal Reserve Board public bulletin.",
        "Independent verification through commercial banking clearinghouse advisories."
      ]
    },
    forensicAnalysis: {
      textCharacteristics: "The script uses sensational, non-statutory terminology ('immediate account freeze', 'interbank bank halt') rather than standard Federal Reserve Act regulatory definitions.",
      sourceObservations: "OPUS audio format with multiple re-encoding containers. Metadata indicates file was created using consumer audio editing software 4 hours prior to viral circulation.",
      visualClues: "Not applicable (pure audio specimen).",
      audioClues: "Voice prosody exhibits robotic pitch-contour flatness with absent micro-tremors typical of human vocal cords under high emotional stress. Spectrogram indicates discrete 24kHz cutoff with phase stitching artifacts.",
      groundedObservations: [
        "Observed: Spectral phase continuity breaks every 1.8 seconds, indicating concatenated acoustic tokens.",
        "Observed: Absence of natural breathing inhalations between long sentences.",
        "Observed: Real-time payments telemetry shows zero operational disruption across participating financial institutions."
      ]
    },
    challengeRound: {
      skepticAssertion: "Could this recording be authentic audio from an internal, classified crisis simulation exercise rather than an AI-generated clone?",
      forensicResponse: "While internal training exercises occur, acoustic analysis reveals micro-phase discontinuities and vocoder pitch quantization. Natural human speech—even when role-playing—contains respiratory pauses and sub-glottal resonance. The voice profile exactly matches a commercially available eleven-labs voice model trained on the official's congressional testimonies.",
      adjudicatorNote: "The acoustic evidence confirms synthetic generation, substantially weakening the 'leaked internal exercise' hypothesis."
    },
    agreementDisagreement: {
      agreements: [
        "Both agree that real-time payment rails are functioning with zero disruption, disproving the factual truth of the claim.",
        "Both agree the voice note was crafted to induce viral emotional reaction and panic.",
        "Both agree that no official documentation exists."
      ],
      disagreements: [
        "The Skeptic cautions against declaring intentional economic warfare without attribution; the Forensic Analyst notes high correlation with market manipulation schemes."
      ],
      unresolvedQuestions: [
        "Did the creator profit from short positions in regional banking equities during the panic window?"
      ]
    },
    finalAssessment: {
      outcome: "Misleading context suspected",
      verdictSummary: "The claim is categorized as UNVERIFIED AND HIGHLY DECEPTIVE. Telemetry from payment settlement systems confirms normal operations, while speech acoustic forensics demonstrate synthetic neural voice cloning.",
      groundedEvidence: [
        "Payment network telemetry (Fedwire / CHIPS) operating at nominal volume.",
        "Acoustic phase discontinuities and artificial pitch quantization in voice recording.",
        "Official public schedule placing the speaker in an open public forum in Chicago."
      ],
      limitations: [
        "Voice clone training dataset cannot be determined with legal finality without access to the creator's local compute environment."
      ],
      recommendedNextSteps: [
        "Financial institutions should issue standardized fraud advisory notices.",
        "Cross-reference social media amplification nodes against known market manipulation accounts."
      ]
    }
  },
  {
    id: "sample-submerged-datacenter",
    title: "Leaked Photo of Flooded AI Data Center Core",
    category: "Corporate Infrastructure",
    claim: "Confidential photograph allegedly leaked by a contractor shows catastrophic coolant breach and sea-water flooding at a frontier AI lab's coastal cluster in Norway.",
    evidenceProvided: "A high-resolution JPEG showing server racks partially submerged in turbulent water with glowing neon cables and emergency flashing red lights.",
    knownContext: "The facility operator reported 99.99% cluster availability over the past 30 days. Independent marine seismic sensors around the fjord detected no structural or geological events.",
    skepticAnalysis: {
      unsupportedAssumptions: [
        "Assumes an industrial data center would utilize decorative exposed neon cables inside a hermetically sealed immersion facility.",
        "Assumes catastrophic ocean flooding would leave server LED status lights operational underwater without triggering electrical arc containment."
      ],
      missingEvidence: [
        "Zero employee chatter, contractor reports, or insurance casualty filings.",
        "No compute capacity drop observed across the public cloud API status monitor.",
        "No emergency maritime or environmental response teams deployed to the fjord."
      ],
      alternativeExplanations: [
        "A photorealistic text-to-image generation (e.g. Midjourney v6 / FLUX.1) depicting a fictional cyberpunk disaster scenario.",
        "An artistic render commissioned for a science-fiction publication misattributed as a factual leak."
      ],
      contradictions: [
        "Physical server racks in the image display incoherent text on warning labels and non-standard form factor dimensions.",
        "Water surface physics exhibit conflicting reflection angles and impossible caustic patterns."
      ],
      substantiationRequirements: [
        "Local emergency services incident report from the municipal fire department.",
        "Noticeable GPU capacity degradation on public LLM inference endpoints."
      ]
    },
    forensicAnalysis: {
      textCharacteristics: "Inspection of warning labels on the server chassis reveals classic neural diffusion pseudotext ('CAUTON: NYDRO-VOLT FLUX') rather than compliant European electrical hazard signage.",
      sourceObservations: "EXIF metadata contains standard image generator tags; color profile conforms to sRGB Web standard with synthetic noise dithering.",
      visualClues: "Optical analysis reveals impossible perspective convergence on server rack rails; server cables blend smoothly into the concrete wall without termination jacks. Water ripples lack physical surface tension caustics.",
      audioClues: "Not applicable.",
      groundedObservations: [
        "Observed: Warning signage contains unreadable pseudo-typographic characters.",
        "Observed: Server rack power cables lack physical junction termination and fuse blocks.",
        "Observed: Facility cloud cluster has served 1.2 billion token requests without interruption."
      ]
    },
    challengeRound: {
      skepticAssertion: "Could this be a real high-security prototype underwater data center (like Microsoft Project Natick) experiencing a controlled sealed test?",
      forensicResponse: "Project Natick used sealed cylindrical pressure vessels without exposed loose wiring or ceiling catwalks. Furthermore, close optical examination of the reflections reveals fingers on the photographer's reflection in the water that have 6 digits—a definitive hallmark of diffusion image synthesis.",
      adjudicatorNote: "The anatomical reflection anomaly and non-standard equipment topology establish synthetic fabrication."
    },
    agreementDisagreement: {
      agreements: [
        "Both agree the image is an artificial generation rather than a real industrial catastrophe.",
        "Both agree that operational telemetry disproves any actual infrastructure loss."
      ],
      disagreements: [
        "The Skeptic believes it was harmless sci-fi art shared playfully; the Forensic Analyst notes it was targeted at stock short-sellers."
      ],
      unresolvedQuestions: [
        "Was the prompt specifically engineered to manipulate technology stock valuations?"
      ]
    },
    finalAssessment: {
      outcome: "Potential manipulation indicators",
      verdictSummary: "The image is categorized as SYNTHETIC MEDIA GENERATION (AI Image Synthesis). Diffusion rendering artifacts, typographic pseudo-text, and uninterrupted cluster telemetry definitively disprove the claimed catastrophic flood.",
      groundedEvidence: [
        "Incoherent pseudo-text on server chassis warning plates.",
        "Anatomical anomalies in the water specular reflection.",
        "Uninterrupted 99.99% cluster telemetry and zero cloud API service degradation."
      ],
      limitations: [
        "Prompt text used to generate the image cannot be recovered from the pixel matrix alone."
      ],
      recommendedNextSteps: [
        "Tag media asset with C2PA synthetic label.",
        "Notify financial misinformation tracking desks of viral synthetic imagery."
      ]
    }
  }
];
