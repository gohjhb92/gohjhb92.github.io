/* =============================================================================
 * markers.js — category visual language + rendering (Section 3)
 * Each of the 9 categories gets a colour (from data.js) and a simple glyph, so
 * the map reads as a designed legend rather than a field of identical pins.
 * ========================================================================== */
(function () {
  "use strict";
  var A = (window.AtlasApp = window.AtlasApp || {});

  // Minimal 24x24 glyphs, keyed to CATEGORIES[*].glyph. fill-rule:evenodd lets
  // the "donut" shapes (coin) punch a hole.
  var GLYPHS = {
    rocket: "M12 2c2.4 2.2 3.4 5 3.4 7.9l1.7 2.1-2.9.8-2.2-.4-2.2.4-2.9-.8 1.7-2.1C8.6 7 9.6 4.2 12 2z",
    flask:  "M9 3h6v2l-1 1v4l3.8 6.6A2 2 0 0 1 16 20H8a2 2 0 0 1-1.8-3.4L10 10V6L9 5z",
    cap:    "M12 4 2 9l10 5 10-5zM6 13.2V17c0 1.1 2.7 2 6 2s6-.9 6-2v-3.8l-6 3z",
    cross:  "M10 3h4v5h5v4h-5v5h-4v-5H5V8h5z",
    server: "M4 4h16v6H4zm0 8h16v6H4zM7 6.5h2v1H7zm0 8h2v1H7z",
    coin:   "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11z",
    art:    "M12 3a9 9 0 0 0 0 18c1.4 0 1.9-1 1.9-1.9 0-.5-.4-1-.4-1.5 0-.6.5-1.1 1.1-1.1h1.3A4.6 4.6 0 0 0 21 11.9C21 7 17 3 12 3zM7.5 9A1.5 1.5 0 1 1 7.5 12 1.5 1.5 0 0 1 7.5 9zm9 0A1.5 1.5 0 1 1 16.5 12 1.5 1.5 0 0 1 16.5 9z",
    home:   "M12 3 2 11h3v9h6v-5h2v5h6v-9h3z",
    pillar: "M12 3 3 8v2h18V8zM5 11h2v7H5zm6 0h2v7h-2zm6 0h2v7h-2zM3 19h18v2H3z"
  };

  A.makeIcon = function (categoryKey) {
    var cat = window.ATLAS.CATEGORIES[categoryKey];
    var glyph = GLYPHS[cat.glyph] || "";
    return L.divIcon({
      className: "atlas-marker",
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -24],
      html:
        '<div class="atlas-pin" style="background:' + cat.color + '">' +
        '<svg viewBox="0 0 24 24" fill-rule="evenodd"><path d="' + glyph + '"/></svg>' +
        "</div>"
    });
  };

  function popupHtml(site) {
    var D = window.ATLAS;
    var cat = D.CATEGORIES[site.category];
    var sectors = (site.sectors || [])
      .map(function (s) { return "<span>" + (D.SECTORS[s] || s) + "</span>"; })
      .join("");
    var est = site.coordPrecision === "estimated"
      ? '<div class="est">◇ Coordinate hand-estimated, pending geocoding</div>'
      : "";
    return (
      '<div class="pop">' +
        '<span class="pop-cat" style="color:' + cat.color + '">' +
          '<span class="dot" style="background:' + cat.color + '"></span>' + cat.label +
        "</span>" +
        "<h4>" + site.name + "</h4>" +
        '<p class="note">' + site.note + "</p>" +
        '<div class="meta">' + D.TYPES[site.type] + " · " + (D.CLUSTERS[site.cluster] || site.cluster) + "</div>" +
        '<div class="sectors">' + sectors + "</div>" +
        est +
      "</div>"
    );
  }
  A.popupHtml = popupHtml;

  // Render a set of sites, replacing whatever is on the marker layer.
  A.renderMarkers = function (sites) {
    if (!A.markerLayer) A.markerLayer = L.layerGroup().addTo(A.map);
    A.markerLayer.clearLayers();
    A._markerIndex = {};

    sites.forEach(function (site) {
      var m = L.marker([site.lat, site.lng], {
        icon: A.makeIcon(site.category),
        title: site.name,
        riseOnHover: true
      }).bindPopup(popupHtml(site), { closeButton: true, maxWidth: 300 });
      m.addTo(A.markerLayer);
      A._markerIndex[site.id] = m;
    });
  };
})();
