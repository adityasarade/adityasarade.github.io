"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  stars,
  edges,
  regions,
  starfieldDeep,
  starfieldMid,
  starfieldNear,
  glints,
  starById,
  tour,
  viewForStars,
  WORLD,
  HOME_VIEW,
  type Star,
  type View,
} from "@/lib/sky";
import { site } from "@/lib/data";
import type { Flight } from "@/lib/kb";
import NodePanel from "./NodePanel";
import PreviewCard from "./PreviewCard";
import ThemeToggle from "./ThemeToggle";
import GroundControl from "./GroundControl";

const RADIUS: Record<number, number> = {
  1: 1.05,
  1.5: 0.9,
  2: 0.75,
  2.5: 0.62,
  3: 0.5,
  3.5: 0.42,
  4: 0.34,
};

type Phase = "free" | "tour";
type Cam = { x: number; y: number; s: number };

/* camera the visitor arrives with - slightly pulled back, below home */
const ARRIVAL_CAM: Cam = { x: HOME_VIEW.cx, y: HOME_VIEW.cy + 6, s: 0.94 };
const ZOOM_MAX = 2.4;
const PAR_MID = 0.65;
const PAR_DEEP = 0.35;
/* everything drawn, labels included - the frame the full-sky view fits */
const SKY_FIT = { cx: 100, cy: 64, w: 176, h: 116 };
/* how far past the world edge the viewport may wander */
const OVERSCAN = 26;

/* the visible window in world units at scale 1, plus the zoom floor that
   fits the whole sky - both depend on the real element size, so they are
   measured per device and on resize */
type Viewport = { hw: number; hh: number; minZoom: number };

function clampView(c: Cam, vp: Viewport, soft = false) {
  c.s = Math.min(ZOOM_MAX, Math.max(vp.minZoom, c.s));
  const hw = vp.hw / c.s;
  const hh = vp.hh / c.s;
  const axis = (v: number, lo: number, hi: number, center: number) => {
    if (lo > hi) return center; // viewport wider than the world: pin to center
    if (v < lo) return soft ? lo + (v - lo) * 0.25 : lo;
    if (v > hi) return soft ? hi + (v - hi) * 0.25 : hi;
    return v;
  };
  c.x = axis(c.x, WORLD.minX + hw - OVERSCAN, WORLD.maxX - hw + OVERSCAN, (WORLD.minX + WORLD.maxX) / 2);
  c.y = axis(c.y, WORLD.minY + hh - OVERSCAN, WORLD.maxY - hh + OVERSCAN, (WORLD.minY + WORLD.maxY) / 2);
}

function camCSS(x: number, y: number, s: number) {
  return `translate(${50 - s * x}px, ${31 - s * y}px) scale(${s})`;
}

function parallaxOf(cam: Cam, k: number): Cam {
  return {
    x: HOME_VIEW.cx + (cam.x - HOME_VIEW.cx) * k,
    y: HOME_VIEW.cy + (cam.y - HOME_VIEW.cy) * k,
    s: 1 + (cam.s - 1) * k,
  };
}

function edgeEndpoints(fromId: string, toId: string) {
  const a = starById(fromId)!;
  const b = starById(toId)!;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const pad = 1.6;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: a.x + ux * pad,
    y1: a.y + uy * pad,
    x2: b.x - ux * pad,
    y2: b.y - uy * pad,
    mx: (a.x + b.x) / 2,
    my: (a.y + b.y) / 2,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}

function labelAnchor(s: Star): { x: number; y: number; anchor: "start" | "middle" | "end" } {
  const r = RADIUS[s.mag];
  switch (s.labelPos ?? "right") {
    case "top":
      return { x: s.x, y: s.y - r - 1.1, anchor: "middle" };
    case "bottom":
      return { x: s.x, y: s.y + r + 2.1, anchor: "middle" };
    case "left":
      return { x: s.x - r - 1.2, y: s.y + 0.55, anchor: "end" };
    default:
      return { x: s.x + r + 1.2, y: s.y + 0.55, anchor: "start" };
  }
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* occasional meteor streak — screen-space, decorative only */
function ShootingStars() {
  const [streak, setStreak] = useState<{ top: string; left: string; angle: number; dur: number; key: number } | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number;
    let cancelled = false;
    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setStreak({
          top: `${6 + Math.random() * 46}%`,
          left: `${8 + Math.random() * 64}%`,
          angle: 18 + Math.random() * 34,
          dur: 0.9 + Math.random() * 0.8,
          key: Date.now(),
        });
        schedule(8000 + Math.random() * 10000);
      }, delay);
    };
    schedule(5000 + Math.random() * 6000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
  if (!streak) return null;
  return (
    <div
      key={streak.key}
      className="obs__meteor"
      aria-hidden="true"
      style={
        {
          top: streak.top,
          left: streak.left,
          "--meteor-angle": `${streak.angle}deg`,
          "--meteor-dur": `${streak.dur}s`,
        } as React.CSSProperties
      }
      onAnimationEnd={() => setStreak(null)}
    />
  );
}

