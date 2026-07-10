/* ============================================================
   Content layer — every fact here traces back to a verified
   source: the live repos, registries, sites, or Aditya's own
   published writing (resume, GitHub profile, project READMEs).
   ============================================================ */

export const site = {
  name: "Aditya Sarade",
  role: "AI Engineer",
  docId: "AS·2026.07 · REV A",
  email: "aditya.sarade2003@gmail.com",
  location: "Mumbai, India",
  employer: "Medikabazaar",
  links: {
    github: "https://github.com/adityasarade",
    linkedin: "https://www.linkedin.com/in/adityasarade/",
    x: "https://x.com/aditya_sarade14",
    pypi: "https://pypi.org/user/adityasarade/",
    npm: "https://www.npmjs.com/package/ai-command-center",
  },
};

export const hero = {
  kicker: "Technical datasheet — issued Jul 2026",
  statement: ["I take AI from", "prototype", "to", "production."],
  sub: "Voice agents that pick up the phone in eleven languages. An LLM gateway that meters every token it forwards. A memory framework so agents stop forgetting. Shipped as packages, not gists — and measured, because if nobody watches the meter, the meter runs.",
  status: "AI Engineer @ Medikabazaar — founding member of the AI initiative",
};

/* §00 — calibration strip */
export type Metric = {
  value: string;
  num?: number; // animated part, if numeric
  prefix?: string;
  suffix?: string;
  label: string;
  note?: string;
};

export const metrics: Metric[] = [
  { value: "11", num: 11, label: "languages of live voice AI" },
  { value: "5", num: 5, label: "packages on PyPI + npm" },
  { value: "0.21ms", num: 0.21, suffix: "ms", label: "gateway overhead, p50", note: "1" },
  { value: "₹3L+", prefix: "₹", num: 3, suffix: "L+", label: "cost savings delivered" },
  { value: "27", num: 27, label: "codebases audited monthly" },
  { value: "100%", num: 100, suffix: "%", label: "safety-classifier accuracy", note: "2" },
];

export const metricFootnotes = [
  "1 — measured over 400 paired requests; reproducible via `npm run evals`",
  "2 — OSCAR risk classifier, 20/20 labelled cases, perfect per-tier precision/recall",
];

/* §01 — selected work index */
export type WorkItem = {
  slug: string;
  index: string;
  title: string;
  oneLiner: string;
  year: string;
  status: string;
  statusKind: "live" | "prod" | "shipped";
  stack: string[];
  headline: string; // stat shown on hover / in row
};

export const workIndex: WorkItem[] = [
  {
    slug: "ai-command-center",
    index: "01",
    title: "AI Command Center",
    oneLiner: "Zero-dependency LLM gateway + self-hosted cost dashboard. Point any app at it with one base-URL change.",
    year: "2026",
    status: "npm + PyPI + live",
    statusKind: "live",
    stack: ["Node.js · 0 deps", "SSE passthrough", "scrypt + HMAC auth", "Next.js docs site"],
    headline: "0.21ms p50 overhead · 11+ providers · 92 tests",
  },
  {
    slug: "mb-voice",
    index: "02",
    title: "MB Voice",
    oneLiner: "A voice AI that places and answers real phone calls — in 11 Indian languages, with per-call cost metering.",
    year: "2026",
    status: "in production",
    statusKind: "prod",
    stack: ["Python + LiveKit", "Sarvam ASR/TTS", "Gemini Live", "RAG on Bedrock"],
    headline: "11 languages · auto language detection · BANT lead scoring",
  },
  {
    slug: "oscar",
    index: "03",
    title: "OSCAR",
    oneLiner: "An agentic coding assistant that plans before it acts — VS Code extension + CLI with tiered human-in-the-loop safety.",
    year: "2025–26",
    status: "PyPI v0.6.2",
    statusKind: "shipped",
    stack: ["Python + FastAPI", "ReAct loop", "15 tools", "5 providers / 26 models"],
    headline: "100% (20/20) safety classifier · 13 endpoints · SSE streaming",
  },
  {
    slug: "asterix",
    index: "04",
    title: "Asterix",
    oneLiner: "The memory framework underneath — agents that edit their own memory and survive a process restart.",
    year: "2025–26",
    status: "PyPI v0.2.1",
    statusKind: "shipped",
    stack: ["Python", "SQLite / JSON state", "Qdrant archival", "decorator tools"],
    headline: "7 releases · powers OSCAR · 14 GitHub stars",
  },
];

