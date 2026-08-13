# Glasses Fit

Take a photo, pick a brand, and get sunglasses or eyeglasses recommendations matched to your face shape and the look you're going for.

## How it works

1. **Pick a brand** — recommendations are scoped to that brand's catalog.
2. **Sunglasses or regular glasses.**
3. **Pick a look** — Everyday, Classic, Flashy, or Sporty (capped at four by design).
4. **Add a photo** — via webcam or file upload. A face-shape estimate (oval, round, square, heart, diamond, or oblong) is computed **entirely in the browser** using on-device face landmark detection ([MediaPipe Face Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker)). No photo is ever uploaded to a server. If detection fails (or you'd rather skip the photo), you can pick your face shape manually.
5. **Results** — frames from the chosen brand/type/look, ranked by fit for your face shape, with a short explanation of why each shape works.

The face-shape → frame-shape matching follows standard optician heuristics (e.g. angular frames for round faces, rounded frames for square faces) defined in `src/data/faceShapeFit.ts`.

Frame artwork is procedurally drawn SVG (`src/components/FrameGlyph.tsx`), not real product photography, since the catalog is illustrative rather than a live retail feed.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- `@mediapipe/tasks-vision` for on-device face landmark detection — the WASM runtime and model weights are self-hosted under `public/mediapipe` and `public/models` so detection works fully offline and without any third-party CDN dependency.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```

## Project structure

```
src/
  types.ts              shared types
  data/
    brands.ts            brand list
    looks.ts              the 4 "look" options
    faceShapeFit.ts        face-shape ↔ frame-shape heuristics + labels
    catalog.ts             the frame catalog
  lib/
    faceShape.ts           on-device face landmark detection + shape classification
    recommend.ts            filtering/ranking logic
  components/               step screens + UI
```
