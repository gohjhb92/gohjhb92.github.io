/* =============================================================================
 * filters.js — three-axis filter dock + filter pipeline (Section 4)
 * State is one plain object; filtering is one pure function over the dataset
 * that re-renders the markers. No framework, no virtual DOM.
 * ========================================================================== */
(function () {
  "use strict";
  var A = (window.AtlasApp = window.AtlasApp || {});

  // The single source of UI truth. Empty set on an axis = "no filter".
  A.state = {
    cat: new Set(),
    type: new Set(),
    sector: new Set(),
    q: ""
  };

  // ---- the pure selector: state + dataset -> visible sites -----------------
  A.selectSites = function () {
    var s = A.state;
    var q = s.q.trim().toLowerCase();
    return window.ATLAS.SITES.filter(function (site) {
      if (s.cat.size && !s.cat.has(site.category)) return false;
      if (s.type.size && !s.type.has(site.type)) return false;
      if (s.sector.size && !site.sectors.some(function (x) { return s.sector.has(x); })) return false;
      if (q) {
        var cluster = (window.ATLAS.CLUSTERS[site.cluster] || "").toLowerCase();
        if (site.name.toLowerCase().indexOf(q) === -1 && cluster.indexOf(q) === -1) return false;
      }
      return true;
    });
  };

  // ---- apply: re-render markers + count, keep the URL in sync --------------
  A.applyFilters = function () {
    var sites = A.selectSites();
    A.renderMarkers(sites);
    var el = document.getElementById("count");
    if (el) {
      el.innerHTML = "<b>" + sites.length + "</b> of " + window.ATLAS.SITES.length + " sites";
    }
    if (A.syncUrl) A.syncUrl();
    return sites;
  };

  // ---- build the dock chips from the taxonomy in data.js -------------------
  function chip(axis, key, label, color) {
    var dot = color ? '<span class="dot" style="background:' + color + '"></span>' : "";
    var b = document.createElement("button");
    b.className = "chip" + (axis === "cat" ? " cat" : "");
    b.type = "button";
    b.dataset.axis = axis;
    b.dataset.key = key;
    b.innerHTML = dot + label;
    b.addEventListener("click", function () {
      var set = A.state[axis];
      if (set.has(key)) { set.delete(key); b.classList.remove("active"); }
      else { set.add(key); b.classList.add("active"); }
      if (axis === "cat" && color) {
        b.style.background = b.classList.contains("active") ? tint(color) : "";
        b.style.borderColor = b.classList.contains("active") ? color : "";
      }
      A.applyFilters();
    });
    return b;
  }

  function tint(hex) {
    return hex + "1a"; // ~10% alpha overlay for the active category chip
  }

  function group(title, axisKey) {
    var wrap = document.createElement("div");
    wrap.className = "filter-group";
    var h = document.createElement("h3");
    h.innerHTML = title + ' <button type="button" data-clear="' + axisKey + '">clear</button>';
    var chips = document.createElement("div");
    chips.className = "chips";
    chips.dataset.group = axisKey;
    wrap.appendChild(h);
    wrap.appendChild(chips);
    h.querySelector("button").addEventListener("click", function () {
      A.state[axisKey].clear();
      chips.querySelectorAll(".chip.active").forEach(function (c) {
        c.classList.remove("active");
        c.style.background = "";
        c.style.borderColor = "";
      });
      A.applyFilters();
    });
    return { wrap: wrap, chips: chips };
  }

  A.buildDock = function () {
    var body = document.getElementById("dockBody");
    var D = window.ATLAS;

    var g1 = group("Category", "cat");
    Object.keys(D.CATEGORIES).forEach(function (k) {
      g1.chips.appendChild(chip("cat", k, D.CATEGORIES[k].label, D.CATEGORIES[k].color));
    });

    var g2 = group("Sector", "sector");
    Object.keys(D.SECTORS).forEach(function (k) {
      g2.chips.appendChild(chip("sector", k, D.SECTORS[k], null));
    });

    var g3 = group("Form", "type");
    Object.keys(D.TYPES).forEach(function (k) {
      g3.chips.appendChild(chip("type", k, D.TYPES[k], null));
    });

    body.appendChild(g1.wrap);
    body.appendChild(g2.wrap);
    body.appendChild(g3.wrap);
  };

  // Reflect hydrated state (from URL) onto the chips' active styling.
  A.syncDockUI = function () {
    document.querySelectorAll(".chip").forEach(function (b) {
      var on = A.state[b.dataset.axis].has(b.dataset.key);
      b.classList.toggle("active", on);
      if (b.dataset.axis === "cat") {
        var color = window.ATLAS.CATEGORIES[b.dataset.key].color;
        b.style.background = on ? color + "1a" : "";
        b.style.borderColor = on ? color : "";
      }
    });
  };
})();