/* §02 — the stack story */
export const stackStory = {
  title: "Three projects, one system",
  body: "Asterix is the memory framework. OSCAR is the agent built on it — asterix-agent is a pinned PyPI dependency, not a diagram arrow. AI Command Center is the gateway either of them can point at with one base-URL change, metering every token they spend. One remembers, one acts, one watches the bill — each shipped as its own package.",
};

/* §03 — in production at Medikabazaar */
export type ProductionSystem = {
  name: string;
  metric: string;
  metricLabel: string;
  body: string;
  stack: string;
};

export const productionSystems: ProductionSystem[] = [
  {
    name: "Voice AI platform",
    metric: "11",
    metricLabel: "languages, live calls",
    body: "Autonomously places and answers phone calls — real speech in, real speech out. ASR/TTS via Sarvam, speech-to-speech via Gemini Live, RAG grounding, automatic language detection, and a GenAI analytics layer: summaries, sentiment, BANT lead scoring.",
    stack: "Python · LiveKit · ChromaDB · Cohere Embed v4 on AWS Bedrock · FastAPI · Next.js",
  },
  {
    name: "Image enhancement service",
    metric: "~30K",
    metricLabel: "product images live",
    body: "Scores every SKU image on a multi-metric quality composite — sharpness, resolution, contrast, exposure — and routes the weak ones through Gemini across four enhancement styles. Serving the marketplace right now.",
    stack: "FastAPI · Gemini · S3 · Kafka → CMS · EC2 · Jenkins CI",
  },
  {
    name: "SEO blog engine",
    metric: "624",
    metricLabel: "keyword clusters",
    body: "21K Ahrefs keywords across 1,000+ SKUs, clustered to kill keyword cannibalization, then blogs and banners generated and published end-to-end. Replaced a fully manual workflow — ships continuously with zero engineering per release.",
    stack: "Python · ChromaDB · agglomerative clustering · Gemini 2.5 Pro · React/TS dashboard",
  },
  {
    name: "KYC OCR migration",
    metric: "14",
    metricLabel: "proof types, byte parity",
    body: "Rebuilt a legacy Django OCR endpoint as a Spring Boot 4 / Java 17 microservice with byte-for-byte output parity across all 14 document proof types — then upgraded to LSTM behind a feature flag for a quality win on top of strict parity.",
    stack: "Spring Boot 4 · Java 17 · Tess4J · OpenCV · PDFBox",
  },
];

export const productionFooter =
  "Plus: ₹3L+ in direct cost savings via batch APIs, caching, and cloud credits · monthly security audits across 27 codebases actioned by 4 engineering teams · Google Ads, Analytics & Search Console wired into Claude Code via MCP for leadership insights.";

/* §04 — open-source registry */
export type Pkg = {
  name: string;
  registry: "npm" | "PyPI";
  version: string;
  install: string;
  desc: string;
  href: string;
};

