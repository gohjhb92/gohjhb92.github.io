const filterButtons = document.querySelectorAll(".filter-button");
const workCards = document.querySelectorAll(".work-card");
const commandOverlay = document.querySelector("#command-palette");
const commandInput = document.querySelector("#command-input");
const commandList = document.querySelector("#command-list");
const commandOpeners = document.querySelectorAll("[data-command-open]");
const commandClosers = document.querySelectorAll("[data-command-close]");
const navLinks = document.querySelectorAll(".nav-links a");

const projectDetails = {
  "FinSight Incubator": "Shows the strongest portfolio shift: from programme experience into practical AI-enabled incubation tooling. It gives visitors a live example of how ecosystem judgment can become an operator dashboard.",
  FounderPathOS: "Frames founder support as a staged operating pathway instead of a loose resource list, useful for accelerators, university innovation teams, and venture builders.",
  IncubatorOS: "Connects grant readiness, mentor matching, milestone evidence, and KPI tracking into one programme operations surface for education-linked incubation.",
  GrantsOS: "Turns startup funding navigation into a structured pathway, with founder eligibility and evidence tracking at the center.",
  PilotMatchOS: "Bridges startups and institutions with readiness scoring, risk review, fit assessment, and validation outcomes.",
  CommsAI: "A focused AI tool for the communications burden programme teams carry every week: stakeholder updates, founder outreach, and repeatable social copy.",
  "Startup Social Kit": "A lightweight reusable content system that shows practical programme marketing instincts, not just one-off design work.",
  TezAsia: "The clearest proof point for multi-country programme delivery, partner coordination, community growth, and operational follow-through.",
  "NUS Computing x TZ APAC Partnership": "A strong institutional partnership signal: university engagement, education programming, and ecosystem-building around developer talent.",
  "CoinGecko Learn & Earn": "Shows partner-led education and top-of-funnel ecosystem reach through accessible learning content and incentive mechanics.",
  "Singapore Fintech Festival Activation": "Demonstrates high-visibility event operations, partner coordination, and on-ground execution in a regional industry setting."
};

const commands = [
  { label: "View selected works", hint: "Jump to project explorer", keywords: "work projects portfolio", action: () => goTo("#work") },
  { label: "Show AI tools", hint: "Filter project explorer", keywords: "ai tools comms grants dashboard", action: () => applyFilter("tool", true) },
  { label: "Show ecosystem programmes", hint: "Filter project explorer", keywords: "ecosystem programmes tezasia incubation", action: () => applyFilter("ecosystem", true) },
  { label: "Show partnerships", hint: "Filter project explorer", keywords: "partners nus coingecko pilot", action: () => applyFilter("partnership", true) },
  { label: "Open CommsAI", hint: "AI communications tool", keywords: "commsai communications stakeholder", action: () => openUrl("./comms-ai/") },
  { label: "Open FinSight Incubator", hint: "AI startup screening dashboard", keywords: "finsight fintech incubator memo", action: () => openUrl("./finsight-incubator/") },
  { label: "Open FounderPathOS", hint: "Founder journey dashboard", keywords: "founder journey os", action: () => openUrl("./founderpathos/") },
  { label: "Contact Bryan", hint: "Go to contact section", keywords: "linkedin contact talk", action: () => goTo("#contact") },
  { label: "Open GitHub", hint: "github.com/gohjhb92", keywords: "github code repos", action: () => openUrl("https://github.com/gohjhb92") },
  { label: "Back to top", hint: "Return to intro", keywords: "home top bryan", action: () => goTo("#top") }
];

function applyFilter(filter, shouldScroll = false) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  workCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);
    card.classList.toggle("is-hidden", !shouldShow);
  });

  if (shouldScroll) {
    goTo("#work");
  }
}

