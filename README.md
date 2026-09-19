# AI Usage Tracker 📊

A minimalist, high-precision Google Chrome extension (Manifest V3) designed to track session and weekly token limits in real time across popular AI chat platforms, including **ChatGPT**, **Claude**, **Gemini**, and **DeepSeek**.

Featuring a sleek, fixed edge-to-edge bottom status bar, **AI Usage Tracker** sits unobtrusively at the bottom of your screen to deliver live token updates, session percentages, and reset countdowns without interfering with your chat UI.

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
├── manifest.json        # Extension configuration & Manifest V3 setup
├── content.js          # Main script: DOM extraction, tokenizer execution & UI injection
├── styles.css           # Bottom-bar layout, progress track outlines & responsive styling
└── o200k_base.js       # Tiktoken tokenizer module for live token counting
