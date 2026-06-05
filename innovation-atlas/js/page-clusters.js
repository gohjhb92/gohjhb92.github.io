/* =============================================================================
 * page-clusters.js — renders the Clusters analysis page from the dataset
 * Everything here is computed live from data.js / boundaries.js / content.js,
 * so the prose and the numbers can never drift from the map.
 * ========================================================================== */
(function () {
  "use strict";
  var D = window.ATLAS, C = window.ATLAS_CONTENT, B = window.ATLAS_BOUNDARIES;

  // Order the clusters as a narrative, not alphabetically.
  var ORDER = ["one-north", "kent-ridge", "cbd", "civic-dist", "novena", "outram", "punggol", "jid", "distributed"];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function subzoneFor(cluster) {
    var f = (B && B.features || []).find(function (x) { return x.properties.cluster === cluster; });
    if (!f) return null;
    var p = f.properties;
    return p.subzone.toLowerCase().replace(/\b\w/g, function (m) { return m.toUpperCase(); }) +
      " subzone · " + p.planningArea.toLowerCase().replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }

  // ---- thesis ----
  document.getElementById("thesisLede").textContent = C.THESIS.lede;
  document.getElementById("thesisBody").textContent = C.THESIS.body;

  // ---- stats ----
  var sites = D.SITES;
  var onemap = sites.filter(function (s) { return s.coordPrecision === "onemap"; }).length;
  var clustersWithSites = new Set(sites.map(function (s) { return s.cluster; })).size;
  var stats = [
    [sites.length, "sites mapped"],
    [Math.round((onemap / sites.length) * 100) + "%", "coordinates source-verified"],
    [clustersWithSites, "clusters"],
    [Object.keys(D.CATEGORIES).length, "categories"]
  ];
  var statWrap = document.getElementById("stats");
  stats.forEach(function (s) {
    var c = el("div", "stat");
    c.appendChild(el("div", "num", String(s[0])));
    c.appendChild(el("div", "lbl", s[1]));
    statWrap.appendChild(c);
  });

  // ---- category distribution bars ----
  var counts = {};
  Object.keys(D.CATEGORIES).forEach(function (k) { counts[k] = 0; });
  sites.forEach(function (s) { counts[s.category]++; });
  var max = Math.max.apply(null, Object.values(counts));
  var barWrap = document.getElementById("catBars");
  Object.keys(D.CATEGORIES)
    .sort(function (a, b) { return counts[b] - counts[a]; })
    .forEach(function (k) {
      var cat = D.CATEGORIES[k];
      var row = el("div", "bar-row");
      row.appendChild(el("div", "name",
        '<span class="dot" style="background:' + cat.color + '"></span>' + cat.label));
      var track = el("div", "bar-track");
      var fill = el("div", "bar-fill");
      fill.style.width = (counts[k] / max * 100) + "%";
      fill.style.background = cat.color;
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el("div", "val", String(counts[k])));
      barWrap.appendChild(row);
    });

  // ---- per-cluster sections ----
  var wrap = document.getElementById("clusters");
  ORDER.forEach(function (key) {
    var content = C.CLUSTERS[key];
    var clusterSites = sites.filter(function (s) { return s.cluster === key; });
    if (!content || !clusterSites.length) return;

    var sec = el("section", "cluster");
    var head = el("div", "head");
    var left = el("div");
    left.appendChild(el("h2", null, D.CLUSTERS[key] || key));
    var sz = subzoneFor(key);
    if (sz) left.appendChild(el("div", "subzone", sz + " · URA"));
    head.appendChild(left);
    head.appendChild(el("div", "subzone", clusterSites.length + (clusterSites.length === 1 ? " site" : " sites")));
    sec.appendChild(head);

    sec.appendChild(el("div", "tagline", content.tagline));
    sec.appendChild(el("p", null, content.body));

    var chips = el("div", "sites");
    clusterSites.forEach(function (s) {
      var cat = D.CATEGORIES[s.category];
      var a = el("a", null,
        '<span class="dot" style="background:' + cat.color + '"></span>' + s.name);
      a.href = "index.html?q=" + encodeURIComponent(s.name);
      a.title = "Open " + s.name + " on the map";
      chips.appendChild(a);
    });
    sec.appendChild(chips);
    wrap.appendChild(sec);
  });
})();
