/* ============================================================
   The Observatory — sky chart data.
   The sky is an open, explorable world. Coordinate space is
   WORLD (200 × 124); the camera window shows 100 × 62 units
   at scale 1. Node positions are art-directed into clusters:
   professional experience (west), open source (north-east),
   side projects (south-east), profile (south). Edges encode
   only TRUE relationships.
   ============================================================ */

export type StarKind = "flagship" | "system" | "employer" | "oss" | "minor" | "profile" | "comet";

export type PanelRef =
  | { type: "case"; slug: string }
  | { type: "system"; index: number }
  | { type: "job"; index: number }
  | { type: "edu" }
  | { type: "principles" }
  | { type: "registry" }
  | { type: "other"; index: number }
  | { type: "contact" };

export type Star = {
  id: string;
  name: string;
  kind: StarKind;
  /** 1 = brightest/largest … 4 = faint */
  mag: 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4;
  x: number;
  y: number;
  blurb: string; // one-liner shown in the hover preview
  panel: PanelRef;
  /** label placement to avoid collisions */
  labelPos?: "top" | "bottom" | "left" | "right";
  /** small mono line under the name — role · period for stations */
  sublabel?: string;
};

export type Edge = {
  from: string;
  to: string;
  label?: string;
  kind: "ships" | "powers" | "meters" | "trajectory" | "asterism";
};

export type Region = {
  name: string;
  sub?: string;
  x: number;
  y: number;
};

/* world bounds the camera can roam (stars live well inside) */
export const WORLD = { minX: 0, minY: 0, maxX: 200, maxY: 124 };
export const HOME_VIEW = { cx: 98, cy: 52, s: 1 };

