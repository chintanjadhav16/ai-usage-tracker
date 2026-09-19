let updateTimeout = null;

function extractChatText() {
  const host = window.location.hostname;
  let text = "";

  if (host.includes("chatgpt.com") || host.includes("openai.com")) {
    const elements = document.querySelectorAll("div[data-message-author-role], article, .markdown");
    elements.forEach((el) => { if (el.innerText) text += el.innerText + "\n"; });
  } else if (host.includes("claude.ai")) {
    const elements = document.querySelectorAll(".font-claude-message, .font-user-message");
    elements.forEach((el) => { if (el.innerText) text += el.innerText + "\n"; });
  } else if (host.includes("gemini.google.com")) {
    const elements = document.querySelectorAll("message-content, .query-text, .response-text");
    elements.forEach((el) => { if (el.innerText) text += el.innerText + "\n"; });
  } else if (host.includes("deepseek.com")) {
    const elements = document.querySelectorAll(".ds-markdown, article");
    elements.forEach((el) => { if (el.innerText) text += el.innerText + "\n"; });
  }

  return text;
}

function injectBottomBar() {
  let bar = document.getElementById("cc-bottom-bar");

  if (!bar) {
    bar = document.createElement("div");
    bar.id = "cc-bottom-bar";
    bar.className = "ct-bottom-bar";
    bar.innerHTML = `
      <div class="ct-bar-section">
        <span id="ct-session-label" class="ct-label">Session: 0% · resets in 4h 12m</span>
        <div class="ct-track">
          <div id="ct-session-fill" class="ct-fill" style="width: 0%;"></div>
          <div class="ct-marker"></div>
        </div>
      </div>

      <div class="ct-bar-section">
        <div class="ct-track">
          <div id="ct-weekly-fill" class="ct-fill" style="width: 0%;"></div>
          <div class="ct-marker"></div>
        </div>
        <span id="ct-weekly-label" class="ct-label">Weekly: 0% · resets in 6d 18h</span>
      </div>
    `;

    document.body.appendChild(bar);
  }

  return bar;
}

function updateMetrics() {
  const bar = injectBottomBar();
  if (!bar) return;

  const rawText = extractChatText();
  let count = 0;

  if (rawText && window.o200k_base) {
    try { count = window.o200k_base.encode(rawText).length; } 
    catch (e) { count = Math.ceil(rawText.length / 4); }
  } else if (rawText) {
    count = Math.ceil(rawText.length / 4);
  }

  const sessionPct = Math.min(Math.round((count / 100000) * 100), 100);
  const weeklyPct = Math.min(Math.round((count / 300000) * 100), 100);

  const sessionLabel = document.getElementById("ct-session-label");
  const sessionFill = document.getElementById("ct-session-fill");
  const weeklyLabel = document.getElementById("ct-weekly-label");
  const weeklyFill = document.getElementById("ct-weekly-fill");

  if (sessionLabel) sessionLabel.textContent = `Session: ${sessionPct}% · resets in 4h 12m`;
  if (sessionFill) sessionFill.style.width = `${sessionPct}%`;

  if (weeklyLabel) weeklyLabel.textContent = `Weekly: ${weeklyPct}% · resets in 6d 18h`;
  if (weeklyFill) weeklyFill.style.width = `${weeklyPct}%`;
}

function scheduleUpdate() {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => { updateMetrics(); }, 600);
}

const observer = new MutationObserver(() => { scheduleUpdate(); });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    observer.observe(document.body, { childList: true, subtree: true });
    updateMetrics();
  });
} else {
  observer.observe(document.body, { childList: true, subtree: true });
  updateMetrics();
}