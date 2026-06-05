/* =============================================================================
 * geocode.mjs — OneMap batch geocoder (optional, offline tooling)
 * -----------------------------------------------------------------------------
 * Resolves the coordinates of every site flagged coordPrecision:"estimated"
 * against Singapore's official OneMap search API, then writes an upgraded copy
 * to data/data.geocoded.js (gitignored — review, then fold back into data.js).
 *
 * This is the ONLY part of the project that uses Node. The site itself ships no
 * dependencies and runs straight from file://. Nothing here runs in the browser.
 *
 * Usage:
 *   node scripts/geocode.mjs            # dry run, prints proposed changes
 *   node scripts/geocode.mjs --write    # writes data/data.geocoded.js
 *
 * OneMap search API is free and needs no key for the search endpoint:
 *   https://www.onemap.gov.sg/apidocs/  (search returns lat/long for a query)
 * Be polite: this throttles to a few requests/second.
 * ========================================================================== */

import { readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const ONEMAP_SEARCH =
  "https://www.onemap.gov.sg/api/common/elastic/search?returnGeom=Y&getAddrDetails=N&pageNum=1&searchVal=";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Load data.js (a classic browser script) by giving it a fake global. */
function loadSites() {
  const require = createRequire(import.meta.url);
  const sandbox = {};
  global.window = sandbox;
  require(resolve(ROOT, "data/data.js"));
  delete global.window;
  if (!sandbox.ATLAS) throw new Error("data/data.js did not populate window.ATLAS");
  return sandbox.ATLAS;
}

/** Query OneMap and return {lat, lng} for the first result, or null. */
async function geocode(query) {
  const res = await fetch(ONEMAP_SEARCH + encodeURIComponent(query));
  if (!res.ok) throw new Error(`OneMap ${res.status} for "${query}"`);
  const json = await res.json();
  const hit = json?.results?.[0];
  if (!hit) return null;
  return { lat: parseFloat(hit.LATITUDE), lng: parseFloat(hit.LONGITUDE) };
}

function dist(a, b) {
  // rough metres between two lat/lng (good enough to flag big corrections)
  const R = 6371000, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}

async function main() {
  const ATLAS = loadSites();
  const targets = ATLAS.SITES.filter((s) => s.coordPrecision === "estimated");
  console.log(
    `${ATLAS.SITES.length} sites total · ${targets.length} flagged "estimated" to geocode\n`
  );

  const updated = new Map();
  for (const site of targets) {
    try {
      const hit = await geocode(site.name);
      if (!hit) {
        console.log(`  ?  ${site.name} — no OneMap match, left as-is`);
      } else {
        const moved = dist(site, hit);
        console.log(
          `  ✓  ${site.name} → ${hit.lat.toFixed(4)},${hit.lng.toFixed(4)} (moved ~${moved}m)`
        );
        updated.set(site.id, hit);
      }
    } catch (err) {
      console.log(`  !  ${site.name} — ${err.message}`);
    }
    await sleep(350); // be kind to the API
  }

  if (!WRITE) {
    console.log(`\nDry run. Re-run with --write to emit data/data.geocoded.js`);
    return;
  }

  // Re-emit data.js verbatim but with upgraded coordinates for matched sites.
  const src = await readFile(resolve(ROOT, "data/data.js"), "utf8");
  let out = src;
  for (const [id, hit] of updated) {
    const site = ATLAS.SITES.find((s) => s.id === id);
    // Replace this record's lat/lng/precision in the source text, scoped by id.
    const block = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?)lat:\\s*[-0-9.]+,\\s*lng:\\s*[-0-9.]+,\\s*coordPrecision:\\s*"estimated"`);
    out = out.replace(
      block,
      `$1lat: ${hit.lat.toFixed(4)}, lng: ${hit.lng.toFixed(4)}, coordPrecision: "onemap"`
    );
  }
  await writeFile(resolve(ROOT, "data/data.geocoded.js"), out, "utf8");
  console.log(
    `\nWrote data/data.geocoded.js (${updated.size} coordinates upgraded). ` +
    `Review the diff, then fold good changes back into data/data.js.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
