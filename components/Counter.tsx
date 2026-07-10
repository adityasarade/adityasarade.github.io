"use client";

import { useEffect, useRef } from "react";

/* Odometer-style count-up that starts when scrolled into view.
   Falls back to the final value instantly under reduced motion. */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${value.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = final;
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = `${prefix}${(value * eased).toFixed(decimals)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, decimals, duration, final]);

  return (
    <span ref={ref} aria-label={final}>
      {final}
    </span>
  );
}
