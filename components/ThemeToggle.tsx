"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("paper");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "night" ? "night" : "paper");
    const onThemeChange = (e: Event) =>
      setTheme((e as CustomEvent<string>).detail === "night" ? "night" : "paper");
    window.addEventListener("as-theme-change", onThemeChange);
    return () => window.removeEventListener("as-theme-change", onThemeChange);
  }, []);

  const toggle = () => {
    const next = document.documentElement.dataset.theme === "night" ? "paper" : "night";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("as-theme", next);
    } catch {
      /* private mode — fine */
    }
    window.dispatchEvent(new CustomEvent("as-theme-change", { detail: next }));
    setTheme(next);
  };

  return (
    <button
      className="themeToggle"
      onClick={toggle}
      aria-label={theme === "night" ? "Switch to paper (light) theme" : "Switch to night (dark) theme"}
      title={theme === "night" ? "Paper mode" : "Night mode"}
    >
      <span aria-hidden="true">{theme === "night" ? "◖" : "◗"}</span>
      <span className="themeToggle__label">{theme === "night" ? "paper" : "night"}</span>
    </button>
  );
}