export default function SkyChart() {
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<Phase>("free");
  const [tourStep, setTourStep] = useState(0);
  const [gcLit, setGcLit] = useState<string[]>([]);
  const [gcOpen, setGcOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; x: number; y: number; side: "left" | "right" } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);
  const [hintOn, setHintOn] = useState(false);

  const obsRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const midRef = useRef<SVGGElement>(null);
  const deepRef = useRef<SVGGElement>(null);
  const miniViewRef = useRef<SVGRectElement>(null);
  const coordsRef = useRef<HTMLParagraphElement>(null);
  const gcOpenTimer = useRef<number | undefined>(undefined);

  const camRef = useRef<Cam>({ ...ARRIVAL_CAM });
  const velRef = useRef({ x: 0, y: 0 });
  const viewRef = useRef<Viewport>({ hw: 50, hh: 31, minZoom: 0.42 });
  const lastBoostRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const movingRef = useRef(false);
  const hoveredRef = useRef<string | null>(null);
  const reducedRef = useRef(false);
  const flightRef = useRef<{ from: Cam; to: Cam; start: number; dur: number } | null>(null);

  const dragRef = useRef({
    active: false,
    pointerId: -1,
    moved: false,
    heroDrag: false,
    lastX: 0,
    lastY: 0,
    unitPerPx: 0.1,
    downStar: null as string | null,
    samples: [] as { t: number; x: number; y: number }[],
  });
  const pinchRef = useRef<{
    ids: [number, number];
    dist0: number;
    s0: number;
    anchor: { x: number; y: number };
  } | null>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const revealPRef = useRef(0);
  const revealedRef = useRef(false);
  /* swallow trailing wheel momentum so it can't cancel the arrival flight */
  const wheelLockUntil = useRef(0);
  const hintTimer = useRef<number | undefined>(undefined);

  const selected = selectedId ? (starById(selectedId) ?? null) : null;
  const chapter = phase === "tour" ? tour[tourStep] : null;

  /* ---------- camera engine ---------- */

  const metrics = useCallback(() => {
    const rect = svgRef.current?.getBoundingClientRect() ?? { width: 1200, height: 744, left: 0, top: 0 };
    const pxPerUnit = Math.max(rect.width / 100, rect.height / 62);
    return { rect, pxPerUnit };
  }, []);

  const applyCam = useCallback(() => {
    const cam = camRef.current;
    /* level-of-detail: zoomed far out, dots and region names grow while
       star names fade, so the overview stays readable on small screens */
    const boost = Math.round(Math.min(2.4, Math.max(1, Math.pow(0.62 / cam.s, 0.7))) * 40) / 40;
    if (boost !== lastBoostRef.current && obsRef.current) {
      lastBoostRef.current = boost;
      obsRef.current.style.setProperty("--zoomBoost", String(boost));
      obsRef.current.classList.toggle("obs--far", cam.s < 0.42);
    }
    if (worldRef.current) worldRef.current.style.transform = camCSS(cam.x, cam.y, cam.s);
    if (midRef.current) {
      const p = parallaxOf(cam, PAR_MID);
      midRef.current.style.transform = camCSS(p.x, p.y, p.s);
    }
    if (deepRef.current) {
      const p = parallaxOf(cam, PAR_DEEP);
      deepRef.current.style.transform = camCSS(p.x, p.y, p.s);
    }
    if (miniViewRef.current) {
      miniViewRef.current.setAttribute("x", String(cam.x - 50 / cam.s));
      miniViewRef.current.setAttribute("y", String(cam.y - 31 / cam.s));
      miniViewRef.current.setAttribute("width", String(100 / cam.s));
      miniViewRef.current.setAttribute("height", String(62 / cam.s));
    }
  }, []);

  const clampCam = useCallback((soft = false) => clampView(camRef.current, viewRef.current, soft), []);

  /* measure the visible window and the fit-everything zoom floor */
  const refreshViewport = useCallback(() => {
    const { rect, pxPerUnit } = metrics();
    const w = rect.width / pxPerUnit;
    const h = rect.height / pxPerUnit;
    viewRef.current = {
      hw: w / 2,
      hh: h / 2,
      minZoom: Math.max(0.1, Math.min(0.85, Math.min(w / SKY_FIT.w, h / SKY_FIT.h))),
    };
  }, [metrics]);

  /* window in world units, for fitting flights to the real screen */
  const winOf = useCallback(() => ({ w: viewRef.current.hw * 2, h: viewRef.current.hh * 2 }), []);

  /* hover bookkeeping - position is computed in handlers, never in render.
     Clearing is deferred slightly so the pointer can travel from the star
     onto the preview card without the card vanishing underneath it. */
  const hoverClearTimer = useRef<number | undefined>(undefined);

  const setHover = useCallback((id: string | null) => {
    window.clearTimeout(hoverClearTimer.current);
    hoveredRef.current = id;
    setHovered(id);
    if (id == null) setPreview(null);
  }, []);

  const scheduleHoverClear = useCallback(() => {
    window.clearTimeout(hoverClearTimer.current);
    hoverClearTimer.current = window.setTimeout(() => setHover(null), 160);
  }, [setHover]);

  const cancelHoverClear = useCallback(() => window.clearTimeout(hoverClearTimer.current), []);

  const computePreview = useCallback(
    (id: string) => {
      const s = starById(id);
      if (!s || !svgRef.current) return;
      const cam = camRef.current;
      const { rect, pxPerUnit } = metrics();
      const sx = rect.left + rect.width / 2 + cam.s * (s.x - cam.x) * pxPerUnit;
      const sy = rect.top + rect.height / 2 + cam.s * (s.y - cam.y) * pxPerUnit;
      const side: "left" | "right" = sx > rect.width - 400 ? "left" : "right";
      setPreview({
        id,
        x: sx + (side === "right" ? 22 : -22),
        y: Math.min(Math.max(sy - 40, 24), rect.height - 320),
        side,
      });
    },
    [metrics]
  );

  const setMoving = useCallback(
    (on: boolean) => {
      if (movingRef.current === on) return;
      movingRef.current = on;
      /* camera settled — anchor the preview for whichever star is hovered */
      if (!on && hoveredRef.current) computePreview(hoveredRef.current);
    },
    [computePreview]
  );

  const tick = useCallback(
    function tickFn(now: number) {
      const dt = Math.min(48, now - (lastTickRef.current || now));
      lastTickRef.current = now;
      const cam = camRef.current;
      let running = false;

      const flight = flightRef.current;
      if (flight) {
        const t = flight.dur === 0 ? 1 : Math.min(1, (now - flight.start) / flight.dur);
        const e = easeInOutCubic(t);
        cam.x = flight.from.x + (flight.to.x - flight.from.x) * e;
        cam.y = flight.from.y + (flight.to.y - flight.from.y) * e;
        cam.s = flight.from.s + (flight.to.s - flight.from.s) * e;
        if (t >= 1) flightRef.current = null;
        else running = true;
      } else if (!dragRef.current.active) {
        const vel = velRef.current;
        if (Math.hypot(vel.x, vel.y) > 0.00006) {
          cam.x += vel.x * dt;
          cam.y += vel.y * dt;
          const decay = Math.exp(-dt / 320);
          vel.x *= decay;
          vel.y *= decay;
          /* kill velocity on the axis that hit the wall */
          const px = cam.x;
          const py = cam.y;
          clampCam();
          if (cam.x !== px) vel.x = 0;
          if (cam.y !== py) vel.y = 0;
          running = true;
        } else {
          /* ease back from any rubber-band overshoot */
          const t = { ...cam };
          clampView(t, viewRef.current);
          const k = Math.min(1, dt / 140);
          if (Math.abs(t.x - cam.x) > 0.05 || Math.abs(t.y - cam.y) > 0.05) {
            cam.x += (t.x - cam.x) * k;
            cam.y += (t.y - cam.y) * k;
            running = true;
          } else {
            cam.x = t.x;
            cam.y = t.y;
          }
        }
      } else {
        running = true; // keep ticking while a drag is live
      }

      applyCam();
      if (running) {
        rafRef.current = requestAnimationFrame(tickFn);
      } else {
        rafRef.current = null;
        setMoving(false);
      }
    },
    [applyCam, clampCam, setMoving]
  );

  const ensureRaf = useCallback(() => {
    if (rafRef.current == null) {
      lastTickRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const flyTo = useCallback(
    (v: View, dur = 1300) => {
      velRef.current = { x: 0, y: 0 };
      const to = { x: v.cx, y: v.cy, s: v.s };
      clampView(to, viewRef.current);
      flightRef.current = {
        from: { ...camRef.current },
        to,
        start: performance.now(),
        dur: reducedRef.current ? 0 : dur,
      };
      setMoving(true);
      setPreview(null);
      ensureRaf();
    },
    [ensureRaf, setMoving]
  );

  /* ---------- reveal (hero → sky) ---------- */

  const commitReveal = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    obsRef.current?.style.setProperty("--revealP", "1");
    wheelLockUntil.current = performance.now() + 1600;
    flyTo(HOME_VIEW, 1700);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHintOn(true), 1500);
  }, [flyTo]);

  const nudgeReveal = useCallback(
    (deltaPx: number) => {
      if (revealedRef.current) return;
      const threshold = Math.max(420, window.innerHeight * 0.85);
      const p = Math.min(1, Math.max(0, revealPRef.current + deltaPx / threshold));
      revealPRef.current = p;
      obsRef.current?.style.setProperty("--revealP", p.toFixed(3));
      const cam = camRef.current;
      cam.y = HOME_VIEW.cy + 6 * (1 - p);
      cam.s = 0.94 + 0.05 * p;
      applyCam();
      if (p >= 1) commitReveal();
    },
    [applyCam, commitReveal]
  );

  /* measure the viewport before anything flies, and again on resize */
  useEffect(() => {
    refreshViewport();
    const onResize = () => {
      refreshViewport();
      clampCam();
      applyCam();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [refreshViewport, clampCam, applyCam]);

  /* deep link: /#s=oscar skips the hero */
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const applyHash = () => {
      const m = window.location.hash.match(/^#s=([a-z0-9-]+)/);
      if (m && starById(m[1])) {
        revealedRef.current = true;
        setRevealed(true);
        obsRef.current?.style.setProperty("--revealP", "1");
        setSelectedId(m[1]);
        refreshViewport();
        const v = viewForStars([m[1]], 1.3, 16, winOf());
        camRef.current = { x: v.cx, y: v.cy, s: v.s };
        clampCam();
        applyCam();
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [applyCam, clampCam, refreshViewport, winOf]);

  const select = useCallback(
    (id: string | null) => {
      setSelectedId(id);
      setIndexOpen(false);
      setHover(null);
      try {
        history.replaceState(null, "", id ? `#s=${id}` : window.location.pathname);
      } catch {}
    },
    [setHover]
  );

  const startTour = useCallback(() => {
    if (!revealedRef.current) commitReveal();
    setPhase("tour");
    setTourStep(0);
    setGcLit([]);
    select(null);
    setGcOpen(false);
    setHintOn(false);
  }, [commitReveal, select]);

  const endTour = useCallback(() => {
    setPhase("free");
    setGcLit([]);
    flyTo(HOME_VIEW);
  }, [flyTo]);

  /* the whole sky in one frame - min zoom fits it on this screen */
  const fullSky = useCallback(() => {
    refreshViewport();
    flyTo({ cx: SKY_FIT.cx, cy: SKY_FIT.cy, s: viewRef.current.minZoom }, 1200);
    setHintOn(false);
  }, [flyTo, refreshViewport]);

  /* camera + dimming follow the tour */
  useEffect(() => {
    if (chapter) flyTo(viewForStars(chapter.focus, chapter.maxScale, 16, winOf()));
  }, [chapter, flyTo, winOf]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.clearTimeout(gcOpenTimer.current);
        setIndexOpen(false);
        setGcOpen(false);
        select(null);
        return;
      }
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (!revealedRef.current) {
        if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
          e.preventDefault();
          commitReveal();
        }
        return;
      }
      if (phase === "tour") {
        if (e.key === "ArrowRight") setTourStep((s) => Math.min(s + 1, tour.length - 1));
        if (e.key === "ArrowLeft") setTourStep((s) => Math.max(s - 1, 0));
        return;
      }
      /* free roam: arrows pan the sky - unless a panel wants them */
      if (selectedId || indexOpen || gcOpen) return;
      const cam = camRef.current;
      const step = 10 / cam.s;
      const pans: Record<string, [number, number]> = {
        ArrowLeft: [-step, 0],
        ArrowRight: [step, 0],
        ArrowUp: [0, -step],
        ArrowDown: [0, step],
      };
      if (pans[e.key]) {
        e.preventDefault();
        flyTo({ cx: cam.x + pans[e.key][0], cy: cam.y + pans[e.key][1], s: cam.s }, 260);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("as-tour-start", startTour);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("as-tour-start", startTour);
    };
  }, [select, phase, startTour, commitReveal, flyTo, selectedId, indexOpen, gcOpen]);

  /* wheel: reveal during hero, pan/zoom afterwards */
  useEffect(() => {
    const el = obsRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const k = e.deltaMode === 1 ? 16 : 1;
      if (!revealedRef.current) {
        nudgeReveal(e.deltaY * k);
        return;
      }
      if (performance.now() < wheelLockUntil.current) return;
      const cam = camRef.current;
      const { rect, pxPerUnit } = metrics();
      flightRef.current = null;
      velRef.current = { x: 0, y: 0 };
      if (e.ctrlKey || e.metaKey) {
        /* pinch-zoom trackpad gesture / ctrl+wheel — zoom about the cursor */
        const wx = cam.x + (e.clientX - rect.left - rect.width / 2) / (pxPerUnit * cam.s);
        const wy = cam.y + (e.clientY - rect.top - rect.height / 2) / (pxPerUnit * cam.s);
        const next = Math.min(ZOOM_MAX, Math.max(viewRef.current.minZoom, cam.s * Math.exp(-e.deltaY * k * 0.002)));
        cam.x = wx - (e.clientX - rect.left - rect.width / 2) / (pxPerUnit * next);
        cam.y = wy - (e.clientY - rect.top - rect.height / 2) / (pxPerUnit * next);
        cam.s = next;
      } else {
        cam.x += (e.deltaX * k) / (pxPerUnit * cam.s);
        cam.y += (e.deltaY * k) / (pxPerUnit * cam.s);
        if (hoveredRef.current) setHover(null); // the sky slid out from under the card
      }
      clampCam();
      applyCam();
      setHintOn(false);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyCam, clampCam, metrics, nudgeReveal, setHover]);

  /* ---------- pointer: drag / momentum / pinch / tap ---------- */

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const el = e.currentTarget as HTMLElement;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 2 && revealedRef.current) {
        const [a, b] = [...pointersRef.current.values()];
        const cam = camRef.current;
        const { rect, pxPerUnit } = metrics();
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        pinchRef.current = {
          ids: [...pointersRef.current.keys()] as [number, number],
          dist0: Math.hypot(a.x - b.x, a.y - b.y),
          s0: cam.s,
          anchor: {
            x: cam.x + (midX - rect.left - rect.width / 2) / (pxPerUnit * cam.s),
            y: cam.y + (midY - rect.top - rect.height / 2) / (pxPerUnit * cam.s),
          },
        };
        dragRef.current.active = false;
        el.setPointerCapture(e.pointerId);
        return;
      }

      const { pxPerUnit } = metrics();
      const target = (e.target as Element).closest?.("[data-star]") as HTMLElement | null;
      dragRef.current = {
        active: true,
        pointerId: e.pointerId,
        moved: false,
        heroDrag: !revealedRef.current,
        lastX: e.clientX,
        lastY: e.clientY,
        unitPerPx: 1 / pxPerUnit,
        downStar: target?.dataset.star ?? null,
        samples: [{ t: performance.now(), x: e.clientX, y: e.clientY }],
      };
      flightRef.current = null;
      velRef.current = { x: 0, y: 0 };
    },
    [metrics]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pts = pointersRef.current;
      if (pts.has(e.pointerId)) pts.set(e.pointerId, { x: e.clientX, y: e.clientY });

      /* pinch zoom */
      const pinch = pinchRef.current;
      if (pinch && pts.has(pinch.ids[0]) && pts.has(pinch.ids[1])) {
        const a = pts.get(pinch.ids[0])!;
        const b = pts.get(pinch.ids[1])!;
        const cam = camRef.current;
        const { rect, pxPerUnit } = metrics();
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const next = Math.min(ZOOM_MAX, Math.max(viewRef.current.minZoom, pinch.s0 * (dist / pinch.dist0)));
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        cam.s = next;
        cam.x = pinch.anchor.x - (midX - rect.left - rect.width / 2) / (pxPerUnit * next);
        cam.y = pinch.anchor.y - (midY - rect.top - rect.height / 2) / (pxPerUnit * next);
        clampCam(true);
        applyCam();
        return;
      }

      const drag = dragRef.current;
      if (!drag.active || e.pointerId !== drag.pointerId) return;
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.samples.push({ t: performance.now(), x: e.clientX, y: e.clientY });
      if (drag.samples.length > 6) drag.samples.shift();

      if (!drag.moved && Math.hypot(e.clientX - drag.samples[0].x, e.clientY - drag.samples[0].y) > 4) {
        drag.moved = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        setHover(null);
        setMoving(true);
        setHintOn(false);
        ensureRaf();
      }
      if (!drag.moved) return;

      if (drag.heroDrag) {
        /* a swipe that began on the hero only feeds the reveal —
           its tail must not fling the sky after the commit */
        nudgeReveal(-dy * 2.2);
        return;
      }

      const cam = camRef.current;
      cam.x -= (dx * drag.unitPerPx) / cam.s;
      cam.y -= (dy * drag.unitPerPx) / cam.s;
      clampCam(true);
      applyCam();
    },
    [applyCam, clampCam, ensureRaf, metrics, nudgeReveal, setHover, setMoving]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pinchRef.current) {
        if (!pointersRef.current.has(pinchRef.current.ids[0]) || !pointersRef.current.has(pinchRef.current.ids[1])) {
          pinchRef.current = null;
          /* hand the pan over to whichever finger is still down */
          const rest = [...pointersRef.current.entries()][0];
          if (rest) {
            const { pxPerUnit } = metrics();
            dragRef.current = {
              active: true,
              pointerId: rest[0],
              moved: true,
              heroDrag: false,
              lastX: rest[1].x,
              lastY: rest[1].y,
              unitPerPx: 1 / pxPerUnit,
              downStar: null,
              samples: [{ t: performance.now(), x: rest[1].x, y: rest[1].y }],
            };
          } else {
            dragRef.current.active = false;
            dragRef.current.moved = false;
          }
          ensureRaf(); // settle any rubber-band overshoot
        }
        return;
      }
      const drag = dragRef.current;
      if (!drag.active || e.pointerId !== drag.pointerId) return;
      drag.active = false;

      if (!drag.moved) {
        /* a clean tap/click - select the star under the pointer */
        if (drag.downStar && revealedRef.current) select(drag.downStar);
        return;
      }
      drag.moved = false; // hover must work again as soon as the drag ends

      if (revealedRef.current && !drag.heroDrag && drag.samples.length >= 2 && !reducedRef.current) {
        const first = drag.samples[0];
        const last = drag.samples[drag.samples.length - 1];
        const dt = Math.max(1, last.t - first.t);
        if (performance.now() - last.t < 90) {
          const cam = camRef.current;
          velRef.current = {
            x: (-(last.x - first.x) / dt) * (drag.unitPerPx / cam.s),
            y: (-(last.y - first.y) / dt) * (drag.unitPerPx / cam.s),
          };
        }
      }
      ensureRaf();
    },
    [ensureRaf, metrics, select]
  );

  const onPointerCancel = useCallback((e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    pinchRef.current = null;
    dragRef.current.active = false;
    dragRef.current.moved = false;
  }, []);

  const onGCFlight = useCallback(
    (f: Flight) => {
      window.clearTimeout(gcOpenTimer.current);
      flyTo(viewForStars(f.focus, f.maxScale ?? 1.6, 16, winOf()));
      setGcLit(f.lit);
      if (f.open) {
        gcOpenTimer.current = window.setTimeout(() => select(f.open!), 700);
      }
    },
    [flyTo, select, winOf]
  );

  /* hover — mouse only; touch taps open the panel directly */
  const onStarEnter = useCallback(
    (id: string, pointerType: string) => {
      if (!revealedRef.current || pointerType === "touch" || movingRef.current || dragRef.current.moved) return;
      setHover(id);
      computePreview(id);
    },
    [computePreview, setHover]
  );

  /* decorative world coordinates under the cursor - written straight to the
     DOM so mousemove never re-renders the scene */
  const onMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!coordsRef.current) return;
      const cam = camRef.current;
      const { rect, pxPerUnit } = metrics();
      const wx = cam.x + (e.clientX - rect.left - rect.width / 2) / (pxPerUnit * cam.s);
      const wy = cam.y + (e.clientY - rect.top - rect.height / 2) / (pxPerUnit * cam.s);
      const ra = Math.min(23.99, Math.max(0, (wx / WORLD.maxX) * 24));
      const dec = Math.round((HOME_VIEW.cy - wy) / 1.8);
      coordsRef.current.textContent = `RA ${String(Math.floor(ra)).padStart(2, "0")}h ${String(Math.floor((ra % 1) * 60)).padStart(2, "0")}m · DEC ${dec >= 0 ? "+" : "−"}${String(Math.abs(dec)).padStart(2, "0")}°`;
    },
    [metrics]
  );

  const onMiniJump = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      e.stopPropagation(); // the chart's own pointerdown would kill this flight
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * WORLD.maxX;
      const cy = ((e.clientY - rect.top) / rect.height) * WORLD.maxY;
      flyTo({ cx, cy, s: camRef.current.s }, 900);
    },
    [flyTo]
  );

  /* hint self-dismisses */
  useEffect(() => {
    if (!hintOn) return;
    const t = window.setTimeout(() => setHintOn(false), 7000);
    return () => window.clearTimeout(t);
  }, [hintOn]);

  useEffect(
    () => () => {
      window.clearTimeout(hintTimer.current);
      window.clearTimeout(hoverClearTimer.current);
      window.clearTimeout(gcOpenTimer.current);
    },
    []
  );

  /* once the HUD (and its minimap) mounts, sync it to the live camera -
     matters after a deep link, where the camera moved before the mount */
  useEffect(() => {
    applyCam();
  }, [revealed, applyCam]);

  /* which stars stay bright while the sky dims */
  const baseLit = chapter ? chapter.lit : gcLit;
  const dimming = baseLit.length > 0;
  const litSet = useMemo(() => new Set(baseLit), [baseLit]);

  const litEdges = useMemo(() => {
    const set = new Set<number>();
    const focus = hovered ?? selectedId;
    edges.forEach((e, i) => {
      if (focus && (e.from === focus || e.to === focus)) set.add(i);
      if (dimming && litSet.has(e.from) && litSet.has(e.to)) set.add(i);
    });
    return set;
  }, [hovered, selectedId, dimming, litSet]);

  const previewStar = preview ? (starById(preview.id) ?? null) : null;

  const arrival = camCSS(ARRIVAL_CAM.x, ARRIVAL_CAM.y, ARRIVAL_CAM.s);
  const arrivalMid = parallaxOf(ARRIVAL_CAM, PAR_MID);
  const arrivalDeep = parallaxOf(ARRIVAL_CAM, PAR_DEEP);

  return (
    <div
      ref={obsRef}
      className={`obs ${dimming ? "obs--dim" : ""} ${revealed ? "obs--revealed" : "obs--hero"} obs--${phase}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerCancel}
    >
      {/* ---------- the sky ---------- */}
      <div className="obs__chartWrap">
        <svg
          ref={svgRef}
          className="obs__svg"
          viewBox="0 0 100 62"
          preserveAspectRatio="xMidYMid slice"
          onPointerMove={onMove}
          role="group"
          aria-label="Explorable star chart of Aditya Sarade's work — drag to pan, click a star to open it"
        >
          <defs>
            <radialGradient id="nebBlue">
              <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.09" />
              <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebBrass">
              <stop offset="0%" stopColor="var(--brass)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nebEmber">
              <stop offset="0%" stopColor="var(--signal-ink)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--signal-ink)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* deepest layer — drifts slowest (parallax) */}
          <g ref={deepRef} className="obs__layer" aria-hidden="true" style={{ transform: camCSS(arrivalDeep.x, arrivalDeep.y, arrivalDeep.s) }}>
            <ellipse cx={140} cy={30} rx={48} ry={27} fill="url(#nebBlue)" />
            <ellipse cx={44} cy={46} rx={42} ry={25} fill="url(#nebBrass)" />
            <ellipse cx={150} cy={94} rx={36} ry={20} fill="url(#nebEmber)" />
            {starfieldDeep.map((f, i) => (
              <circle key={i} cx={f.x} cy={f.y} r={f.r} className="obs__dust" style={{ opacity: f.o * 0.6 }} />
            ))}
          </g>

          {/* mid dust */}
          <g ref={midRef} className="obs__layer" aria-hidden="true" style={{ transform: camCSS(arrivalMid.x, arrivalMid.y, arrivalMid.s) }}>
            {starfieldMid.map((f, i) => (
              <circle
                key={i}
                cx={f.x}
                cy={f.y}
                r={f.r}
                className={`obs__dust ${f.twinkle ? "obs__dust--twinkle" : ""}`}
                style={{ opacity: f.o * 0.8, animationDuration: `${f.dur}s`, animationDelay: `${(i % 7) * 0.9}s` }}
              />
            ))}
          </g>

          {/* the world — dust, regions, edges, stars */}
          <g ref={worldRef} className="obs__camera" style={{ transform: arrival }}>
            <g aria-hidden="true">
              {starfieldNear.map((f, i) => (
                <circle
                  key={i}
                  cx={f.x}
                  cy={f.y}
                  r={f.r}
                  className={`obs__dust ${f.twinkle ? "obs__dust--twinkle" : ""}`}
                  style={{ opacity: f.o, animationDuration: `${f.dur}s`, animationDelay: `${(i % 9) * 0.7}s` }}
                />
              ))}
              {glints.map((f, i) => (
                <circle
                  key={`g${i}`}
                  cx={f.x}
                  cy={f.y}
                  r={f.r}
                  className="obs__dust obs__dust--glint obs__dust--twinkle"
                  style={{ animationDuration: `${f.dur + 2}s`, animationDelay: `${(i % 5) * 1.3}s` }}
                />
              ))}
            </g>

            <g className="obs__nodes">
              {/* region names */}
              <g aria-hidden="true">
                {regions.map((r) => (
                  <g
                    key={r.name}
                    className="obs__regionGroup"
                    style={{ transformOrigin: `${r.x}px ${r.y}px`, transformBox: "view-box" }}
                  >
                    <text x={r.x} y={r.y} className="obs__region">
                      {r.name}
                    </text>
                    {r.sub && (
                      <text x={r.x} y={r.y + 2.1} className="obs__regionSub">
                        {r.sub}
                      </text>
                    )}
                  </g>
                ))}
              </g>

              {/* edges */}
              <g>
                {edges.map((e, i) => {
                  const p = edgeEndpoints(e.from, e.to);
                  const lit = litEdges.has(i);
                  return (
                    <g key={i} className={`obs__edgeGroup ${lit ? "is-lit" : ""}`} aria-hidden="true">
                      <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} className={`obs__edge obs__edge--${e.kind}`} />
                      {e.label && lit && (
                        <text
                          x={p.mx}
                          y={p.my - 0.9}
                          className="obs__edgeLabel"
                          transform={`rotate(${Math.abs(p.angle) > 90 ? p.angle + 180 : p.angle} ${p.mx} ${p.my - 0.9})`}
                          textAnchor="middle"
                        >
                          {e.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* stars */}
              <g>
                {stars.map((s, i) => {
                  const r = RADIUS[s.mag];
                  const la = labelAnchor(s);
                  const active = hovered === s.id || selectedId === s.id;
                  const lit = litSet.has(s.id);
                  const bright = s.mag <= 2;
                  return (
                    <g
                      key={s.id}
                      data-star={s.id}
                      className={`obs__star obs__star--${s.kind} ${active ? "is-active" : ""} ${lit ? "is-lit" : ""}`}
                      style={{
                        animationDelay: `${0.15 + i * 0.06}s`,
                        transformOrigin: `${s.x}px ${s.y}px`,
                        transformBox: "view-box",
                      }}
                      role="button"
                      tabIndex={revealed ? 0 : -1}
                      aria-label={`${s.name} — ${s.blurb}`}
                      onPointerEnter={(e) => onStarEnter(s.id, e.pointerType)}
                      onPointerLeave={scheduleHoverClear}
                      onFocus={() => {
                        setHover(s.id);
                        const cam = camRef.current;
                        if (
                          !dragRef.current.active &&
                          (Math.abs(s.x - cam.x) > 44 / cam.s || Math.abs(s.y - cam.y) > 26 / cam.s)
                        ) {
                          flyTo({ cx: s.x, cy: s.y, s: cam.s }, 700);
                        } else {
                          computePreview(s.id);
                        }
                      }}
                      onBlur={() => setHover(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          select(s.id);
                        }
                      }}
                    >
                      <circle cx={s.x} cy={s.y} r={2.6} className="obs__hit" />
                      <circle cx={s.x} cy={s.y} r={r * 2.1} className="obs__halo" />
                      {bright && (
                        <g className="obs__spikes">
                          <line x1={s.x - r * 3.2} y1={s.y} x2={s.x + r * 3.2} y2={s.y} />
                          <line x1={s.x} y1={s.y - r * 3.2} x2={s.x} y2={s.y + r * 3.2} />
                        </g>
                      )}
                      {s.kind === "comet" && (
                        <g className="obs__tail" aria-hidden="true">
                          <path d={`M ${s.x} ${s.y} q 5 -2.4 11 -3.6`} />
                          <path d={`M ${s.x} ${s.y} q 5.5 -1.2 11.5 -1.6`} />
                        </g>
                      )}
                      {s.kind === "employer" ? (
                        /* stations get an orbit ring + ticks so roles read differently from projects */
                        <g className="obs__stationMark" aria-hidden="true">
                          <circle cx={s.x} cy={s.y} r={r * 2} className="obs__stationRing" />
                          <line x1={s.x - r * 2.7} y1={s.y} x2={s.x - r * 2.1} y2={s.y} />
                          <line x1={s.x + r * 2.1} y1={s.y} x2={s.x + r * 2.7} y2={s.y} />
                          <line x1={s.x} y1={s.y - r * 2.7} x2={s.x} y2={s.y - r * 2.1} />
                          <line x1={s.x} y1={s.y + r * 2.1} x2={s.x} y2={s.y + r * 2.7} />
                        </g>
                      ) : (
                        s.mag <= 1.5 && <circle cx={s.x} cy={s.y} r={r * 1.65} className="obs__ring" />
                      )}
                      <circle cx={s.x} cy={s.y} r={r} className="obs__core" />
                      <text x={la.x} y={la.y} textAnchor={la.anchor} className="obs__name">
                        {s.name}
                      </text>
                      {s.sublabel && (
                        <text x={la.x} y={la.y + 2.2} textAnchor={la.anchor} className="obs__sublabel">
                          {s.sublabel}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </g>
          </g>
        </svg>
        <ShootingStars />
      </div>

      {/* ---------- name & introduction: centered hero → docks top-left ---------- */}
      <header className={`heroDock ${revealed ? "heroDock--corner" : "heroDock--center"}`}>
        <p className="heroDock__name">Aditya Sarade</p>
        <p className="heroDock__role">
          AI Engineer — <em>prototype</em> → <em>production</em>
        </p>
        <p className="heroDock__sub">
          Voice agents live on real phone calls in 11 languages. An LLM gateway on npm + PyPI. A memory framework so
          agents stop forgetting. Shipped as packages — and measured.
        </p>
        <div className="heroDock__more" aria-hidden={!revealed}>
          <p className="obs__status">
            <span className="pulse" aria-hidden="true" /> @ {site.employer} · {site.location}
          </p>
          <div className="obs__actions">
            <a className="obs__action obs__action--primary" href="/resume.pdf" target="_blank" rel="noopener noreferrer" tabIndex={revealed ? 0 : -1}>
              Resume ↗
            </a>
            <button className="obs__action" onClick={() => setGcOpen((v) => !v)} tabIndex={revealed ? 0 : -1}>
              Ground Control
            </button>
            <button className="obs__action obs__action--ghost" onClick={startTour} tabIndex={revealed ? 0 : -1}>
              ↻ tour
            </button>
          </div>
          <nav className="obs__links" aria-label="Profiles">
            <a className="link" href={site.links.github} target="_blank" rel="noopener noreferrer" tabIndex={revealed ? 0 : -1}>
              GitHub
            </a>
            <a className="link" href={site.links.linkedin} target="_blank" rel="noopener noreferrer" tabIndex={revealed ? 0 : -1}>
              LinkedIn
            </a>
            <a className="link" href={site.links.x} target="_blank" rel="noopener noreferrer" tabIndex={revealed ? 0 : -1}>
              X
            </a>
            <a className="link" href={site.links.pypi} target="_blank" rel="noopener noreferrer" tabIndex={revealed ? 0 : -1}>
              PyPI
            </a>
            <a className="link" href={`mailto:${site.email}`} tabIndex={revealed ? 0 : -1}>
              Email
            </a>
          </nav>
        </div>
      </header>

      {/* scroll invitation */}
      {!revealed && (
        <button className="obs__enter" onClick={commitReveal}>
          <span className="label">scroll to enter the sky</span>
          <span className="obs__enterChevron" aria-hidden="true">
            ↓
          </span>
        </button>
      )}

      {/* ---------- tour card ---------- */}
      {chapter && (
        <div className="tourCard" role="region" aria-label="Guided tour" aria-live="polite">
          <div className="tourCard__top">
            <span className="label label--blue">{chapter.label}</span>
            <button className="tourCard__skip label" onClick={endTour}>
              skip ✕
            </button>
          </div>
          <h2 className="tourCard__heading">{chapter.heading}</h2>
          <p className="tourCard__line">{chapter.line}</p>
          <div className="tourCard__nav">
            <button
              className="tourCard__btn"
              onClick={() => setTourStep((s) => Math.max(0, s - 1))}
              disabled={tourStep === 0}
            >
              ← back
            </button>
            <span className="tourCard__dots" aria-hidden="true">
              {tour.map((t, i) => (
                <span key={t.id} className={`tourCard__dot ${i === tourStep ? "is-on" : ""}`} />
              ))}
            </span>
            {tourStep < tour.length - 1 ? (
              <button className="tourCard__btn tourCard__btn--primary" onClick={() => setTourStep((s) => s + 1)}>
                next →
              </button>
            ) : (
              <button className="tourCard__btn tourCard__btn--primary" onClick={endTour}>
                explore the sky →
              </button>
            )}
          </div>
          {tourStep === tour.length - 1 && (
            <div className="tourCard__final">
              <a className="link" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                Resume ↗
              </a>
              <a className="link" href={`mailto:${site.email}`}>
                Email
              </a>
              <button
                className="link tourCard__gcLink"
                onClick={() => {
                  endTour();
                  setGcOpen(true);
                }}
              >
                Open Ground Control
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------- HUD (free roam) ---------- */}
      {revealed && phase === "free" && (
        <>
          <div className="obs__hud obs__hud--tr">
            <button className="obs__control" onClick={() => flyTo(HOME_VIEW)} aria-label="Recenter the sky">
              ⌖ home
            </button>
            <button className="obs__control" onClick={fullSky} aria-label="Zoom out to see the whole sky">
              ⛶ full sky
            </button>
            <button className="obs__control" onClick={() => setIndexOpen((v) => !v)} aria-expanded={indexOpen}>
              index
            </button>
            <button
              className="obs__control"
              onClick={() => window.dispatchEvent(new Event("as-console-open"))}
              aria-label="Open agent console"
            >
              ⌘K console
            </button>
            <ThemeToggle />
          </div>

          <div className="obs__hud obs__hud--bl">
            <button className="obs__legendToggle label" onClick={() => setLegendOpen((v) => !v)} aria-expanded={legendOpen}>
              {legendOpen ? "✕ legend" : "✦ legend"}
            </button>
            {legendOpen && (
              <ul className="obs__legend">
                <li>
                  <span className="obs__legendStar obs__legendStar--1" /> flagship — shipped &amp; live
                </li>
                <li>
                  <span className="obs__legendStar obs__legendStar--2" /> production system / package
                </li>
                <li>
                  <span className="obs__legendStar obs__legendStar--3" /> side project / earlier work
                </li>
                <li>
                  <span className="obs__legendStation" /> station — a role I&apos;ve held
                </li>
                <li>
                  <span className="obs__legendLine" /> real dependency · ships
                </li>
                <li>
                  <span className="obs__legendLine obs__legendLine--dash" /> career trajectory
                </li>
              </ul>
            )}
          </div>

          {hintOn && (
            <p className="obs__hud obs__hud--bc obs__caption" aria-live="polite">
              drag to wander · hover a star to preview · click to open
            </p>
          )}

          <div className="obs__hud obs__hud--br" aria-hidden="true">
            <div className="minimap">
              <svg viewBox={`0 0 ${WORLD.maxX} ${WORLD.maxY}`} onPointerDown={onMiniJump}>
                {stars.map((s) => (
                  <circle
                    key={s.id}
                    cx={s.x}
                    cy={s.y}
                    r={s.mag <= 1.5 ? 2.6 : 1.7}
                    className={`minimap__dot ${s.mag <= 1.5 ? "minimap__dot--bright" : ""}`}
                  />
                ))}
                <rect
                  ref={miniViewRef}
                  className="minimap__view"
                  x={ARRIVAL_CAM.x - 50 / ARRIVAL_CAM.s}
                  y={ARRIVAL_CAM.y - 31 / ARRIVAL_CAM.s}
                  width={100 / ARRIVAL_CAM.s}
                  height={62 / ARRIVAL_CAM.s}
                  rx={3}
                />
              </svg>
            </div>
            <p className="label obs__coords" ref={coordsRef}>
              RA 00h 00m · DEC +00°
            </p>
          </div>
        </>
      )}

      {/* ---------- floating hover preview ---------- */}
      {preview && previewStar && phase === "free" && !selectedId && (
        <PreviewCard
          star={previewStar}
          x={preview.x}
          y={preview.y}
          side={preview.side}
          onHoldHover={cancelHoverClear}
          onReleaseHover={scheduleHoverClear}
        />
      )}

      {/* ---------- index drawer ---------- */}
      {indexOpen && (
        <div className="obs__indexBackdrop" onClick={() => setIndexOpen(false)}>
          <nav className="obs__index" aria-label="Chart index" onClick={(e) => e.stopPropagation()}>
            <p className="label label--blue">Chart index</p>
            {[
              {
                name: "Professional experience",
                ids: ["medikabazaar", "mb-voice", "image-enhance", "seo-engine", "kyc-ocr", "wasserstoff", "adgama"],
              },
              { name: "Open source packages", ids: ["ai-command-center", "oscar", "asterix", "qmem", "registry"] },
              { name: "Side projects", ids: ["querypilot", "ai-tutor", "doc-researcher"] },
              { name: "Profile", ids: ["education", "principles", "contact"] },
            ].map((group) => (
              <div key={group.name} className="obs__indexGroup">
                <p className="obs__indexGroupName">{group.name}</p>
                <ul>
                  {group.ids.map((id) => {
                    const s = starById(id);
                    if (!s) return null;
                    return (
                      <li key={id}>
                        <button
                          className="obs__indexItem"
                          onClick={() => {
                            select(id);
                            flyTo(viewForStars([id], Math.max(camRef.current.s, 1.1), 16, winOf()), 900);
                          }}
                        >
                          <span className="obs__indexItemName">{s.name}</span>
                          <span className="obs__indexItemBlurb">{s.blurb}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <a className="obs__indexResume" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume (PDF) ↗
            </a>
          </nav>
        </div>
      )}

      {/* ---------- ground control ---------- */}
      <GroundControl open={gcOpen} onClose={() => setGcOpen(false)} onFlight={onGCFlight} />

      {/* ---------- detail panel ---------- */}
      <NodePanel star={selected} onClose={() => select(null)} />
    </div>
  );
}