export const registry: Pkg[] = [
  {
    name: "ai-command-center",
    registry: "npm",
    version: "v0.2.1",
    install: "npx ai-command-center",
    desc: "LLM gateway + cost dashboard. Zero runtime dependencies.",
    href: "https://www.npmjs.com/package/ai-command-center",
  },
  {
    name: "@ai-command-center/sdk",
    registry: "npm",
    version: "v0.1.0",
    install: "npm i @ai-command-center/sdk",
    desc: "JavaScript helper SDK for the gateway.",
    href: "https://www.npmjs.com/package/@ai-command-center/sdk",
  },
  {
    name: "aicc-sdk",
    registry: "PyPI",
    version: "v0.1.0",
    install: "pip install aicc-sdk",
    desc: "Python helper SDK. Zero dependencies, Python ≥3.8.",
    href: "https://pypi.org/project/aicc-sdk/",
  },
  {
    name: "oscar-agent",
    registry: "PyPI",
    version: "v0.6.2",
    install: "pip install oscar-agent",
    desc: "Agentic coding assistant — CLI + VS Code backend.",
    href: "https://pypi.org/project/oscar-agent/",
  },
  {
    name: "asterix-agent",
    registry: "PyPI",
    version: "v0.2.1",
    install: "pip install asterix-agent",
    desc: "Persistent-memory framework for AI agents.",
    href: "https://pypi.org/project/asterix-agent/",
  },
];

/* §05 — experience */
export type Job = {
  company: string;
  role: string;
  period: string;
  current?: boolean;
  bullets: string[];
  stack?: string;
};

export const experience: Job[] = [
  {
    company: "Medikabazaar",
    role: "AI Engineer",
    period: "Feb 2026 — present",
    current: true,
    bullets: [
      "Founding member of the company's AI initiative — voice platform, image pipeline, SEO engine, OCR migration (see §03).",
      "Own Google API key management and per-image / per-call cost tracking across the AI stack.",
      "Rolled out Claude, Claude Code, and MCP integrations to dev and non-dev teams; monthly audits across 27 codebases.",
    ],
    stack: "Python · FastAPI · Gemini · AWS · Kafka · Jenkins · Spring Boot · React",
  },
  {
    company: "Wasserstoff Innovations",
    role: "AI Engineer Intern",
    period: "Jun — Oct 2025",
    bullets: [
      "Legal-document analysis backend: semantic search, text-to-SQL over DuckDB, automated visualizations.",
      "Qdrant vector workflows with Redis caching — ~90% query-latency reduction; async pipelines on TaskIQ/Celery + RabbitMQ.",
      "Multi-agent HR automation on LangGraph + MongoDB; co-built QMem, a vector-DB setup CLI published to PyPI during the internship.",
    ],
    stack: "Python · FastAPI · LangGraph · Qdrant · Redis · RabbitMQ · DuckDB",
  },
  {
    company: "Adgama Digital",
    role: "Data Science Intern",
    period: "Feb — Apr 2025",
    bullets: [
      "Built and fine-tuned 15+ ML/DL models on 100K+ row datasets with reusable preprocessing pipelines.",
      "Deployed 10+ models into real-time web apps via Streamlit, Gradio, FastAPI, and Django.",
    ],
    stack: "Python · TensorFlow · XGBoost · Streamlit · Django",
  },
];

export const education = {
  school: "AISSMS Institute of Information Technology, Pune",
  degree: "B.Tech, Artificial Intelligence & Data Science",
  period: "2022 — May 2026",
};

export const certifications = [
  "LLM Agents — UC Berkeley",
  "LLMs as Operating Systems: Agent Memory — DeepLearning.AI",
  "Neural Networks & Deep Learning — DeepLearning.AI",
  "Career Essentials in Generative AI — Microsoft × LinkedIn",
];

/* §06 — operating principles */
export const principles = [
  {
    title: "Ship → measure → cut.",
    body: "Every project on this page has a number attached, because I instrument before I optimize.",
  },
  {
    title: "Eval-driven, not vibe-driven.",
    body: "I'd rather a benchmark tell me I'm wrong than a demo that looks right.",
  },
  {
    title: "Agents, end to end.",
    body: "Speech, tools, memory, RAG, guardrails, cost metering — I've shipped every layer of the stack.",
  },
  {
    title: "If the tool doesn't exist, I write it.",
    body: "And publish it. If I build it, someone else should be able to pip install it.",
  },
];

