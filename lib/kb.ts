/* ============================================================
   Ground Control knowledge base.
   Scripted, verified answers — every claim traces to the
   public record (repos, registries, resume). Each entry can
   fly the telescope and light the stars it talks about.
   ============================================================ */

export type Flight = {
  /** stars the camera frames — empty array means the home view */
  focus: string[];
  /** upper bound on zoom; the camera fits the focused stars */
  maxScale?: number;
  lit: string[];
  open?: string; // star id to open in the panel
};

export type KBEntry = {
  id: string;
  chip?: string; // shown as a suggested question
  keywords: string[];
  answer: string[];
  flight?: Flight;
};

export const kb: KBEntry[] = [
  {
    id: "whoami",
    chip: "Who is Aditya?",
    keywords: ["who", "aditya", "about", "intro", "yourself", "himself"],
    answer: [
      "Aditya Sarade — AI Engineer at Medikabazaar, Mumbai. Founding member of the company's AI initiative.",
      "Pattern: he takes AI from prototype to production, ships tools as packages, and puts a number on everything.",
    ],
    flight: { focus: [], lit: [] },
  },
  {
    id: "shipped",
    chip: "What has he shipped?",
    keywords: ["shipped", "production", "built", "work", "projects", "live", "real"],
    answer: [
      "In production right now: a voice AI answering phone calls in 11 Indian languages, ~30K enhanced product images on a live marketplace, an SEO engine publishing without humans, and a byte-parity OCR migration.",
      "Lighting up the Forge for you — click any star for its numbers.",
    ],
    flight: { focus: ["medikabazaar", "mb-voice", "image-enhance", "seo-engine", "kyc-ocr"], maxScale: 1.55, lit: ["medikabazaar", "mb-voice", "image-enhance", "seo-engine", "kyc-ocr"] },
  },
  {
    id: "oss",
    chip: "Open source?",
    keywords: ["open", "source", "oss", "github", "package", "packages", "npm", "pypi", "install"],
    answer: [
      "Five packages across npm + PyPI. The spine: Asterix (agent memory framework) powers OSCAR (agentic coding assistant), and AI Command Center meters any of them — a zero-dependency LLM gateway with 0.21ms p50 overhead.",
      "That dependency line on the chart is real: asterix-agent is pinned in OSCAR's requirements.",
    ],
    flight: { focus: ["asterix", "oscar", "ai-command-center", "registry"], maxScale: 1.5, lit: ["asterix", "oscar", "ai-command-center", "registry"] },
  },
  {
    id: "voice",
    chip: undefined,
    keywords: ["voice", "call", "phone", "speech", "language", "languages", "livekit", "sarvam"],
    answer: [
      "MB Voice: places and answers real phone calls — ASR/TTS via Sarvam, speech-to-speech via Gemini Live, RAG grounding, automatic language detection across 11 Indian languages. Per-call cost metering included.",
      "It's the project he's proudest of. Opening the entry.",
    ],
    flight: { focus: ["mb-voice"], maxScale: 1.7, lit: ["mb-voice"], open: "mb-voice" },
  },
  {
    id: "cost",
    chip: "Does cost matter to him?",
    keywords: ["cost", "money", "spend", "save", "savings", "meter", "budget", "cheap", "roi"],
    answer: [
      "Obsessively. ₹3L+ saved at Medikabazaar via batch APIs, caching, and cloud credits. He owns per-image and per-call cost tracking, and built AI Command Center because nobody could answer 'what did this feature cost us yesterday?'",
      "His line: if nobody watches the meter, the meter runs.",
    ],
    flight: { focus: ["ai-command-center"], maxScale: 1.6, lit: ["ai-command-center"] },
  },
  {
    id: "evals",
    keywords: ["eval", "evals", "test", "tests", "benchmark", "safety", "quality", "reliable"],
    answer: [
      "Eval-driven, not vibe-driven. OSCAR's risk classifier scores 100% on a 20-case labelled benchmark with perfect per-tier precision and recall. AI Command Center ships 92 tests and reproducible benchmarks — npm run evals, no API keys needed.",
    ],
    flight: { focus: ["oscar", "ai-command-center"], maxScale: 1.6, lit: ["oscar", "ai-command-center"] },
  },
  {
    id: "stack",
    chip: "What's his stack?",
    keywords: ["stack", "tech", "technology", "tools", "skills", "python", "typescript", "fastapi", "langgraph"],
    answer: [
      "Python · TypeScript · FastAPI · Node (zero-dep when it matters) · LangGraph · MCP · Gemini / Claude / OpenAI / Groq · Qdrant / ChromaDB / FAISS · AWS + Vertex AI · Docker · Kafka · Jenkins.",
      "Rule of thumb: whatever layer is missing, he's shipped it once already.",
    ],
  },
  {
    id: "experience",
    keywords: ["experience", "career", "history", "internship", "wasserstoff", "adgama", "medikabazaar", "job"],
    answer: [
      "Trajectory: B.Tech in AI & Data Science (2026) → Data Science intern at Adgama → AI Engineer intern at Wasserstoff (~90% latency cut on vector search) → founding AI engineer at Medikabazaar since Feb 2026.",
    ],
    flight: { focus: ["education", "adgama", "wasserstoff", "medikabazaar"], maxScale: 1.3, lit: ["education", "adgama", "wasserstoff", "wf-legal-rag", "wf-hr-agents", "qmem", "medikabazaar"] },
  },
  {
    id: "hire",
    chip: "Why hire him?",
    keywords: ["hire", "hiring", "why", "recruit", "candidate", "fit", "strength"],
    answer: [
      "Three reasons, all verifiable on this chart: he ships to production (11-language voice AI, live marketplace systems), he publishes real tools (5 packages, install them yourself), and he measures everything (evals, cost meters, benchmarks).",
      "sudo hire aditya also works in the console. Next step: the resume, or email.",
    ],
    flight: { focus: ["mb-voice", "ai-command-center", "oscar", "asterix"], maxScale: 1.15, lit: ["mb-voice", "ai-command-center", "oscar", "asterix"] },
  },
  {
    id: "resume",
    chip: "Resume?",
    keywords: ["resume", "cv", "pdf", "download"],
    answer: ["Transmitting the paper version. It opens in a new tab — one page of everything this sky says."],
  },
  {
    id: "contact",
    chip: "How do I reach him?",
    keywords: ["contact", "reach", "email", "mail", "linkedin", "twitter", "x", "talk", "connect"],
    answer: [
      "aditya.sarade2003@gmail.com — the inbox is always open. Also github.com/adityasarade, linkedin.com/in/adityasarade, and @aditya_sarade14 on X.",
      "Flying you to the comet.",
    ],
    flight: { focus: ["contact"], maxScale: 1.5, lit: ["contact"], open: "contact" },
  },
  {
    id: "chart",
    keywords: ["chart", "map", "sky", "star", "stars", "constellation", "site", "website", "navigate", "help"],
    answer: [
      "You're reading a knowledge graph drawn as a star chart. Stars are systems, packages, and stations; solid lines are real dependencies; dashed lines are the career trajectory. Hover to read, click to open, ⌘K for the console.",
    ],
  },
];

export const kbFallback = [
  "That's outside my flight plan — I'm a scripted flight computer, not an LLM.",
  "For anything I can't answer: aditya.sarade2003@gmail.com. The human responds.",
];

export function matchKB(input: string): KBEntry | null {
  const words = input.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (words.length === 0) return null;
  let best: { entry: KBEntry; score: number } | null = null;
  for (const entry of kb) {
    let score = 0;
    for (const w of words) {
      if (entry.keywords.includes(w)) score += 2;
      else if (entry.keywords.some((k) => w.length > 3 && (k.startsWith(w) || w.startsWith(k)))) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }
  return best?.entry ?? null;
}