export const stars: Star[] = [
  /* ----- PROFESSIONAL EXPERIENCE — Medikabazaar (west) ----- */
  {
    id: "medikabazaar",
    name: "Medikabazaar",
    kind: "employer",
    mag: 1.5,
    x: 58,
    y: 64,
    blurb: "Founding member of the AI initiative — four systems in production around this station.",
    panel: { type: "job", index: 0 },
    labelPos: "bottom",
    sublabel: "AI Engineer · Feb 2026 →",
  },
  {
    id: "mb-voice",
    name: "MB Voice",
    kind: "flagship",
    mag: 1,
    x: 70,
    y: 51,
    blurb: "Voice AI answering real phone calls in 11 Indian languages — in production.",
    panel: { type: "case", slug: "mb-voice" },
    labelPos: "right",
  },
  {
    id: "image-enhance",
    name: "Image Enhancement",
    kind: "system",
    mag: 2.5,
    x: 39,
    y: 55,
    blurb: "~30K product images scored, enhanced, and live on the marketplace.",
    panel: { type: "system", index: 1 },
    labelPos: "top",
  },
  {
    id: "seo-engine",
    name: "SEO Blog Engine",
    kind: "system",
    mag: 2.5,
    x: 41,
    y: 75,
    blurb: "21K keywords → 624 clusters → blogs that publish themselves.",
    panel: { type: "system", index: 2 },
    labelPos: "bottom",
  },
  {
    id: "kyc-ocr",
    name: "KYC OCR",
    kind: "system",
    mag: 3,
    x: 66,
    y: 73,
    blurb: "Legacy Django → Spring Boot 4 with byte-for-byte parity across 14 proof types.",
    panel: { type: "system", index: 3 },
    labelPos: "bottom",
  },

  /* ----- PROFESSIONAL EXPERIENCE — internships (south-west) ----- */
  {
    id: "wasserstoff",
    name: "Wasserstoff",
    kind: "employer",
    mag: 2.5,
    x: 42,
    y: 92,
    blurb: "Legal-doc RAG backend, ~90% query-latency cut, multi-agent HR automation.",
    panel: { type: "job", index: 1 },
    labelPos: "bottom",
    sublabel: "AI Engineer Intern · Jun–Oct 2025",
  },
  {
    id: "wf-legal-rag",
    name: "Legal-Doc RAG",
    kind: "system",
    mag: 3,
    x: 29,
    y: 84,
    blurb: "Semantic search + text-to-SQL over legal documents — ~90% latency reduction.",
    panel: { type: "job", index: 1 },
    labelPos: "left",
  },
  {
    id: "wf-hr-agents",
    name: "HR Automation",
    kind: "system",
    mag: 3.5,
    x: 31,
    y: 100,
    blurb: "Multi-agent HR workflows on LangGraph + MongoDB.",
    panel: { type: "job", index: 1 },
    labelPos: "left",
  },
  {
    id: "qmem",
    name: "QMem",
    kind: "oss",
    mag: 3.5,
    x: 53,
    y: 101,
    blurb: "Vector-DB setup in one CLI command — co-built and published to PyPI at Wasserstoff.",
    panel: { type: "other", index: 3 },
    labelPos: "bottom",
  },
  {
    id: "adgama",
    name: "Adgama Digital",
    kind: "employer",
    mag: 3,
    x: 67,
    y: 108,
    blurb: "15+ ML/DL models built and deployed into real-time web apps.",
    panel: { type: "job", index: 2 },
    labelPos: "bottom",
    sublabel: "Data Science Intern · Feb–Apr 2025",
  },

  /* ----- PROFILE (south-center) ----- */
  {
    id: "education",
    name: "AISSMS IOIT",
    kind: "profile",
    mag: 3.5,
    x: 92,
    y: 114,
    blurb: "B.Tech, AI & Data Science · Class of 2026 · + certifications.",
    panel: { type: "edu" },
    labelPos: "bottom",
    sublabel: "B.Tech AI & DS · 2022–26",
  },
  {
    id: "principles",
    name: "Operating Principles",
    kind: "profile",
    mag: 2.5,
    x: 103,
    y: 76,
    blurb: "Ship → measure → cut. Eval-driven, not vibe-driven.",
    panel: { type: "principles" },
    labelPos: "right",
  },

  /* ----- OPEN SOURCE (north-east) ----- */
  {
    id: "ai-command-center",
    name: "AI Command Center",
    kind: "flagship",
    mag: 1,
    x: 139,
    y: 25,
    blurb: "Zero-dep LLM gateway + cost dashboard · 0.21ms p50 · npm + PyPI.",
    panel: { type: "case", slug: "ai-command-center" },
    labelPos: "right",
  },
  {
    id: "oscar",
    name: "OSCAR",
    kind: "oss",
    mag: 1.5,
    x: 124,
    y: 42,
    blurb: "Agentic coding assistant with tiered human-in-the-loop safety — 100% (20/20).",
    panel: { type: "case", slug: "oscar" },
    labelPos: "right",
  },
  {
    id: "asterix",
    name: "Asterix",
    kind: "oss",
    mag: 2,
    x: 109,
    y: 56,
    blurb: "Persistent-memory framework for agents — the layer OSCAR runs on.",
    panel: { type: "case", slug: "asterix" },
    labelPos: "left",
  },
  {
    id: "registry",
    name: "The Registry",
    kind: "profile",
    mag: 3,
    x: 162,
    y: 17,
    blurb: "5 packages published across npm + PyPI — pip install away.",
    panel: { type: "registry" },
    labelPos: "right",
  },

  /* ----- SIDE PROJECTS (south-east) ----- */
  {
    id: "querypilot",
    name: "QueryPilot",
    kind: "minor",
    mag: 3,
    x: 135,
    y: 89,
    blurb: "RAG SQL copilot — ghost-text completions in MySQL Workbench.",
    panel: { type: "other", index: 0 },
    labelPos: "left",
  },
  {
    id: "ai-tutor",
    name: "Agentic AI Tutor",
    kind: "minor",
    mag: 3.5,
    x: 152,
    y: 99,
    blurb: "6-agent adaptive tutor · SM-2 spaced repetition · 51 tests.",
    panel: { type: "other", index: 1 },
    labelPos: "bottom",
  },
  {
    id: "doc-researcher",
    name: "Document Researcher",
    kind: "minor",
    mag: 3.5,
    x: 168,
    y: 84,
    blurb: "Multi-PDF semantic search with OCR + cited theme synthesis.",
    panel: { type: "other", index: 2 },
    labelPos: "right",
  },

  /* ----- the comet (contact, north-center) ----- */
  {
    id: "contact",
    name: "Comet Sarade",
    kind: "comet",
    mag: 2,
    x: 99,
    y: 16,
    blurb: "Get in touch — the inbox is always open.",
    panel: { type: "contact" },
    labelPos: "right",
  },
];

export const edges: Edge[] = [
  /* Medikabazaar ships systems */
  { from: "medikabazaar", to: "mb-voice", kind: "ships" },
  { from: "medikabazaar", to: "image-enhance", kind: "ships" },
  { from: "medikabazaar", to: "seo-engine", kind: "ships" },
  { from: "medikabazaar", to: "kyc-ocr", kind: "ships" },

  /* Wasserstoff ships systems */
  { from: "wasserstoff", to: "wf-legal-rag", kind: "ships" },
  { from: "wasserstoff", to: "wf-hr-agents", kind: "ships" },
  { from: "wasserstoff", to: "qmem", kind: "ships" },

  /* career trajectory (dashed) */
  { from: "education", to: "adgama", kind: "trajectory" },
  { from: "adgama", to: "wasserstoff", kind: "trajectory" },
  { from: "wasserstoff", to: "medikabazaar", kind: "trajectory" },

  /* the open-source spine — true dependencies */
  { from: "asterix", to: "oscar", label: "powers", kind: "powers" },
  { from: "oscar", to: "ai-command-center", label: "one base-URL from the meter", kind: "meters" },
  { from: "ai-command-center", to: "registry", kind: "ships" },

  /* side-projects asterism */
  { from: "querypilot", to: "doc-researcher", kind: "asterism" },
  { from: "querypilot", to: "ai-tutor", kind: "asterism" },
];

export const regions: Region[] = [
  { name: "PROFESSIONAL EXPERIENCE", sub: "shipped at work · 2025 →", x: 55, y: 47 },
  { name: "OPEN SOURCE", sub: "installable — npm + PyPI", x: 126, y: 47 },
  { name: "SIDE PROJECTS", sub: "independent builds", x: 140, y: 76 },
  { name: "PROFILE", sub: "the pilot", x: 96, y: 106 },
];

