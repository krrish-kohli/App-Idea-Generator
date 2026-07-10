const form = document.getElementById("idea-form");
const promptInput = document.getElementById("custom-prompt");
const charCount = document.getElementById("char-count");
const generateBtn = document.getElementById("generate-btn");
const clearBtn = document.getElementById("clear-btn");
const loadingSection = document.getElementById("loading-section");
const errorSection = document.getElementById("error-section");
const errorMessage = document.getElementById("error-message");
const dismissError = document.getElementById("dismiss-error");
const resultSection = document.getElementById("result-section");
const ideaOutput = document.getElementById("idea-output");
const copyBtn = document.getElementById("copy-btn");
const copyText = document.getElementById("copy-text");
const regenerateBtn = document.getElementById("regenerate-btn");
const suggestionChips = document.querySelectorAll(".suggestion-chip");

let lastIdea = "";

const SECTION_LABELS = {
  "app name": { class: "label-red" },
  "one-line description": { class: "label-blue" },
  description: { class: "label-blue" },
  "target audience": { class: "label-yellow" },
  "core features": { class: "label-red" },
  features: { class: "label-red" },
  "unique value proposition": { class: "label-blue" },
  "value proposition": { class: "label-blue" },
  "monetization strategy": { class: "label-yellow" },
  monetization: { class: "label-yellow" },
  "technology stack": { class: "label-red" },
  "tech stack": { class: "label-red" },
};

promptInput.addEventListener("input", () => {
  charCount.textContent = promptInput.value.length;
});

suggestionChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    promptInput.value = chip.dataset.prompt;
    charCount.textContent = promptInput.value.length;
    promptInput.focus();
  });
});

clearBtn.addEventListener("click", () => {
  promptInput.value = "";
  charCount.textContent = "0";
  hideAllStates();
  clearBtn.hidden = true;
  promptInput.focus();
});

dismissError.addEventListener("click", () => {
  errorSection.hidden = true;
});

copyBtn.addEventListener("click", async () => {
  if (!lastIdea) return;
  try {
    await navigator.clipboard.writeText(lastIdea);
    copyText.textContent = "Copied!";
    setTimeout(() => {
      copyText.textContent = "Copy";
    }, 2000);
  } catch {
    copyText.textContent = "Failed";
  }
});

regenerateBtn.addEventListener("click", () => {
  if (promptInput.value.trim()) {
    form.dispatchEvent(new Event("submit"));
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const customPrompt = promptInput.value.trim();
  if (!customPrompt) return;

  hideAllStates();
  setLoading(true);

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customPrompt }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    lastIdea = data.idea;
    ideaOutput.innerHTML = formatIdea(data.idea);
    resultSection.hidden = false;
    clearBtn.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    errorMessage.textContent = err.message;
    errorSection.hidden = false;
  } finally {
    setLoading(false);
  }
});

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  generateBtn.querySelector(".btn-text").textContent = isLoading
    ? "Generating..."
    : "Generate Idea";
  loadingSection.hidden = !isLoading;
}

function hideAllStates() {
  loadingSection.hidden = true;
  errorSection.hidden = true;
  resultSection.hidden = true;
}

function formatIdea(text) {
  const lines = text.split("\n");
  let html = "";
  let currentBlock = "";
  let currentLabel = "";

  const flushBlock = () => {
    if (!currentBlock.trim()) return;
    const labelInfo = getLabelInfo(currentLabel);
    html += `<div class="section-block">`;
    if (currentLabel) {
      html += `<span class="section-label ${labelInfo.class}">${escapeHtml(currentLabel)}</span>`;
    }
    html += formatBlockContent(currentBlock.trim());
    html += `</div>`;
    currentBlock = "";
    currentLabel = "";
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^#{1,3}\s+(.+)$/) || trimmed.match(/^\*\*(.+?)\*\*:?\s*$/);
    const numberedHeading = trimmed.match(/^\d+\.\s*\*?\*?(.+?)\*?\*?:?\s*$/);

    if (headingMatch || numberedHeading) {
      flushBlock();
      currentLabel = (headingMatch ? headingMatch[1] : numberedHeading[1])
        .replace(/\*+/g, "")
        .replace(/:$/, "")
        .trim();
      continue;
    }

    const boldHeading = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
    if (boldHeading && boldHeading[1].length < 60) {
      flushBlock();
      currentLabel = boldHeading[1].replace(/:$/, "").trim();
      if (boldHeading[2]) {
        currentBlock += boldHeading[2] + "\n";
      }
      continue;
    }

    currentBlock += line + "\n";
  }

  flushBlock();
  return html || `<p>${escapeHtml(text)}</p>`;
}

function getLabelInfo(label) {
  const key = label.toLowerCase();
  for (const [pattern, info] of Object.entries(SECTION_LABELS)) {
    if (key.includes(pattern)) return info;
  }
  return { class: "label-default" };
}

function formatBlockContent(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  let result = "";
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    const listItem = trimmed.match(/^[-*•]\s+(.+)$/);
    const numberedItem = trimmed.match(/^\d+\.\s+(.+)$/);

    if (listItem || numberedItem) {
      if (!inList) {
        result += "<ul>";
        inList = true;
      }
      const content = listItem ? listItem[1] : numberedItem[1];
      result += `<li>${formatInline(content)}</li>`;
    } else {
      if (inList) {
        result += "</ul>";
        inList = false;
      }
      result += `<p>${formatInline(trimmed)}</p>`;
    }
  }

  if (inList) result += "</ul>";
  return result;
}

function formatInline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
