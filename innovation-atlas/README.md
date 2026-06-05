# Singapore Innovation Atlas

**An interactive map of where Singapore's innovation actually concentrates.**

![Singapore Innovation Atlas — screenshot](assets/screenshot.png)
<!-- ↑ Add assets/screenshot.png (a clean shot of the live map). Until you do, this image is broken on purpose as a reminder. -->

🔗 **Live demo:** https://gohjhb92.github.io/innovation-atlas/

---

## What this is

Innovation in Singapore isn't spread evenly — it clusters. This maps where:
**one-north**'s deep-tech belt, the **CBD fintech core**, the new **Punggol Digital
District**, the **Novena** and **Outram** health cities, and the **Jurong Innovation
District**'s advanced-manufacturing belt — across **nine categories of institution**.

It's an interactive, filterable, shareable map built as clean static files — open
`index.html` and it runs. No backend, no build step.

## Why I built it

I work in and around startup ecosystems, and I wanted a single visual of how
Singapore's innovation *geography* is actually structured — not a list of programmes,
but the physical map of where the research, capital, talent and institutions sit, and
how they cluster. Most "ecosystem maps" are logo soups; I wanted one organised the way
the island is actually zoned.

## Features

- **Filter on three axes** — by category (the 9 ecosystem layers), by sector
  (fintech, biomed, deep tech, advanced manufacturing…), and by institutional form
  (hub, lab, university, hospital, district…).
- **Geographic search** — jump to a site or an area; the camera eases to frame it.
- **Shareable views** — any filtered view encodes into the URL, so a link reopens the
  exact same map state. Try
  [the health-tech view](https://gohjhb92.github.io/innovation-atlas/?cat=health&sector=biomedtech).
- **Editorial cartography** — muted Positron base map, one accent colour per category,
  a designed legend rather than a field of identical pins.
- **Fully static** — no framework, no bundler, no backend. Opens from `file://`.

## Tech

Vanilla JavaScript + [Leaflet](https://leafletjs.com/) on CartoDB Positron tiles.
Data is fully separated from presentation in [`data/data.js`](data/data.js); the UI is
split into small classic-script modules (`map`, `markers`, `filters`, `search`,
`share`) that share one state object. **Deliberately no framework and no build step** —
the entire value here is that it's legible static files anyone can open and read.

## Data model

Every site is described on **three orthogonal axes**, so the same place can be sliced
three different ways without duplicating records:

| Axis | What it captures | Examples |
|------|------------------|----------|
| `category` | the role it plays in the ecosystem (the 9 layers) | Research & R&D, Financial Core, Health & Biomedical |
| `type` | its physical / institutional form | university, hospital, data-centre, district, agency |
| `sectors[]` | the industry verticals it advances (cross-cutting) | fintech, biomedtech, deeptech, advanced-manufacturing |

None of the three is derivable from the others. NUS is `category: education`,
`type: university`, `sectors: [deeptech, biomedtech, digital-ict]`. Biopolis is
`category: research`, `type: institute`, `sectors: [biomedtech]`. That separation is
what makes the filters meaningful rather than redundant.

## Status & roadmap

Honest about where this is:

**Current** — ~40 hand-curated, real Singapore sites across the nine categories,
grouped by their true cluster.

**Known work-in-progress**
- **District shapes are placeholder rectangles.** The shaded districts (one-north,
  Punggol, Jurong) are hand-drawn bounding boxes labelled *"approx."*, not real
  boundaries — pending real URA Master Plan GeoJSON from
  [data.gov.sg](https://data.gov.sg/).
- **Some coordinates are hand-estimated.** Sites are flagged
  `coordPrecision: "estimated"` where the point was placed from memory (good to
  ~100–300m). [`scripts/geocode.mjs`](scripts/geocode.mjs) resolves these against the
  official OneMap API when you're ready to harden them.

**Next**
- Real district boundaries from URA Master Plan data.
- A density / weighting layer (where clusters are *dense*, not just present).
- Expand the dataset beyond the initial ~40 anchor sites.

## Run locally

No install, no server:

```
open index.html        # macOS
start index.html       # Windows
```

It works straight from `file://` because data loads via a `<script>` tag, not `fetch()`.
(Map tiles and the Leaflet library load from CDNs, so you'll want to be online.)

To re-geocode the estimated coordinates (optional, needs Node 18+ for `fetch`):

```
node scripts/geocode.mjs            # dry run — prints proposed changes
node scripts/geocode.mjs --write    # writes data/data.geocoded.js for review
```

## License

[MIT](LICENSE) © 2026 Bryan Goh
