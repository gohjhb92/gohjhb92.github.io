/* =============================================================================
 * app.js — bootstrap (Section 7)
 * Wires the modules together in order and renders the first frame.
 * ========================================================================== */
(function () {
  "use strict";
  var A = window.AtlasApp;

  function buildLegend() {
    var ul = document.getElementById("legendList");
    if (!ul) return;
    var C = window.ATLAS.CATEGORIES;
    Object.keys(C).forEach(function (k) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="dot" style="background:' + C[k].color + '"></span>' + C[k].label;
      ul.appendChild(li);
    });
  }

  function wireIntro() {
    var intro = document.getElementById("intro");
    var btn = document.getElementById("introEnter");
    function dismiss() {
      intro.classList.add("dismissed");
      A.map.flyTo([1.3000, 103.7880], 14, { duration: 1.6 }); // glide into one-north
      setTimeout(function () { intro.style.display = "none"; }, 950);
    }
    if (btn) btn.addEventListener("click", dismiss);
    // If arriving via a shared link, skip the cinematic and honour the link.
    // (Checks the flag captured at load — NOT location.search, which our own
    // syncUrl() will have already populated with a camera param by now.)
    if (A.hadIncomingState) { intro.style.display = "none"; }
  }

  function wireDockToggle() {
    var dock = document.getElementById("dock");
    var toggle = document.getElementById("dockToggle");
    if (toggle) toggle.addEventListener("click", function () {
      dock.classList.toggle("collapsed");
    });
  }

  function start() {
    A.initMap();
    A.drawDistricts();
    A.buildDock();
    buildLegend();

    // Hydrate from a shared link before the first render.
    A.applyFromUrl();
    A.syncDockUI();
    if (A._pendingView) {
      A.map.setView(A._pendingView.center, A._pendingView.zoom, { animate: false });
    }

    A.applyFilters();
    A.wireSearch();
    A.wireShare();
    wireIntro();
    wireDockToggle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
