/* =============================================================================
 * share.js — URL-encoded shareable view state (Section 6)
 * Encodes the active filters + map camera into a compact query string, and
 * hydrates from it on load. A filtered view is just a link you can paste.
 *   ?cat=startup,research&sector=fintech&type=hub&q=novena&at=1.305,103.81,13
 * ========================================================================== */
(function () {
  "use strict";
  var A = (window.AtlasApp = window.AtlasApp || {});

  var writing = false; // guard so syncUrl() doesn't fight hydration

  function setList(params, key, set) {
    if (set.size) params.set(key, Array.from(set).join(","));
  }

  A.encodeState = function () {
    var p = new URLSearchParams();
    setList(p, "cat", A.state.cat);
    setList(p, "sector", A.state.sector);
    setList(p, "type", A.state.type);
    if (A.state.q.trim()) p.set("q", A.state.q.trim());
    if (A.map) {
      var c = A.map.getCenter();
      p.set("at", c.lat.toFixed(4) + "," + c.lng.toFixed(4) + "," + A.map.getZoom());
    }
    return p.toString();
  };

  // Push state into the address bar without adding history entries.
  A.syncUrl = function () {
    if (writing) return;
    var qs = A.encodeState();
    history.replaceState(null, "", qs ? "?" + qs : location.pathname);
  };

  // Read the URL on load and populate state (validating against the taxonomy).
  A.applyFromUrl = function () {
    writing = true;
    var p = new URLSearchParams(location.search);
    var D = window.ATLAS;

    // Did the visitor arrive on a shared/deep-linked view? Decide this BEFORE
    // any later syncUrl() writes a camera param and pollutes location.search.
    A.hadIncomingState =
      p.has("cat") || p.has("sector") || p.has("type") || p.has("q") || p.has("at");

    readSet(p.get("cat"), A.state.cat, D.CATEGORIES);
    readSet(p.get("sector"), A.state.sector, D.SECTORS);
    readSet(p.get("type"), A.state.type, D.TYPES);

    var q = p.get("q");
    if (q) {
      A.state.q = q;
      var input = document.getElementById("search");
      if (input) input.value = q;
    }

    var at = p.get("at");
    if (at) {
      var parts = at.split(",");
      var lat = parseFloat(parts[0]), lng = parseFloat(parts[1]), z = parseInt(parts[2], 10);
      if (isFinite(lat) && isFinite(lng) && isFinite(z)) A._pendingView = { center: [lat, lng], zoom: z };
    }
    writing = false;
  };

  function readSet(raw, set, validKeys) {
    if (!raw) return;
    raw.split(",").forEach(function (k) {
      if (Object.prototype.hasOwnProperty.call(validKeys, k)) set.add(k);
    });
  }

  // Copy-link button wiring.
  A.wireShare = function () {
    var btn = document.getElementById("share");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var url = location.origin + location.pathname + (A.encodeState() ? "?" + A.encodeState() : "");
      var done = function () {
        btn.classList.add("copied");
        var label = btn.querySelector("span");
        var prev = label ? label.textContent : "";
        if (label) label.textContent = "Link copied";
        setTimeout(function () {
          btn.classList.remove("copied");
          if (label) label.textContent = prev;
        }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
      else done();
    });
  };
})();
