import Link from "next/link";
import SkyChart from "@/components/SkyChart";
import Console from "@/components/Console";
import { site, caseStudies, otherBuilds } from "@/lib/data";

export default function Home() {
  return (
    <main className="obsPage">
      <h1 className="visually-hidden">
        Aditya Sarade — AI Engineer. I take AI from prototype to production: voice agents in 11 languages, a
        zero-dependency LLM gateway on npm and PyPI, and a persistent-memory framework for agents.
      </h1>

      <SkyChart />
      <Console />

      {/* accessible fallback when JavaScript is unavailable */}
      <noscript>
        <div className="obs__noscript">
          <h2>Aditya Sarade — AI Engineer</h2>
          <p>
            This page is an interactive star chart of my work; without JavaScript, here is the index instead.
          </p>
          <ul>
            {caseStudies.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}/`}>
                  {c.title} — {c.tagline}
                </Link>
              </li>
            ))}
            {otherBuilds.map((o) => (
              <li key={o.name}>
                <a href={o.href}>
                  {o.name} — {o.desc}
                </a>
              </li>
            ))}
            <li>
              <a href={site.links.github}>GitHub</a> · <a href={site.links.linkedin}>LinkedIn</a> ·{" "}
              <a href={site.links.x}>X</a> · <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>
      </noscript>
    </main>
  );
}
