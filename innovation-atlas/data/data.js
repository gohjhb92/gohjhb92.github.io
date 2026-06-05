/* =============================================================================
 * Singapore Innovation Atlas — dataset
 * -----------------------------------------------------------------------------
 * Loaded as a classic <script> (NOT an ES module) so the atlas opens straight
 * from file:// with no server and no fetch(). Everything hangs off one global.
 *
 * THE THREE ORTHOGONAL AXES
 *   Every site is described on three independent axes, so the same place can be
 *   sliced three different ways without duplicating records:
 *
 *     category  — the role it plays in the ecosystem (the 9 "layers")
 *     type      — its physical / institutional form
 *     sectors[] — the industry verticals it actually advances (cross-cutting)
 *
 *   These are deliberately orthogonal. NUS is category:"education",
 *   type:"university", sectors:["deeptech","biomedtech","digital-ict"].
 *   Biopolis is category:"research", type:"institute", sectors:["biomedtech"].
 *   Punggol Digital District is category:"digital-infra", type:"district",
 *   sectors:["digital-ict","cybersecurity"]. None of the three axes is
 *   derivable from the others — that's the point.
 *
 * HONESTY ON COORDINATES
 *   coordPrecision:"verified"  — landmark coordinate I'm confident in.
 *   coordPrecision:"estimated" — hand-placed from memory, good to ~100–300m,
 *                                pending OneMap geocoding (see scripts/geocode.mjs).
 *   Nothing here is invented. Where I'm unsure, it says so.
 * ========================================================================== */

