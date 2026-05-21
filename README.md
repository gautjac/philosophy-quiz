# Sophia — A Daily Philosophy Quiz

Learn the canon of Western philosophy one thinker at a time. Modelled on [lit-quiz](https://github.com/gautjac/lit-quiz).

## Two modes

- **Passage mode** — read an excerpt from the original work (via Project Gutenberg). Identify the thinker and their school.
- **Takeaway mode** — read a single key idea in plain language ("God is dead — and we have killed him"). Identify the thinker and their school.

Each quiz is 10 questions. The reveal screen shows a bio, the school's description, and 4–6 **key takeaways** — the educational core. Weighted spaced repetition surfaces thinkers you've struggled with.

## Coverage

48 thinkers across 20 schools, from the Pre-Socratics to mid-20th century. Passage mode covers the 36 thinkers with substantial public-domain English works on Gutenberg; takeaway mode covers all 48 (so Sartre, Heidegger, Wittgenstein-late, Rawls, de Beauvoir are reachable too).

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 (or 3300 if 3000 is taken — Next.js will tell you which port).

## Rebuild the passage cache

The passage cache (`src/data/passages.json`) is checked in. Re-run if you change `THINKERS` in `src/lib/thinkers.ts`:

```bash
npm run build:passages
```

The script checkpoints after each thinker, so it's safe to interrupt and resume. Set `FORCE_REBUILD=1` to overwrite cached thinkers.

## Deploy

`netlify.toml` is configured. Connect the repo to Netlify — `npm run build` is the publish command, `.next` the publish dir, and the `@netlify/plugin-nextjs` plugin handles the rest.

## Project structure

```
src/
  app/
    page.tsx              — home (mode picker, progress, school grid)
    quiz/page.tsx         — quiz page (both modes)
    school/[id]/page.tsx  — school browse page
    thinker/[id]/page.tsx — thinker page (bio + key takeaways + works)
    api/passage/route.ts  — serves cached or live Gutenberg passages
  lib/
    thinkers.ts           — the 48 thinkers + their key takeaways
    schools.ts            — the 20 schools
    quiz-engine.ts        — question generation for both modes
    storage.ts            — LocalStorage progress (streak, weights, history)
    gutenberg.ts          — passage extraction from Project Gutenberg
    passage-cache.ts      — reads pre-built passages.json
  data/passages.json      — pre-extracted passages (192 across 36 thinkers)
scripts/build-passages.mjs — Gutenberg ingest script
```
