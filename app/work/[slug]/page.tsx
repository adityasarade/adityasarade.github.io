import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import Console from "@/components/Console";
import Reveal from "@/components/Reveal";
import { CaseSchematic } from "@/components/Schematics";
import Inline from "@/components/Inline";
import { caseStudies, getCaseStudy, site } from "@/lib/data";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: `${cs.tagline} — ${cs.intro.slice(0, 150)}…`,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const idx = caseStudies.findIndex((c) => c.slug === cs.slug);
  const prev = caseStudies[(idx - 1 + caseStudies.length) % caseStudies.length];
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <>
      <SiteNav />
      <Console />

      <main className="case container">
        <div className="case__breadcrumb">
          <Link href="/#work" className="link label">
            ← Index
          </Link>
          <span className="label">
            {String(idx + 1).padStart(2, "0")} / {String(caseStudies.length).padStart(2, "0")}
          </span>
          <span className="label sectionHead__aside">{site.docId}</span>
        </div>

        <h1 className="case__title">{cs.title}</h1>
        <p className="case__tagline">{cs.tagline}</p>

        <dl className="case__specs">
          <div className="case__spec">
            <dt className="label label--blue">Status</dt>
            <dd>
              <span className="stamp">{cs.status}</span>
            </dd>
          </div>
          <div className="case__spec">
            <dt className="label label--blue">Role</dt>
            <dd>{cs.role}</dd>
          </div>
          <div className="case__spec">
            <dt className="label label--blue">Stack</dt>
            <dd>{cs.stack.join(" · ")}</dd>
          </div>
          <div className="case__spec">
            <dt className="label label--blue">Links</dt>
            <dd className="case__specLinks">
              {cs.links.length > 0 ? (
                cs.links.map((l) => (
                  <a key={l.href} className="link" href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                ))
              ) : (
                <span>Proprietary — no public links</span>
              )}
            </dd>
          </div>
        </dl>

        <Reveal>
          <p className="case__intro">
            <Inline text={cs.intro} />
          </p>
        </Reveal>

        <Reveal className="case__diagram">
          <CaseSchematic kind={cs.schematic} />
        </Reveal>

        {cs.sections.map((s) => (
          <Reveal key={s.heading} className="case__section" as="section">
            <h2 className="case__sectionHeading">{s.heading}</h2>
            <div className="case__sectionBody">
              {s.paras.map((p) => (
                <p key={p.slice(0, 32)}>
                  <Inline text={p} />
                </p>
              ))}
            </div>
          </Reveal>
        ))}

        <Reveal className="case__numbers" as="section">
          <span className="label label--blue">§ The numbers</span>
          <div className="case__numbersGrid">
            {cs.numbers.map((n) => (
              <div key={n.label} className="case__number">
                <span className="case__numberValue">{n.value}</span>
                <span className="case__numberLabel">{n.label}</span>
              </div>
            ))}
          </div>
          {cs.numbersNote && (
            <p className="case__numbersNote">
              <Inline text={cs.numbersNote} />
            </p>
          )}
        </Reveal>

        <Reveal className="case__hard" as="section">
          <span className="label label--blue">§ The hard parts</span>
          <div className="case__hardList">
            {cs.hardParts.map((h) => (
              <div key={h.title} className="case__hardItem">
                <h3 className="case__hardTitle">{h.title}</h3>
                <p className="case__hardBody">{h.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <nav className="case__pager" aria-label="More case studies">
          <Link href={`/work/${prev.slug}/`} className="case__pagerLink">
            <span className="label">← Previous</span>
            <span className="case__pagerTitle">{prev.title}</span>
          </Link>
          <Link href={`/work/${next.slug}/`} className="case__pagerLink case__pagerLink--next">
            <span className="label">Next →</span>
            <span className="case__pagerTitle">{next.title}</span>
          </Link>
        </nav>

        <footer className="colophon" style={{ background: "none", borderTop: "none" }}>
          <p className="label" style={{ paddingBlock: "2rem" }}>
            {site.docId} · © 2026 Aditya Sarade ·{" "}
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
