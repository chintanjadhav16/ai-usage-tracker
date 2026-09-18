let updateTimeout = null;

function getPromptContainer() {
  const host = window.location.hostname;

  if (host.includes("chatgpt.com") || host.includes("openai.com")) {
    return document.querySelector("form #prompt-textarea")?.parentElement || 
           document.querySelector("form") || 
           document.querySelector("#prompt-textarea");
  } else if (host.includes("claude.ai")) {
    return document.querySelector(".fieldset-fieldset") || 
           document.querySelector("fieldset") || 
           document.querySelector("[contenteditable='true']")?.parentElement;
  } else if (host.includes("gemini.google.com")) {
    return document.querySelector(".input-area") || document.querySelector("rich-textarea");
  } else if (host.includes("deepseek.com")) {
    return document.querySelector("#chat-input")?.parentElement;
  }

  return null;
}

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

function injectPromptFooter() {
  const container = getPromptContainer();
  if (!container) return null;

  let footer = document.getElementById("cc-prompt-footer");

  if (!footer) {
    footer = document.createElement("div");
    footer.id = "cc-prompt-footer";
    footer.className = "ct-footer-panel";
    footer.innerHTML = `
      <div class="ct-row">
        <div class="ct-section">
          <div class="ct-section-header">
            <span class="ct-title">CURRENT SESSION</span>
            <span id="ct-session-pct" class="ct-percentage ct-green">0%</span>
          </div>
          <div class="ct-bar-bg">
            <div id="ct-session-fill" class="ct-bar-fill ct-fill-green" style="width: 0%;"></div>
          </div>
          <div class="ct-subtext" id="ct-session-sub">Resets in 4h 12m</div>
        </div>

        <div class="ct-section">
          <div class="ct-section-header">
            <span class="ct-title">WEEKLY</span>
            <span id="ct-weekly-pct" class="ct-percentage ct-green">0%</span>
          </div>
          <div class="ct-bar-bg">
            <div id="ct-weekly-fill" class="ct-bar-fill ct-fill-green" style="width: 0%;"></div>
          </div>
          <div class="ct-subtext" id="ct-weekly-sub">Resets Sat 7:00 AM</div>
        </div>
      </div>
    `;

    container.appendChild(footer);
  }

  return footer;
}

function updateMetrics() {
  const footer = injectPromptFooter();
  if (!footer) return;

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

  const sessionPctEl = document.getElementById("ct-session-pct");
  const sessionFillEl = document.getElementById("ct-session-fill");
  const weeklyPctEl = document.getElementById("ct-weekly-pct");
  const weeklyFillEl = document.getElementById("ct-weekly-fill");

  if (sessionPctEl) sessionPctEl.textContent = `${sessionPct}%`;
  if (sessionFillEl) sessionFillEl.style.width = `${sessionPct}%`;
  
  if (weeklyPctEl) weeklyPctEl.textContent = `${weeklyPct}%`;
  if (weeklyFillEl) weeklyFillEl.style.width = `${weeklyPct}%`;

  let colorClass = "green";
  if (sessionPct >= 75) {
    colorClass = "red";
  } else if (sessionPct >= 50) {
    colorClass = "amber";
  }

  if (sessionPctEl) sessionPctEl.className = `ct-percentage ct-${colorClass}`;
  if (sessionFillEl) sessionFillEl.className = `ct-bar-fill ct-fill-${colorClass}`;
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