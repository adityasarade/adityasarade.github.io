"use client";

import type { Star } from "@/lib/sky";
import { caseStudies, workIndex, productionSystems, experience } from "@/lib/data";
import { CaseSchematic } from "./Schematics";

/* Floating preview shown next to the hovered star. Clicking it opens
   the detail panel - it carries data-star so the chart's pointer-up
   selection treats it exactly like clicking the star itself. */

type Preview = {
  badge: string;
  title: string;
  tagline?: string;
  line: string;
  stat?: string;
  schematic?: "gateway" | "voice" | "agent" | "memory";
  cta: string;
};

function previewFor(star: Star): Preview {
  const base = { title: star.name, line: star.blurb, cta: "click to open" };

  switch (star.panel.type) {
    case "case": {
      const slug = star.panel.slug;
      const cs = caseStudies.find((c) => c.slug === slug);
      const wi = workIndex.find((w) => w.slug === slug);
      return {
        ...base,
        badge: star.kind === "flagship" ? "flagship — shipped & live" : "open source — on PyPI",
        tagline: cs?.tagline,
        stat: wi?.headline,
        schematic: cs?.schematic,
        cta: "click for the case study",
      };
    }
    case "system": {
      const p = productionSystems[star.panel.index];
      return {
        ...base,
        badge: "production system · Medikabazaar",
        stat: p ? `${p.metric} ${p.metricLabel}` : undefined,
      };
    }
    case "job": {
      const job = experience[star.panel.index];
      const atStation = star.kind === "employer";
      return {
        ...base,
        badge: atStation ? "professional experience" : `built at ${job?.company.split(" ")[0] ?? "work"}`,
        stat: job ? `${job.role} · ${job.period}` : undefined,
        cta: atStation ? "click for the full role" : "click to open",
      };
    }
    case "edu":
      return { ...base, badge: "education" };
    case "principles":
      return { ...base, badge: "how I work" };
    case "registry":
      return { ...base, badge: "package registry", cta: "click for install commands" };
    case "other":
      return { ...base, badge: star.kind === "oss" ? "open source — on PyPI" : "side project" };
    case "contact":
      return { ...base, badge: "transmission", cta: "click to get in touch" };
  }
}

export default function PreviewCard({
  star,
  x,
  y,
  side,
  onHoldHover,
  onReleaseHover,
}: {
  star: Star;
  x: number;
  y: number;
  side: "left" | "right";
  onHoldHover: () => void;
  onReleaseHover: () => void;
}) {
  const p = previewFor(star);
  return (
    <div
      className={`previewCard previewCard--${side}`}
      style={{ left: x, top: y }}
      data-star={star.id}
      aria-hidden="true"
      onPointerEnter={onHoldHover}
      onPointerLeave={onReleaseHover}
    >
      <p className="label label--blue previewCard__badge">{p.badge}</p>
      <h3 className="previewCard__title">{p.title}</h3>
      {p.tagline && <p className="previewCard__tagline">{p.tagline}</p>}
      <p className="previewCard__line">{p.line}</p>
      {p.schematic && (
        <div className="previewCard__thumb">
          <CaseSchematic kind={p.schematic} />
        </div>
      )}
      {p.stat && <p className="previewCard__stat label">{p.stat}</p>}
      <p className="previewCard__cta label">{p.cta} ↳</p>
    </div>
  );
}
