# adityasarade.github.io

**The Observatory** — my portfolio as an interactive constellation knowledge graph. Projects, employers, and packages are stars on a celestial atlas; the lines between them are real relationships (Asterix *powers* OSCAR; anything is *one base-URL from the meter* of AI Command Center). No infinite scroll — you read the sky.

Live at **[adityasarade.github.io](https://adityasarade.github.io)**.

## Design

Celestial-atlas aesthetic: deep navy-ink sky, starlight ivory, vintage brass for glints, muted periwinkle for interactivity, one ember accent. Instrument Serif star names, Fragment Mono coordinates. A "day atlas" (warm paper) theme is one toggle away. No neon, no tracking, no cookies.

## Interactions

- **The tour** — first visit opens cinematic: five chapters fly the telescope across the sky, one line each
- **Hover** a star → connected edges illuminate, the caption reads it aloud
- **Click** a star → its chart entry opens in a side panel (deep-linkable: `/#s=oscar`)
- **Ground Control** — a scripted flight-computer assistant; its answers fly the chart and light the stars they mention
- **Resume** — `public/resume.pdf`, offered in the intro, HUD, tour finale, index, and console (`resume`)
- **Index** → full accessible list of every node
- **⌘K** → the agent console (try `sudo hire aditya`)
- Fake RA/Dec cursor readout, drawn graticule, deterministic starfield, comet for contact

## Structure

| Path | What |
|---|---|
| `lib/data.ts` | **All content** — edit this to update the site |
| `lib/sky.ts` | The sky: star positions, magnitudes, edges, regions, starfield |
| `components/SkyChart.tsx` | The chart + HUD + index drawer |
| `components/NodePanel.tsx` | Star detail panels |
| `app/work/[slug]/page.tsx` | Full case studies: AI Command Center · MB Voice · OSCAR · Asterix |
| `components/Console.tsx` | The ⌘K agent console |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/
```

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and publishes to GitHub Pages. Repo **Settings → Pages → Source** must be **GitHub Actions**.
