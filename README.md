# RoomWalk — 3D Virtual Tour PoC

Upload a property walkthrough video → mock Gaussian-splat conversion → interactive browser tour.

Assignment brief: [`docs/assignment-brief.txt`](docs/assignment-brief.txt)

## Quick start

```bash
npm install
npm run samples:download   # large .splat files are gitignored
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## What you can try

1. **Upload / sample video** — drop your own MP4/MOV, or use the bundled Mixkit clips.
2. **Convert** — simulated reconstruction pipeline (no paid API key required).
3. **Tour** — explore a stand-in Gaussian splat with Spark.js + Three.js (orbit + WASD).
4. **Skip convert** — open a pre-built splat directly.

## Project layout

```
├── docs/                 Assignment brief
├── public/samples/       Demo videos + splat credits
├── scripts/              Sample asset download helper
├── src/
│   ├── components/       Upload, processing, tour, splat viewer
│   ├── data/             Sample video ↔ splat mappings
│   └── App.tsx           Workflow orchestration
└── package.json
```

## Sample assets

| Asset | Path | Source |
| --- | --- | --- |
| Apartment viewing | `public/samples/videos/apartment-viewing.mp4` | [Mixkit](https://mixkit.co/free-stock-video/viewing-a-new-apartment-22513/) |
| House move-in | `public/samples/videos/house-moving.mp4` | [Mixkit](https://mixkit.co/free-stock-video/moving-into-a-new-house-15182/) |
| Kitchen splat (~54 MB) | `public/samples/splats/kitchen.splat` | [dylanebert/3dgs](https://huggingface.co/datasets/dylanebert/3dgs) via `npm run samples:download` |
| Bonsai splat (~35 MB) | `public/samples/splats/bonsai.splat` | same — via `npm run samples:download` |

Splat binaries are **gitignored**. Credits: `public/samples/CREDITS.md`.

## Intended production pipeline

```
iPhone walkthrough (MP4)
        │
        ▼
 Reconstruction API / tool
 (Luma AI · Polycam · Scaniverse
  · COLMAP + gsplat / nerfstudio)
        │
        ▼
  .splat / .spz / .ply
        │
        ▼
 Browser viewer (Spark.js)  ← this PoC
```

Replace the mock timer in `src/App.tsx` to call a real converter, then pass the resulting URL into `TourPanel` / `SplatViewer`.

## Future scope

- Still photos per room from the walkthrough
- Floor-plan generation from the reconstructed space

## Stack

- Vite + React + TypeScript
- Three.js + `@sparkjsdev/spark`