(function (global) {
  "use strict";

  /* ---- Axis 1: the 9 ecosystem categories (single source of truth) -------- */
  const CATEGORIES = {
    "startup":       { label: "Startup & Incubation", color: "#e8590c", glyph: "rocket" },
    "research":      { label: "Research & R&D",        color: "#7048e8", glyph: "flask"  },
    "education":     { label: "Education (IHL)",       color: "#1c7ed6", glyph: "cap"    },
    "health":        { label: "Health & Biomedical",  color: "#2f9e44", glyph: "cross"  },
    "digital-infra": { label: "Digital Infrastructure", color: "#0c8599", glyph: "server" },
    "financial":     { label: "Financial Core",       color: "#f08c00", glyph: "coin"   },
    "culture":       { label: "Arts & Culture",       color: "#c2255c", glyph: "art"    },
    "living":        { label: "Living & Housing",     color: "#5c940d", glyph: "home"   },
    "civic":         { label: "Civic & Government",   color: "#495057", glyph: "pillar" }
  };

  /* ---- Axis 2: physical / institutional form ------------------------------ */
  const TYPES = {
    "hub":        "Hub / incubator",
    "institute":  "Research institute",
    "university": "University campus",
    "hospital":   "Hospital",
    "data-centre":"Data centre",
    "district":   "Innovation district",
    "venue":      "Cultural venue",
    "estate":     "Residential estate",
    "agency":     "Government agency"
  };

  /* ---- Axis 3: cross-cutting industry verticals --------------------------- */
  const SECTORS = {
    "deeptech":      "Deep tech",
    "fintech":       "Fintech",
    "biomedtech":    "Biomed & health tech",
    "adv-mfg":       "Advanced manufacturing",
    "sustainability":"Sustainability & green",
    "digital-ict":   "Digital & ICT",
    "cybersecurity": "Cybersecurity",
    "media-creative":"Media & creative",
    "agritech-food": "Agritech & food"
  };

  /* ---- Named clusters (the real geography of SG innovation) ---------------- */
  const CLUSTERS = {
    "one-north":  "one-north",
    "cbd":        "CBD financial core",
    "punggol":    "Punggol Digital District",
    "novena":     "Novena health city",
    "outram":     "Outram health city",
    "jid":        "Jurong Innovation District",
    "kent-ridge": "Kent Ridge",
    "civic-dist": "Civic & Marina district",
    "distributed":"Island-wide"
  };

  /* ---- The sites ----------------------------------------------------------
   * ~40 hand-curated real Singapore institutions, grouped by their true
   * cluster. `note` is one editorial sentence on why the site matters.
   * ------------------------------------------------------------------------ */
  const SITES = [
    /* ---------------- one-north ---------------- */
    { id: "block71", name: "BLOCK71 @ JTC LaunchPad", category: "startup", type: "hub",
      sectors: ["deeptech", "digital-ict"], cluster: "one-north",
      lat: 1.2966, lng: 103.7872, coordPrecision: "verified",
      note: "The dense startup cluster that anchored one-north as Singapore's deep-tech front door." },
    { id: "biopolis", name: "Biopolis", category: "research", type: "institute",
      sectors: ["biomedtech"], cluster: "one-north",
      lat: 1.3000, lng: 103.7869, coordPrecision: "verified",
      note: "A*STAR's biomedical research city — wet labs, institutes and pharma R&D in one campus." },
    { id: "fusionopolis", name: "Fusionopolis", category: "research", type: "institute",
      sectors: ["deeptech", "digital-ict"], cluster: "one-north",
      lat: 1.2995, lng: 103.7877, coordPrecision: "verified",
      note: "The physical-sciences and infocomm counterpart to Biopolis across the road." },
    { id: "mediapolis", name: "Mediapolis", category: "research", type: "district",
      sectors: ["media-creative", "digital-ict"], cluster: "one-north",
      lat: 1.2958, lng: 103.7896, coordPrecision: "estimated",
      note: "one-north's media-production and digital-content quarter." },
    { id: "insead", name: "INSEAD Asia Campus", category: "education", type: "university",
      sectors: ["deeptech"], cluster: "one-north",
      lat: 1.3013, lng: 103.7901, coordPrecision: "estimated",
      note: "A global business school planting its Asia hub inside the research belt." },
    { id: "astar-hq", name: "A*STAR (HQ, Connexis)", category: "research", type: "agency",
      sectors: ["deeptech", "biomedtech"], cluster: "one-north",
      lat: 1.2988, lng: 103.7884, coordPrecision: "estimated",
      note: "The agency that steers most of Singapore's public R&D spending." },
    { id: "govtech-mbc", name: "GovTech @ Mapletree Business City", category: "civic", type: "agency",
      sectors: ["digital-ict", "cybersecurity"], cluster: "one-north",
      lat: 1.2743, lng: 103.7905, coordPrecision: "estimated",
      note: "The state's in-house digital build team, sitting next to the research belt rather than in the CBD." },
    { id: "imda", name: "IMDA (Infocomm Media Dev. Authority)", category: "civic", type: "agency",
      sectors: ["digital-ict", "media-creative"], cluster: "one-north",
      lat: 1.2761, lng: 103.7963, coordPrecision: "estimated",
      note: "Regulator-cum-developer for Singapore's infocomm and media sectors." },
    { id: "gillman", name: "Gillman Barracks", category: "culture", type: "venue",
      sectors: ["media-creative"], cluster: "one-north",
      lat: 1.2789, lng: 103.8022, coordPrecision: "estimated",
      note: "Former barracks turned contemporary-art enclave on the edge of the research belt." },

    /* ---------------- Kent Ridge ---------------- */
    { id: "nus", name: "National University of Singapore (Kent Ridge)", category: "education", type: "university",
      sectors: ["deeptech", "biomedtech", "digital-ict"], cluster: "kent-ridge",
      lat: 1.2966, lng: 103.7764, coordPrecision: "verified",
      note: "Singapore's flagship research university and a primary feeder of founders into one-north." },
    { id: "nuh", name: "National University Hospital", category: "health", type: "hospital",
      sectors: ["biomedtech"], cluster: "kent-ridge",
      lat: 1.2939, lng: 103.7836, coordPrecision: "estimated",
      note: "Teaching hospital paired with NUS, closing the bench-to-bedside loop on the ridge." },

    /* ---------------- CBD financial core ---------------- */
    { id: "mas", name: "Monetary Authority of Singapore", category: "civic", type: "agency",
      sectors: ["fintech"], cluster: "cbd",
      lat: 1.2776, lng: 103.8470, coordPrecision: "verified",
      note: "Central bank and the regulator whose sandbox shaped Singapore's fintech rise." },
    { id: "mbfc", name: "Marina Bay Financial Centre", category: "financial", type: "district",
      sectors: ["fintech"], cluster: "cbd",
      lat: 1.2799, lng: 103.8547, coordPrecision: "verified",
      note: "The newer face of the financial core, anchoring banks and trading floors at Marina Bay." },
    { id: "raffles-place", name: "Raffles Place", category: "financial", type: "district",
      sectors: ["fintech"], cluster: "cbd",
      lat: 1.2840, lng: 103.8510, coordPrecision: "verified",
      note: "The historic heart of the CBD and the original centre of gravity for SG finance." },
    { id: "80rr", name: "80RR Fintech Hub @ Robinson Road", category: "startup", type: "hub",
      sectors: ["fintech"], cluster: "cbd",
      lat: 1.2787, lng: 103.8487, coordPrecision: "estimated",
      note: "A fintech-focused co-working hub embedded inside the financial district itself." },
    { id: "ura", name: "URA Centre", category: "civic", type: "agency",
      sectors: ["sustainability"], cluster: "cbd",
      lat: 1.2790, lng: 103.8420, coordPrecision: "estimated",
      note: "The Urban Redevelopment Authority — the hand behind the Master Plan that zones all of this." },

    /* ---------------- Civic & Marina district ---------------- */
    { id: "smu", name: "Singapore Management University", category: "education", type: "university",
      sectors: ["fintech", "digital-ict"], cluster: "civic-dist",
      lat: 1.2975, lng: 103.8497, coordPrecision: "verified",
      note: "A city-campus university wired into the business and finance districts beside it." },
    { id: "national-gallery", name: "National Gallery Singapore", category: "culture", type: "venue",
      sectors: ["media-creative"], cluster: "civic-dist",
      lat: 1.2903, lng: 103.8516, coordPrecision: "verified",
      note: "Southeast Asia's largest public art collection, in the former Supreme Court and City Hall." },
    { id: "esplanade", name: "Esplanade — Theatres on the Bay", category: "culture", type: "venue",
      sectors: ["media-creative"], cluster: "civic-dist",
      lat: 1.2899, lng: 103.8557, coordPrecision: "verified",
      note: "The national performing-arts centre on the Marina Bay waterfront." },
    { id: "artscience", name: "ArtScience Museum", category: "culture", type: "venue",
      sectors: ["media-creative", "deeptech"], cluster: "civic-dist",
      lat: 1.2863, lng: 103.8593, coordPrecision: "verified",
      note: "Where Singapore stages the art-meets-technology narrative for visitors." },
    { id: "ndc", name: "National Design Centre", category: "culture", type: "venue",
      sectors: ["media-creative"], cluster: "civic-dist",
      lat: 1.2998, lng: 103.8556, coordPrecision: "estimated",
      note: "DesignSingapore's home base in the Bras Basah.Bugis arts district." },

    /* ---------------- Novena health city ---------------- */
    { id: "ttsh", name: "Tan Tock Seng Hospital", category: "health", type: "hospital",
      sectors: ["biomedtech"], cluster: "novena",
      lat: 1.3216, lng: 103.8456, coordPrecision: "verified",
      note: "The acute-care anchor of HealthCity Novena." },
    { id: "lkc-medicine", name: "LKC School of Medicine (NTU)", category: "education", type: "university",
      sectors: ["biomedtech"], cluster: "novena",
      lat: 1.3225, lng: 103.8450, coordPrecision: "estimated",
      note: "NTU's medical school, co-located with TTSH to pair training and care." },
    { id: "novena-health", name: "HealthCity Novena", category: "health", type: "district",
      sectors: ["biomedtech"], cluster: "novena",
      lat: 1.3210, lng: 103.8440, coordPrecision: "estimated",
      note: "A planned medical precinct consolidating hospitals, research and teaching in one node." },

    /* ---------------- Outram health city ---------------- */
    { id: "sgh", name: "Singapore General Hospital", category: "health", type: "hospital",
      sectors: ["biomedtech"], cluster: "outram",
      lat: 1.2790, lng: 103.8350, coordPrecision: "verified",
      note: "Singapore's oldest and largest hospital, core of the Outram health campus." },
    { id: "duke-nus", name: "Duke-NUS Medical School", category: "education", type: "university",
      sectors: ["biomedtech"], cluster: "outram",
      lat: 1.2795, lng: 103.8345, coordPrecision: "estimated",
      note: "A graduate medical school built for clinician-scientists, sitting on the SGH campus." },
    { id: "ncc", name: "National Cancer Centre Singapore", category: "health", type: "hospital",
      sectors: ["biomedtech"], cluster: "outram",
      lat: 1.2785, lng: 103.8355, coordPrecision: "estimated",
      note: "National specialist centre concentrating oncology research and care." },

    /* ---------------- Punggol Digital District ---------------- */
    { id: "pdd", name: "Punggol Digital District", category: "digital-infra", type: "district",
      sectors: ["digital-ict", "cybersecurity"], cluster: "punggol",
      lat: 1.4100, lng: 103.9100, coordPrecision: "estimated",
      note: "Singapore's first district master-planned around the digital economy — built ground-up, still maturing." },
    { id: "sit-punggol", name: "Singapore Institute of Technology (Punggol)", category: "education", type: "university",
      sectors: ["digital-ict", "adv-mfg"], cluster: "punggol",
      lat: 1.4120, lng: 103.9130, coordPrecision: "estimated",
      note: "SIT's new campus, deliberately woven into the digital district rather than walled off from it." },
    { id: "punggol-coast", name: "Punggol Coast (housing)", category: "living", type: "estate",
      sectors: ["digital-ict", "sustainability"], cluster: "punggol",
      lat: 1.4180, lng: 103.9120, coordPrecision: "estimated",
      note: "The residential edge of the district — talent housing next to where the work is meant to be." },

    /* ---------------- Jurong Innovation District ---------------- */
    { id: "jid", name: "Jurong Innovation District", category: "digital-infra", type: "district",
      sectors: ["adv-mfg", "sustainability"], cluster: "jid",
      lat: 1.3400, lng: 103.6900, coordPrecision: "estimated",
      note: "An advanced-manufacturing district pulling research, makers and factories of the future together." },
    { id: "ntu", name: "Nanyang Technological University", category: "education", type: "university",
      sectors: ["deeptech", "adv-mfg", "sustainability"], cluster: "jid",
      lat: 1.3483, lng: 103.6831, coordPrecision: "verified",
      note: "Engineering-heavy research university anchoring the western innovation belt." },
    { id: "cleantech", name: "CleanTech Park", category: "research", type: "district",
      sectors: ["sustainability", "adv-mfg"], cluster: "jid",
      lat: 1.3440, lng: 103.6840, coordPrecision: "estimated",
      note: "A testbed business park for clean-tech and sustainability ventures beside NTU." },

    /* ---------------- Island-wide / distributed ---------------- */
    { id: "sutd", name: "Singapore University of Technology & Design", category: "education", type: "university",
      sectors: ["deeptech", "digital-ict"], cluster: "distributed",
      lat: 1.3413, lng: 103.9637, coordPrecision: "verified",
      note: "A design-and-technology university seeded with MIT in the east at Upper Changi." },
    { id: "suss", name: "Singapore University of Social Sciences", category: "education", type: "university",
      sectors: ["digital-ict"], cluster: "distributed",
      lat: 1.3300, lng: 103.7760, coordPrecision: "estimated",
      note: "Applied, work-relevant degrees with a social-science centre of gravity." },
    { id: "equinix-sg3", name: "Equinix SG3 (Tai Seng)", category: "digital-infra", type: "data-centre",
      sectors: ["digital-ict"], cluster: "distributed",
      lat: 1.3350, lng: 103.8870, coordPrecision: "estimated",
      note: "One node of the carrier-dense data-centre cluster that makes SG a regional interconnect hub." },
    { id: "digital-realty-loyang", name: "Digital Realty (Loyang)", category: "digital-infra", type: "data-centre",
      sectors: ["digital-ict"], cluster: "distributed",
      lat: 1.3700, lng: 103.9700, coordPrecision: "estimated",
      note: "Eastern data-centre capacity serving cloud and content providers." },
    { id: "google-dc", name: "Google Data Centre (Jurong West)", category: "digital-infra", type: "data-centre",
      sectors: ["digital-ict", "sustainability"], cluster: "distributed",
      lat: 1.3300, lng: 103.6700, coordPrecision: "estimated",
      note: "Hyperscale capacity in the west — part of why latency-sensitive workloads sit in SG." },
    { id: "tengah", name: "Tengah — “Forest Town”", category: "living", type: "estate",
      sectors: ["sustainability"], cluster: "distributed",
      lat: 1.3550, lng: 103.7200, coordPrecision: "estimated",
      note: "Singapore's first town planned around car-lite, smart and green-living ideas from scratch." },
    { id: "bidadari", name: "Bidadari Estate", category: "living", type: "estate",
      sectors: ["sustainability"], cluster: "distributed",
      lat: 1.3380, lng: 103.8720, coordPrecision: "estimated",
      note: "A dense new housing estate testing walkable, transit-first town design near the centre." }
  ];

  /* ---- Placeholder district shapes ---------------------------------------
   * HONEST PLACEHOLDERS. These are hand-drawn rectangles approximating the
   * footprint of each named cluster, NOT real boundaries. They are here to
   * communicate "this is a district, not a dot" and will be replaced with
   * real URA Master Plan GeoJSON (data.gov.sg). Drawn as [[south,west],[north,east]].
   * ------------------------------------------------------------------------ */
  const DISTRICTS = [
    { cluster: "one-north", label: "one-north", bounds: [[1.2930, 103.7840], [1.3030, 103.7930]] },
    { cluster: "punggol",   label: "Punggol Digital District", bounds: [[1.4060, 103.9060], [1.4210, 103.9170]] },
    { cluster: "jid",       label: "Jurong Innovation District", bounds: [[1.3350, 103.6780], [1.3520, 103.6960]] }
  ];

  global.ATLAS = {
    CATEGORIES: CATEGORIES,
    TYPES: TYPES,
    SECTORS: SECTORS,
    CLUSTERS: CLUSTERS,
    SITES: SITES,
    DISTRICTS: DISTRICTS,
    meta: {
      count: SITES.length,
      lastReviewed: "2026-06-05",
      coordCaveat: "Sites flagged coordPrecision:'estimated' are hand-placed and pending OneMap geocoding."
    }
  };
})(typeof window !== "undefined" ? window : this);
