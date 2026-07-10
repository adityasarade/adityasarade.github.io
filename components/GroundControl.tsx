"use client";

import { useEffect, useRef, useState } from "react";
import { kb, kbFallback, matchKB, type Flight } from "@/lib/kb";

type Line = { from: "you" | "gc"; text: string };

const chips = kb.filter((e) => e.chip).map((e) => ({ id: e.id, chip: e.chip! }));

export default function GroundControl({
  open,
  onClose,
  onFlight,
}: {
  open: boolean;
  onClose: () => void;
  onFlight: (f: Flight) => void;
}) {
  const [lines, setLines] = useState<Line[]>([
    { from: "gc", text: "Ground Control here. Ask about the pilot — or pick a transmission below." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const ask = (question: string, entryId?: string) => {
    const entry = entryId ? (kb.find((e) => e.id === entryId) ?? null) : matchKB(question);
    const reply: Line[] = [{ from: "you", text: question }];
    if (entry) {
      for (const a of entry.answer) reply.push({ from: "gc", text: a });
      if (entry.id === "resume") {
        window.open("/resume.pdf", "_blank", "noopener");
      }
      if (entry.flight) onFlight(entry.flight);
    } else {
      for (const a of kbFallback) reply.push({ from: "gc", text: a });
    }
    setLines((l) => [...l, ...reply]);
  };

  if (!open) return null;

  return (
    <section className="gc" role="dialog" aria-label="Ground Control — scripted assistant">
      <header className="gc__bar">
        <span className="gc__signal" aria-hidden="true" />
        <span className="gc__title">Ground Control</span>
        <span className="gc__freq label" aria-hidden="true">
          145.80 MHz
        </span>
        <button className="gc__close" onClick={onClose} aria-label="Close Ground Control">
          ✕
        </button>
      </header>

      <div className="gc__scroll" ref={scrollRef} role="log" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className={`gc__line gc__line--${l.from}`}>
            <span className="gc__prefix" aria-hidden="true">
              {l.from === "gc" ? "GC ▸" : "YOU ▸"}
            </span>
            {l.text}
          </p>
        ))}
      </div>

      <div className="gc__chips">
        {chips.map((c) => (
          <button key={c.id} className="gc__chip" onClick={() => ask(c.chip, c.id)}>
            {c.chip}
          </button>
        ))}
      </div>

      <form
        className="gc__form"
        onSubmit={(e) => {
          e.preventDefault();
          const q = input.trim();
          if (!q) return;
          setInput("");
          ask(q);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ask about the pilot…"
          aria-label="Ask Ground Control"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="gc__send" aria-label="Transmit">
          ⇧
        </button>
      </form>

      <p className="gc__honest label">scripted flight computer, not an LLM — for the rest, ask the human</p>
    </section>
  );
}
