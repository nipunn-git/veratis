// Mock Forensic Investigation Datasets for VERATIS

export const INVESTIGATION_CASES = [
  {
    id: "VR-8092",
    code: "CASE-8092-DIPLO",
    title: "Geneva Peace Envoy Emergency Protocol",
    subject: "Purported leaked footage of Ambassador Vance announcing closed-door treaty withdrawal",
    threatLevel: "CRITICAL",
    category: "SYNTHETIC NEURAL VIDEO / VOICE CLONING",
    verdict: "SYNTHETICALLY MANUFACTURED",
    verdictConfidence: 94.8,
    dateLogged: "OCT 14, 2026 // 18:42:09 UTC",
    leadInvestigator: "VERATIS UNIT 09 // S. HAWTHORNE",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    radarScores: {
      visual: 94,
      contextual: 88,
      temporal: 92,
      source: 79,
      claim: 86
    },
    radarAnalysis: {
      visual: "Sub-surface skin scattering inconsistency detected around zygomatic arc; neural blend boundary along mandibular margin.",
      contextual: "Press room podium seal corresponds to 2023 delegation room; microphone badges indicate defunct broadcast frequency.",
      temporal: "Video timestamp states 14:00 CET; flight transponder logs confirm Ambassador Vance was airborne over Zurich at that exact minute.",
      source: "Earliest propagation trace leads to newly registered Telegram relay node without prior digital provenance.",
      claim: "Treaty clause referenced in the statement does not exist in bilateral treaty codex document A/78/304."
    },
    annotations: [
      {
        id: "ann-1",
        label: "Mandibular Blend Line",
        x: 42,
        y: 48,
        width: 16,
        height: 18,
        severity: "critical",
        title: "Neural Face-Swap Boundary Discontinuity",
        detail: "Fourier transform analysis reveals 64px tiling artifacts and blur gradient anomalies where the neural face mask meets the collar line. High-frequency pixel noise drops by 37% inside the region."
      },
      {
        id: "ann-2",
        label: "Corneal Reflection Anomaly",
        x: 48,
        y: 28,
        width: 10,
        height: 10,
        severity: "critical",
        title: "Physically Impossible Specular Highlight",
        detail: "Right eye corneal reflection displays a single linear ceiling strip bank, while left eye displays two dispersed parabolic spotlights. Physics simulation shows light source divergence > 41 degrees."
      },
      {
        id: "ann-3",
        label: "Microphone Braid Pattern",
        x: 35,
        y: 72,
        width: 22,
        height: 16,
        severity: "warning",
        title: "Synthetic Texture Hallucination",
        detail: "Microphone pop filter mesh texture fails periodic hexagonal repetition. Neural generation hallucinated chaotic moiré patterns characteristic of latent diffusion upscalers."
      },
      {
        id: "ann-4",
        label: "Background Lapel Pin",
        x: 58,
        y: 62,
        width: 8,
        height: 8,
        severity: "info",
        title: "Historical Protocol Mismatch",
        detail: "The protocol enamel pin worn on the right lapel was officially retired by the Swiss Federal Council in December 2024, confirming stock footage compositing."
      }
    ],
    timeline: [
      {
        time: "14:02 UTC",
        date: "OCT 14, 2026",
        event: "First Seed Published",
        platform: "Telegram Channel @diplomatic_wire_ch",
        status: "suspicious",
        description: "12-second compressed MP4 uploaded with Russian and German text claiming 'emergency defection'."
      },
      {
        time: "14:15 UTC",
        date: "OCT 14, 2026",
        event: "Algorithmic Bot Amplification",
        platform: "X / Twitter & BlueSky",
        status: "suspicious",
        description: "340 coordinated dormant accounts quote-retweet the clip simultaneously within 90 seconds."
      },
      {
        time: "14:38 UTC",
        date: "OCT 14, 2026",
        event: "Financial Market Volatility",
        platform: "Forex & DAX Indices",
        status: "critical",
        description: "EUR/CHF slips 32 basis points as automated algorithmic sentiment trading bots ingest the video headline."
      },
      {
        time: "15:05 UTC",
        date: "OCT 14, 2026",
        event: "Official Denial Issued",
        platform: "Swiss Federal Department of Foreign Affairs",
        status: "verified",
        description: "Diplomatic mission confirms Ambassador Vance was in flight aboard Swiss Air Force Falcon 900."
      },
      {
        time: "15:22 UTC",
        date: "OCT 14, 2026",
        event: "Audio Phoneme Latency Forensic Match",
        platform: "VERATIS Acoustic Analysis",
        status: "verified",
        description: "Voice print verified as ElevenLabs v3 cloned model trained on Vance's 2022 World Economic Forum address."
      }
    ],
    gravityMap: {
      nodes: [
        { id: "CLAIM_1", label: "Claim: Vance Treaty Exit", type: "claim", gravity: 90 },
        { id: "EVID_VIDEO", label: "Geneva Press Clip", type: "media", gravity: 85 },
        { id: "EVID_AUDIO", label: "Voice Model Acoustic Clone", type: "anomaly", gravity: 95 },
        { id: "SRC_BOTS", label: "340 Synchronized Accounts", type: "source", gravity: 75 },
        { id: "FACT_FLIGHT", label: "Transponder LX-GVA Flight Log", type: "fact", gravity: 98 },
        { id: "PHYS_LIGHT", label: "Corneal Reflection Disparity", type: "anomaly", gravity: 92 },
        { id: "STOCK_BG", label: "2023 Stock Press Room", type: "context", gravity: 70 }
      ],
      connections: [
        { from: "CLAIM_1", to: "EVID_VIDEO", relation: "asserted_by", strength: 0.9 },
        { from: "FACT_FLIGHT", to: "CLAIM_1", relation: "directly_contradicts", strength: 0.98 },
        { from: "EVID_AUDIO", to: "EVID_VIDEO", relation: "proves_synthetic", strength: 0.95 },
        { from: "PHYS_LIGHT", to: "EVID_VIDEO", relation: "renders_impossible", strength: 0.92 },
        { from: "SRC_BOTS", to: "CLAIM_1", relation: "artificially_amplifies", strength: 0.8 },
        { from: "STOCK_BG", to: "EVID_VIDEO", relation: "recycled_asset", strength: 0.75 }
      ]
    },
    competingHypotheses: [
      {
        id: "hyp-1",
        title: "Synthetic Diffusion Model + Voice Clone Composite",
        probability: 91,
        status: "MOST PROBABLE",
        description: "The video is a completely fabricated composite using a photorealistic neural head swap placed over a paid actor's body, paired with an acoustic speech synthesis model.",
        supporting: [
          "Fourier high-frequency noise dropout in facial contour",
          "Divergent corneal light reflections (41° discrepancy)",
          "Acoustic spectrogram reveals pitch quantization identical to ElevenLabs voice architecture",
          "Verified ADS-B flight telemetry shows the subject was 11,000 meters in the air"
        ],
        contradicting: [
          "Background acoustics include subtle real-world microphone handling noise (likely overlaid in post)"
        ]
      },
      {
        id: "hyp-2",
        title: "Real Rehearsal Video with Falsified Context",
        probability: 7,
        status: "UNLIKELY",
        description: "The footage depicts a genuine contingency tabletop rehearsal recorded earlier in Vance's tenure, leaked out of historical context.",
        supporting: [
          "Room layout closely matches Geneva Room B-14 as configured in early 2023"
        ],
        contradicting: [
          "Mandibular pixel artifacts cannot occur in organic optical camera sensor readouts",
          "Audio voice print matches synthesized frequency spikes not present in analog vocal cords",
          "Official schedule confirms Vance never visited Room B-14 in 2026"
        ]
      },
      {
        id: "hyp-3",
        title: "Genuine Spontaneous Leaked Event",
        probability: 2,
        status: "DEBUNKED",
        description: "The statement was genuine, occurred live, and the denial is an official cover-up.",
        supporting: [],
        contradicting: [
          "Overwhelming forensic, temporal, biometric, and physical light evidence invalidates the premise"
        ]
      }
    ],
    uncertaintyEngine: {
      known: [
        "The subject was indisputably in Swiss airspace at the claimed event timestamp.",
        "The corneal light reflections violate standard 3D Euclidean optical physics.",
        "The audio waveform exhibits characteristic neural vocoder phase artifacts below 120Hz."
      ],
      unknown: [
        "The exact physical identity of the body actor whose neck and torso were used as the neural canvas.",
        "The precise geo-location of the server that rendered the diffusion frames."
      ],
      untestable: [
        "The subjective motive or ultimate geopolitical sponsor cannot be determined purely from pixel and signal telemetry."
      ]
    }
  },
  {
    id: "VR-4120",
    code: "CASE-4120-SUBSEA",
    title: "Abyssal Trench Autonomous Trench Crawler Anomaly",
    subject: "Claimed leaked sonar & optical photos of an uncharted seabed structure at 8,200m depth",
    threatLevel: "MODERATE",
    category: "DIFFUSION SYNTHETIC IMAGERY",
    verdict: "FULLY AI-GENERATED (MIDJOURNEY V7/FLUX)",
    verdictConfidence: 98.2,
    dateLogged: "OCT 12, 2026 // 09:15:33 UTC",
    leadInvestigator: "VERATIS UNIT 04 // M. REYES",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    radarScores: {
      visual: 98,
      contextual: 82,
      temporal: 70,
      source: 89,
      claim: 94
    },
    radarAnalysis: {
      visual: "Rayleigh underwater scattering physics are violated; light falloff does not follow Beer-Lambert attenuation law.",
      contextual: "Submersible markings feature unpronounceable pseudo-cyrillic typography and nonsensical hydraulic piping.",
      temporal: "Claimed research expedition R/V Nereus was in dry dock in Brest on the logged date.",
      source: "Originates from a Discord rendering enthusiast channel before reposting to conspiracy subreddits.",
      claim: "Claims of 8,200m depth inconsistent with pressure rating markings on the hull."
    },
    annotations: [
      {
        id: "ann-41-1",
        label: "Impossible Caustics",
        x: 30,
        y: 35,
        width: 25,
        height: 20,
        severity: "critical",
        title: "Synthetic Sunlight Caustic at 8,000m Depth",
        detail: "Sunlight caustics are physically extinguished past 200m in oceanic water. Image depicts crisp ripple caustics requiring an overhead point light source at infinite distance."
      },
      {
        id: "ann-41-2",
        label: "Gibberish Stencil Text",
        x: 55,
        y: 60,
        width: 18,
        height: 12,
        severity: "critical",
        title: "Diffusion Glyphic Hallucination",
        detail: "Hull stencil typography mimics Cyrillic and Latin letterforms but lacks linguistic syntax. Classical latent diffusion failure mode."
      }
    ],
    timeline: [
      {
        time: "02:14 UTC",
        date: "OCT 12, 2026",
        event: "Image Posted to Discord Midjourney Showcase",
        platform: "Discord Community",
        status: "verified",
        description: "User @deepsea_dreamer posts under 'prompt engineering sci-fi trench crawler'."
      },
      {
        time: "05:40 UTC",
        date: "OCT 12, 2026",
        event: "Decontextualized Re-upload",
        platform: "Reddit r/conspiracy & Telegram",
        status: "suspicious",
        description: "Stripped of metadata, captioned as 'Whistleblower leaks classified Mariana Trench anomaly'."
      }
    ],
    gravityMap: {
      nodes: [
        { id: "CLAIM_OCEAN", label: "Mariana Structure Leaked", type: "claim", gravity: 80 },
        { id: "EVID_IMG", label: "Crawler Still", type: "media", gravity: 90 },
        { id: "DISCORD_PROMPT", label: "Original Midjourney Prompt", type: "fact", gravity: 100 },
        { id: "PHYSICS_OPTIC", label: "Beer-Lambert Light Violation", type: "anomaly", gravity: 94 }
      ],
      connections: [
        { from: "DISCORD_PROMPT", to: "CLAIM_OCEAN", relation: "directly_disproves", strength: 1.0 },
        { from: "PHYSICS_OPTIC", to: "EVID_IMG", relation: "proves_synthetic", strength: 0.94 }
      ]
    },
    competingHypotheses: [
      {
        id: "hyp-41-1",
        title: "Latent Diffusion Art Project Misrepresented as Reality",
        probability: 99,
        status: "CONFIRMED",
        description: "Created in Midjourney v6/v7 for artistic purposes, subsequently scraped and weaponized as clickbait misinformation.",
        supporting: [
          "Exact match found in public Discord generation logs with prompt text",
          "Severe physical optical violations for deep sea acoustics and light",
          "Hallucinated letters on mechanical components"
        ],
        contradicting: []
      }
    ],
    uncertaintyEngine: {
      known: [
        "The image is 100% synthetically rendered.",
        "Original prompt author identified in open source Discord records."
      ],
      unknown: [
        "Whether the Reddit re-poster acted in malicious deception or genuine gullibility."
      ],
      untestable: [
        "None; this case is forensically closed."
      ]
    }
  },
  {
    id: "VR-6715",
    code: "CASE-6715-METEO",
    title: "Metro Transit Central Hub Structural Collapse",
    subject: "Viral images showing alleged catastrophic tunnel fire and structural cave-in during morning rush",
    threatLevel: "HIGH",
    category: "RECYCLED ARCHIVAL MEDIA / MISLEADING CONTEXT",
    verdict: "GENUINE 2018 MEDIA MISATTRIBUTED TO 2026",
    verdictConfidence: 96.1,
    dateLogged: "OCT 15, 2026 // 06:10:14 UTC",
    leadInvestigator: "VERATIS UNIT 02 // E. CHEN",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    radarScores: {
      visual: 22,
      contextual: 96,
      temporal: 98,
      source: 91,
      claim: 95
    },
    radarAnalysis: {
      visual: "Image is optically organic; no diffusion or deepfake artifacts. Sensor Bayer pattern and chromatic aberration are genuine.",
      contextual: "Advertising billboard in tunnel background displays an advertisement for a 2018 FIFA World Cup broadcast.",
      temporal: "Reverse image hash matches a controlled demolition drill conducted in Frankfurt in October 2018.",
      source: "Coordinated network of financial panic bots posting to induce commuter transport stock shorting.",
      claim: "Transit authority live CCTV feeds confirm uninterrupted service with zero emergency dispatches."
    },
    annotations: [
      {
        id: "ann-67-1",
        label: "2018 Ad Poster",
        x: 65,
        y: 40,
        width: 15,
        height: 22,
        severity: "critical",
        title: "Temporal Anchor: 2018 Commercial Poster",
        detail: "High-resolution OCR recovers campaign slogan from June 2018 German telecommunications provider. Proves photo is at least 8 years old."
      },
      {
        id: "ann-67-2",
        label: "Organic Sensor Noise",
        x: 20,
        y: 65,
        width: 14,
        height: 14,
        severity: "info",
        title: "Genuine Optical Photography",
        detail: "Sensor ISO noise matches Sony α7 III CMOS readout pattern. No synthetic diffusion tiling or frequency attenuation present."
      }
    ],
    timeline: [
      {
        time: "05:48 UTC",
        date: "OCT 15, 2026",
        event: "Early Morning Panic Post",
        platform: "WhatsApp Groups & X",
        status: "suspicious",
        description: "Captioned 'AVOID CENTRAL STATION NOW: EXPLOSION AND COLLAPSE'."
      },
      {
        time: "06:05 UTC",
        date: "OCT 15, 2026",
        event: "Transit Authority Live Stream",
        platform: "Official Transit Webcams",
        status: "verified",
        description: "Live camera shows commuters boarding trains smoothly under normal operations."
      }
    ],
    gravityMap: {
      nodes: [
        { id: "CLAIM_COLLAPSE", label: "Current Tunnel Collapse", type: "claim", gravity: 85 },
        { id: "FACT_2018", label: "2018 Frankfurt Drill Photo", type: "fact", gravity: 98 },
        { id: "LIVE_CCTV", label: "Live Station Feed", type: "fact", gravity: 95 }
      ],
      connections: [
        { from: "FACT_2018", to: "CLAIM_COLLAPSE", relation: "recycled_footage", strength: 0.98 },
        { from: "LIVE_CCTV", to: "CLAIM_COLLAPSE", relation: "empirically_refutes", strength: 0.99 }
      ]
    },
    competingHypotheses: [
      {
        id: "hyp-67-1",
        title: "Malicious Recirculation of Archival Drill Footage",
        probability: 97,
        status: "CONFIRMED",
        description: "A genuine, unmanipulated photograph from an October 2018 Frankfurt emergency services exercise was deliberately republished as current breaking news.",
        supporting: [
          "Exact match in German Federal Fire Brigade public archives (2018)",
          "Background 2018 commercial advertisement verified",
          "Station architecture is Frankfurt Taunusanlage, not London or NYC"
        ],
        contradicting: []
      }
    ],
    uncertaintyEngine: {
      known: [
        "The photo itself is optically real and unmanipulated.",
        "The claim of an active catastrophe is 100% false.",
        "The event took place in Frankfurt in October 2018."
      ],
      unknown: [
        "Identity of the account that initially re-tagged the archival image."
      ],
      untestable: [
        "None."
      ]
    }
  }
];