/* §07 — instruments (curated stack) */
export const instruments: { group: string; items: string }[] = [
  { group: "Languages", items: "Python · TypeScript · SQL · Java 17" },
  { group: "Agents & LLMs", items: "LangGraph · MCP · Gemini · Claude · OpenAI · Groq · eval harnesses · guardrails" },
  { group: "Retrieval", items: "Qdrant · ChromaDB · FAISS · Pinecone · pgvector" },
  { group: "Backend", items: "FastAPI · Node.js · Spring Boot · SSE · Kafka · Redis · RabbitMQ" },
  { group: "Infra", items: "AWS (EC2 · S3 · Bedrock) · Vertex AI · Docker · Jenkins · GitHub Actions" },
  { group: "Frontend", items: "Next.js · React · vanilla JS/CSS when zero deps matter" },
];

/* index of other builds */
export const otherBuilds = [
  {
    name: "QueryPilot",
    desc: "RAG SQL copilot — ghost-text completions inside MySQL Workbench via LLaMA 3.3 70B on Groq, acceptance tracked in MLflow.",
    href: "https://github.com/adityasarade/Query-Pilot",
  },
  {
    name: "Agentic AI Tutor",
    desc: "Adaptive tutoring platform — 6 specialized agents, SM-2 spaced repetition, 51 passing tests, $0/month to run.",
    href: "https://github.com/adityasarade/Agentic_AI_Tutor",
  },
  {
    name: "Document Researcher",
    desc: "Multi-PDF semantic search with OCR fallback, FAISS index, and citation-backed cross-document synthesis.",
    href: "https://github.com/adityasarade/Document-Researcher",
  },
  {
    name: "QMem",
    desc: "Vector-database setup collapsed into one CLI command — co-built with the Wasserstoff team during the internship.",
    href: "https://pypi.org/project/qmem/",
  },
];

export const funFacts = "Off the clock: chess, astronomy, and a past life as an MUN delegate.";

/* ============================================================
   Case studies
   ============================================================ */

