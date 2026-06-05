/* =============================================================================
 * content.js — editorial prose, kept separate from the dataset (data.js)
 * Interpretation and analysis live here; facts and coordinates live in data.js.
 * Classic script so the static pages can read it from file://.
 * ========================================================================== */
(function (global) {
  "use strict";

  // The thesis the whole atlas argues.
  var THESIS = {
    lede: "Singapore's innovation geography is unusually deliberate.",
    body:
      "In most cities, clusters emerge — a few firms, a university, some capital, " +
      "and a neighbourhood slowly acquires gravity. In Singapore, clusters are " +
      "largely engineered: zoned by the URA, built by JTC, anchored by A*STAR " +
      "institutes and the universities, then named and marketed as districts before " +
      "the tenants arrive. This atlas maps that planned geography — where the state " +
      "has decided innovation should concentrate, and which institutions it has put " +
      "there to make the bet pay off."
  };

  // One honest, interpretive paragraph per cluster. Grounded in the real sites;
  // claims are qualitative and defensible, not invented statistics.
  var CLUSTERS = {
    "one-north": {
      tagline: "The engineered deep-tech district.",
      body:
        "The clearest case of a cluster built rather than grown. JTC master-planned " +
        "one-north around A*STAR's two research cities — Biopolis for biomedical, " +
        "Fusionopolis for physical sciences and infocomm — then layered startup density " +
        "(BLOCK71 at JTC LaunchPad), a business school (INSEAD) and the state's own " +
        "digital teams (GovTech, IMDA) around them. It is the reference design for how " +
        "Singapore tries to manufacture an ecosystem."
    },
    "cbd": {
      tagline: "Innovation as capital and regulation.",
      body:
        "The financial core is an innovation cluster of a different kind: the input " +
        "isn't lab space, it's capital and rules. The Monetary Authority of Singapore " +
        "sits here, and its regulatory sandbox did as much to seed Singapore's fintech " +
        "scene as any incubator. The banks and trading floors at Marina Bay and Raffles " +
        "Place are the demand side that fintech builds for."
    },
    "punggol": {
      tagline: "The newest bet, still maturing.",
      body:
        "Punggol Digital District is Singapore's first district master-planned around " +
        "the digital economy from greenfield — co-locating a university campus (SIT), " +
        "industry space for cyber and digital firms, and housing, on the theory that " +
        "talent, training and employers in walking distance compound. It is the most " +
        "honest 'work in progress' on the map: the plan is bold, the tenancy still filling in."
    },
    "novena": {
      tagline: "A planned medical precinct.",
      body:
        "HealthCity Novena consolidates acute care (Tan Tock Seng Hospital), medical " +
        "training (NTU's Lee Kong Chian School of Medicine) and specialist research into " +
        "a single node — the health-sector equivalent of one-north's co-location logic."
    },
    "outram": {
      tagline: "The older health-and-research campus.",
      body:
        "Singapore's deepest medical campus: SGH, the oldest and largest hospital; " +
        "Duke-NUS, built for clinician-scientists; and the National Cancer Centre. " +
        "URA's own map registers its weight — there is an official subzone literally " +
        "named 'Singapore General Hospital'."
    },
    "jid": {
      tagline: "Advanced manufacturing in the west.",
      body:
        "The Jurong Innovation District concentrates advanced manufacturing and clean " +
        "tech around NTU and CleanTech Park. A detail outsiders miss: NTU and its " +
        "neighbours sit inside the Western Water Catchment planning area, not 'Jurong' " +
        "proper — the innovation district is a programme stitched across several planning " +
        "areas rather than a single zone."
    },
    "kent-ridge": {
      tagline: "The talent spine.",
      body:
        "NUS and the National University Hospital form a university-hospital research " +
        "spine immediately west of one-north — the feeder that supplies much of the " +
        "research talent and many of the founders the deep-tech district depends on."
    },
    "civic-dist": {
      tagline: "Soft power and the city campus.",
      body:
        "The civic and cultural core — National Gallery, the Esplanade, the ArtScience " +
        "Museum — plus SMU's city campus. The layer that supplies the creative, " +
        "convening and education functions an innovation economy leans on but rarely maps."
    },
    "distributed": {
      tagline: "The island-wide layer.",
      body:
        "Not everything clusters. Data centres — the carrier-dense interconnect that " +
        "makes Singapore a regional digital hub — sit dispersed for power and resilience. " +
        "So do the newest smart towns (Tengah, Bidadari) and the universities planted " +
        "deliberately outside the centre (SUTD in the east, SUSS in the west)."
    }
  };

  global.ATLAS_CONTENT = { THESIS: THESIS, CLUSTERS: CLUSTERS };
})(typeof window !== "undefined" ? window : this);
