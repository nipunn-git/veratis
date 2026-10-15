# VERATIS Companion — AI Digital Trust Chrome Extension

A persistent browser side panel assistant for investigating suspicious claims, challenging assumptions, spotting phishing attacks, and verifying webpage facts across the web.

---

## 🚀 Quick Setup Instructions (How to Load into Chrome)

### Step 1: Open Chrome Extensions
1. In Google Chrome, open a new tab and go to:
   ```text
   chrome://extensions/
   ```
2. In the top right corner, turn **ON** the **Developer mode** toggle.

### Step 2: Load Unpacked Extension
1. Click the **Load unpacked** button in the top left corner.
2. Select the extension directory:
   ```text
   c:\Users\adity\Downloads\veratis\veratis-extension
   ```
3. You will immediately see **VERATIS Companion — AI Digital Trust Assistant** in your extensions list.

### Step 3: Pin and Open the Side Panel
1. Click the **Extensions puzzle icon** in your Chrome toolbar.
2. Click the **Pin** icon next to **VERATIS Companion** to keep it accessible.
3. Click the **VERATIS Companion icon** — the persistent Side Panel will slide open alongside any webpage you visit!

---

## 🎯 How to Use the Companion

### 1. Highlight & Analyze Webpage Text
- Select any text on a webpage with your mouse.
- In the side panel, click **"Get Selection"**. The companion captures the selected text with word count.
- Click any action chip:
  - 🔍 **Investigate:** Checks for misleading context, manipulation, or unverified claims.
  - 💡 **Explain:** Translates complicated articles or news into plain English.
  - ⚔️ **Challenge This:** Spots unproven assumptions and missing evidence.
  - 🎣 **Phishing Check:** Detects urgency traps, fake links, or credential requests.
  - 📋 **Find Claims:** Lists factual claims that need external verification.
  - 🛡️ **Safe Reply:** Drafts cautious counter-responses to suspicious messages.
  - 📄 **Summarize:** Provides a high-level summary of the active page.

### 2. Right-Click Context Menu
- Highlight text on any website $\to$ right-click $\to$ choose **VERATIS: Investigate**, **Explain**, or **Check for Phishing**.
- The side panel will open automatically with the analysis ready!

### 3. Voice Controls
- **Microphone Dictation:** Click the microphone icon in the composer to speak your question aloud.
- **Read Aloud (TTS):** Click the **"Listen"** button on any assistant answer to have it read aloud. Click **"Stop"** in the top banner anytime.

---

## ⚙️ AI Modes: Demo vs. Live AI

### Demo Mode (Offline Safe — Ready Right Now)
- The extension includes smart, deterministic analysis for every action.
- Works 100% offline without needing any API keys or internet connection.
- Clearly badged as **`DEMO MODE`**.

### Live AI Mode (Gemini / OpenAI / Claude)
1. **Local Dev Server:**
   - Make sure `npm run dev` is running in your `veratis` folder.
   - The backend runs on `http://localhost:5173/api/companion`.
   - Add your API key to `.env` in the `veratis` root:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     ```
2. **Production on Vercel:**
   - Add `GEMINI_API_KEY` to your Vercel Project Environment Variables.
   - In the extension, click **Settings (Gear icon)** $\to$ set AI Backend URL to `https://your-vercel-domain.vercel.app/api/companion` $\to$ click **Save Settings**.
   - The status badge will switch to **`LIVE AI`**!
