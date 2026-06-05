/* =============================================================================
 * geocode.mjs — OneMap coordinate verifier (offline tooling)
 * -----------------------------------------------------------------------------
 * Resolves each site's coordinates against Singapore's official OneMap search
 * API, then writes an upgraded copy to data/data.geocoded.js (gitignored —
 * review the diff, then fold good changes back into data.js by hand).
 *
 * This is deliberately conservative, because naive name→geocode is noisy:
 *   - OneMap rate-limits bursts, so we pace + retry.
 *   - The first result is sometimes the wrong entity (a hotel "at Raffles
 *     Place", a sub-institute 12km from the main campus), so we REJECT any
 *     match that jumps further than MAX_KM from the existing coordinate and
 *     flag it for manual review instead of silently trusting it.
 *   - Informal / brand-new names (Punggol Digital District, Tengah) aren't in
 *     the gazetteer; those stay flagged "estimated" honestly.
 *
 * The site itself ships zero dependencies and runs from file://. This is the
 * only Node in the project and never runs in the browser.
 *
 * Usage:
 *   node scripts/geocode.mjs            # dry run, prints a report
 *   node scripts/geocode.mjs --write    # also writes data/data.geocoded.js
 * Needs Node 18+ (global fetch).
 * ========================================================================== */

import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const SEARCH =
  "https://www.onemap.gov.sg/api/common/elastic/search" +
  "?returnGeom=Y&getAddrDetails=Y&pageNum=1&searchVal=";
const PACE_MS = 900;   // be gentle: OneMap blocks bursts
const RETRIES = 3;
const MAX_KM = 2.0;    // reject matches that jump further than this

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadAtlas() {
  const require = createRequire(import.meta.url);
  const sandbox = {};
  global.window = sandbox;
  require(resolve(ROOT, "data/data.js"));
  delete global.window;
  if (!sandbox.ATLAS) throw new Error("data/data.js did not populate window.ATLAS");
  return sandbox.ATLAS;
}

function km(a, b) {
  const R = 6371, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Build progressively looser query variants from a site's display name. */
function queryVariants(name) {
  const variants = new Set();
  variants.add(name);
  const beforeSep = name.split(/[—–\-@(]/)[0].trim(); // strip suffixes/brackets
  if (beforeSep && beforeSep !== name) variants.add(beforeSep);
  return Array.from(variants).filter(Boolean);
}

async function searchOnce(q) {
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(SEARCH + encodeURIComponent(q));
      const text = await res.text();
      if (text.trim().startsWith("<")) throw new Error("rate-limited (HTML)");
      const json = JSON.parse(text);
      const hit = (json.results || [])[0];
      if (!hit || !hit.LATITUDE) return null;
      return { lat: +hit.LATITUDE, lng: +hit.LONGITUDE, label: hit.SEARCHVAL };
    } catch (err) {
      if (attempt === RETRIES) return { error: err.message };
      await sleep(PACE_MS * attempt); // backoff
    }
  }
}

/** Try each variant; accept the first hit within MAX_KM of the current point. */
async function resolve_(site) {
  for (const q of queryVariants(site.name)) {
    const hit = await searchOnce(q);
    await sleep(PACE_MS);
    if (!hit) continue;
    if (hit.error) return { status: "error", detail: hit.error };
    const moved = km(site, hit);
    if (moved <= MAX_KM) {
      return { status: "ok", lat: hit.lat, lng: hit.lng, label: hit.label, moved, query: q };
    }
    // matched something, but implausibly far — note it, keep trying variants
    site._farMatch = { label: hit.label, moved };
  }
  if (site._farMatch) {
    return { status: "review", detail: `nearest match ${site._farMatch.label} +${site._farMatch.moved.toFixed(1)}km` };
  }
  return { status: "nomatch", detail: "not in OneMap gazetteer" };
}

async function main() {
  const ATLAS = loadAtlas();
  console.log(`Geocoding ${ATLAS.SITES.length} sites against OneMap (≤${MAX_KM}km sanity gate)\n`);

  const results = [];
  for (const site of ATLAS.SITES) {
    const r = await resolve_(site);
    results.push({ id: site.id, name: site.name, ...r });
    const tag = { ok: "✓", review: "?", nomatch: "·", error: "!" }[r.status];
    const extra =
      r.status === "ok" ? `→ ${r.lat.toFixed(5)},${r.lng.toFixed(5)} (${r.moved.toFixed(2)}km, "${r.label}")`
      : r.detail;
    console.log(`  ${tag} ${site.id.padEnd(22)} ${extra}`);
  }

  const ok = results.filter((r) => r.status === "ok");
  console.log(
    `\n${ok.length} verified · ${results.filter(r=>r.status==="review").length} need review · ` +
    `${results.filter(r=>r.status==="nomatch").length} not in gazetteer · ` +
    `${results.filter(r=>r.status==="error").length} errored`
  );

  await writeFile(resolve(ROOT, "scripts/_geocode_report.json"), JSON.stringify(results, null, 2));

  if (!WRITE) { console.log(`\nDry run. Re-run with --write to emit data/data.geocoded.js`); return; }

  let src = await readFile(resolve(ROOT, "data/data.js"), "utf8");
  for (const r of ok) {
    const block = new RegExp(`(id:\\s*"${r.id}"[\\s\\S]*?)lat:\\s*[-0-9.]+,\\s*lng:\\s*[-0-9.]+,\\s*coordPrecision:\\s*"[a-z]+"`);
    src = src.replace(block, `$1lat: ${r.lat.toFixed(5)}, lng: ${r.lng.toFixed(5)}, coordPrecision: "onemap"`);
  }
  await writeFile(resolve(ROOT, "data/data.geocoded.js"), src, "utf8");
  console.log(`\nWrote data/data.geocoded.js (${ok.length} coordinates upgraded to OneMap). Review the diff.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
