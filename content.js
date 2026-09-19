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
    bar.className = "cc-exact-bar";
    bar.innerHTML = `
      <div class="cc-bar-item cc-left">
        <span id="cc-session-txt" class="cc-label">Session: 86% · resets in 4h 32m</span>
        <div class="cc-track">
          <div id="cc-session-fill" class="cc-fill" style="width: 86%;"></div>
          <div class="cc-marker" style="left: 18%;"></div>
        </div>
      </div>

      <div class="cc-bar-item cc-right">
        <div class="cc-track">
          <div id="cc-weekly-fill" class="cc-fill" style="width: 6%;"></div>
          <div class="cc-marker" style="right: 5%;"></div>
        </div>
        <span id="cc-weekly-txt" class="cc-label">Weekly: 6% · resets in 1d 8h</span>
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

  const sessionTxt = document.getElementById("cc-session-txt");
  const sessionFill = document.getElementById("cc-session-fill");
  const weeklyTxt = document.getElementById("cc-weekly-txt");
  const weeklyFill = document.getElementById("cc-weekly-fill");

  if (sessionTxt) sessionTxt.textContent = `Session: ${sessionPct}% · resets in 4h 32m`;
  if (sessionFill) sessionFill.style.width = `${sessionPct}%`;

  if (weeklyTxt) weeklyTxt.textContent = `Weekly: ${weeklyPct}% · resets in 1d 8h`;
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