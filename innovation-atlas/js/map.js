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

  // Honest placeholder district rectangles (NOT real boundaries — see data.js).
  A.drawDistricts = function () {
    var layer = L.layerGroup().addTo(A.map);
    (window.ATLAS.DISTRICTS || []).forEach(function (d) {
      var rect = L.rectangle(d.bounds, {
        className: "atlas-district",
        color: "#868e96",
        weight: 1.2,
        fillColor: "#868e96"
      }).addTo(layer);

      L.marker(rect.getBounds().getNorthWest(), {
        interactive: false,
        icon: L.divIcon({
          className: "",
          html:
            '<div class="district-label">' +
            d.label +
            ' <small>· approx.</small></div>',
          iconSize: null
        })
      }).addTo(layer);
    });
    A.districtLayer = layer;
  };
})();
