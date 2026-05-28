# Provoke

Provoke is a cinematic bilingual card game rebuilt from the ThinkDeck prototype with React, TypeScript, glass-morphism cards, and category-themed 3D particle backgrounds. Players choose one or more categories, draw reflective prompts, reveal hints and perspectives, and can switch between English and Indonesian content without any backend or runtime API calls.

## Stack

- Vite
- React 19
- TypeScript strict mode with `noUncheckedIndexedAccess`
- Tailwind CSS v4
- shadcn/ui
- `tw-animate-css`
- React Three Fiber (`@react-three/fiber`) with drei and postprocessing
- i18next and react-i18next
- Vitest
- Zod
- CSV-driven content generation

## Getting Started

Install dependencies:

```bash
bun install
```

or:

```bash
npm install
```

Start the dev server:

```bash
bun run dev
```

The app opens at `http://localhost:5173` by default.

## Scripts

| Script                 | Purpose                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `bun run dev`          | Validates CSV, regenerates typed questions, and starts Vite.                          |
| `bun run build`        | Runs `prebuild`, then creates a production build in `dist/`.                          |
| `bun run preview`      | Serves the production build locally.                                                  |
| `bun run prebuild`     | Validates `src/data/questions.csv` and regenerates `src/data/questions.generated.ts`. |
| `bun run lint`         | Runs ESLint across the project.                                                       |
| `bun run format`       | Formats the repository with Prettier.                                                 |
| `bun test`             | Runs the Vitest/Bun-compatible unit test suite.                                       |
| `bunx vitest run`      | Runs Vitest directly.                                                                 |
| `bun run csv:validate` | Validates the CSV source without building the app.                                    |

## Editing Questions

Questions live in `src/data/questions.csv`. The CSV is the only source of prompt content; generated TypeScript is created from it during `prebuild`.

Required columns:

```csv
qid,category_id,level,q_en,hint_en,persp_en,q_id,hint_id,persp_id
```

After editing the CSV, run:

```bash
bun run csv:validate
bun run prebuild
```

`prebuild` regenerates `src/data/questions.generated.ts`, which should stay committed so static hosts can build without runtime content fetching. See `docs/EDITING-QUESTIONS.md` for detailed row and escaping rules.

## Adding Translations

UI translations live in:

- `public/locales/en/translation.json`
- `public/locales/id/translation.json`

Keep translation keys in parity between both locale files. English is the fallback language, and tests cover locale loading/fallback behavior.

## Themes

Category themes live in `src/data/themes.ts`. The app expects exactly one theme for each of the 21 locked categories from `src/data/categories.ts`; do not add runtime theme editing or fallback-only categories.

## Building for Production

Create a static production build:

```bash
bun run build
```

The output is written to `dist/` and can be deployed to static hosts such as:

- [Vercel Vite deployments](https://vercel.com/docs/frameworks/vite)
- [Netlify Vite deployments](https://docs.netlify.com/integrations/frameworks/vite/)

See `docs/DEPLOY.md` for host-specific setup notes.

## Project Structure

```text
src/
  components/      Reusable UI such as cards, timer, brand, language toggle, and category grid.
  components/ui/   shadcn/ui primitives.
  data/            Locked categories, category themes, source CSV, and generated questions.
  i18n/            i18next initialization.
  screens/         Home, playing, and finished phase screens.
  store/           Game FSM, localStorage keys, persistence helpers, and sync wiring.
  three/           Persistent R3F scene, particles, postprocessing, theme provider, and quality tier hook.
  types/           Core domain types and discriminated unions.
scripts/           CSV validation and CSV-to-TypeScript generation.
public/locales/    English and Indonesian UI translation JSON files.
docs/              Content editing and deployment guides.
```

## Architecture Notes

- Game state is modeled as a discriminated union for the `home`, `playing`, and `finished` phases.
- The R3F scene is mounted once at the app root and persists across screen changes.
- Theme updates flow through refs/uniform updates so category changes do not remount the scene.
- `useQualityTier()` adapts particles for device capability and returns `none` when reduced motion is preferred.
- localStorage uses versioned `provoke_v1_*` keys with Zod-guarded parsing and stores session question IDs rather than full question objects.
- Content is generated at build time from CSV, keeping the deployed app static and API-free.
