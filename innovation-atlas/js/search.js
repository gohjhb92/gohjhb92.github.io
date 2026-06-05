/* =============================================================================
 * search.js — geographic / name search (Section 5)
 * Client-side only: filters the in-memory dataset and flies to the best match.
 * No runtime geocoding API — that's the offline job of scripts/geocode.mjs.
 * ========================================================================== */
(function () {
  "use strict";
  var A = (window.AtlasApp = window.AtlasApp || {});

  var debounceTimer = null;

  A.wireSearch = function () {
    var input = document.getElementById("search");
    if (!input) return;

    input.addEventListener("input", function () {
      A.state.q = input.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        var sites = A.applyFilters();
        flyToBest(sites, input.value);
      }, 160);
    });

    // Enter jumps straight to the top match and opens its popup.
    input.addEventListener("keydown", function (e) {
      if (e.key !== "Enter") return;
      var sites = A.selectSites();
      if (sites.length) openSite(sites[0]);
    });
  };

  // If the query meaningfully narrows the set, ease the camera to frame it.
  function flyToBest(sites, query) {
    if (!query.trim() || !sites.length) return;
    if (sites.length === 1) { openSite(sites[0]); return; }
    if (sites.length <= 8) {
      var b = L.latLngBounds(sites.map(function (s) { return [s.lat, s.lng]; }));
      A.map.flyToBounds(b.pad(0.35), { duration: 0.8, maxZoom: 15 });
    }
  }

  function openSite(site) {
    A.map.flyTo([site.lat, site.lng], 15, { duration: 0.8 });
    var m = A._markerIndex && A._markerIndex[site.id];
    if (m) A.map.once("moveend", function () { m.openPopup(); });
  }

  A.openSite = openSite;
})();