export type CaseSection = { heading: string; paras: string[] };
export type CaseStudy = {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  status: string;
  links: { label: string; href: string }[];
  stack: string[];
  intro: string;
  sections: CaseSection[];
  numbers: { value: string; label: string }[];
  numbersNote?: string;
  hardParts: { title: string; body: string }[];
  schematic: "gateway" | "voice" | "agent" | "memory";
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "ai-command-center",
    title: "AI Command Center",
    tagline: "One gateway. Every AI project. One dashboard.",
    year: "2026",
    role: "Designer, author, maintainer — solo",
    status: "Live · npm + PyPI · MIT",
    links: [
      { label: "GitHub", href: "https://github.com/adityasarade/ai-command-center" },
      { label: "Live site + demo", href: "https://aicommandcenter.vercel.app/" },
      { label: "npm", href: "https://www.npmjs.com/package/ai-command-center" },
      { label: "PyPI", href: "https://pypi.org/project/aicc-sdk/" },
    ],
    stack: ["Node.js ≥18 — zero runtime deps", "Vanilla JS/CSS dashboard", "Python + JS SDKs", "Next.js docs site", "GitHub Actions CI"],
    intro:
      "Every team running LLMs has the same blind spot: spend is scattered across provider consoles, and nobody can answer \"what did this feature cost us yesterday?\" AI Command Center is my answer — a self-hosted gateway you point any app at with a one-line base-URL change. Requests pass through untouched; every token, cost, and millisecond lands in one dashboard. No SDK adoption, no database, no telemetry wiring. `npx ai-command-center` and you're running.",
    sections: [
      {
        heading: "The one-line pitch is literal",
        paras: [
          "Integration is a single base-URL swap — `OpenAI(base_url=\"http://localhost:4321/p/invoice-bot/openai/v1\")` — in any language. The `/p/<project>` path segment groups calls per project. API keys pass through; prompt and response bodies are never stored.",
          "The gateway proxies 11+ providers — OpenAI, Anthropic, Gemini, OpenRouter, Mistral, DeepSeek, xAI, Groq, Together, Ollama, plus anything OpenAI-compatible — and reads real token usage on the way past to compute exact per-request cost, shown in rupees, dollars, or euros at live FX rates.",
        ],
      },
      {
        heading: "Zero dependencies, on purpose",
        paras: [
          "The npm gateway package has zero runtime dependencies — pure Node stdlib. CI installs nothing. The dashboard is vanilla JS and CSS. This isn't asceticism: a tool that watches your infrastructure shouldn't be a supply-chain risk itself, and it should still start in seconds on a bare VM.",
          "Pricing never silently drifts: config overrides → a daily-refreshed community price sheet (cached to disk) → stale cache → a shipped hand-curated dataset. Four layers of fallback, so costs stay exact even offline.",
        ],
      },
      {
        heading: "Built like a product, not a demo",
        paras: [
          "Traces and sessions, prompt-version metrics, model comparison, budgets with anomaly alerts and webhooks. RBAC with admin/member/viewer roles, per-project gateway keys, and last-admin lockout protection. Opt-in provider routing fans requests across failover or round-robin pools.",
          "A `/api/track` endpoint ingests non-LLM AI spend too — speech-to-text, TTS, telephony, image generation — with shared trace IDs, so an entire pipeline reads as one session. The docs are honest about failure modes: the gateway is not fail-open, and the README says so, with supervision examples and a kill-switch story.",
        ],
      },
    ],
    numbers: [
      { value: "0.21 ms", label: "added latency, p50 (p99 0.71 ms)" },
      { value: "0", label: "runtime dependencies" },
      { value: "92", label: "tests, green on Node 18/20/22" },
      { value: "0/20", label: "cost mismatches vs independent recomputation" },
      { value: "11+", label: "providers proxied" },
      { value: "7/7", label: "provider usage shapes parsed, stream + non-stream" },
    ],
    numbersNote: "All benchmarks run against an in-process mock upstream — no keys, no network. Reproduce with `npm run evals`; CI runs the smoke version.",
    hardParts: [
      {
        title: "SSE passthrough with usage capture",
        body: "Streaming responses have to flow through unbuffered — but token counts live at the end of the stream. The proxy detects `text/event-stream`, measures TTFB, and where needed injects `stream_options.include_usage` and relays the stream while recovering usage from the final frames. Getting backpressure right so a slow client can't balloon gateway memory was one of the hardest bugs.",
      },
      {
        title: "A random web page must not spend your keys",
        body: "The dashboard runs on localhost, which makes CSRF and cross-origin abuse a real threat model. I wrote an explicit origin policy: no-Origin and same-origin requests are trusted, everything else must be allowlisted. Auth is scrypt-hashed passwords (async, so hashing never stalls proxied traffic) and HMAC-signed cookies compared with timing-safe equality.",
      },
      {
        title: "Exact cost, not estimates",
        body: "Cost accounting uses real token counts including cached tokens, priced against a 4-layer fallback dataset with live FX. Verified by recomputing 20 provider/model/token-mix cases independently: zero mismatches.",
      },
    ],
    schematic: "gateway",
  },
  {
    slug: "mb-voice",
    title: "MB Voice",
    tagline: "An AI that picks up the phone — in 11 Indian languages.",
    year: "2026",
    role: "AI Engineer, Medikabazaar — built the full pipeline",
    status: "In production · proprietary",
    links: [],
    stack: ["Python + LiveKit", "Sarvam Saaras (ASR) · Bulbul (TTS)", "Gemini Live speech-to-speech", "ChromaDB + Cohere Embed v4 on AWS Bedrock", "FastAPI · Next.js · Docker"],
    intro:
      "A multilingual voice-calling platform that autonomously places and answers live phone calls — real speech in, real speech out. India doesn't speak one language, so the system detects what the caller actually speaks and switches to it, across eleven Indian languages. This is the project I'm proudest of.",
    sections: [
      {
        heading: "The full pipeline, not a wrapper",
        paras: [
          "Telephony and media over LiveKit. Speech recognition via Sarvam Saaras, synthesis via Sarvam Bulbul, and speech-to-speech through Gemini Live. Automatic language detection picks the caller's language mid-conversation and the agent follows.",
          "Answers are grounded with RAG — ChromaDB with Cohere Embed v4 on AWS Bedrock — so the agent speaks from the catalog and policy corpus, not from vibes.",
        ],
      },
      {
        heading: "The call is only half the product",
        paras: [
          "On top of the calls sits a GenAI analytics layer: call summarization, three-class sentiment, BANT hot/warm/cold lead scoring, and entity extraction — served from a FastAPI backend with a Next.js dashboard, all containerized.",
          "Every call is metered. Per-call cost tracking runs through the same discipline as the rest of my stack: if nobody watches the meter, the meter runs.",
        ],
      },
    ],
    numbers: [
      { value: "11", label: "Indian languages, live" },
      { value: "S2S", label: "speech-to-speech via Gemini Live" },
      { value: "3-class", label: "sentiment + BANT lead scoring" },
      { value: "per-call", label: "cost metering, every call" },
    ],
    numbersNote: "Proprietary system — described with permission, no public links.",
    hardParts: [
      {
        title: "Language detection that can't lag",
        body: "A caller who switches from Hindi to Marathi mid-sentence won't wait for a model to catch up. Detection has to happen fast enough that the reply comes back in the right language on the very next turn.",
      },
      {
        title: "Latency budgets in speech",
        body: "Voice is the least forgiving AI interface: every stage — ASR, retrieval, generation, TTS — eats into a silence budget measured in hundreds of milliseconds before the call feels broken.",
      },
    ],
    schematic: "voice",
  },
  {
    slug: "oscar",
    title: "OSCAR",
    tagline: "An agent you can trust with your shell.",
    year: "2025 — 26",
    role: "Designer, author, maintainer — solo",
    status: "PyPI v0.6.2 · MIT",
    links: [
      { label: "GitHub", href: "https://github.com/adityasarade/OSCAR" },
      { label: "Live site", href: "https://oscar-agent.vercel.app/" },
      { label: "PyPI", href: "https://pypi.org/project/oscar-agent/" },
    ],
    stack: ["Python 3.10+ · FastAPI + SSE", "TypeScript VS Code extension", "Asterix (my framework) as the runtime", "Playwright · Tavily", "5 LLM providers · 26 models"],
    intro:
      "OSCAR is an agentic coding assistant — a VS Code extension and CLI that takes a high-level instruction, decomposes it into an explicit plan, shows you that plan, and only then executes. It specializes in git workflows: branch comparison with LLM-summarized diffs, PR-style reviews with risk assessment, safe shell execution. The interesting part isn't that it acts — it's how it decides when *not* to.",
    sections: [
      {
        heading: "Plan → confirm → execute",
        paras: [
          "Most coding agents act first and apologize later. OSCAR runs a ReAct loop that produces a structured action plan, surfaces it, and gates execution on your confirmation. Human-in-the-loop is the architecture, not an afterthought.",
          "A tiered risk classifier routes every action: low-risk operations auto-approve; medium, high, and dangerous ones require explicit confirmation. On a 20-case labelled benchmark it scores 100% — with perfect precision and recall in every tier.",
        ],
      },
      {
        heading: "Two layers, both mine",
        paras: [
          "OSCAR runs on Asterix, my own persistent-memory agent framework, pinned as a real PyPI dependency (asterix-agent==0.2.1). Framework and product, designed together: the callbacks, custom system prompts, and history API in Asterix v0.2.x were built specifically because OSCAR needed them.",
          "The product surface is real: a FastAPI backend with 13 endpoints and 6 SSE event types streaming progress live into a VS Code sidebar, plus a Rich/Click CLI — one codebase, 15 registered tools (9 git, 4 browser, 1 shell, 1 web search).",
        ],
      },
      {
        heading: "Eval-driven development",
        paras: [
          "The repo ships a benchmark harness — safety classification, tool selection, latency/token/cost — with offline and online modes, each run writing a timestamped summary. The safety number above is the published one; the harness exists so every release can regenerate the rest.",
          "It runs multi-provider: 5 providers, 26 catalogued models, switchable via environment variables with oscar config-check to verify your setup.",
        ],
      },
    ],
    numbers: [
      { value: "100%", label: "safety-classifier accuracy (20/20, perfect per-tier P/R)" },
      { value: "15", label: "registered tools" },
      { value: "13", label: "HTTP endpoints, 6 SSE event types" },
      { value: "26", label: "models across 5 providers" },
      { value: "2,308", label: "lines of backend Python" },
    ],
    hardParts: [
      {
        title: "Safety tiers that don't cry wolf",
        body: "A gate that asks confirmation for everything trains users to click yes. The risk classifier had to auto-approve the boring 80% while never letting a dangerous operation through unflagged — that's why the benchmark measures per-tier precision and recall, not just accuracy.",
      },
      {
        title: "Streaming an agent's mind",
        body: "Watching an agent think is a UX problem: 6 SSE event types stream plan, progress, tool calls, and results into the sidebar so the user always knows what's about to happen before it does.",
      },
    ],
    schematic: "agent",
  },
  {
    slug: "asterix",
    title: "Asterix",
    tagline: "Memory that survives the restart.",
    year: "2025 — 26",
    role: "Designer, author, maintainer — solo",
    status: "PyPI v0.2.1 · 7 releases · MIT",
    links: [
      { label: "GitHub", href: "https://github.com/adityasarade/Asterix" },
      { label: "PyPI", href: "https://pypi.org/project/asterix-agent/" },
    ],
    stack: ["Python 3.10+ · Pydantic", "SQLite / JSON persistence", "Qdrant Cloud archival memory", "Gemini · Groq · OpenAI"],
    intro:
      "I was tired of agents that forget everything the moment you close the terminal. Asterix is a Python framework for stateful agents: sized, prioritized memory blocks the agent edits itself, state that persists across sessions with no server to run, and semantic long-term recall. MemGPT-style memory — without the infrastructure.",
    sections: [
      {
        heading: "Memory as a first-class API",
        paras: [
          "Agents are configured with explicit memory blocks — `Agent(blocks={\"task\": BlockConfig(size=1500, priority=1)})` — and edit them through built-in tools. Two tiers: in-context blocks for working memory, Qdrant-backed archival memory with semantic retrieval for everything else.",
          "Persistence is serverless: `agent.save_state()` writes to JSON or SQLite, `Agent.load_state(\"agent_id\")` restores the full agent across a process restart. Two lines, no database daemon.",
        ],
      },
      {
        heading: "Designed against a real consumer",
        paras: [
          "The decorator-driven tool system — `@agent.tool` with validation, retries, and auto-generated docs — plus before/after callbacks for human-in-the-loop gating and audit logging all exist because OSCAR, the agent built on top, needed them. Seven releases over six months, each driven by a real downstream requirement.",
          "One standardized interface across Gemini, Groq, and OpenAI, so swapping the LLM under an agent is a config change, not a rewrite.",
        ],
      },
    ],
    numbers: [
      { value: "7", label: "releases, Oct 2025 → Mar 2026" },
      { value: "2", label: "memory tiers: in-context + archival" },
      { value: "14", label: "GitHub stars" },
      { value: "3", label: "LLM providers, one interface" },
    ],
    hardParts: [
      {
        title: "Self-editing memory without chaos",
        body: "An agent that rewrites its own memory can also destroy it. Size budgets and priorities per block keep working memory bounded, and the block API makes every edit explicit and auditable rather than an opaque context mutation.",
      },
    ],
    schematic: "memory",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
