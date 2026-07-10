"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* The agent console — an easter egg that actually works.
   Open with ⌘K / Ctrl+K or the nav button. */

type Line = { kind: "in" | "out" | "ok" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "ok", text: "aditya@prod — agent console v2026.07" },
  { kind: "out", text: "type `help` for commands. type `exit` (or Esc) to close." },
];

const HELP = [
  "help            this list",
  "whoami          who is aditya?",
  "work            list case studies",
  "open <slug>     open a case study (e.g. open oscar)",
  "stack           what he builds with",
  "contact         how to reach him",
  "resume          open the resume (PDF)",
  "tour            replay the guided tour",
  "cost            session token spend",
  "theme           toggle paper/night",
  "sudo hire aditya   (try it)",
  "clear           clear the console",
];

const SLUGS = ["ai-command-center", "mb-voice", "oscar", "asterix"];

export default function Console() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const onOpen = () => setOpen(true);
    window.addEventListener("as-console-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("as-console-open", onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => prev?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = useCallback((out: Line[]) => setLines((l) => [...l, ...out]), []);

  const run = (raw: string) => {
    const cmd = raw.trim().replace(/\s+/g, " ");
    if (!cmd) return;
    print([{ kind: "in", text: cmd }]);
    const [head, ...rest] = cmd.toLowerCase().split(" ");
    const arg = rest.join(" ");

    switch (true) {
      case head === "help":
        print(HELP.map((t) => ({ kind: "out" as const, text: t })));
        break;
      case head === "whoami":
        print([
          { kind: "out", text: "Aditya Sarade — AI Engineer @ Medikabazaar, Mumbai." },
          { kind: "out", text: "Takes AI from prototype to production. Voice agents in 11 languages," },
          { kind: "out", text: "an LLM gateway on npm + PyPI, and a memory framework for agents." },
        ]);
        break;
      case head === "work":
        print([
          { kind: "out", text: "01  ai-command-center   LLM gateway + cost dashboard" },
          { kind: "out", text: "02  mb-voice            voice AI, 11 languages, in production" },
          { kind: "out", text: "03  oscar               agentic coding assistant" },
          { kind: "out", text: "04  asterix             persistent memory for agents" },
          { kind: "out", text: "run `open <slug>` to read a case study." },
        ]);
        break;
      case head === "open": {
        if (!arg) {
          print([{ kind: "err", text: `usage: open <slug>. try: ${SLUGS.join(", ")}` }]);
          break;
        }
        const slug = SLUGS.find((s) => s === arg || s.includes(arg));
        if (slug) {
          print([{ kind: "ok", text: `opening /work/${slug} …` }]);
          setOpen(false);
          router.push(`/work/${slug}/`);
        } else {
          print([{ kind: "err", text: `unknown slug "${arg}". try: ${SLUGS.join(", ")}` }]);
        }
        break;
      }
      case head === "stack":
        print([
          { kind: "out", text: "Python · TypeScript · FastAPI · Node (zero-dep when it matters)" },
          { kind: "out", text: "LangGraph · MCP · Gemini · Claude · Qdrant · ChromaDB · FAISS" },
          { kind: "out", text: "AWS · Vertex AI · Docker · Kafka · Jenkins · GitHub Actions" },
        ]);
        break;
      case head === "contact":
        print([
          { kind: "out", text: "email    aditya.sarade2003@gmail.com" },
          { kind: "out", text: "github   github.com/adityasarade" },
          { kind: "out", text: "linkedin linkedin.com/in/adityasarade" },
        ]);
        break;
      case head === "resume":
        print([{ kind: "ok", text: "opening /resume.pdf …" }]);
        window.open("/resume.pdf", "_blank", "noopener");
        break;
      case head === "tour":
        print([{ kind: "ok", text: "starting the guided tour …" }]);
        setOpen(false);
        window.dispatchEvent(new Event("as-tour-start"));
        break;
      case head === "cost":
        print([
          { kind: "out", text: "session spend: 0 tokens — this site is static." },
          { kind: "out", text: "every byte was paid for at build time. the meter reads zero." },
        ]);
        break;
      case head === "theme": {
        const next = document.documentElement.dataset.theme === "night" ? "paper" : "night";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("as-theme", next);
        } catch {}
        window.dispatchEvent(new CustomEvent("as-theme-change", { detail: next }));
        print([{ kind: "ok", text: `theme → ${next}` }]);
        break;
      }
      case cmd.toLowerCase() === "sudo hire aditya":
        print([
          { kind: "out", text: "[sudo] password for recruiter: ********" },
          { kind: "ok", text: "authentication successful." },
          { kind: "out", text: "checking references … 3 packages on PyPI ✓" },
          { kind: "out", text: "checking production experience … 11 languages of voice AI ✓" },
          { kind: "out", text: "checking cost discipline … ₹3L+ saved ✓" },
          { kind: "ok", text: "HIRED SUCCESSFULLY. welcome aboard." },
          { kind: "out", text: "next step: aditya.sarade2003@gmail.com" },
        ]);
        break;
      case head === "sudo":
        print([{ kind: "err", text: "permission granted, but that's not the command. try `sudo hire aditya`." }]);
        break;
      case head === "clear":
        setLines([]);
        break;
      case head === "exit":
        setOpen(false);
        break;
      case head === "ls":
        print([{ kind: "out", text: "work/  registry/  experience/  principles/  contact/" }]);
        break;
      case head === "rm":
        print([{ kind: "err", text: "nice try. this agent has a human-in-the-loop safety layer." }]);
        break;
      default:
        print([{ kind: "err", text: `command not found: ${head}. type \`help\`.` }]);
    }
  };

  if (!open) return null;

  return (
    <div className="console" role="dialog" aria-modal="true" aria-label="Agent console" onClick={() => setOpen(false)}>
      <div
        className="console__panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          e.preventDefault();
          (document.activeElement === inputRef.current ? closeRef.current : inputRef.current)?.focus();
        }}
      >
        <div className="console__bar">
          <span className="console__dot" />
          <span className="console__title">agent console</span>
          <button ref={closeRef} className="console__close" onClick={() => setOpen(false)} aria-label="Close console">
            esc
          </button>
        </div>
        <div className="console__scroll" ref={scrollRef} role="log" aria-live="polite">
          {lines.map((l, i) => (
            <div key={i} className={`console__line console__line--${l.kind}`}>
              {l.kind === "in" ? "❯ " : ""}
              {l.text}
            </div>
          ))}
        </div>
        <form
          className="console__form"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
            setInput("");
          }}
        >
          <span aria-hidden="true">❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="help"
            aria-label="Console command"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
