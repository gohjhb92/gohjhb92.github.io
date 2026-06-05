/* =============================================================================
 * map.js — Leaflet base map (Section 2)
 * Editorial cartography on CartoDB Positron, locked to Singapore, opening on a
 * deliberately composed first frame over one-north.
 * Classic script: attaches to window.AtlasApp, no imports.
 * ========================================================================== */
(function () {
  "use strict";
  var A = (window.AtlasApp = window.AtlasApp || {});

  // Singapore, framed slightly west so one-north + Kent Ridge lead the eye.
  var FIRST_FRAME = { center: [1.3050, 103.8050], zoom: 12 };
  var SG_BOUNDS = L.latLngBounds([1.205, 103.595], [1.475, 104.045]);

  A.initMap = function () {
    var map = L.map("map", {
      center: FIRST_FRAME.center,
      zoom: FIRST_FRAME.zoom,
      minZoom: 11,
      maxZoom: 18,
      maxBounds: SG_BOUNDS,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      attributionControl: true
    });

    L.control.zoom({ position: "bottomleft" }).addTo(map);

    // Positron: muted, label-light — lets the markers carry the colour.
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
        attribution:
          'Sites hand-curated · ' +
          '&copy; <a href="https://carto.com/attributions">CARTO</a> · ' +
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }
    ).addTo(map);

    A.map = map;
    return map;
  };

  // Real cluster outlines: URA Master Plan 2019 subzone boundaries (data.gov.sg),
  // baked into window.ATLAS_BOUNDARIES by scripts/extract-boundaries.mjs.
  A.drawBoundaries = function () {
    var fc = window.ATLAS_BOUNDARIES;
    if (!fc) return;
    var layer = L.geoJSON(fc, {
      style: {
        className: "atlas-boundary",
        color: "#5f6b7a",
        weight: 1.3,
        opacity: 0.7,
        fillColor: "#5f6b7a",
        fillOpacity: 0.045
      }
    }).addTo(A.map);

    // A small label at each subzone's centre, naming the REAL subzone it is.
    layer.eachLayer(function (l) {
      var p = l.feature.properties;
      var c = l.getBounds().getCenter();
      L.marker(c, {
        interactive: false,
        icon: L.divIcon({
          className: "",
          html:
            '<div class="district-label">' + p.clusterLabel +
            ' <small>· ' + titleCase(p.subzone) + ' subzone, URA</small></div>',
          iconSize: null
        })
      }).addTo(layer);
    });
    A.boundaryLayer = layer;
  };

  function titleCase(s) {
    return String(s).toLowerCase().replace(/\b\w/g, function (m) { return m.toUpperCase(); });
  }
})();