function goTo(selector) {
  closeCommandPalette();
  const target = document.querySelector(selector);

  if (!target) {
    return;
  }

  target.classList.add("is-visible");
  target.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openUrl(url) {
  closeCommandPalette();
  window.open(url, url.startsWith("http") ? "_blank" : "_self", "noreferrer");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

workCards.forEach((card) => {
  const title = card.querySelector("h3")?.textContent.trim();
  const detail = projectDetails[title];

  if (!detail) {
    return;
  }

  const button = document.createElement("button");
  const detailId = `detail-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  button.className = "details-button";
  button.type = "button";
  button.textContent = "Details";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", detailId);

  const panel = document.createElement("div");
  panel.className = "work-detail";
  panel.id = detailId;
  panel.innerHTML = `<div class="work-detail-inner"><p>${detail}</p></div>`;

  button.addEventListener("click", () => {
    const isExpanded = card.classList.toggle("is-expanded");
    button.textContent = isExpanded ? "Hide details" : "Details";
    button.setAttribute("aria-expanded", String(isExpanded));
  });

  card.append(button, panel);
});

function renderCommands(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const matches = commands.filter((command) => {
    const haystack = `${command.label} ${command.hint} ${command.keywords}`.toLowerCase();
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });

  commandList.innerHTML = "";

  matches.forEach((command, index) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `command-item${index === 0 ? " is-selected" : ""}`;
    item.setAttribute("role", "option");
    item.innerHTML = `<span><strong>${command.label}</strong><span>${command.hint}</span></span><em>Enter</em>`;
    item.addEventListener("click", command.action);
    commandList.append(item);
  });

  if (!matches.length) {
    const empty = document.createElement("div");
    empty.className = "command-item";
    empty.innerHTML = "<span><strong>No command found</strong><span>Try work, AI, partnerships, contact, or GitHub.</span></span>";
    commandList.append(empty);
  }
}

function openCommandPalette() {
  commandOverlay.hidden = false;
  renderCommands();
  window.setTimeout(() => commandInput.focus(), 0);
}

function closeCommandPalette() {
  if (commandOverlay) {
    commandOverlay.hidden = true;
    commandInput.value = "";
  }
}

commandOpeners.forEach((button) => button.addEventListener("click", openCommandPalette));
commandClosers.forEach((button) => button.addEventListener("click", closeCommandPalette));

commandOverlay?.addEventListener("click", (event) => {
  if (event.target === commandOverlay) {
    closeCommandPalette();
  }
});

commandInput?.addEventListener("input", () => renderCommands(commandInput.value));

document.addEventListener("keydown", (event) => {
  const isCommandShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

  if (isCommandShortcut) {
    event.preventDefault();
    openCommandPalette();
  }

  if (event.key === "Escape") {
    closeCommandPalette();
  }

  if (event.key === "Enter" && !commandOverlay.hidden && document.activeElement === commandInput) {
    event.preventDefault();
    commandList.querySelector(".command-item")?.click();
  }
});

const moreWorkNavLink = [...navLinks].find((link) => link.getAttribute("href") === "#more-work");

if (moreWorkNavLink) {
  moreWorkNavLink.textContent = "Writing";
}

const writingList = document.querySelector("#more-work .compact-list");

if (writingList && !document.querySelector('[href="./articles/ai-fintech-startups-singapore.html"]')) {
  const articleCard = document.createElement("article");
  articleCard.className = "featured-writing";
  articleCard.innerHTML = `
    <span>Market Research Article</span>
    <h3>AI FinTech Startups in Singapore</h3>
    <p>A portfolio research article mapping AI-fintech startup opportunities across regtech, credit underwriting, wealthtech, insurtech, payments, and personal finance.</p>
    <a href="./articles/ai-fintech-startups-singapore.html">Read Article</a>
  `;
  writingList.prepend(articleCard);
}

const revealTargets = document.querySelectorAll(".section-band, .timeline-row, .work-card, .compact-list article");

if ("IntersectionObserver" in window) {
  revealTargets.forEach((element) => element.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
} else {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main > section[id]")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));
