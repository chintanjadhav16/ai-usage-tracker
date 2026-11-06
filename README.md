# AI Usage Tracker 📊

A minimalist, high-precision Google Chrome extension (Manifest V3) designed to track session and weekly token limits in real time across popular AI chat platforms, including **ChatGPT**, **Claude**, **Gemini**, and **DeepSeek**.

Featuring a sleek, fixed edge-to-edge bottom status bar, **AI Usage Tracker** sits unobtrusively at the bottom of your screen to deliver live token updates, session percentages, and reset countdowns without interfering with your chat UI.

## ⬇️ Download

**[Download the extension (zip)](downloads/ai-usage-tracker.zip)** — one click, no account needed.

1. Unzip the file. You'll get an `ai-usage-tracker` folder.
2. Open `chrome://extensions` and turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select the `ai-usage-tracker` folder.
4. Open ChatGPT, Claude, Gemini or DeepSeek. The bar appears at the bottom of the page.

Works in Chrome, Edge and Brave.

---

## ✨ Features

- **Multi-Platform Support**: Works seamlessly on `chatgpt.com`, `claude.ai`, `gemini.google.com`, and `deepseek.com`.
- **Edge-to-Edge Bottom Bar**: Fixed 22px dark status strip anchored to the bottom of the viewport for constant, zero-clutter visibility.
- **Side-by-Side Tracking**:
  - **Session Metrics**: Live percentage tracking with reset countdown timers.
  - **Weekly Metrics**: Long-term usage overview with scheduled reset tracking.
- **Client-Side Tokenization**: Powered by `o200k_base` Tiktoken encoding and `MutationObserver` DOM tracking to compute token counts directly in your browser.
- **Outlined Progress Tracks & Markers**: Clean progress bars featuring threshold indicator markers and vibrant status fills.
- **Privacy-First Architecture**: 100% local calculation—no prompt text or usage data is transmitted externally.

---

## 🏗️ Project Structure

```text
├── index.html                  # Landing page with the download button (GitHub Pages)
├── manifest.json               # Extension configuration & Manifest V3 setup
├── content.js                  # Main script: DOM extraction, token counting & UI injection
├── styles.css                  # Bottom-bar layout & progress track styling
├── downloads/
│   └── ai-usage-tracker.zip    # Ready-to-install package (rebuilt automatically)
└── .github/workflows/
    └── build-zip.yml           # Rebuilds the zip when the extension files change
```

> Token counts use `o200k_base` when it is available and otherwise fall back to an estimate of about 4 characters per token.
