import Link from "next/link";
import SiteNav from "@/components/SiteNav";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="case container">
        <span className="label label--signal">error 404 — page not in the index</span>
        <h1 className="case__title" style={{ marginTop: "1rem" }}>
          Nothing shipped here<span style={{ color: "var(--signal-ink)" }}>.</span>
        </h1>
        <p className="case__intro">
          This route returned nothing — and unlike some agents, this site won&apos;t make something up.
        </p>
        <Link href="/" className="link case__backHome">
          ← Back to the datasheet
        </Link>
      </main>
    </>
  );
}
