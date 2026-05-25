const filterButtons = document.querySelectorAll(".filter-button");
const workCards = document.querySelectorAll(".work-card");
const filterCards = document.querySelectorAll("#experience .work-card");
const commandOverlay = document.querySelector("#command-palette");
const commandInput = document.querySelector("#command-input");
const commandList = document.querySelector("#command-list");
const commandOpeners = document.querySelectorAll("[data-command-open]");
const commandClosers = document.querySelectorAll("[data-command-close]");
const navLinks = document.querySelectorAll(".nav-links a");

const projectDetails = {
  TezAsia: "Regional programme delivery involving partner coordination, communications, judging workflows, and participant operations.",
  "TZ APAC / Tezos Startup Grant & Ecosystem Programmes": "Grant coordination, founder follow-up, milestone tracking, and ecosystem campaign delivery across Asia-Pacific.",
  "NUS Computing x TZ APAC Partnership": "Connects education programming and partnership activation with founder and developer engagement.",
  "CoinGecko Learn & Earn": "Shows how partner-led learning content can support accessible ecosystem activation.",
  "Singapore Fintech Festival Activation": "Event activation, stakeholder management, and on-ground execution in a major fintech setting.",
  "MAS Payment System Testing": "Shows UAT coordination, documentation, status reporting, and issue follow-up in regulated delivery.",
  "S.E.A. Focus 2022 - Tezos NFT Exhibition": "Public-facing activation involving event logistics and stakeholder coordination.",
  "NUS Research Engineer": "Shows documentation, lab workflow support, operational readiness, and data discipline in an institutional setting.",
  IncubatorOS: "Flagship Programme OS: founder intake, cohort tracking, grant readiness, mentor matching, milestone evidence, pilot readiness, founder check-ins, and institutional reporting.",
  "FinSight Incubator": "Fintech intake, screening, regulatory-readiness review, and memo preparation using sample company records.",
  CommsAI: "Repeatable workflows for stakeholder updates, founder outreach, social posts, and follow-up notes."
};

const commands = [
  { label: "View real experience", hint: "Jump to real programme and ecosystem experience", keywords: "work projects portfolio real experience ecosystem", action: () => goTo("#experience") },
  { label: "View featured projects", hint: "Jump to self-directed portfolio case studies", keywords: "featured portfolio incubatoros finsight commsai", action: () => goTo("#prototypes") },
  { label: "View archive", hint: "Jump to supporting modules and smaller studies", keywords: "archive modules founder grants pilot social kit world order", action: () => goTo("#archive") },
  { label: "Show programmes", hint: "Filter real experience", keywords: "ecosystem programmes tezasia incubation", action: () => applyFilter("programme", true) },
  { label: "Show partnerships", hint: "Filter real experience", keywords: "partners nus coingecko pilot", action: () => applyFilter("partnership", true) },
  { label: "Show institutional work", hint: "Filter real experience", keywords: "mas deloitte nus institutional", action: () => applyFilter("institutional", true) },
  { label: "Open IncubatorOS", hint: "Flagship programme OS", keywords: "incubatoros incubation programme grant mentor reporting", action: () => openUrl("./incubatoros/") },
  { label: "Open CommsAI", hint: "Stakeholder communications workflow", keywords: "commsai communications stakeholder", action: () => openUrl("./comms-ai/") },
  { label: "Open FinSight Incubator", hint: "Fintech screening workflow", keywords: "finsight fintech incubator memo", action: () => openUrl("./finsight-incubator/") },
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

  filterCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);
    card.classList.toggle("is-hidden", !shouldShow);
  });

  if (shouldScroll) {
    goTo("#experience");
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
    empty.innerHTML = "<span><strong>No command found</strong><span>Try ecosystem work, partnerships, modules, contact, or GitHub.</span></span>";
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
