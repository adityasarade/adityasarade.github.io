"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Star } from "@/lib/sky";
import {
  caseStudies,
  productionSystems,
  experience,
  education,
  certifications,
  principles,
  registry,
  otherBuilds,
  funFacts,
  site,
} from "@/lib/data";
import CopyButton from "./CopyButton";
import Inline from "./Inline";

function CaseContent({ slug }: { slug: string }) {
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return null;
  return (
    <>
      <p className="panel__tagline">{cs.tagline}</p>
      <p className="panel__body">
        <Inline text={cs.intro} />
      </p>
      <div className="panel__numbers">
        {cs.numbers.slice(0, 4).map((n) => (
          <div key={n.label} className="panel__number">
            <span className="panel__numberValue">{n.value}</span>
            <span className="panel__numberLabel">{n.label}</span>
          </div>
        ))}
      </div>
      <p className="panel__stack label">{cs.stack.join(" · ")}</p>
      <div className="panel__links">
        {cs.links.map((l) => (
          <a key={l.href} className="link" href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label} ↗
          </a>
        ))}
      </div>
      <Link href={`/work/${cs.slug}/`} className="panel__cta">
        Read the full study →
      </Link>
    </>
  );
}

function SystemContent({ index }: { index: number }) {
  const p = productionSystems[index];
  if (!p) return null;
  return (
    <>
      <div className="panel__numbers">
        <div className="panel__number">
          <span className="panel__numberValue">{p.metric}</span>
          <span className="panel__numberLabel">{p.metricLabel}</span>
        </div>
      </div>
      <p className="panel__body">{p.body}</p>
      <p className="panel__stack label">{p.stack}</p>
      <p className="panel__note">Proprietary system at Medikabazaar — described with permission.</p>
    </>
  );
}

function JobContent({ index }: { index: number }) {
  const job = experience[index];
  if (!job) return null;
  return (
    <>
      <p className="panel__tagline">
        {job.role} · {job.period}
      </p>
      <ul className="panel__bullets">
        {job.bullets.map((b) => (
          <li key={b.slice(0, 24)}>{b}</li>
        ))}
      </ul>
      {job.stack && <p className="panel__stack label">{job.stack}</p>}
    </>
  );
}

function PanelBody({ star }: { star: Star }) {
  switch (star.panel.type) {
    case "case":
      return <CaseContent slug={star.panel.slug} />;
    case "system":
      return <SystemContent index={star.panel.index} />;
    case "job":
      return <JobContent index={star.panel.index} />;
    case "edu":
      return (
        <>
          <p className="panel__tagline">{education.degree}</p>
          <p className="panel__body">
            {education.school} · {education.period}
          </p>
          <p className="label panel__sectionLabel">Certifications</p>
          <ul className="panel__bullets">
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </>
      );
    case "principles":
      return (
        <>
          {principles.map((p, i) => (
            <div key={p.title} className="panel__principle">
              <span className="label label--signal">0{i + 1}</span>
              <h3 className="panel__principleTitle">{p.title}</h3>
              <p className="panel__body">{p.body}</p>
            </div>
          ))}
        </>
      );
    case "registry":
      return (
        <>
          <p className="panel__tagline">If I build it, you can install it.</p>
          {registry.map((p) => (
            <div key={p.name} className="panel__pkg">
              <a className="link panel__pkgName" href={p.href} target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
              <span className="label">
                {p.registry} · {p.version}
              </span>
              <div className="panel__install">
                <code>{p.install}</code>
                <CopyButton text={p.install} />
              </div>
            </div>
          ))}
        </>
      );
    case "other": {
      const o = otherBuilds[star.panel.index];
      if (!o) return null;
      return (
        <>
          <p className="panel__body">{o.desc}</p>
          <div className="panel__links">
            <a className="link" href={o.href} target="_blank" rel="noopener noreferrer">
              {o.href.includes("pypi") ? "PyPI" : "GitHub"} ↗
            </a>
          </div>
        </>
      );
    }
    case "contact":
      return (
        <>
          <p className="panel__tagline">Building something where AI has to work, not just demo well?</p>
          <a className="panel__email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="panel__links">
            <a className="link" href={site.links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="link" href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a className="link" href={site.links.x} target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a className="link" href={site.links.pypi} target="_blank" rel="noopener noreferrer">
              PyPI
            </a>
          </div>
          <p className="panel__note">{funFacts}</p>
        </>
      );
  }
}

const KIND_LABEL: Record<Star["kind"], string> = {
  flagship: "flagship system",
  system: "production system",
  employer: "station",
  oss: "open source",
  minor: "minor work",
  profile: "chart data",
  comet: "comet · periodic visitor",
};

export default function NodePanel({ star, onClose }: { star: Star | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!star) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus();
  }, [star]);

  if (!star) return null;

  return (
    <aside className="panel" role="dialog" aria-modal="false" aria-label={star.name} ref={panelRef}>
      <header className="panel__head">
        <div>
          <span className="label label--blue">{KIND_LABEL[star.kind]}</span>
          <h2 className="panel__title">{star.name}</h2>
        </div>
        <button ref={closeRef} className="panel__close" onClick={onClose} aria-label="Close panel">
          esc
        </button>
      </header>
      <div className="panel__scroll">
        <PanelBody star={star} />
      </div>
    </aside>
  );
}
