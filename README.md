# CV Builder

Fill in your details once, preview them instantly across 10 differently-styled resume templates, and export straight to PDF.

## How it works

1. **Edit** — fill in personal info, experience, education, skills, projects, and languages in the form.
2. **Pick a look** — the gallery shows all 10 templates as live thumbnails; click one to switch the preview.
3. **Export** — "Save as PDF" opens the browser's print dialog with the CV formatted as a clean A4 page (choose "Save as PDF" as the destination).

Everything runs client-side — your data is saved to `localStorage` in your own browser and never leaves your machine.

## Templates

Minimal, Classic, Sidebar, Creative, Timeline, Corporate, Dark Tech, Elegant, Compact, and Academic — each a distinct layout, typography, and color treatment over the same underlying data (`src/components/templates/`).

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- No backend, no build-time data — everything is client-side state persisted to `localStorage`

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
  types.ts                  CVData / template types
  data/
    sampleData.ts             default/sample CV content
    templates.ts               the 10 template definitions (id, name, accent)
  components/
    editor/                    the CV editing form
    templates/                 the 10 template components + registry
    TemplateGallery.tsx         live-thumbnail template picker
    PreviewPane.tsx              on-screen + print preview
  hooks/useLocalStorage.ts     persistence
  lib/format.ts                 shared formatting helpers
```
