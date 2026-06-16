# 40K Core Rules — Quick Reference (PWA)

A single-page, offline-capable mobile reference for the Warhammer 40,000 Core
Rules. Built for Thousand Sons / Space Marines / Deathwatch / Chaos Knights.

## What's in here

- `index.html` — the whole app (markup, CSS, JS — no build step, no dependencies)
- `manifest.json` — PWA metadata (name, icons, colors, standalone display)
- `sw.js` — service worker that caches the app shell so it works with zero signal
- `icons/` — app icons in the sizes iOS/Android expect

## Preview it locally, right now

No install needed — just serve the folder over plain HTTP (service workers
refuse to register on `file://` URLs, so don't just double-click `index.html`):

```bash
cd pwa
python3 -m http.server 8080
# then open http://localhost:8080 on your phone (same Wi-Fi) or on this machine
```

## Picking this up in Claude Code

This chat (claude.ai) can't reach your terminal or your GitHub account directly
— Claude Code runs locally on your machine and acts under *your* credentials,
which is exactly what's needed to push to GitHub and turn on Pages. Here's the
handoff:

**1. Install Claude Code** (skip if you already have it):

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash
```

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

Needs a Claude Pro/Max/Team/Enterprise subscription or a Console (API) account
to log in — same account as this chat works fine.

**2. Start a session inside this project folder:**

```bash
cd pwa
claude
```

**3. Paste this as your first message:**

> This is a static PWA (index.html + manifest.json + sw.js + icons/). Init a
> git repo, create a GitHub repo for it called `40k-quickref` under my
> account, push this folder to it, then enable GitHub Pages on the main
> branch so it's live at a real HTTPS URL. Confirm the final URL when done.

Claude Code will ask permission before each git/gh action — approve as it
goes. GitHub Pages is free and is exactly what a service worker needs (it
won't register over plain `file://`, but works on any HTTPS host).

**4. On your iPhone:** open the Pages URL in Safari → Share → Add to Home
Screen. That installs it as a standalone app icon with the offline cache
already primed.

## Updating it later

Edit `index.html` (or ask Claude Code to), bump `CACHE_VERSION` in `sw.js` by
one so phones pick up the change instead of serving a stale cached copy, then
push. Pages redeploys automatically on every push to `main`.
