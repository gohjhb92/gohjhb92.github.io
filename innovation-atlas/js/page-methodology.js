/* =============================================================================
 * page-methodology.js — fills the Method page with live provenance numbers
 * so the honesty claims always match the actual dataset.
 * ========================================================================== */
(function () {
  "use strict";
  var D = window.ATLAS, B = window.ATLAS_BOUNDARIES;
  var sites = D.SITES;
  var onemap = sites.filter(function (s) { return s.coordPrecision === "onemap"; });
  var estimated = sites.filter(function (s) { return s.coordPrecision === "estimated"; });
  var pct = Math.round((onemap.length / sites.length) * 100);

  document.getElementById("coordSummary").textContent =
    "Of " + sites.length + " sites, " + onemap.length + " (" + pct + "%) carry a coordinate " +
    "verified against OneMap; the remaining " + estimated.length + " are honestly flagged as estimated.";

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  var stats = [
    [sites.length, "sites"],
    [onemap.length, "OneMap-verified"],
    [estimated.length, "hand-estimated"],
    [(B && B.features.length) || 0, "real URA boundaries"]
  ];
  var wrap = document.getElementById("coordStats");
  stats.forEach(function (s) {
    var c = el("div", "stat");
    c.appendChild(el("div", "num", String(s[0])));
    c.appendChild(el("div", "lbl", s[1]));
    wrap.appendChild(c);
  });

  document.getElementById("estimatedList").textContent =
    estimated.map(function (s) { return s.name; }).join(" · ");

  document.getElementById("limits").textContent =
    "This is a curated starting set of " + sites.length + " anchor institutions, not a census of " +
    "Singapore's innovation economy — there are many more labs, accelerators and firms to add. " +
    "Coordinates flagged 'estimated' are good to roughly 100–300m, not survey-grade. The cluster " +
    "outlines are URA subzones containing each cluster's anchor, which approximate but do not " +
    "perfectly trace the informal districts. And the cluster narratives are interpretation, offered " +
    "as a point of view rather than settled fact.";
})();