/* deterministic starfield — seeded PRNG so SSR and client agree */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type FieldStar = { x: number; y: number; r: number; o: number; twinkle: boolean; dur: number };

function makeField(seed: number, count: number, rMin: number, rMax: number, spread: number): FieldStar[] {
  const rand = mulberry32(seed);
  const out: FieldStar[] = [];
  const w = WORLD.maxX - WORLD.minX + spread * 2;
  const h = WORLD.maxY - WORLD.minY + spread * 2;
  for (let i = 0; i < count; i++) {
    out.push({
      x: Math.round((WORLD.minX - spread + rand() * w) * 10) / 10,
      y: Math.round((WORLD.minY - spread + rand() * h) * 10) / 10,
      r: Math.round((rMin + rand() * (rMax - rMin)) * 100) / 100,
      o: Math.round((0.2 + rand() * 0.55) * 100) / 100,
      twinkle: rand() < 0.2,
      dur: Math.round((3.5 + rand() * 5) * 10) / 10,
    });
  }
  return out;
}

/* three depths: deep drifts slowest under the camera (parallax) */
export const starfieldDeep: FieldStar[] = makeField(20260710, 240, 0.04, 0.1, 40);
export const starfieldMid: FieldStar[] = makeField(19991114, 190, 0.05, 0.15, 26);
export const starfieldNear: FieldStar[] = makeField(20250601, 150, 0.06, 0.2, 14);

/* brass glints — a few warmer, brighter grains in the near field */
export const glints: FieldStar[] = makeField(777, 16, 0.16, 0.26, 8);

export function starById(id: string): Star | undefined {
  return stars.find((s) => s.id === id);
}

/* ============================================================
   Camera helpers — every flight target is derived from the
   stars it frames, so the layout can move without breaking
   the tour or Ground Control.
   ============================================================ */

export type View = { cx: number; cy: number; s: number };

export function viewForStars(
  ids: string[],
  maxScale = 1.6,
  pad = 16,
  /* the visible window in world units - pass the real one on small screens */
  win: { w: number; h: number } = { w: 100, h: 62 }
): View {
  const pts = ids.map(starById).filter((s): s is Star => Boolean(s));
  if (pts.length === 0) return { ...HOME_VIEW, cx: HOME_VIEW.cx, cy: HOME_VIEW.cy, s: HOME_VIEW.s };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const fit = Math.min(win.w / (maxX - minX + pad), win.h / (maxY - minY + pad));
  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    s: Math.min(maxScale, Math.max(0.35, fit)),
  };
}

/* ============================================================
   The guided tour — five short chapters. Each frames the
   stars it lights; the rest of the sky dims.
   ============================================================ */

export type TourChapter = {
  id: string;
  label: string;
  heading: string;
  line: string;
  focus: string[];
  maxScale: number;
  lit: string[];
};

export const tour: TourChapter[] = [
  {
    id: "who",
    label: "01 · the sky",
    heading: "Aditya Sarade — AI Engineer",
    line: "I take AI from prototype to production. This sky is everything I've shipped — every line between stars is a real relationship. Drag anywhere to wander.",
    focus: [],
    maxScale: 1,
    lit: [],
  },
  {
    id: "forge",
    label: "02 · at work",
    heading: "In production at Medikabazaar",
    line: "Founding member of the AI initiative. Voice AI answering live phone calls in 11 languages, ~30K product images enhanced, an SEO engine that publishes itself.",
    focus: ["medikabazaar", "mb-voice", "image-enhance", "seo-engine", "kyc-ocr"],
    maxScale: 1.55,
    lit: ["medikabazaar", "mb-voice", "image-enhance", "seo-engine", "kyc-ocr"],
  },
  {
    id: "opus",
    label: "03 · open source",
    heading: "Open source, shipped as packages",
    line: "A memory framework, the agent it powers, and the gateway that meters every token — 5 packages on npm + PyPI, one pip install away.",
    focus: ["asterix", "oscar", "ai-command-center", "registry"],
    maxScale: 1.5,
    lit: ["asterix", "oscar", "ai-command-center", "registry"],
  },
  {
    id: "origin",
    label: "04 · origin",
    heading: "The trajectory",
    line: "B.Tech in AI & Data Science → two internships → founding AI engineer, in under two years. Eval-driven, not vibe-driven.",
    focus: ["education", "adgama", "wasserstoff", "medikabazaar", "principles"],
    maxScale: 1.3,
    lit: ["education", "adgama", "wasserstoff", "wf-legal-rag", "wf-hr-agents", "qmem", "medikabazaar", "principles"],
  },
  {
    id: "transmission",
    label: "05 · transmission",
    heading: "Reach the observatory",
    line: "The comet carries mail. Or open Ground Control and ask the flight computer about me — it knows this sky by heart.",
    focus: ["contact"],
    maxScale: 1.5,
    lit: ["contact"],
  },
];
