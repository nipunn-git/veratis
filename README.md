<div align="center">

<img src="./public/veratis-logo.png" alt="VERATIS Logo" width="180" style="margin-bottom: 16px;" />

# VERATIS

### *Reality Has a Blind Spot — Take One of Ours.*

An advanced full-stack epistemic intelligence platform and media forensics suite that neutralizes synthetic manipulation, deepfakes, conversational social engineering, and viral disinformation through **adversarial multi-agent deliberation**, **neural latent inversion**, and **client-side browser intervention**.

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.16-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8860D0?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![GroqCloud](https://img.shields.io/badge/Groq-Llama_3.3_70B-f55036?style=for-the-badge&logo=meta&logoColor=white)](https://groq.com/)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

[Platform Overview](#-overview--epistemic-philosophy) • [Platform Architecture](#-platform-architecture) • [Forensic Workspaces](#-core-forensic-workspaces) • [Chrome Extension](#-veratis-companion-chrome-extension-mv3) • [Serverless AI Engine](#-serverless-api--dual-ai-engine) • [Quick Start](#-quick-start--local-development) • [Contributors](#-contributors)

---

</div>

## 🔭 Overview & Epistemic Philosophy

Modern digital ecosystems face unprecedented disruption from **hyper-realistic generative AI synthetic media (deepfakes)**, **coordinated emotional and linguistic manipulation**, and **rapid viral rumor cascades**. 

Conventional detection solutions fail because they rely on **opaque, binary confidence scores** (e.g., *"87% Fake"*), which erode user trust, hallucinate certainty, and offer no explainable forensic reasoning.

**VERATIS shifts the verification paradigm:**
- 🚫 **No Black-Box Percentages**: Decisions are accompanied by orthogonal evidence vectors and dialectical argumentation.
- ⚖️ **Adversarial Deliberation**: Multiple autonomous AI personas with competing priors cross-examine claims to eliminate sycophancy and bias.
- 🔬 **Latent Pre-Morph Inversion**: Rather than merely labeling media as altered, VERATIS reconstructs the predicted authentic baseline ground truth.
- 🛡️ **Client-Side Browser Intervention**: The VERATIS Companion brings explainable epistemic analysis directly into the user's active browsing tab via a persistent Chrome Manifest V3 Side Panel.

---

## 🏛️ Platform Architecture

VERATIS is engineered as a privacy-preserving, low-latency ecosystem composed of an interactive SPA, a Chromium Manifest V3 extension, and a high-throughput serverless reasoning layer:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          VERATIS ECOSYSTEM                             │
├────────────────────────────┬───────────────────────────────────────────┤
│    Web Dashboard (SPA)     │    VERATIS Companion (Chrome Ext MV3)     │
│   React 18 · Vite · Tailwind│    Persistent Side Panel · Safe DOM Parser│
│  Three.js Halftone Nebula  │    Web Speech Dictation & Audio Playback  │
└─────────────┬──────────────┴─────────────────────┬─────────────────────┘
              │                                    │
              ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Serverless API Layer (Vercel Node)                   │
│      /api/companion    ·    /api/tribunal    ·    /api/twin            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Dual AI Live Reasoning Engine                          │
│   Google Gemini 2.5 Flash   ◄─── Failover ───►   Groq Llama 3.3 70B    │
│            (Deterministic Offline Engine as Zero-Fail Fallback)        │
└────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **Frontend Core**: React 18 with Vite 6 build infrastructure.
- **Styling & Design System**: Tailwind CSS with custom editorial typography (**Geist**, **Instrument Sans**, **Plus Jakarta Sans**, and **JetBrains Mono**).
- **Shader & Kinetic Background**: Custom Three.js WebGL Halftone Nebula generating a serene, interactive drift particle canvas with zero distraction.
- **Browser Extension**: Manifest V3 Chrome Extension featuring Chrome `sidePanel` API, content script DOM sanitization, Web Speech API recognition, and TTS speech synthesis.
- **Backend Infrastructure**: Node.js serverless functions running on Vercel with CORS headers for cross-origin browser extension execution.
- **AI Intelligence Backbone**: Dual LLM provider architecture supporting **Google Gemini 2.5 Flash** and **GroqCloud Llama 3.3 70B Versatile**, with an instant offline heuristic fallback.

---

## 🔬 Core Forensic Workspaces

The VERATIS web dashboard features a minimalist Obsidian capsule dock offering instant keyboard-driven navigation (`1`–`7`) across six forensic modules:

```
[1 Home]  [2 Tribunal]  [3 Digital Twin]  [4 Reconstruct]  [5 Reactor]  [6 Neutralizer]  [7 Radar]
```

### 1. ⚖️ The Truth Tribunal (`/tribunal`)
*Adversarial Multi-Agent Epistemic Deliberation*
- **Problem**: Single AI models suffer from sycophancy, cognitive bias, and hallucinated consensus.
- **Mechanism**: Deconstructs claims and evidence by orchestrating an adversarial debate between three specialized AI agents:
  1. **The Skeptic**: Methodically attacks the premise, flags logical fallacies, uncovers unstated assumptions, and interrogates provenance motives.
  2. **The Forensic Analyst**: Evaluates empirical data, physical constraints, historical benchmarks, and cryptographic metadata.
  3. **The Adjudicator**: Synthesizes the debate into a transparent ruling detailing verified facts, unverified assertions, and context blind spots.
- **Engine**: Live streaming structured schemas via Gemini 2.5 Flash / Groq Llama 3.3.

### 2. 🎭 Digital Twin Simulator (`/twin`)
*Interactive Social Engineering & Deepfake Impersonation Defense*
- **Problem**: Threat actors deploy AI voice cloning and synthetic personas to execute targeted executive phishing, wire fraud, and identity compromises.
- **Mechanism**: A sandboxed training simulation where users converse in real time against deceptive AI personas impersonating executives, IT administrators, or distressed relatives demanding urgent wire transfers, credentials, or 2FA tokens.
- **Debrief Engine**: Analyzes conversation turns, tracks trust degradation, flags exact vulnerability inflection points, and awards a comprehensive resilience score.

### 3. 🔬 Reality Inversion (`/reconstruct`)
*Neural Latent Pre-Morph Ground Truth Reconstruction*
- **Problem**: Legacy forensic tools only label images as altered without demonstrating what the authentic subject looked like.
- **Mechanism**: Leverages generative latent inversion to neutralize synthetic blend lines, discrete cosine transform (DCT) boundary artifacts, and facial morph perturbations to reconstruct the predicted authentic baseline.
- **Inspection Tools**: Interactive split-screen loupe slider, pixel-level error diffing, and boundary anomaly heatmaps.

### 4. 🌐 Rumor Reactor (`/reactor`)
*Network Epidemiological Disinformation Diffusion Simulation*
- **Problem**: Misinformation propagates like a pathogen; tracking viral reproduction rates ($R_0$) is essential for targeted neutralization.
- **Mechanism**: Models rumor cascades across heterogeneous network nodes (unverified echo chambers, algorithmic amplification bots, high-reach influencers, and institutional anchors).
- **Active Interventions**: Operators test real-time countermeasures—such as context injections, dissemination throttling, and authoritative pinning—to quantify immediate drops in viral velocity.

### 5. 📝 Neutralizer (`/neutralizer`)
*3-Layer Epistemic Framing & Linguistic De-Escalation Engine*
- **Problem**: Factual events are frequently weaponized through sensationalism, loaded adjectives, and manufactured outrage.
- **Mechanism**: Deconstructs texts into three forensic strata:
  1. **Verifiable Ground Truth**: Empirical events and physical occurrences.
  2. **Supporting Evidence**: Explicit citations, timestamps, and verifiable data points.
  3. **Manipulative Framing**: Emotional triggers, loaded rhetoric, and false dichotomies.
- **Output**: Produces an objective, neutral rewrite with side-by-side visual diff highlighting manipulative heuristics.

### 6. 📡 Deception Radar (`/radar`)
*5-Axis Orthogonal Integrity Decomposition*
- **Visual Spectrum**: Fourier transform variance, noise distribution consistency, and edge boundary artifacts.
- **Contextual Anchors**: C2PA metadata, camera hardware profiles, EXIF integrity, and geolocation plausibility.
- **Temporal Synchronicity**: Frame cadence, lip-sync audio-video alignment, and inter-frame compression jitter.
- **Source Provenance**: Upstream domain lineage, publisher reputation, and cryptographic chain-of-custody.
- **Claim Verifiability**: Cross-referencing against authenticated public record indices.

---

## 🧩 VERATIS Companion (Chrome Extension MV3)

The **VERATIS Companion** is a standalone, client-side Chromium extension built on **Manifest V3** that brings platform intelligence directly into the user's active browsing session.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ACTIVE BROWSER WEBPAGE                          │
│   User selects text   OR   Companion captures clean readable article  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Safe DOM Message Passing
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 VERATIS COMPANION SIDE PANEL                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Context Tag: 58 words from "reuters.com/world/europe/..."        │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Action Chips: [Investigate] [Explain] [Challenge] [Phishing]     │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Conversational Chat: Live Gemini 2.5 Flash / Groq Reasoning      │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │ Voice Dictation (STT)  ·  Audio Reading (TTS)  ·  Settings Modal │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP POST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND API (/api/companion)                       │
│    Analyzes context with Gemini / Groq & streams explainable findings  │
└────────────────────────────────────────────────────────────────────────┘
```

### Companion Capabilities
- 📑 **Non-Intrusive DOM Extractor**: Extracts active selections or intelligently strips boilerplate, ads, navigation, and trackers to ingest clean article text.
- ⚡ **One-Tap Action Chips**:
  - 🔍 **Investigate**: Scans for unverified assertions, manipulation, and deceptive context.
  - 💡 **Explain**: Translates dense legal/technical disclaimers into plain English.
  - ⚔️ **Challenge This**: Acts as Devil's Advocate to expose unproven assumptions.
  - 🎣 **Phishing Check**: Detects urgency triggers, credential traps, and fake links.
  - 🛡️ **Safe Reply**: Generates guarded counter-responses to suspicious communications.
- 🎙️ **Voice Dictation (STT)**: Hands-free query input using the browser's native Web Speech Recognition.
- 🔊 **Read Aloud (TTS)**: Built-in speech synthesis with speed control to listen to forensic verdicts.
- 🖱️ **Context Menu Shortcuts**: Right-click highlighted text on any webpage to immediately trigger VERATIS analysis.
- 🔄 **Dual Operation Mode**: Seamlessly works with live serverless backends or fully offline in zero-config Demo Mode.

### Installing the Extension
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** (top right) to **ON**.
3. Click **Load unpacked** (top left).
4. Select the directory:
   ```text
   path/to/veratis/veratis-extension
   ```
5. Click the Extensions puzzle icon in the toolbar, pin **VERATIS Companion**, and click it to open the Side Panel.

---

## ⚡ Serverless API & Dual AI Engine

VERATIS includes production-ready serverless API routes compatible with Vercel and local development:

| Endpoint | Method | Functionality |
| :--- | :--- | :--- |
| `/api/tribunal` | `POST` | Executes 3-agent adversarial debate on submitted claims and evidence. |
| `/api/twin` | `POST` | Powers dynamic conversational phishing simulations & resilience debriefing. |
| `/api/companion` | `POST` | Contextual analysis for the Chrome extension (article fact check, phishing, framing). |
| `/api/health` | `GET` | Health check reporting active AI provider configurations and status. |

### Provider Support & Failover
- **Primary Live Engine**: Google Gemini 2.5 Flash / Gemini 1.5 Flash.
- **High-Speed Alternative**: GroqCloud Llama 3.3 70B Versatile / Llama 3.1 8B.
- **Zero-Failure Fallback**: Deterministic heuristic rules engine that guarantees 100% uptime even if API quotas expire or external networks are unavailable.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/nipunn-git/veratis.git
cd veratis
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate your preferred provider API keys:
```env
# Optional: Live AI Provider API Keys
# If omitted, VERATIS uses its smart, plain-English offline analysis with zero errors.
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

### 4. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```text
veratis/
├── api/                             # Serverless API routes (Vercel & Local)
│   ├── companion.js                 # Chrome extension backend endpoint
│   ├── health.js                    # Service health check & provider inspection
│   ├── tribunal.js                  # Adversarial multi-agent deliberation API
│   └── twin.js                      # Social engineering simulation API
├── public/                          # Static assets, logos, and pre-built extension
│   ├── veratis-logo.png             # Official VERATIS wordmark & emblem
│   ├── veratis-extension.zip        # Pre-packaged Chrome extension archive
│   └── art-*.png                    # High-definition WebGL textures
├── src/                             # React 18 Application Source
│   ├── components/
│   │   ├── common/                  # InitialLoader, TornadoLoader
│   │   ├── dashboard/               # DeceptionRadar, RealityInversion, RumorReactor, Neutralizer
│   │   ├── digitaltwin/             # Simulation debrief, active dialogue, scenario selector
│   │   ├── hero/                    # WebGLHero, HalftoneWordmark, cinematic tear transition
│   │   ├── tribunal/                # TruthTribunal, PersonalityCard, AdjudicatorAssessment
│   │   └── ui/                      # Three.js HalftoneNebula canvas & shader system
│   ├── dashboard/                   # Dashboard layout, TopCommandBar, BottomNavbar, DraggableGrid
│   ├── data/                        # Forensic cases, investigation samples, scenarios
│   ├── services/                    # Client-side AI service orchestrator
│   ├── App.jsx                      # Main application orchestrator & view transitions
│   ├── index.css                    # Global design tokens and typography
│   └── main.jsx                     # Vite entry point
├── veratis-extension/               # Standalone Chromium Manifest V3 Extension
│   ├── background.js                # Extension service worker & context menu handler
│   ├── content.js                   # Safe DOM text & article sanitization script
│   ├── manifest.json                # Chrome Manifest V3 configuration
│   ├── sidepanel.html               # Persistent side panel interface
│   ├── sidepanel.css                # Obsidian & matte grey styling
│   └── sidepanel.js                 # Extension client logic, TTS, STT & API client
├── .env.example                     # Sample environment variable template
├── tailwind.config.js               # Custom font definitions, tokens & theme
├── vercel.json                      # Vercel deployment & API rewrite configuration
└── vite.config.js                   # Vite configuration with proxy rules
```

---

## 👥 Contributors

This platform was architected, designed, and developed by:

<div align="center">

| <a href="https://github.com/nipunn-git"><img src="https://github.com/nipunn-git.png" width="100px;" alt="Nipun Dhiman"/><br /><sub><b>Nipun Dhiman</b></sub></a><br />| <a href="https://github.com/adityaa6060"><img src="https://github.com/adityaa6060.png" width="100px;" alt="Aditya Tanwar"/><br /><sub><b>Aditya Tanwar</b></sub></a><br />|
| :---: | :---: |
| [@nipunn-git](https://github.com/nipunn-git) | [@adityaa6060](https://github.com/adityaa6060) |

</div>


## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

<div align="center">
<sub>Built with precision for the future of epistemic clarity and digital media integrity.</sub>
</div>
