"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Sky chart" },
  { href: "/#s=registry", label: "Registry" },
  { href: "/#s=contact", label: "Contact" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner container">
        <Link href="/" className="nav__brand">
          <span className="nav__mark" aria-hidden="true">
            AS
          </span>
          <span className="nav__name">Aditya Sarade</span>
        </Link>

        <nav className="nav__links" aria-label="Site">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav__link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav__tools">
          <button
            className="nav__console"
            onClick={() => window.dispatchEvent(new Event("as-console-open"))}
            aria-label="Open agent console"
          >
            <span className="nav__consoleKey">⌘K</span>
            <span className="nav__consoleLabel">console</span>
          </button>
          <ThemeToggle />
          <details className="nav__menu">
            <summary aria-label="Menu">menu</summary>
            <div className="nav__menuList">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nav__link">
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
