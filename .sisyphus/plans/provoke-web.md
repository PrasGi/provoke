# Provoke Web — React Rebuild of ThinkDeck

## TL;DR

> **Quick Summary**: Greenfield rebuild of the `thinkdeck_game.html` vanilla-JS prototype as a polished React 19 + TypeScript app called **Provoke**. The differentiator from the prototype is _the UI itself_: cinematic dark theme with category-themed 3D particle backgrounds (react-three-fiber), bilingual EN/ID content, 21 categories × 3 levels × ~5–10 seed questions, glass-morphism cards with Y-axis flip on perspective reveal.
>
> **Deliverables**:
>
> - Vite + React 19 + TypeScript (strict + `noUncheckedIndexedAccess`) scaffold
> - Tailwind CSS v4 + shadcn/ui (with `tw-animate-css`)
> - react-three-fiber + @react-three/drei + @react-three/postprocessing scene
> - i18next + react-i18next (EN default, ID alternate; self-hosted fonts)
> - 21 category themes (each: color palette + particle config + mood)
> - CSV → typed JSON build pipeline (Zod-validated; `prebuild` npm hook)
> - Ported game FSM as discriminated union (`home → playing → finished`)
> - Glass-card UI with Y-axis flip on reveal; responsive 21-chip category grid
> - localStorage persistence (versioned `provoke_v1_*` keys, Zod-guarded)
> - Quality-tier adaptive particle system (high/medium/low/none) honoring `prefers-reduced-motion`
> - Vitest unit tests (state machine, CSV parser, i18n, theme lookup, localStorage)
> - Static-host build (Vercel/Netlify ready)
>
> **Estimated Effort**: Large (greenfield, 21 themes, content pipeline, 3D scene)
> **Parallel Execution**: YES — 5 waves
> **Critical Path**: T1 (scaffold) → T2 (type contracts) → T6 (CSV pipeline) → T15 (theme system) → T18 (R3F scene) → T24 (integration) → F1–F4 → user okay

---

## Context

### Original Request

Prototype file `/Users/macbook/Downloads/thinkdeck_game.html` is a 274-line vanilla-JS single-file card game with 12 cards across 9 categories. User wants to rebuild it as a React app with:

- Bilingual (EN default + ID)
- 21 categories × 3 levels × 50 questions target (3,150 max; seed 5–10 per cat/level now)
- 3D particle backgrounds that retheme per category — "UI is the most important"
- Questions stored in CSV
- Same gameplay loop as prototype (single-player draw-card)

### Interview Summary

**Key Discussions**:

- Toolchain → Vite + React 19 + TypeScript strict
- 3D → react-three-fiber + drei + postprocessing
- Styling → Tailwind CSS v4 + shadcn/ui (using `tw-animate-css`, not `tailwindcss-animate`)
- i18n → i18next + react-i18next (2 locales)
- CSV → single file, all languages side-by-side, Zod-validated, build-time generation
- Themes → one per category (21 themes)
- Sourcing → seed 5–10 per cat/level (~315–630 questions), CSV designed for expansion
- Persistence → localStorage (settings, seen cards, session snapshot)
- Modes → single-player only (faithful port)
- Tests → Vitest unit + agent QA static analysis (NO Playwright per AGENTS.md)
- Deploy → static hosting (Vercel/Netlify)
- UI direction → dark/cinematic/immersive, flowing constellation/dust particles, glass card with backdrop-blur, Inter (UI) + Instrument Serif (questions), subtle transitions, skip onboarding, grid of 21 chips, card flip Y-axis, mobile-first responsive, "Provoke" wordmark

**Research Findings**:

- Workspace `/Users/macbook/workspace/personal/provoke-web/` is empty — greenfield.
- Prototype FSM ports cleanly. Empty-deck crash bug exists in prototype (must guard with discriminated union).
- iOS WebGL DPR > 1 causes silent context loss — hard-code `dpr={[1, 1]}` in Canvas.
- shadcn/ui v4 needs `tw-animate-css`, not the deprecated `tailwindcss-animate`.

### Metis Review

**Identified Gaps** (addressed):

- ~~21 categories undefined~~ → user provided full locked list
- ~~CSV column collision (`id` vs `question_id`)~~ → renamed columns: `qid`, `q_en`, `q_id`, `hint_en`, `hint_id`, `persp_en`, `persp_id`
- ~~Seen-card semantics undefined~~ → "seen" = perspective revealed; per-category tracking; reshuffle when exhausted
- ~~Card interaction sequence unclear~~ → preserve prototype FSM, Y-flip on reveal, explicit "next" button
- ~~Timer role unclear~~ → cosmetic only (matches prototype), configurable 1/2/3 min/free
- ~~Session model unclear~~ → multi-category select, merged shuffled deck, no mid-session category switching
- ~~Empty category crash~~ → guard via discriminated union; Zod on CSV parse
- ~~`prefers-reduced-motion` ignored~~ → respected via `useQualityTier()` hook (degrades particles + flip)
- ~~iOS WebGL context loss~~ → `dpr={[1,1]}` + `webglcontextlost` handler
- ~~Theme transition perf~~ → uniform/attribute swap (NEVER scene unmount/remount on category change)
- ~~CSV build timing~~ → `prebuild` npm hook (`tsx scripts/parse-csv.ts`); generated TS file committed
- ~~Font privacy (GDPR)~~ → self-hosted via `@fontsource/*` packages

---

## Work Objectives

### Core Objective

Deliver a production-quality, UI-first React rebuild of the ThinkDeck prototype as "Provoke" — featuring cinematic 3D particle backgrounds that retheme per category, bilingual content (EN/ID), and a polished glass-card interaction loop, with infrastructure designed for content expansion (target 3,150 questions, seed ~315–630).

### Concrete Deliverables

- `package.json` (Vite, React 19, TypeScript, Tailwind v4, shadcn/ui, R3F, i18next, Vitest, Zod, fontsource)
- `vite.config.ts` + `tsconfig.json` (strict, `noUncheckedIndexedAccess`)
- `tailwind.config.ts` + `src/index.css` (dark theme tokens, Tailwind v4 CSS-first config)
- shadcn init (`components.json`, `tw-animate-css` installed)
- `src/types/` (CategoryId union, Level, Phase, Question, GameState discriminated union, CategoryTheme)
- `src/data/categories.ts` (21 locked categories with `label`, `label_en`, `description_id`, `description_en`)
- `src/data/themes.ts` (21 `CategoryTheme` objects)
- `src/data/questions.csv` (seed 5–10 per cat/level)
- `scripts/parse-csv.ts` + `scripts/validate-csv.mjs` (Zod-validated build script, `prebuild` hook)
- `src/data/questions.generated.ts` (committed, generated from CSV)
- `src/store/keys.ts` (localStorage key manifest `provoke_v1_*`)
- `src/store/persist.ts` (Zod-guarded read/write helpers)
- `src/store/game.store.ts` (FSM, Zustand or React reducer — TBD by executor, both acceptable)
- `src/i18n/index.ts` + `public/locales/{en,id}/translation.json`
- `src/three/Scene.tsx` (R3F Canvas, dpr=[1,1], aria-hidden, context-loss handler)
- `src/three/Particles.tsx` (constellation/dust system, uniform/attribute swap on theme change)
- `src/three/useQualityTier.ts` (capability detection hook)
- `src/three/postprocessing.ts` (Bloom only, conditional on tier)
- `src/components/Card.tsx` (glass card, Y-axis flip, backdrop-blur)
- `src/components/CategoryGrid.tsx` (responsive 21-chip multi-select)
- `src/components/Timer.tsx` (color-graded urgency bar)
- `src/components/LanguageToggle.tsx`
- `src/screens/HomeScreen.tsx`, `src/screens/PlayingScreen.tsx`, `src/screens/FinishedScreen.tsx`
- `src/App.tsx` (FSM root, screen switcher, scene mount)
- `src/main.tsx` (i18n init, font preload, mount)
- `index.html` (lang attr, meta tags, Provoke brand)
- Unit tests under `src/**/__tests__/`
- `README.md` (setup, dev, build, content editing)

### Definition of Done

- [ ] `bun install` (or `npm install`) completes with zero peer-dep errors
- [ ] `bun run build` exits 0 (or `npm run build`)
- [ ] `npx tsc --noEmit` exits 0
- [ ] `bun test` / `vitest run` — all tests pass
- [ ] `bun run dev` opens the app, shows home screen with 21 category chips and 3D particle background
- [ ] Selecting categories + level + timer + "Mulai/Start" begins a session with themed particles
- [ ] Card displays question, hint button works, "Buka Perspektif/Reveal Perspective" flips card on Y-axis
- [ ] Language toggle switches all UI strings + card content between EN/ID
- [ ] Reloading the page restores language preference and seen-card list
- [ ] All 21 categories have a theme (no fallback path triggers)
- [ ] CSV → generated TS pipeline runs on `prebuild`; modifying CSV + rebuild updates content
- [ ] F1–F4 reviewers all VERDICT: APPROVE
- [ ] User gives explicit "okay" after reviewing F1–F4 output

### Must Have

- React 19 + TypeScript strict + `noUncheckedIndexedAccess`
- Tailwind CSS v4 + shadcn/ui + `tw-animate-css`
- react-three-fiber Canvas with `dpr={[1,1]}` + `aria-hidden="true"` + WebGL context-loss handler
- Constellation/dust particle system with per-category uniform swap (NOT scene remount)
- 21 `CategoryTheme` objects covering exactly the 21 locked `CategoryId` literal values
- Bilingual i18n (EN default, ID alternate), self-hosted fonts (`@fontsource/inter`, `@fontsource/instrument-serif`)
- Single CSV (`src/data/questions.csv`) with columns: `qid, category_id, level, q_en, hint_en, persp_en, q_id, hint_id, persp_id`
- Zod validation at CSV parse boundary; `qid` uniqueness asserted; all 21 categories present
- Discriminated-union `GameState` (`home | playing | finished`)
- localStorage with versioned keys (`provoke_v1_settings`, `provoke_v1_seen`, `provoke_v1_session`); Zod-guarded reads
- Quality-tier adaptive particles (`high | medium | low | none`) via `useQualityTier()`; honors `prefers-reduced-motion`
- Glass card with Y-axis CSS-3D flip; reduced-motion → instant
- Responsive 21-chip category grid with multi-select + "Select All" / "Clear" shortcuts
- Vitest unit tests for: FSM transitions, CSV→types parse, i18n fallback, localStorage migration, theme exhaustiveness, particle config tiers
- `prebuild` npm hook generates `src/data/questions.generated.ts`
- Static build deployable to Vercel/Netlify (zero runtime API calls)

### Must NOT Have (Guardrails)

- ❌ NO score / points / streak / leaderboard / social sharing
- ❌ NO backend / API endpoint / WebSocket / auth / cloud sync at runtime
- ❌ NO 22nd category added at runtime; no theme editor; no user theme overrides
- ❌ NO `as Question[]` casting on CSV-parsed data — Zod or throw
- ❌ NO `tailwindcss-animate` (deprecated for v4) — use `tw-animate-css`
- ❌ NO `fonts.googleapis.com` — fonts self-hosted via `@fontsource/*`
- ❌ NO hardcoded question / hint / perspective strings in `.ts` / `.tsx` source
- ❌ NO DepthOfField postprocessing — Bloom only, conditional on quality tier
- ❌ NO Playwright (replaced by static analysis per AGENTS.md)
- ❌ NO Service Worker / PWA manifest / offline cache (out of v1)
- ❌ NO back-nav during active card flip animation
- ❌ NO scene unmount/remount on category change (uniform/attribute swap only)
- ❌ NO `@testing-library/react` alone for R3F — use `@react-three/test-renderer` + `vitest-canvas-mock`
- ❌ NO 3rd language; ID + EN only
- ❌ NO multiplayer / pass-the-device / deep-dive mode (v2)
- ❌ NO CMS / admin panel / runtime content editing
- ❌ NO sound effects / audio
- ❌ NO analytics / telemetry / tracking
- ❌ NO `prefers-reduced-motion` ignored — must be respected end-to-end
- ❌ NO scoring on `deck[idx]` without guard (empty deck must be unreachable via discriminated union)
- ❌ NO ad-hoc localStorage keys outside the manifest in `src/store/keys.ts`
- ❌ NO auto-commits / auto-pushes (AGENTS.md: only commit when user says "commit")

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision

- **Infrastructure exists**: NO (greenfield)
- **Automated tests**: YES (Tests-after) using **Vitest**
- **Framework**: `vitest` + `@testing-library/react` for DOM + `@react-three/test-renderer` + `vitest-canvas-mock` for R3F
- **Coverage focus**: pure logic (FSM, CSV parser, i18n fallback, localStorage migration, theme exhaustiveness, quality-tier detection). UI components verified by static analysis + render-snapshot tests where useful.

### QA Policy (per AGENTS.md)

Every task includes agent-executed QA scenarios. **Playwright is OFF** by default — F3 reviewer wave uses **static code analysis only**. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Library/Logic**: `bun test` / `vitest run <path>` — assert outputs
- **TypeScript contracts**: `npx tsc --noEmit` — must exit 0
- **Lint**: `bun run lint` / `eslint .` — must exit 0
- **Build**: `bun run build` — must exit 0
- **CSV pipeline**: `bun run prebuild` (or `tsx scripts/parse-csv.ts`) — must produce valid generated TS
- **CSS / Tailwind**: grep generated CSS for theme token classes (e.g., `--color-primary`) — must be present
- **R3F components**: `@react-three/test-renderer` + `vitest-canvas-mock` — assert scene-graph shape, props, dispose calls
- **i18n**: load `en` + `id` JSON, assert key parity, assert missing-ID falls back to EN
- **Static analysis (F3 substitute)**: grep for forbidden patterns (`as any`, `as Question[]`, hardcoded strings, Google Fonts URLs, `tailwindcss-animate`, etc.) — must return zero results

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves. Target: 5–8 tasks per wave. Each wave completes before the next begins.

```
Wave 1 (Start Immediately — foundation, max parallel):
├── Task 1:  Vite scaffold + tsconfig strict + ESLint + Prettier              [quick]
├── Task 2:  Type contracts (CategoryId union, Level, Phase, Question,
│            GameState discriminated union, CategoryTheme)                     [quick]
├── Task 3:  Categories data module (21 locked categories with EN/ID labels)   [quick]
├── Task 4:  Tailwind v4 CSS-first config + shadcn init + tw-animate-css       [quick]
├── Task 5:  Self-hosted fonts (@fontsource/inter, instrument-serif) + globals [quick]
├── Task 6:  i18next setup + EN/ID translation skeletons (UI strings only)     [quick]
└── Task 7:  localStorage key manifest + Zod-guarded persist helpers           [quick]

Wave 2 (After Wave 1 — content + theme + 3D foundation, MAX PARALLEL):
├── Task 8:  CSV schema + seed file (5–10 questions per cat × level)           [unspecified-high]
├── Task 9:  CSV → generated TS pipeline (prebuild hook, Zod, qid uniqueness)  [unspecified-high]
├── Task 10: 21 CategoryTheme objects (colors, particle configs, mood)         [visual-engineering]
├── Task 11: Theme context provider + useTheme() hook                          [quick]
├── Task 12: useQualityTier() hook (DPR, hardwareConcurrency, reduced-motion)  [quick]
├── Task 13: R3F Canvas wrapper (Scene.tsx) — aria-hidden, dpr=[1,1], context-loss handler [unspecified-high]
└── Task 14: Game store / FSM reducer (discriminated union transitions)        [deep]

Wave 3 (After Wave 2 — UI + 3D scene assembly):
├── Task 15: Particles component (constellation/dust, uniform swap on theme)   [visual-engineering]
├── Task 16: Postprocessing (Bloom only, quality-gated)                        [visual-engineering]
├── Task 17: Card component (glass, backdrop-blur, Y-axis flip, reduced-motion fallback) [visual-engineering]
├── Task 18: CategoryGrid component (21 chips, multi-select, themed)           [visual-engineering]
├── Task 19: Timer component (color-graded urgency, tabular nums)              [quick]
├── Task 20: LanguageToggle + Brand wordmark + small UI primitives             [quick]
└── Task 21: i18n category labels + description injection                      [quick]

Wave 4 (After Wave 3 — screens + integration):
├── Task 22: HomeScreen (category grid + level + timer pickers + Start)        [visual-engineering]
├── Task 23: PlayingScreen (card stack + actions + perspective reveal + timer) [deep]
├── Task 24: FinishedScreen (stats + replay)                                   [quick]
├── Task 25: App.tsx FSM root + screen switcher + scene mount                  [deep]
├── Task 26: localStorage wiring (settings, seen, session restore)             [unspecified-high]
└── Task 27: Vitest unit tests (FSM, CSV, i18n, persist, themes, quality)      [unspecified-high]

Wave 5 (After Wave 4 — polish + deploy readiness):
├── Task 28: README + content-editing guide + deployment docs                  [writing]
├── Task 29: Static-host build config (vercel.json / netlify.toml) + .env example [quick]
├── Task 30: Lint + format pass + AI-slop sweep                                [unspecified-high]
└── Task 31: Final integration smoke (manual dev-server walkthrough via agent) [unspecified-high]

Wave FINAL (After ALL tasks — 4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit                                              [oracle]
├── Task F2: Code quality review                                                [unspecified-high]
├── Task F3: Static-analysis QA (replaces Playwright per AGENTS.md)             [unspecified-high]
└── Task F4: Scope fidelity check                                               [deep]
-> Present results -> Get explicit user okay

Critical Path: T1 → T2 → T9 → T15 → T17 → T23 → T25 → T27 → F1–F4 → user okay
Parallel Speedup: ~70% faster than sequential
Max Concurrent: 7 (Wave 1)
```

### Dependency Matrix

| Task | Depends On                        | Blocks                                      |
| ---- | --------------------------------- | ------------------------------------------- |
| 1    | —                                 | 2, 3, 4, 5, 6, 7 (everything)               |
| 2    | 1                                 | 3, 8, 9, 10, 11, 14, 15, 17, 18, 22, 23, 25 |
| 3    | 1, 2                              | 8, 10, 18, 21, 22                           |
| 4    | 1                                 | 5, 17, 18, 19, 20, 22, 23                   |
| 5    | 1, 4                              | 17, 20, 22, 23                              |
| 6    | 1                                 | 20, 21, 22, 23, 25, 27                      |
| 7    | 1, 2                              | 26, 27                                      |
| 8    | 2, 3                              | 9                                           |
| 9    | 2, 3, 8                           | 23, 25, 27                                  |
| 10   | 2, 3                              | 11, 15, 18                                  |
| 11   | 2, 10                             | 15, 17, 18, 22, 23, 25                      |
| 12   | 1                                 | 13, 15, 16, 17                              |
| 13   | 12                                | 15, 16, 25                                  |
| 14   | 2, 9                              | 23, 25, 27                                  |
| 15   | 2, 11, 12, 13                     | 16, 25                                      |
| 16   | 12, 13, 15                        | 25                                          |
| 17   | 2, 4, 5, 11, 12                   | 23                                          |
| 18   | 3, 4, 11, 21                      | 22                                          |
| 19   | 4                                 | 23                                          |
| 20   | 4, 5, 6                           | 22, 25                                      |
| 21   | 3, 6                              | 18, 22                                      |
| 22   | 3, 4, 5, 6, 11, 18, 20, 21        | 25                                          |
| 23   | 2, 4, 5, 6, 9, 11, 14, 17, 19     | 25                                          |
| 24   | 4, 6                              | 25                                          |
| 25   | 6, 11, 13, 14, 16, 20, 22, 23, 24 | 26, 27, 31                                  |
| 26   | 7, 14, 25                         | 27, 31                                      |
| 27   | 6, 7, 9, 14, 25, 26               | 30, 31                                      |
| 28   | 25, 26                            | F1, F4                                      |
| 29   | 1, 25                             | F1                                          |
| 30   | 27                                | F2                                          |
| 31   | 25, 26, 27                        | F1, F3                                      |
| F1   | All                               | user okay                                   |
| F2   | All                               | user okay                                   |
| F3   | All                               | user okay                                   |
| F4   | All                               | user okay                                   |

### Agent Dispatch Summary

| Wave  | Count | Assignments                                                                                                                                                 |
| ----- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | 7     | T1–T7 → `quick`                                                                                                                                             |
| 2     | 7     | T8 → `unspecified-high`, T9 → `unspecified-high`, T10 → `visual-engineering`, T11 → `quick`, T12 → `quick`, T13 → `unspecified-high`, T14 → `deep`          |
| 3     | 7     | T15 → `visual-engineering`, T16 → `visual-engineering`, T17 → `visual-engineering`, T18 → `visual-engineering`, T19 → `quick`, T20 → `quick`, T21 → `quick` |
| 4     | 6     | T22 → `visual-engineering`, T23 → `deep`, T24 → `quick`, T25 → `deep`, T26 → `unspecified-high`, T27 → `unspecified-high`                                   |
| 5     | 4     | T28 → `writing`, T29 → `quick`, T30 → `unspecified-high`, T31 → `unspecified-high`                                                                          |
| FINAL | 4     | F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`                                                                                |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [x] 1. **Vite scaffold + tsconfig strict + ESLint + Prettier**

  **What to do**:
  - Initialize Vite + React 19 + TypeScript in `provoke-web/` root: `bun create vite . --template react-ts` (or `npm create vite@latest`).
  - Set `tsconfig.json` to: `"strict": true`, `"noUncheckedIndexedAccess": true`, `"target": "ES2022"`, `"jsx": "react-jsx"`, `"moduleResolution": "Bundler"`.
  - Install dev deps: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `prettier`, `eslint-config-prettier`.
  - Create `.eslintrc.cjs` with TS strict rules + react-hooks + prettier integration.
  - Create `.prettierrc` with `{ "semi": true, "singleQuote": true, "trailingComma": "all", "printWidth": 100 }`.
  - Add npm scripts: `dev`, `build`, `preview`, `lint`, `format`.
  - Delete demo boilerplate (App.css, default logos).

  **Must NOT do**:
  - Do NOT initialize git (already up to user); do NOT install Tailwind/shadcn yet (Task 4).
  - Do NOT use `"strictNullChecks": false` or any TS strictness loosening.
  - Do NOT auto-commit.

  **Recommended Agent Profile**:
  - **Category**: `quick` — Reason: Mechanical scaffolding, no design judgment needed.
  - **Skills**: `[]` — No matching skill domain (greenfield init).

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation for everything)
  - **Parallel Group**: Wave 1 — but blocks all other Wave-1 tasks (must finish first)
  - **Blocks**: 2, 3, 4, 5, 6, 7 (all subsequent)
  - **Blocked By**: None

  **References**:
  - Vite React-TS template docs: `https://vitejs.dev/guide/#scaffolding-your-first-vite-project`
  - TypeScript strict + `noUncheckedIndexedAccess`: `https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess` — protects against the prototype's empty-deck crash bug
  - Prototype file (for FSM reference later, not used here): `/Users/macbook/Downloads/thinkdeck_game.html`

  **WHY Each Reference Matters**:
  - `noUncheckedIndexedAccess` flagged by Metis as critical — `deck[idx]` access in original prototype was unguarded.

  **Acceptance Criteria**:
  - [ ] `package.json` exists with `vite`, `react@^19`, `react-dom@^19`, `typescript@^5.5`, `@types/react`, `@types/react-dom`, eslint+prettier deps.
  - [ ] `bun install` (or `npm install`) exits 0 with no peer-dep errors.
  - [ ] `bun run dev` starts dev server, opens, shows default Vite + React page.
  - [ ] `bun run build` exits 0.
  - [ ] `bun run lint` exits 0.
  - [ ] `npx tsc --noEmit` exits 0.
  - [ ] `tsconfig.json` contains `"strict": true` AND `"noUncheckedIndexedAccess": true` (grep must find both).

  **QA Scenarios**:

  ```
  Scenario: Fresh install + build succeeds
    Tool: Bash
    Preconditions: Empty provoke-web/ workspace
    Steps:
      1. Run `bun install` from project root
      2. Run `bun run build` from project root
      3. Verify `dist/index.html` exists and contains a `<script type="module">` tag
    Expected Result: Both commands exit 0; dist/ directory contains assets
    Failure Indicators: Peer-dep warnings, build errors, missing dist/
    Evidence: .sisyphus/evidence/task-1-build-output.txt

  Scenario: TypeScript strict flags enforced
    Tool: Bash
    Preconditions: Task 1 complete
    Steps:
      1. Run `rtk read tsconfig.json | grep -E '"strict"|"noUncheckedIndexedAccess"'`
      2. Assert both flags present and set to true
    Expected Result: Both flags appear with `true` value
    Evidence: .sisyphus/evidence/task-1-tsconfig.txt
  ```

  **Commit**: NO (per AGENTS.md, user explicitly requests)

- [x] 2. **Core type contracts (CategoryId, Level, Phase, Question, GameState, CategoryTheme)**

  **What to do**:
  - Create `src/types/category.ts`:
    ```ts
    export type CategoryId =
      | 'ethics'
      | 'philosophy'
      | 'politics'
      | 'technology'
      | 'law'
      | 'social'
      | 'economy'
      | 'life'
      | 'identity'
      | 'relationship'
      | 'education'
      | 'career'
      | 'environment'
      | 'religion'
      | 'psychology'
      | 'science'
      | 'power'
      | 'future'
      | 'paradox'
      | 'local'
      | 'popculture';
    export const CATEGORY_IDS: readonly CategoryId[] = [
      /* same 21, frozen */
    ] as const;
    ```
  - Create `src/types/level.ts`: `export type Level = 'easy' | 'medium' | 'hard';`
  - Create `src/types/phase.ts`: `export type Phase = 'thinking' | 'hinted' | 'revealed';`
  - Create `src/types/question.ts`:
    ```ts
    export interface Question {
      qid: string;
      category_id: CategoryId;
      level: Level;
      q_en: string;
      hint_en?: string;
      persp_en: string;
      q_id: string;
      hint_id?: string;
      persp_id: string;
    }
    ```
  - Create `src/types/game.ts`:
    ```ts
    export type GameState =
      | { screen: 'home' }
      | {
          screen: 'playing';
          selectedCategories: CategoryId[];
          level: Level | 'all';
          timerDur: number;
          deck: Question[];
          idx: number;
          phase: Phase;
          secs: number;
          running: boolean;
        }
      | { screen: 'finished'; totalSeen: number };
    ```
  - Create `src/types/theme.ts`:
    ```ts
    export interface CategoryTheme {
      id: CategoryId;
      colorPrimary: string; // oklch(...)
      colorSecondary: string;
      colorAccent: string;
      particleColor: string; // hex
      particleSpeed: number; // 0..1
      particleDensityMul: number;
      bloomIntensity: number;
      mood: string;
    }
    ```
  - Create `src/types/index.ts` barrel re-exporting all the above.

  **Must NOT do**:
  - Do NOT use `string` for `CategoryId` (must be literal union for exhaustiveness).
  - Do NOT make `GameState` a flat object with optional fields (must be discriminated union).
  - Do NOT add fields not listed (e.g., no `score`, `streak`).

  **Recommended Agent Profile**:
  - **Category**: `quick` — Mechanical type declaration.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T3–T7 in Wave 1 (after T1)
  - **Parallel Group**: Wave 1
  - **Blocks**: 3, 8, 9, 10, 11, 14, 15, 17, 18, 22, 23, 25
  - **Blocked By**: 1

  **References**:
  - Metis directive (this plan, "Locked Type Contracts" section) — exact shapes specified
  - Prototype `state` object (`thinkdeck_game.html` line 39) — fields to mirror in `GameState['playing']`

  **WHY Each Reference Matters**:
  - The discriminated-union `GameState` eliminates the prototype's empty-deck crash by making invalid states unrepresentable.
  - Literal-union `CategoryId` enables `Record<CategoryId, CategoryTheme>` exhaustiveness check.

  **Acceptance Criteria**:
  - [ ] Files exist: `src/types/{category,level,phase,question,game,theme,index}.ts`.
  - [ ] `CategoryId` is a string literal union of exactly the 21 ids.
  - [ ] `GameState` is a discriminated union with `screen` as discriminant.
  - [ ] `npx tsc --noEmit` exits 0.
  - [ ] Test file `src/types/__tests__/category.test.ts` asserts `CATEGORY_IDS.length === 21`.
  - [ ] `vitest run src/types` passes.

  **QA Scenarios**:

  ```
  Scenario: CategoryId is exhaustive over 21 ids
    Tool: Bash (vitest)
    Preconditions: Task 2 complete
    Steps:
      1. Run `vitest run src/types/__tests__/category.test.ts`
      2. Assert exit 0
      3. Assert `CATEGORY_IDS.length === 21`
    Expected Result: All assertions pass
    Evidence: .sisyphus/evidence/task-2-category-test.txt

  Scenario: GameState discriminated union narrows correctly
    Tool: Bash (tsc)
    Preconditions: Task 2 complete; small test file `src/types/__tests__/game.compile.ts` imports GameState and uses `switch(state.screen)` exhaustively
    Steps:
      1. Run `npx tsc --noEmit`
      2. Verify zero errors
      3. Add intentionally broken switch (omit one case) and re-run, expect "not all paths return"
      4. Revert
    Expected Result: Exhaustive switch compiles, non-exhaustive does not
    Evidence: .sisyphus/evidence/task-2-tsc-output.txt
  ```

  **Commit**: NO

- [x] 3. **Categories data module (21 locked categories with EN/ID labels)**

  **What to do**:
  - Create `src/data/categories.ts` exporting `CATEGORIES: readonly CategoryDef[]`.
  - `CategoryDef` shape:
    ```ts
    interface CategoryDef {
      id: CategoryId;
      label_id: string; // Indonesian display label
      label_en: string; // English display label
      description_id: string;
      description_en: string;
    }
    ```
  - Populate from user's locked list (verbatim copy of the 21 objects user provided in interview). For example:
    - `{ id: 'ethics', label_id: 'Etika', label_en: 'Ethics', description_id: 'Benar vs salah, niat vs dampak, dilema moral', description_en: '<translate from id>' }` — provide English translations of each description.
  - Add a build-time assertion: `if (CATEGORIES.length !== 21) throw new Error(...)`.
  - Add helper `getCategoryById(id: CategoryId): CategoryDef` (uses Map; throws on miss — should be impossible given literal-union typing).

  **Must NOT do**:
  - Do NOT add a 22nd category.
  - Do NOT include theme data (themes are Task 10).
  - Do NOT hardcode label strings into UI components (Task 21 wires labels into i18n).

  **Recommended Agent Profile**:
  - **Category**: `quick` — Static data declaration + minor translation work.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T2, T4–T7 in Wave 1 (after T1)
  - **Parallel Group**: Wave 1
  - **Blocks**: 8, 10, 18, 21, 22
  - **Blocked By**: 1, 2

  **References**:
  - User-provided locked list (in interview answer) — 21 category objects with `id`, `label`, `label_en`, `description`
  - `src/types/category.ts` (Task 2) for `CategoryId` import

  **WHY Each Reference Matters**:
  - The user's locked list is the canonical content. Verbatim copy prevents drift.

  **Acceptance Criteria**:
  - [ ] `src/data/categories.ts` exports `CATEGORIES` of length 21.
  - [ ] Every `CategoryId` literal appears exactly once.
  - [ ] Each entry has non-empty `label_id`, `label_en`, `description_id`, `description_en`.
  - [ ] `vitest run src/data/__tests__/categories.test.ts` passes:
    - asserts length === 21
    - asserts all ids unique
    - asserts all 21 CategoryId literals covered
    - asserts no empty strings
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: All 21 categories present with non-empty fields
    Tool: Bash (vitest)
    Preconditions: Tasks 1, 2 complete
    Steps:
      1. Run `vitest run src/data/__tests__/categories.test.ts`
      2. Assert all category ids match the CategoryId literal union
      3. Assert no description is empty or "TODO"
    Expected Result: All pass
    Evidence: .sisyphus/evidence/task-3-categories-test.txt

  Scenario: Adding a fake category fails type-check
    Tool: Bash (tsc)
    Preconditions: Task 3 complete
    Steps:
      1. Temporarily add `{ id: 'nope', ... }` to CATEGORIES
      2. Run `npx tsc --noEmit`
      3. Assert error: "'nope' is not assignable to CategoryId"
      4. Revert
    Expected Result: Type error
    Evidence: .sisyphus/evidence/task-3-typesafe-error.txt
  ```

  **Commit**: NO

- [x] 4. **Tailwind CSS v4 + shadcn/ui init + tw-animate-css**

  **What to do**:
  - Install: `tailwindcss@^4`, `@tailwindcss/vite`, `tw-animate-css`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`.
  - Configure `vite.config.ts` to include `@tailwindcss/vite` plugin.
  - Create `src/index.css` using Tailwind v4 CSS-first config (`@import "tailwindcss"; @theme { ... }` block with dark-cinematic tokens: `--color-background: oklch(0.08 0 0); --color-foreground: oklch(0.95 0 0); --color-surface: oklch(0.12 0 0); --color-surface-glass: oklch(0.18 0 0 / 0.6); --radius-sm/md/lg`).
  - Run `bunx shadcn@canary init` (or `npx shadcn@canary init`), select: TS + RSC=no + Vite + dark mode default. When prompted for animation package, choose `tw-animate-css` (NOT `tailwindcss-animate`).
  - Verify `components.json` exists and points to `src/components/ui/`.
  - Install initial shadcn components needed later: `button`, `dialog`, `toggle-group`, `tooltip` (via `bunx shadcn@canary add button dialog toggle-group tooltip`).
  - Confirm `tw-animate-css` import is in `src/index.css` (NOT `tailwindcss-animate`).

  **Must NOT do**:
  - Do NOT install `tailwindcss-animate` (deprecated for v4).
  - Do NOT use the v3 `tailwind.config.js`-style config (v4 is CSS-first).
  - Do NOT pull in shadcn's default `accordion`, `sheet`, etc. unless needed (avoid bloat).

  **Recommended Agent Profile**:
  - **Category**: `quick` — Toolchain config.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T2, T3, T5–T7
  - **Parallel Group**: Wave 1
  - **Blocks**: 5, 17, 18, 19, 20, 22, 23
  - **Blocked By**: 1

  **References**:
  - Tailwind v4 docs: `https://tailwindcss.com/docs/v4-beta` — CSS-first config syntax
  - shadcn/ui Vite guide: `https://ui.shadcn.com/docs/installation/vite`
  - `tw-animate-css`: `https://github.com/Wombosvideo/tw-animate-css` (replacement for tailwindcss-animate in v4)
  - Metis directive: explicitly mandates `tw-animate-css`

  **WHY Each Reference Matters**:
  - shadcn defaults to `tailwindcss-animate` which is broken on Tailwind v4. Using `tw-animate-css` is mandatory for the dialog/tooltip animations to work.

  **Acceptance Criteria**:
  - [ ] `package.json` contains `tailwindcss@^4`, `@tailwindcss/vite`, `tw-animate-css`. Does NOT contain `tailwindcss-animate`.
  - [ ] `src/index.css` imports `tailwindcss` and `tw-animate-css`.
  - [ ] `components.json` exists in repo root.
  - [ ] `src/components/ui/button.tsx` exists (shadcn-generated).
  - [ ] `bun run build` exits 0 with Tailwind classes present in output CSS.
  - [ ] Grep: `rg "tailwindcss-animate" .` returns ZERO matches.

  **QA Scenarios**:

  ```
  Scenario: Tailwind v4 + tw-animate-css configured
    Tool: Bash
    Preconditions: Task 4 complete
    Steps:
      1. Run `rtk read package.json | grep -E "tailwindcss|tw-animate-css"`
      2. Assert `tailwindcss@^4.x` AND `tw-animate-css` listed
      3. Assert `tailwindcss-animate` NOT listed
      4. Run `rtk read src/index.css | grep -E "@import"`
      5. Assert both imports present
    Expected Result: All assertions pass
    Evidence: .sisyphus/evidence/task-4-tailwind-config.txt

  Scenario: shadcn button renders + builds
    Tool: Bash
    Preconditions: Task 4 complete
    Steps:
      1. Confirm `src/components/ui/button.tsx` exists
      2. Run `bun run build`
      3. Assert build exits 0
      4. Grep dist/assets/*.css for `bg-primary` or similar Tailwind class
    Expected Result: Build clean, classes present in output CSS
    Evidence: .sisyphus/evidence/task-4-build-output.txt
  ```

  **Commit**: NO

- [x] 5. **Self-hosted fonts (@fontsource/inter, @fontsource/instrument-serif) + font wiring**

  **What to do**:
  - Install: `@fontsource/inter`, `@fontsource/instrument-serif` (variable subsets if available, otherwise weights 400/500/600).
  - Import into `src/main.tsx`:
    ```ts
    import '@fontsource/inter/400.css';
    import '@fontsource/inter/500.css';
    import '@fontsource/inter/600.css';
    import '@fontsource/instrument-serif/400.css';
    ```
  - Add font-family CSS variables to `src/index.css` `@theme`:
    ```css
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-serif: 'Instrument Serif', Georgia, serif;
    ```
  - Set `body { font-family: var(--font-sans); }` in base layer.

  **Must NOT do**:
  - Do NOT add `<link href="https://fonts.googleapis.com/...">` in `index.html` or anywhere.
  - Do NOT use the deprecated `@fontsource/inter/index.css` (use weight-specific imports).

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T2, T3, T6, T7 (waits T4 only because index.css conflicts)
  - **Parallel Group**: Wave 1 (run after T4 settles index.css)
  - **Blocks**: 17, 20, 22, 23
  - **Blocked By**: 1, 4

  **References**:
  - `@fontsource`: `https://fontsource.org/docs/getting-started/install`
  - Metis directive: GDPR — no Google Fonts CDN
  - Inter font: `https://rsms.me/inter/`
  - Instrument Serif: `https://fonts.google.com/specimen/Instrument+Serif` (for visual reference only; we self-host)

  **WHY Each Reference Matters**:
  - Self-hosting avoids GDPR/privacy issues with `fonts.googleapis.com` and improves load reliability.

  **Acceptance Criteria**:
  - [ ] `package.json` lists both `@fontsource/inter` and `@fontsource/instrument-serif`.
  - [ ] `src/main.tsx` imports font CSS files.
  - [ ] `src/index.css` has `--font-sans` and `--font-serif` CSS variables.
  - [ ] Grep: `rg "fonts.googleapis.com" .` returns ZERO matches.
  - [ ] `bun run build` produces font files in `dist/assets/`.

  **QA Scenarios**:

  ```
  Scenario: Fonts self-hosted, no Google CDN
    Tool: Bash
    Preconditions: Task 5 complete
    Steps:
      1. Run `rg "fonts.googleapis.com" .`
      2. Assert ZERO matches across entire repo
      3. Run `rg "@fontsource/(inter|instrument-serif)" src/main.tsx`
      4. Assert at least 2 imports present
    Expected Result: No Google CDN refs; fontsource imports present
    Evidence: .sisyphus/evidence/task-5-fonts.txt

  Scenario: Built dist contains font files
    Tool: Bash
    Preconditions: Task 5 complete
    Steps:
      1. Run `bun run build`
      2. List `dist/assets/*.woff2` files
      3. Assert at least 4 font files (3 Inter weights + 1 Instrument Serif)
    Expected Result: Font files emitted into dist/
    Evidence: .sisyphus/evidence/task-5-dist-fonts.txt
  ```

  **Commit**: NO

- [x] 6. **i18next setup + EN/ID translation skeletons (UI strings only)**

  **What to do**:
  - Install: `i18next`, `react-i18next`, `i18next-browser-languagedetector`.
  - Create `src/i18n/index.ts`:

    ```ts
    import i18n from 'i18next';
    import { initReactI18next } from 'react-i18next';
    import LanguageDetector from 'i18next-browser-languagedetector';
    import en from '../../public/locales/en/translation.json';
    import id from '../../public/locales/id/translation.json';

    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources: { en: { translation: en }, id: { translation: id } },
        fallbackLng: 'en',
        supportedLngs: ['en', 'id'],
        saveMissing: false,
        interpolation: { escapeValue: false },
        detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: 'provoke_v1_lang' },
      });
    export default i18n;
    ```

  - Create `public/locales/en/translation.json` and `public/locales/id/translation.json` with keys:
    - `app.title`, `app.tagline`
    - `home.level.label`, `home.level.easy/medium/hard/all`
    - `home.timer.label`, `home.timer.1min/2min/3min/free`
    - `home.start`, `home.cards_available`
    - `home.categories.label`, `home.categories.select_all`, `home.categories.clear`
    - `play.hint`, `play.reveal`, `play.next`, `play.finish`
    - `play.perspective_title`
    - `finished.title`, `finished.cards_played`, `finished.play_again`
    - `lang.toggle.en`, `lang.toggle.id`
  - Import `src/i18n/index.ts` from `src/main.tsx` BEFORE `App` mount.

  **Must NOT do**:
  - Do NOT add namespaces (single `translation` namespace is enough for <200 keys).
  - Do NOT add `saveMissing: true`.
  - Do NOT put question/hint/perspective content in i18n JSON (CSV owns that).
  - Do NOT add a 3rd language.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T2, T3, T5, T7
  - **Parallel Group**: Wave 1
  - **Blocks**: 20, 21, 22, 23, 25, 27
  - **Blocked By**: 1

  **References**:
  - react-i18next: `https://react.i18next.com/getting-started`
  - LanguageDetector: `https://github.com/i18next/i18next-browser-languageDetector`
  - Metis directive: `fallbackLng: 'en'`, `saveMissing: false`, single namespace

  **WHY Each Reference Matters**:
  - LanguageDetector reads from localStorage key `provoke_v1_lang` for persistence — aligns with Task 7 key manifest.

  **Acceptance Criteria**:
  - [ ] `src/i18n/index.ts` exists with i18n config matching spec.
  - [ ] `public/locales/{en,id}/translation.json` both exist with key parity.
  - [ ] `vitest run src/i18n/__tests__/i18n.test.ts` covers:
    - missing ID key falls back to EN
    - language switch updates `i18n.language`
    - `saveMissing` is false
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: EN/ID translation files have key parity
    Tool: Bash (vitest)
    Preconditions: Task 6 complete
    Steps:
      1. Run test that diffs key sets of en/translation.json and id/translation.json
      2. Assert symmetric difference is empty
    Expected Result: Key sets identical
    Evidence: .sisyphus/evidence/task-6-key-parity.txt

  Scenario: Missing ID key falls back to EN
    Tool: Bash (vitest)
    Preconditions: Task 6 complete; test injects a key into EN only
    Steps:
      1. Set i18n language to 'id'
      2. Call `t('test.only_en')`
      3. Assert returned value matches EN translation
    Expected Result: Fallback returns EN value
    Evidence: .sisyphus/evidence/task-6-fallback.txt
  ```

  **Commit**: NO

- [x] 7. **localStorage key manifest + Zod-guarded persist helpers**

  **What to do**:
  - Install: `zod`.
  - Create `src/store/keys.ts`:
    ```ts
    export const STORAGE_KEYS = {
      settings: 'provoke_v1_settings',
      seen: 'provoke_v1_seen',
      session: 'provoke_v1_session',
      lang: 'provoke_v1_lang',
    } as const;
    export const SCHEMA_VERSION = 'v1' as const;
    ```
  - Create `src/store/persist.ts` with:
    - `SettingsSchema` (Zod): `{ language: 'en'|'id', reducedMotion: boolean, qualityTier: 'high'|'medium'|'low'|'none' }`
    - `SeenSchema`: `Record<CategoryId, string[]>`
    - `SessionSchema`: matches `GameState['playing']` (Question array, etc.)
    - `readSettings()`, `writeSettings(s)`, `readSeen()`, `writeSeen(...)`, `readSession()`, `writeSession()`, `clearSession()` — all using try/catch + Zod parse, returning safe defaults on failure.
    - `migrateIfNeeded()`: stub for future v2 migration (currently no-op for v1).
  - Add unit tests in `src/store/__tests__/persist.test.ts`:
    - read empty → default
    - read garbage JSON → default + no throw
    - read schema-invalid → default + no throw
    - write then read round-trips
    - clear deletes

  **Must NOT do**:
  - Do NOT throw on read failure; always return safe defaults.
  - Do NOT create ad-hoc localStorage keys outside the manifest.
  - Do NOT use `JSON.parse` without Zod validation.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T2–T6
  - **Parallel Group**: Wave 1
  - **Blocks**: 26, 27
  - **Blocked By**: 1, 2

  **References**:
  - Zod docs: `https://zod.dev`
  - Metis directive: "localStorage key contracts" — exact manifest specified
  - `src/types/game.ts` (Task 2) for SessionSchema shape

  **WHY Each Reference Matters**:
  - Zod validation at the persistence boundary prevents corrupted localStorage from crashing the FSM.

  **Acceptance Criteria**:
  - [ ] `src/store/keys.ts` defines exactly 4 keys, all prefixed `provoke_v1_`.
  - [ ] `src/store/persist.ts` exports typed read/write helpers for each.
  - [ ] All read helpers return defaults (not throw) on corrupt input.
  - [ ] `vitest run src/store/__tests__/persist.test.ts` passes ≥5 tests covering happy + corrupt + missing paths.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: Corrupt localStorage falls back to defaults
    Tool: Bash (vitest)
    Preconditions: Task 7 complete
    Steps:
      1. Pre-populate localStorage `provoke_v1_settings` with "{invalid"
      2. Call `readSettings()`
      3. Assert default value returned (no throw)
    Expected Result: No crash; defaults returned
    Evidence: .sisyphus/evidence/task-7-corrupt-read.txt

  Scenario: Write/read round-trip preserves data
    Tool: Bash (vitest)
    Preconditions: Task 7 complete
    Steps:
      1. Call `writeSettings({ language: 'id', reducedMotion: true, qualityTier: 'low' })`
      2. Call `readSettings()`
      3. Assert deep equal to written value
    Expected Result: Equal
    Evidence: .sisyphus/evidence/task-7-roundtrip.txt
  ```

  **Commit**: NO

- [x] 8. **CSV schema + seed file (5–10 questions per cat × level)**

  **What to do**:
  - Create `src/data/questions.csv` with header row: `qid,category_id,level,q_en,hint_en,persp_en,q_id,hint_id,persp_id`.
  - Generate seed questions: 5 per (category × level) = 5 × 21 × 3 = **315 rows minimum**. Aim for 5–10 per cat/level (315–630 total).
  - Each row's `qid` MUST be unique. Recommended format: `{category_id}-{level}-{seq}` (e.g., `ethics-easy-01`).
  - For seed content sources:
    - Port the 12 prototype questions verbatim (map prototype categories: Etika→ethics, Kehidupan→life, Teknologi→technology, Ekonomi→economy, Politik→politics, Hukum→law, Sosial→social, Filsafat→philosophy, Identitas→identity).
    - Author new questions in EN first, then translate to ID — OR vice versa — pick one direction and stay consistent per row.
    - Each question = thought-provoking single-sentence prompt (max ~200 chars).
    - Each hint = ~1 sentence guiding the thinker (optional column — leave blank if no hint).
    - Each perspective = ~3–5 sentences with named thinkers/research where appropriate (mirrors prototype style).
  - Escape CSV properly: wrap fields with commas/quotes in `"`, escape inner quotes as `""`.

  **Must NOT do**:
  - Do NOT include all 3,150 questions in this task (only seed).
  - Do NOT use a category id outside the 21 locked ones.
  - Do NOT use a level outside `easy|medium|hard`.
  - Do NOT leave required fields (`qid`, `category_id`, `level`, `q_en`, `q_id`, `persp_en`, `persp_id`) empty.
  - Do NOT introduce duplicate `qid`.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` — Substantial content authoring + translation work.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T10, T11, T12, T13, T14 in Wave 2
  - **Parallel Group**: Wave 2
  - **Blocks**: 9
  - **Blocked By**: 2, 3

  **References**:
  - Prototype 12 cards: `/Users/macbook/Downloads/thinkdeck_game.html` lines 15–28 (use as seed for matching categories).
  - `src/data/categories.ts` (Task 3) — canonical category metadata for tone/scope.
  - `src/types/question.ts` (Task 2) — Question schema.

  **WHY Each Reference Matters**:
  - Porting the prototype's 12 questions verbatim preserves continuity for users who saw the prototype.
  - Category descriptions define the tone of each batch.

  **Acceptance Criteria**:
  - [ ] `src/data/questions.csv` exists.
  - [ ] Has exactly 9 header columns: `qid,category_id,level,q_en,hint_en,persp_en,q_id,hint_id,persp_id`.
  - [ ] Row count ≥ 315 (5 × 21 × 3).
  - [ ] All `qid` values are unique.
  - [ ] All `category_id` values appear in the locked 21.
  - [ ] All `level` values are exactly `easy`, `medium`, or `hard`.
  - [ ] No required field is empty.
  - [ ] Validation script `node scripts/validate-csv.mjs` exits 0 (this script lives in Task 9 but the CSV must satisfy its constraints).

  **QA Scenarios**:

  ```
  Scenario: CSV row count + uniqueness
    Tool: Bash
    Preconditions: Task 8 complete
    Steps:
      1. Run `wc -l src/data/questions.csv` (excl header)
      2. Assert >= 316 (315 + header)
      3. Run `awk -F, 'NR>1{print $1}' src/data/questions.csv | sort | uniq -d | wc -l`
      4. Assert 0 (no duplicate qids)
    Expected Result: Both pass
    Evidence: .sisyphus/evidence/task-8-csv-counts.txt

  Scenario: Every category and level covered
    Tool: Bash
    Preconditions: Task 8 complete
    Steps:
      1. Extract unique (category_id, level) pairs from CSV
      2. Assert all 21 × 3 = 63 combinations present
      3. Assert each combination has >= 5 rows
    Expected Result: 63/63 coverage; min 5 each
    Evidence: .sisyphus/evidence/task-8-coverage.txt
  ```

  **Commit**: NO

- [x] 9. **CSV → generated TS pipeline (prebuild hook, Zod, qid uniqueness)**

  **What to do**:
  - Create `scripts/parse-csv.ts`:
    - Read `src/data/questions.csv`.
    - Parse with `papaparse` (install as dev dep).
    - Validate each row with Zod `QuestionRowSchema`.
    - Assert: all `qid` unique; all `category_id` in `CATEGORY_IDS`; all `level` in `['easy','medium','hard']`.
    - Emit `src/data/questions.generated.ts` exporting `export const QUESTIONS: readonly Question[] = [...] as const;` plus `export const QUESTION_COUNT = N;`.
    - Add file header `// AUTOGENERATED — do not edit. Source: src/data/questions.csv` and timestamp.
  - Create `scripts/validate-csv.mjs` (lightweight standalone): same validation logic, no codegen, used by F1 reviewer and CI.
  - Wire `package.json`:
    ```json
    "scripts": {
      "prebuild": "tsx scripts/parse-csv.ts",
      "predev":   "tsx scripts/parse-csv.ts",
      "csv:validate": "node scripts/validate-csv.mjs"
    }
    ```
  - Install `tsx` and `papaparse` + `@types/papaparse` as dev deps.
  - Commit `src/data/questions.generated.ts` (NOT gitignored — repo is self-contained per Metis).
  - Add unit tests `src/data/__tests__/questions.test.ts`: assert generated file imports cleanly, every category × level has ≥1 question, no duplicate qids.

  **Must NOT do**:
  - Do NOT gitignore `src/data/questions.generated.ts`.
  - Do NOT use `as Question[]` casting — Zod parse only.
  - Do NOT make this a manual-only script (must run on `prebuild` and `predev`).
  - Do NOT skip qid uniqueness check.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` — Build-script logic + Zod schemas.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T10–T14 (after T8 finishes CSV seed)
  - **Parallel Group**: Wave 2
  - **Blocks**: 23, 25, 27
  - **Blocked By**: 2, 3, 8

  **References**:
  - `papaparse`: `https://www.papaparse.com/docs#csv-to-json`
  - Zod schemas — see Task 7
  - Metis directive: "CSV pipeline must be a `prebuild` npm hook"; rename `id` column → `qid`

  **WHY Each Reference Matters**:
  - The `prebuild` hook ensures CI never ships stale generated data.
  - Committing the generated file means deployments don't require a build step for content review.

  **Acceptance Criteria**:
  - [ ] `scripts/parse-csv.ts` exists and runs via `tsx`.
  - [ ] `scripts/validate-csv.mjs` exists and runs via `node`.
  - [ ] `package.json` has `prebuild` and `predev` hooks both invoking the parser.
  - [ ] Running `bun run prebuild` produces `src/data/questions.generated.ts` with valid TS.
  - [ ] Duplicate qid in CSV causes `prebuild` to exit non-zero with clear error.
  - [ ] Unknown `category_id` in CSV causes `prebuild` to exit non-zero.
  - [ ] `vitest run src/data/__tests__/questions.test.ts` passes.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: prebuild regenerates and TS compiles
    Tool: Bash
    Preconditions: Tasks 8, 9 complete
    Steps:
      1. Delete `src/data/questions.generated.ts`
      2. Run `bun run prebuild`
      3. Assert file regenerated
      4. Run `npx tsc --noEmit`
      5. Assert exit 0
    Expected Result: Generation + compile both clean
    Evidence: .sisyphus/evidence/task-9-prebuild.txt

  Scenario: Duplicate qid is rejected
    Tool: Bash
    Preconditions: Task 9 complete; temp-duplicate first qid in CSV
    Steps:
      1. Duplicate first row's qid into another row
      2. Run `bun run prebuild`
      3. Assert exit non-zero with message mentioning "duplicate qid"
      4. Revert CSV
    Expected Result: Pipeline errors out clearly on dup
    Evidence: .sisyphus/evidence/task-9-dup-rejected.txt
  ```

  **Commit**: NO

- [x] 10. **21 CategoryTheme objects (colors, particle configs, mood)**

  **What to do**:
  - Create `src/data/themes.ts`:
    ```ts
    import type { CategoryTheme } from '../types';
    export const THEMES: Record<CategoryId, CategoryTheme> = { ... };
    ```
  - Design 21 themes. Each theme:
    - `colorPrimary`, `colorSecondary`, `colorAccent` in **oklch()** color space.
    - `particleColor` as hex (`#RRGGBB`) — used by Three.js Color.
    - `particleSpeed` (0..1) — relative speed multiplier.
    - `particleDensityMul` (0.5..1.5) — multiplier on base count.
    - `bloomIntensity` (0.0..1.5).
    - `mood` (short documentation string e.g., "contemplative", "tense", "ethereal").
  - Suggested mood mapping (executor may refine):
    | id | mood | base color hue |
    |---|---|---|
    | ethics | contemplative | warm amber |
    | philosophy | ethereal | violet |
    | politics | tense | red-orange |
    | technology | crystalline | cyan |
    | law | structured | deep blue |
    | social | warm | rose |
    | economy | grounded | green |
    | life | luminous | gold |
    | identity | introspective | indigo |
    | relationship | gentle | pink |
    | education | curious | teal |
    | career | driven | orange |
    | environment | organic | emerald |
    | religion | reverent | royal purple |
    | psychology | reflective | magenta |
    | science | precise | electric blue |
    | power | imposing | deep crimson |
    | future | luminescent | neon cyan |
    | paradox | dizzying | iridescent magenta+cyan |
    | local | earthy | warm terracotta |
    | popculture | vibrant | hot pink |
  - Add unit tests `src/data/__tests__/themes.test.ts`:
    - assert exactly 21 keys
    - assert every `CategoryId` literal mapped
    - assert no `colorPrimary` undefined
    - assert `particleSpeed` ∈ [0, 1]
    - assert `bloomIntensity` ∈ [0, 1.5]

  **Must NOT do**:
  - Do NOT skip any of the 21 categories.
  - Do NOT use plain rgb()/hex for `colorPrimary` (oklch only).
  - Do NOT add a `font` field (typography is global, not per-theme).
  - Do NOT make themes mutable.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — Color/visual design judgment.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T8, T9, T11–T14
  - **Parallel Group**: Wave 2
  - **Blocks**: 11, 15, 18
  - **Blocked By**: 2, 3

  **References**:
  - oklch color space: `https://oklch.com/`
  - Metis directive: `CategoryTheme` interface (see Task 2)
  - Prototype `LS` color tokens: `thinkdeck_game.html` lines 30–34 (color palette inspiration)

  **WHY Each Reference Matters**:
  - oklch ensures perceptually-uniform color across themes — no jarring brightness shifts between categories.

  **Acceptance Criteria**:
  - [ ] `src/data/themes.ts` exports `THEMES: Record<CategoryId, CategoryTheme>` with 21 entries.
  - [ ] Every `CategoryId` literal has a theme (TypeScript enforces this via `Record<CategoryId, ...>` — verify with `Object.keys(THEMES).length === 21`).
  - [ ] All colors use `oklch()` for the three palette colors.
  - [ ] `vitest run src/data/__tests__/themes.test.ts` passes ≥5 assertions.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: All 21 categories have themes
    Tool: Bash (vitest)
    Preconditions: Task 10 complete
    Steps:
      1. Run `vitest run src/data/__tests__/themes.test.ts`
      2. Assert all CATEGORY_IDS map to a theme
      3. Assert no undefined values in any theme field
    Expected Result: All pass
    Evidence: .sisyphus/evidence/task-10-themes-test.txt

  Scenario: Adding 22nd id without theme fails compile
    Tool: Bash
    Preconditions: Task 10 complete
    Steps:
      1. Temporarily add `'nope'` to CategoryId union
      2. Run `npx tsc --noEmit`
      3. Assert error: `THEMES` missing key 'nope'
      4. Revert
    Expected Result: Type error
    Evidence: .sisyphus/evidence/task-10-typesafe.txt
  ```

  **Commit**: NO

- [x] 11. **Theme context provider + useTheme() hook**

  **What to do**:
  - Create `src/three/ThemeProvider.tsx`:
    ```tsx
    const ThemeContext = createContext<{ theme: CategoryTheme; setCategoryId: (id: CategoryId | null) => void }>(...);
    export function ThemeProvider({ children, fallbackId = 'philosophy' }: { children: React.ReactNode; fallbackId?: CategoryId }) { ... }
    export function useTheme() { ... }
    ```
  - On `null` category (e.g., home screen with no specific category active), use `fallbackId` theme.
  - The provider does NOT trigger React re-renders for particle param changes — instead exposes a `themeRef: React.RefObject<CategoryTheme>` that the R3F particle system reads in `useFrame` (so uniform/attribute swaps happen without React reconciliation).
  - Add unit tests for: hook returns theme for known id; fallback works on null; switching ids updates context.

  **Must NOT do**:
  - Do NOT cause full scene unmount/remount on category change (use ref-based access).
  - Do NOT memoize incorrectly such that stale themes leak.

  **Recommended Agent Profile**:
  - **Category**: `quick` — Context API pattern.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T8, T9, T10 (depends T10 only)
  - **Parallel Group**: Wave 2
  - **Blocks**: 15, 17, 18, 22, 23, 25
  - **Blocked By**: 2, 10

  **References**:
  - React context patterns: `https://react.dev/reference/react/createContext`
  - Metis directive: "Theme switching must be a context value" + "uniform/attribute swap, not remount"
  - `src/data/themes.ts` (Task 10)

  **WHY Each Reference Matters**:
  - The ref-based read pattern is the only way to update particle uniforms without re-rendering the entire scene tree.

  **Acceptance Criteria**:
  - [ ] `src/three/ThemeProvider.tsx` exists with provider + hook.
  - [ ] `useTheme()` returns `{ theme, setCategoryId }`.
  - [ ] `themeRef` ref is exposed for R3F consumers.
  - [ ] `vitest run src/three/__tests__/ThemeProvider.test.tsx` covers: known id, fallback, switching.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: useTheme returns correct theme for category
    Tool: Bash (vitest)
    Preconditions: Task 11 complete
    Steps:
      1. Render ThemeProvider with setCategoryId('ethics')
      2. Call useTheme().theme.id
      3. Assert === 'ethics'
    Expected Result: Theme matches set category
    Evidence: .sisyphus/evidence/task-11-useTheme.txt

  Scenario: Null category falls back to default
    Tool: Bash (vitest)
    Preconditions: Task 11 complete
    Steps:
      1. Render ThemeProvider, setCategoryId(null)
      2. Assert theme.id === 'philosophy' (default)
    Expected Result: Fallback theme returned
    Evidence: .sisyphus/evidence/task-11-fallback.txt
  ```

  **Commit**: NO

- [x] 12. **useQualityTier() hook (DPR, hardwareConcurrency, reduced-motion)**

  **What to do**:
  - Create `src/three/useQualityTier.ts`:
    ```ts
    export type QualityTier = 'high' | 'medium' | 'low' | 'none';
    export function useQualityTier(): QualityTier { ... }
    ```
  - Logic:
    - If `matchMedia('(prefers-reduced-motion: reduce)').matches` → `'none'` (return early).
    - If `matchMedia('(max-width: 768px)').matches` AND `navigator.hardwareConcurrency < 4` → `'low'`.
    - If `matchMedia('(max-width: 768px)').matches` OR `navigator.hardwareConcurrency < 4` → `'medium'`.
    - Else (`hardwareConcurrency >= 8`) → `'high'`.
    - Else → `'medium'`.
  - Listen to `matchMedia('change')` events to update tier reactively.
  - Add unit tests with mocked `matchMedia` + `navigator.hardwareConcurrency`:
    - `prefers-reduced-motion: reduce` → `'none'`
    - desktop with hwConc=12 → `'high'`
    - mobile with hwConc=2 → `'low'`
    - mobile with hwConc=8 → `'medium'`

  **Must NOT do**:
  - Do NOT let individual components do their own `isMobile` checks (must consume this hook).
  - Do NOT forget the change-listener cleanup in `useEffect`.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T8–T11, T13, T14
  - **Parallel Group**: Wave 2
  - **Blocks**: 13, 15, 16, 17
  - **Blocked By**: 1

  **References**:
  - `matchMedia`: `https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia`
  - Metis directive: "Define the quality detection logic once and export it as a hook" — exact tier ladder spec'd

  **WHY Each Reference Matters**:
  - Single source of truth for quality detection prevents inconsistent behavior across components.

  **Acceptance Criteria**:
  - [ ] `src/three/useQualityTier.ts` exists and exports `useQualityTier()` + `QualityTier` type.
  - [ ] All four tiers (`high|medium|low|none`) are reachable.
  - [ ] `prefers-reduced-motion: reduce` always returns `'none'`.
  - [ ] `vitest run src/three/__tests__/useQualityTier.test.ts` passes ≥4 mocked-environment tests.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: prefers-reduced-motion forces 'none' tier
    Tool: Bash (vitest)
    Preconditions: Task 12 complete; matchMedia mocked
    Steps:
      1. Mock `matchMedia('(prefers-reduced-motion: reduce)').matches = true`
      2. Render hook
      3. Assert returned tier === 'none'
    Expected Result: 'none' returned
    Evidence: .sisyphus/evidence/task-12-reduced-motion.txt

  Scenario: High-end desktop returns 'high'
    Tool: Bash (vitest)
    Preconditions: Task 12 complete
    Steps:
      1. Mock matchMedia(max-width 768px)=false; hardwareConcurrency=12; reduced-motion=false
      2. Render hook
      3. Assert tier === 'high'
    Expected Result: 'high' returned
    Evidence: .sisyphus/evidence/task-12-high-tier.txt
  ```

  **Commit**: NO

- [x] 13. **R3F Canvas wrapper (Scene.tsx) — aria-hidden, dpr=[1,1], context-loss handler**

  **What to do**:
  - Install: `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/test-renderer` (dev), `vitest-canvas-mock` (dev).
  - Create `src/three/Scene.tsx`:
    ```tsx
    import { Canvas } from '@react-three/fiber';
    export function Scene({ children }: { children: React.ReactNode }) {
      return (
        <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
          <Canvas
            dpr={[1, 1]}
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                // future: dispatch event to react tree to show static fallback
              });
            }}
            role="presentation"
          >
            {children}
          </Canvas>
        </div>
      );
    }
    ```
  - The canvas must be `position: fixed; z-index: -10`, never receive pointer events (`pointer-events-none`), and never receive focus.
  - When `useQualityTier()` returns `'none'`, render a static CSS gradient div instead of the Canvas — same fixed positioning.
  - Add unit test `src/three/__tests__/Scene.test.tsx`: render Scene with `useQualityTier='none'`, assert no `<canvas>` element present.

  **Must NOT do**:
  - Do NOT use `dpr={[1, 2]}` or any value above 1 (iOS WebGL context loss).
  - Do NOT omit `aria-hidden="true"` and `role="presentation"`.
  - Do NOT allow pointer-events on the canvas.
  - Do NOT mount the Canvas if tier is `'none'`.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` — R3F + accessibility nuances.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T8–T11, T14 (depends T12)
  - **Parallel Group**: Wave 2
  - **Blocks**: 15, 16, 25
  - **Blocked By**: 12

  **References**:
  - react-three-fiber Canvas: `https://docs.pmnd.rs/react-three-fiber/api/canvas`
  - Metis directive: `dpr=[1,1]`, `aria-hidden`, `role="presentation"`, context-loss handler
  - iOS WebGL context loss: known issue with high DPR on Safari

  **WHY Each Reference Matters**:
  - `dpr=[1,1]` is the single most important mobile-perf line in the whole codebase.

  **Acceptance Criteria**:
  - [ ] `src/three/Scene.tsx` exists.
  - [ ] `dpr={[1, 1]}` literally present (grep can find).
  - [ ] `aria-hidden="true"` present on wrapping div.
  - [ ] `role="presentation"` present on Canvas.
  - [ ] `webglcontextlost` listener registered.
  - [ ] When `useQualityTier()` returns `'none'`, Scene renders a div with `bg-gradient-*` instead of Canvas.
  - [ ] `vitest run src/three/__tests__/Scene.test.tsx` passes ≥2 tests.

  **QA Scenarios**:

  ```
  Scenario: DPR is hardcoded to [1,1]
    Tool: Bash
    Preconditions: Task 13 complete
    Steps:
      1. Run `rg "dpr=" src/three/Scene.tsx`
      2. Assert match `dpr={[1, 1]}` (or `dpr={[1,1]}`)
      3. Assert NO match for `dpr={[1, 2]}` or higher
    Expected Result: Only [1,1] present
    Evidence: .sisyphus/evidence/task-13-dpr.txt

  Scenario: Reduced motion uses static gradient
    Tool: Bash (vitest)
    Preconditions: Task 13 complete
    Steps:
      1. Mock useQualityTier to return 'none'
      2. Render Scene
      3. Assert no <canvas> element; assert gradient div present
    Expected Result: Static fallback rendered
    Evidence: .sisyphus/evidence/task-13-fallback.txt
  ```

  **Commit**: NO

- [x] 14. **Game store / FSM reducer (discriminated union transitions)**

  **What to do**:
  - Choose between Zustand or React `useReducer` — executor may choose; both acceptable. **Recommended: Zustand** for cleaner cross-component access without prop drilling. If choosing Zustand, install it (`bun add zustand`).
  - Create `src/store/game.store.ts` exposing `useGameStore` (or equivalent).
  - State shape = `GameState` (Task 2 discriminated union).
  - Actions:
    - `start(selectedCategories, level, timerDur)` → 'home' → 'playing' (shuffle deck from `QUESTIONS` filtered by categories/level)
    - `revealPerspective()` → phase: thinking|hinted → revealed; sets `running=false`
    - `showHint()` → phase: thinking → hinted
    - `nextCard()` → idx++, phase=thinking; if past end → 'finished'
    - `tick()` → secs--; at 0, set `running=false` (cosmetic; no auto-advance)
    - `replay()` → 'finished' → 'home'
    - `quit()` → any → 'home'
  - All transitions return new discriminated-union states (no in-place mutation; if Zustand, use immer middleware).
  - Add unit tests in `src/store/__tests__/game.store.test.ts` covering each transition + invalid-transition guards (e.g., calling `revealPerspective()` from 'home' is a no-op or throws).

  **Must NOT do**:
  - Do NOT use `any` or cast to narrow state — switch on `state.screen`.
  - Do NOT mutate state directly outside an immer producer.
  - Do NOT introduce score/streak/leaderboard fields.
  - Do NOT make the timer auto-advance (cosmetic only per spec).

  **Recommended Agent Profile**:
  - **Category**: `deep` — FSM logic with type-narrowing concerns.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T8–T13 (depends T2, T9)
  - **Parallel Group**: Wave 2
  - **Blocks**: 23, 25, 27
  - **Blocked By**: 2, 9

  **References**:
  - Prototype FSM: `thinkdeck_game.html` lines 39–76 (functions: `setState`, `startGame`, `doReveal`, `showHint`, `nextCard`, `startTimer`)
  - Zustand: `https://zustand-demo.pmnd.rs/`
  - `src/types/game.ts` (Task 2) for `GameState`
  - `src/data/questions.generated.ts` (Task 9) for `QUESTIONS` source

  **WHY Each Reference Matters**:
  - Faithful port of prototype FSM preserves the proven UX flow; discriminated union eliminates the prototype's empty-deck crash.

  **Acceptance Criteria**:
  - [ ] `src/store/game.store.ts` exists with all 7 actions.
  - [ ] State transitions are pure (no mutation outside immer/setState).
  - [ ] Discriminated union narrowed via `switch(state.screen)` — no casts.
  - [ ] `vitest run src/store/__tests__/game.store.test.ts` covers ≥7 transition tests + ≥2 invalid-transition tests.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: start transitions home -> playing with shuffled deck
    Tool: Bash (vitest)
    Preconditions: Task 14 complete
    Steps:
      1. Store starts in screen='home'
      2. Call start(['ethics'], 'easy', 120)
      3. Assert state.screen === 'playing'
      4. Assert state.deck.length >= 5
      5. Assert state.deck[0].category_id === 'ethics'
    Expected Result: All assertions pass
    Evidence: .sisyphus/evidence/task-14-start.txt

  Scenario: Past last card transitions to finished
    Tool: Bash (vitest)
    Preconditions: Task 14 complete; deck of 3 cards
    Steps:
      1. Call nextCard() 3 times
      2. Assert state.screen === 'finished'
      3. Assert state.totalSeen === 3
    Expected Result: Finished state with correct count
    Evidence: .sisyphus/evidence/task-14-finished.txt
  ```

  **Commit**: NO

- [x] 15. **Particles component (constellation/dust, uniform swap on theme)**

  **What to do**:
  - Create `src/three/Particles.tsx` rendering a `<points>` mesh + `<bufferGeometry>` + `<pointsMaterial>` (or custom shader material if needed for the connecting-line effect).
  - Base counts per tier (use in `useMemo` with `useQualityTier()`):
    - `high`: 60,000 points
    - `medium`: 20,000 points
    - `low`: 5,000 points
    - `none`: component not rendered (Scene returns static gradient instead)
  - Apply theme via uniforms / attributes — NOT via remount:
    - Read `themeRef` (Task 11) inside `useFrame`.
    - Update material `color` uniform to `themeRef.current.particleColor`.
    - Update motion speed by `themeRef.current.particleSpeed`.
    - Update geometry instance scale by `themeRef.current.particleDensityMul`.
  - Constellation effect: faint connecting lines between near-neighbor particles, rendered as a `<lineSegments>` with `LineBasicMaterial` (alpha ~0.15).
  - Slow drift via `useFrame((_, dt) => { ... })`.
  - Cleanup on unmount: dispose geometry, material, any custom shaders.
  - Add unit test using `@react-three/test-renderer`: render Particles inside a `createRoot()` test renderer, assert geometry vertex count matches expected for tier, assert dispose is called on unmount.

  **Must NOT do**:
  - Do NOT remount the entire scene when category changes — use refs.
  - Do NOT use particle counts above 60k.
  - Do NOT skip dispose calls.
  - Do NOT use `@testing-library/react` alone — must use `@react-three/test-renderer`.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — Visual + performance balance.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T16, T17, T18 in Wave 3
  - **Parallel Group**: Wave 3
  - **Blocks**: 16, 25
  - **Blocked By**: 2, 11, 12, 13

  **References**:
  - drei `Points` helper: `https://github.com/pmndrs/drei?tab=readme-ov-file#points`
  - Three.js BufferGeometry: `https://threejs.org/docs/#api/en/core/BufferGeometry`
  - Metis directive: tier counts `{ high: 60000, medium: 20000, low: 5000 }`
  - Constellation example: `https://threejs.org/examples/#webgl_points_dynamic` (inspiration)

  **WHY Each Reference Matters**:
  - The uniform/attribute swap pattern is the only way to retheme without re-creating the GPU buffers each category change (which would cause a multi-frame freeze).

  **Acceptance Criteria**:
  - [ ] `src/three/Particles.tsx` exists.
  - [ ] Particle count derives from `useQualityTier()` (3 tiers, none = unmounted).
  - [ ] Theme changes happen via ref-based uniform updates (grep confirms `useFrame` reads `themeRef.current`).
  - [ ] Cleanup disposes geometry + material on unmount.
  - [ ] `vitest run src/three/__tests__/Particles.test.tsx` (using `@react-three/test-renderer`) passes.
  - [ ] No `DepthOfField` import (Bloom only — that's Task 16).

  **QA Scenarios**:

  ```
  Scenario: Particle count matches tier
    Tool: Bash (vitest with R3F test-renderer)
    Preconditions: Task 15 complete; mock useQualityTier='high'
    Steps:
      1. Render Particles in createRoot test renderer
      2. Inspect scene; locate <points>
      3. Assert geometry.attributes.position.count === 60000
    Expected Result: 60000 verts at high tier
    Evidence: .sisyphus/evidence/task-15-high-count.txt

  Scenario: Theme change does NOT remount scene
    Tool: Bash (vitest)
    Preconditions: Task 15 complete
    Steps:
      1. Render Particles with theme=ethics
      2. Track the points mesh ref/uuid
      3. Change theme to philosophy via context
      4. Assert mesh uuid unchanged (same instance)
    Expected Result: No remount; same THREE.Object3D instance
    Evidence: .sisyphus/evidence/task-15-no-remount.txt
  ```

  **Commit**: NO

- [x] 16. **Postprocessing (Bloom only, quality-gated)**

  **What to do**:
  - Create `src/three/postprocessing.ts` exporting `<PostFX />` component.
  - Use `@react-three/postprocessing`'s `EffectComposer` + `Bloom`.
  - Bloom intensity derived from `useTheme().theme.bloomIntensity`.
  - Gate by `useQualityTier()`:
    - `high`: full Bloom enabled
    - `medium`: Bloom with reduced intensity (`× 0.6`)
    - `low`: Bloom disabled
    - `none`: component returns `null` (no composer)
  - **NO `DepthOfField`**, **NO `Noise`**, **NO `Vignette`** — Bloom only.
  - Mount inside `<Scene>` children.

  **Must NOT do**:
  - Do NOT import or use `DepthOfField`, `Noise`, `Vignette`, `Pixelation`, or other effects.
  - Do NOT enable Bloom on low tier.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T17, T18 (depends T13, T15)
  - **Parallel Group**: Wave 3
  - **Blocks**: 25
  - **Blocked By**: 12, 13, 15

  **References**:
  - `@react-three/postprocessing`: `https://github.com/pmndrs/react-postprocessing`
  - Metis directive: "DepthOfField must be excluded; Bloom is safe"

  **WHY Each Reference Matters**:
  - Bloom is the cheap effect that gives the cinematic feel; DoF is the expensive one that tanks mobile FPS.

  **Acceptance Criteria**:
  - [ ] `src/three/postprocessing.ts` exists.
  - [ ] Imports only `EffectComposer` + `Bloom` from `@react-three/postprocessing`.
  - [ ] Returns `null` when tier is `none`.
  - [ ] Bloom disabled on `low`.
  - [ ] Grep: `rg "DepthOfField|Noise|Vignette" src/three/` returns ZERO matches.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: Only Bloom imported from postprocessing
    Tool: Bash
    Preconditions: Task 16 complete
    Steps:
      1. Run `rg "from '@react-three/postprocessing'" src/three/`
      2. Assert only `EffectComposer` and `Bloom` imported
      3. Run `rg "(DepthOfField|Noise|Vignette)" src/three/`
      4. Assert ZERO matches
    Expected Result: Only Bloom; no other effects
    Evidence: .sisyphus/evidence/task-16-bloom-only.txt

  Scenario: Low tier disables Bloom
    Tool: Bash (vitest)
    Preconditions: Task 16 complete; mock useQualityTier='low'
    Steps:
      1. Render <PostFX />
      2. Inspect rendered output: assert no Bloom child or composer disabled
    Expected Result: No bloom effect mounted on low tier
    Evidence: .sisyphus/evidence/task-16-low-disabled.txt
  ```

  **Commit**: NO

- [x] 17. **Card component (glass, backdrop-blur, Y-axis flip, reduced-motion fallback)**

  **What to do**:
  - Create `src/components/Card.tsx`:
    - Two-face card: `<div class="card-front">` (question + hint) and `<div class="card-back">` (perspective).
    - Use CSS 3D: `perspective: 1200px` on parent, `transform-style: preserve-3d` on inner wrapper, `transform: rotateY(180deg)` on flip.
    - Backdrop-blur surface: `backdrop-blur-xl bg-[var(--color-surface-glass)] border border-white/10 rounded-2xl shadow-2xl`.
    - Props: `{ question: Question; phase: Phase; lang: 'en' | 'id'; onHint(): void; onReveal(): void; onNext(): void; isLastCard: boolean }`.
    - Display fields based on `lang`: `q_en`/`q_id`, `hint_en`/`hint_id`, `persp_en`/`persp_id`.
    - Action buttons: Hint (shown only if `phase==='thinking'` AND hint exists), Reveal (shown if not revealed), Next (shown if revealed).
    - When `phase === 'revealed'`, apply `rotateY(180deg)` to the inner wrapper.
    - When `prefers-reduced-motion: reduce` (read via `useQualityTier() === 'none'` OR direct matchMedia), make the flip instant: `transition: none` and a key-based remount with `display: block/none` swap.
  - Use Instrument Serif (var: `--font-serif`) for the question text. Inter for everything else.
  - Card category color tint: subtle border-color from `themeRef.current.colorPrimary`.

  **Must NOT do**:
  - Do NOT use Framer Motion (CSS transforms suffice).
  - Do NOT auto-advance when timer expires (next button only).
  - Do NOT show the hint button if the question has no hint.
  - Do NOT break the back-face when `prefers-reduced-motion` is on (must show perspective somehow).

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — Animation + accessibility + visual polish.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T15, T16, T18 in Wave 3
  - **Parallel Group**: Wave 3
  - **Blocks**: 23
  - **Blocked By**: 2, 4, 5, 11, 12

  **References**:
  - CSS 3D transforms: `https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateY`
  - `prefers-reduced-motion`: `https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion`
  - Prototype card UI: `thinkdeck_game.html` lines 191–211 (badges, question, hint box — for parity)
  - shadcn `Button` (from Task 4) for action buttons

  **WHY Each Reference Matters**:
  - The flip-on-Y-axis is the explicit user-requested perspective reveal animation.
  - Reduced-motion respect is a WCAG 2.1 AA requirement (Metis flagged).

  **Acceptance Criteria**:
  - [ ] `src/components/Card.tsx` exists.
  - [ ] Renders front (question + optional hint) and back (perspective).
  - [ ] Hint button only renders when `phase==='thinking'` AND hint exists.
  - [ ] Flip animation uses CSS 3D transforms (rotateY).
  - [ ] When `prefers-reduced-motion: reduce`, transition is `none` AND perspective is still reachable.
  - [ ] Vitest renders the card with each `phase` and asserts correct content visible.
  - [ ] Card uses `--font-serif` for question text and `--font-sans` elsewhere (grep CSS classes or computed styles).
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: Phase=revealed shows perspective text
    Tool: Bash (vitest + RTL)
    Preconditions: Task 17 complete
    Steps:
      1. Render Card with phase='revealed', lang='en'
      2. Use queryByText for the persp_en value
      3. Assert visible
    Expected Result: Perspective text rendered
    Evidence: .sisyphus/evidence/task-17-revealed.txt

  Scenario: prefers-reduced-motion removes flip transition
    Tool: Bash (vitest)
    Preconditions: Task 17 complete; matchMedia reduced-motion mocked true
    Steps:
      1. Render Card with phase='revealed'
      2. Inspect inner wrapper computed style
      3. Assert transition === 'none' (or 0s duration)
      4. Assert perspective still reachable in DOM
    Expected Result: No animation; perspective accessible
    Evidence: .sisyphus/evidence/task-17-no-flip.txt

  Scenario: Hint button hidden when question has no hint
    Tool: Bash (vitest)
    Preconditions: Task 17 complete
    Steps:
      1. Render Card with question { hint_en: undefined, hint_id: undefined }, phase='thinking'
      2. Query for hint button by role/text
      3. Assert NOT in document
    Expected Result: No hint button rendered
    Evidence: .sisyphus/evidence/task-17-no-hint.txt
  ```

  **Commit**: NO

- [x] 18. **CategoryGrid component (21 chips, multi-select, themed)**

  **What to do**:
  - Create `src/components/CategoryGrid.tsx`:
    - Grid of 21 chips: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2`.
    - Each chip: rounded button with category label (i18n-driven), tinted with that category's `colorPrimary` (subtle: border + faint background, not full fill).
    - Active state: full-color border + slightly stronger background + scale-up subtle.
    - Props: `{ selected: CategoryId[]; onChange: (next: CategoryId[]) => void; lang: 'en' | 'id' }`.
    - Two control buttons above grid: "Select All" / "Clear" (i18n keys).
    - "Select All" toggles all 21. "Clear" empties.
    - Touch-friendly: minimum tap target 44px.
    - Add unit tests: rendering 21 chips, click toggles selection, "Select All" selects 21, "Clear" empties.
  - Labels come from `CATEGORIES` (Task 3) via i18n (Task 21 will inject category labels into i18n keys; until then, this component reads `category.label_en` or `category.label_id` directly).

  **Must NOT do**:
  - Do NOT hide chips behind a dropdown (Metis: discoverability matters).
  - Do NOT make chips show full theme particles (heavy — just color tint).
  - Do NOT skip "Select All" / "Clear" shortcuts.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — Responsive grid + a11y.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T15, T16, T17, T19, T20, T21
  - **Parallel Group**: Wave 3
  - **Blocks**: 22
  - **Blocked By**: 3, 4, 11, 21

  **References**:
  - `src/data/categories.ts` (Task 3) for labels
  - `src/data/themes.ts` (Task 10) for chip color tinting
  - WCAG tap target: `https://www.w3.org/WAI/WCAG21/Understanding/target-size.html` (min 44×44)

  **WHY Each Reference Matters**:
  - 21 chips at small sizes need explicit tap-target consideration on mobile.

  **Acceptance Criteria**:
  - [ ] `src/components/CategoryGrid.tsx` renders 21 chips.
  - [ ] Click toggles selection state.
  - [ ] "Select All" results in 21 selected.
  - [ ] "Clear" results in 0 selected.
  - [ ] Each chip uses its category theme `colorPrimary` for tint.
  - [ ] `vitest run src/components/__tests__/CategoryGrid.test.tsx` passes ≥5 tests.
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: 21 chips rendered with correct labels
    Tool: Bash (vitest + RTL)
    Preconditions: Task 18 complete
    Steps:
      1. Render CategoryGrid with selected=[], lang='en'
      2. Query all chips by role='button'
      3. Assert 21 chips (excluding "Select All" / "Clear")
      4. Assert label "Ethics" present
    Expected Result: All 21 chips, EN labels
    Evidence: .sisyphus/evidence/task-18-render.txt

  Scenario: Select All / Clear shortcuts work
    Tool: Bash (vitest)
    Preconditions: Task 18 complete
    Steps:
      1. Render with controlled state spy
      2. Click "Select All"; assert onChange called with array of 21 ids
      3. Click "Clear"; assert onChange called with []
    Expected Result: Shortcuts toggle correctly
    Evidence: .sisyphus/evidence/task-18-shortcuts.txt
  ```

  **Commit**: NO

- [x] 19. **Timer component (color-graded urgency, tabular nums)**

  **What to do**:
  - Create `src/components/Timer.tsx`:
    - Props: `{ secs: number; total: number; running: boolean }`.
    - Renders a thin progress bar + numeric `MM:SS` display.
    - Color tiers: > 60s normal (theme primary), ≤ 60s warning (amber), ≤ 30s danger (red).
    - Tabular numerals (`font-variant-numeric: tabular-nums`) to prevent jitter.
    - When `total === 0` (timer disabled / "Bebas"), render nothing.
    - When `running === false`, freeze display but still show last value.
  - Unit tests: format 90 → "1:30"; format 5 → "0:05"; color tier transitions at 60 and 30.

  **Must NOT do**:
  - Do NOT auto-advance the card when timer hits 0 (cosmetic only).
  - Do NOT make the timer modal / overlay.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T15–T18, T20, T21
  - **Parallel Group**: Wave 3
  - **Blocks**: 23
  - **Blocked By**: 4

  **References**:
  - Prototype timer logic: `thinkdeck_game.html` lines 47–54, 160 (formatter + color thresholds)
  - CSS `font-variant-numeric: tabular-nums`

  **WHY Each Reference Matters**:
  - Faithful color-grading from the prototype preserves the "urgency" feedback that helps groups stop deliberating endlessly.

  **Acceptance Criteria**:
  - [ ] `src/components/Timer.tsx` exists.
  - [ ] Formats time as `MM:SS` with tabular-nums.
  - [ ] Color transitions at 60s (amber) and 30s (red).
  - [ ] Returns null when `total === 0`.
  - [ ] `vitest run src/components/__tests__/Timer.test.tsx` passes ≥4 tests.

  **QA Scenarios**:

  ```
  Scenario: Format 90 -> 1:30, 5 -> 0:05
    Tool: Bash (vitest)
    Preconditions: Task 19 complete
    Steps:
      1. Render Timer secs=90, total=120, running=true
      2. Assert text content "1:30"
      3. Re-render secs=5; assert "0:05"
    Expected Result: Correct formatting
    Evidence: .sisyphus/evidence/task-19-format.txt

  Scenario: Color tier transitions at 30s
    Tool: Bash (vitest)
    Preconditions: Task 19 complete
    Steps:
      1. Render Timer secs=31; assert classlist includes amber
      2. Re-render secs=30; assert classlist includes danger (red)
    Expected Result: Color shifts at exactly 30
    Evidence: .sisyphus/evidence/task-19-color.txt
  ```

  **Commit**: NO

- [x] 20. **LanguageToggle + Brand wordmark + small UI primitives**

  **What to do**:
  - Create `src/components/LanguageToggle.tsx`:
    - Uses shadcn `ToggleGroup` (from Task 4) with `en` / `id` items.
    - Calls `i18n.changeLanguage()` on toggle.
    - Persists choice via `writeSettings()` (Task 7).
  - Create `src/components/Brand.tsx`:
    - Simple "Provoke" wordmark — serif font, large, theme primary color, subtle text-shadow / glow.
    - Optional small subtitle below (i18n key `app.tagline`).
  - Both components small (<100 lines each).
  - Disable language toggle during active card flip (read `phase === 'revealed'` AND animation-in-progress flag). For simplicity, may disable when `state.screen === 'playing'` AND `phase === 'revealed'` AND a `isFlipping` boolean is true; if implementing this is heavy, simply disable when `phase === 'revealed'` and re-enable after 500ms.

  **Must NOT do**:
  - Do NOT add a 3rd language toggle.
  - Do NOT make Brand a heavy graphic (text only, no SVG logo — simple wordmark).

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T15–T19, T21
  - **Parallel Group**: Wave 3
  - **Blocks**: 22, 25
  - **Blocked By**: 4, 5, 6

  **References**:
  - shadcn ToggleGroup: `https://ui.shadcn.com/docs/components/toggle-group`
  - `src/store/persist.ts` (Task 7) for `writeSettings`
  - Metis directive: language switch must NOT race with card flip

  **WHY Each Reference Matters**:
  - Persisting language to settings ensures reloads honor the choice.

  **Acceptance Criteria**:
  - [ ] `LanguageToggle.tsx` and `Brand.tsx` both exist.
  - [ ] Toggling LanguageToggle calls `i18n.changeLanguage` AND `writeSettings({...language})`.
  - [ ] LanguageToggle is disabled during active card flip (verifiable by prop or context).
  - [ ] Brand renders "Provoke" in serif font.
  - [ ] `vitest run src/components/__tests__/LanguageToggle.test.tsx` passes ≥3 tests.

  **QA Scenarios**:

  ```
  Scenario: Toggle changes i18n language and persists
    Tool: Bash (vitest)
    Preconditions: Task 20 complete
    Steps:
      1. Render LanguageToggle, current lang='en'
      2. Click 'id' toggle
      3. Assert i18n.language === 'id'
      4. Assert localStorage `provoke_v1_settings` parsed JSON has language='id'
    Expected Result: Both i18n + persist updated
    Evidence: .sisyphus/evidence/task-20-toggle.txt

  Scenario: Brand wordmark renders
    Tool: Bash (vitest)
    Preconditions: Task 20 complete
    Steps:
      1. Render Brand
      2. Assert text 'Provoke' visible
      3. Assert serif font-family applied
    Expected Result: Wordmark visible with correct font
    Evidence: .sisyphus/evidence/task-20-brand.txt
  ```

  **Commit**: NO

- [x] 21. **i18n category labels + description injection**

  **What to do**:
  - For each of 21 categories, add to BOTH `public/locales/en/translation.json` and `public/locales/id/translation.json`:
    ```
    "category.ethics.label": "Ethics" / "Etika"
    "category.ethics.description": "Right vs wrong, ..." / "Benar vs salah, ..."
    ```
    (42 keys per locale × 2 locales = 84 new keys total)
  - Update `src/data/categories.ts` (or create a helper `getCategoryLabel(id, lang)`) to read from i18n when in components, but keep the raw label fields on `CategoryDef` as fallback.
  - Alternatively, write a small generator script that reads `src/data/categories.ts` and emits the relevant keys into both JSON files — preferred to avoid manual sync.

  **Must NOT do**:
  - Do NOT hardcode category labels in any component file.
  - Do NOT introduce drift between EN/ID key sets.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T15–T20
  - **Parallel Group**: Wave 3
  - **Blocks**: 18, 22
  - **Blocked By**: 3, 6

  **References**:
  - `src/data/categories.ts` (Task 3) for source labels
  - `public/locales/{en,id}/translation.json` (Task 6) for target files

  **WHY Each Reference Matters**:
  - i18n-driven labels mean future translation tooling (e.g., Crowdin) can manage all UI text uniformly.

  **Acceptance Criteria**:
  - [ ] All 21 categories have `category.{id}.label` and `category.{id}.description` keys in BOTH locale files.
  - [ ] Key parity test (from Task 6) still passes.
  - [ ] No component file contains literal Indonesian or English category names.

  **QA Scenarios**:

  ```
  Scenario: All 21 categories have i18n keys in both locales
    Tool: Bash
    Preconditions: Task 21 complete
    Steps:
      1. For each CategoryId, grep `category.<id>.label` in both translation.json files
      2. Assert match count === 21 in each
      3. Same for `.description`
    Expected Result: 42 keys per locale
    Evidence: .sisyphus/evidence/task-21-i18n-keys.txt

  Scenario: No hardcoded category labels in components
    Tool: Bash
    Preconditions: Task 21 complete
    Steps:
      1. Run `rg "Etika|Filsafat|Ethics|Philosophy" src/components/`
      2. Inspect results — anything that's a literal string in JSX is a violation
    Expected Result: Only references via t('category...') keys
    Evidence: .sisyphus/evidence/task-21-no-hardcode.txt
  ```

  **Commit**: NO

- [x] 22. **HomeScreen (category grid + level + timer pickers + Start)**

  **What to do**:
  - Create `src/screens/HomeScreen.tsx`:
    - Top: Brand wordmark (Task 20) + LanguageToggle (Task 20) on opposite ends.
    - Tagline below: i18n key `app.tagline`.
    - Category section: label "Kategori / Categories" + `<CategoryGrid />` (Task 18).
    - Level picker: 4 buttons in a row (`Semua/All`, `Easy`, `Medium`, `Hard`). Visual style mirrors prototype `selBtn`.
    - Timer picker: 4 buttons (`1 menit`, `2 menit`, `3 menit`, `Bebas/Free`). Values map to 60/120/180/0 secs.
    - Start button: full-width, primary, disabled until ≥1 category selected.
    - Footer meta: i18n string showing total questions available filtered by current selection (computed from `QUESTIONS.filter(q => selected.includes(q.category_id) && (level==='all' || q.level===level)).length`).
    - All buttons use shadcn `Button` variants.
  - State managed locally via `useState` + commits to game store on Start (calls `start()` action from Task 14).
  - Restore last-used settings from localStorage `provoke_v1_settings` on mount.

  **Must NOT do**:
  - Do NOT show 3D particles UI control here (particles change with category — that's automatic).
  - Do NOT skip the "≥1 category required" Start guard.
  - Do NOT enable Start when level=`easy` AND selected categories collectively have zero questions at that level.

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering` — Layout + interaction polish.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T23, T24 in Wave 4
  - **Parallel Group**: Wave 4
  - **Blocks**: 25
  - **Blocked By**: 3, 4, 5, 6, 11, 18, 20, 21

  **References**:
  - Prototype setup screen: `thinkdeck_game.html` lines 116–151 (rough layout reference)
  - `src/components/CategoryGrid.tsx` (Task 18)
  - `src/store/game.store.ts` (Task 14) for `start()` action

  **WHY Each Reference Matters**:
  - Replicating the prototype's level/timer picker visual familiarity helps users from the prototype.

  **Acceptance Criteria**:
  - [ ] `src/screens/HomeScreen.tsx` renders Brand, LanguageToggle, CategoryGrid, level picker, timer picker, Start button.
  - [ ] Start button is disabled with 0 selected categories; enabled with ≥1.
  - [ ] Last-used settings restored on mount (read from localStorage).
  - [ ] Clicking Start invokes `start()` with current selections.
  - [ ] `vitest run src/screens/__tests__/HomeScreen.test.tsx` passes ≥4 tests.

  **QA Scenarios**:

  ```
  Scenario: Start disabled until category selected
    Tool: Bash (vitest + RTL)
    Preconditions: Task 22 complete
    Steps:
      1. Render HomeScreen, assert Start button has `disabled` attribute
      2. Simulate click on 'ethics' chip
      3. Assert Start button no longer disabled
    Expected Result: Disabled gating works
    Evidence: .sisyphus/evidence/task-22-start-gate.txt

  Scenario: Last-used settings restored
    Tool: Bash (vitest)
    Preconditions: Task 22 complete; preset localStorage
    Steps:
      1. Pre-populate provoke_v1_settings with last selectedCategories=['life']
      2. Render HomeScreen
      3. Assert 'life' chip rendered as active
    Expected Result: State restored from storage
    Evidence: .sisyphus/evidence/task-22-restore.txt
  ```

  **Commit**: NO

- [x] 23. **PlayingScreen (card stack + actions + perspective reveal + timer)**

  **What to do**:
  - Create `src/screens/PlayingScreen.tsx`:
    - Top row: card counter (`{idx+1}/{deck.length}`) + Timer (Task 19) + Close button (returns to home).
    - Middle: Stack visualization — render up to 2 "ghost" cards behind the current card (mimics the prototype's stack effect) using `position: absolute` + slight rotation/translate. These are decorative only.
    - Current card: `<Card>` (Task 17) with current question.
    - On `phase === 'revealed'`, the card is flipped via Card's own logic.
    - Action buttons row below card:
      - if `phase === 'thinking'` AND `hint` exists: [Hint] [Reveal Perspective]
      - if `phase === 'hinted'`: [Reveal Perspective] (full width)
      - if `phase === 'revealed'`: [Next Card / Finish] (full width)
    - On every action click, dispatch the corresponding store action (Task 14).
    - When the current category's theme changes (because the next card may be a different category), call `setCategoryId()` from `useTheme()` to update the particle scene's theme.
    - Disable LanguageToggle while card is flipping (use a 500ms guard or animation event).
  - Use Tailwind for layout; ensure mobile-responsive (full-bleed on small screens).

  **Must NOT do**:
  - Do NOT auto-advance on timer expiry.
  - Do NOT remount the particle scene on category change (only update theme).
  - Do NOT allow back/Close button during active flip.

  **Recommended Agent Profile**:
  - **Category**: `deep` — Multiple coordinated subsystems (FSM, timer, card flip, theme).
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T22, T24 in Wave 4
  - **Parallel Group**: Wave 4
  - **Blocks**: 25
  - **Blocked By**: 2, 4, 5, 6, 9, 11, 14, 17, 19

  **References**:
  - Prototype playing screen: `thinkdeck_game.html` lines 153–249 (header row, timer bar, stack, card, actions, perspective)
  - `src/components/Card.tsx` (Task 17), `Timer.tsx` (Task 19)
  - `src/store/game.store.ts` (Task 14) for actions

  **WHY Each Reference Matters**:
  - Stack visualization is a small but key visual cue from the prototype — preserves the "deck" feel.

  **Acceptance Criteria**:
  - [ ] `src/screens/PlayingScreen.tsx` renders header (counter + timer + close), stack/card, actions.
  - [ ] Action buttons gated correctly by phase.
  - [ ] Hint button hidden when current card has no hint.
  - [ ] Theme updates when card category changes (call `setCategoryId` on idx change).
  - [ ] `vitest run src/screens/__tests__/PlayingScreen.test.tsx` passes ≥5 tests.

  **QA Scenarios**:

  ```
  Scenario: Action buttons gated by phase
    Tool: Bash (vitest + RTL)
    Preconditions: Task 23 complete
    Steps:
      1. Render PlayingScreen with phase='thinking', card has hint
      2. Assert both Hint and Reveal buttons present
      3. Re-render phase='hinted'; assert only Reveal present
      4. Re-render phase='revealed'; assert only Next/Finish present
    Expected Result: Correct gating
    Evidence: .sisyphus/evidence/task-23-actions.txt

  Scenario: Theme changes on next card (different category)
    Tool: Bash (vitest)
    Preconditions: Task 23 complete; deck=[ethics card, technology card]
    Steps:
      1. Render PlayingScreen at idx=0; spy on setCategoryId
      2. Advance to idx=1 (nextCard action)
      3. Assert setCategoryId called with 'technology'
    Expected Result: setCategoryId invoked
    Evidence: .sisyphus/evidence/task-23-theme-switch.txt
  ```

  **Commit**: NO

- [x] 24. **FinishedScreen (stats + replay)**

  **What to do**:
  - Create `src/screens/FinishedScreen.tsx`:
    - Centered layout: trophy icon (lucide `Trophy`), title (i18n `finished.title`), subtitle (i18n `finished.cards_played` with `{count}` interpolation), "Play Again" button (calls `replay()` store action).
    - Subtle confetti / glow effect via CSS (no JS confetti lib).
    - Match prototype's tone (`thinkdeck_game.html` lines 251–265).

  **Must NOT do**:
  - Do NOT add a "share to social" button.
  - Do NOT add scoring / streak display.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T22, T23
  - **Parallel Group**: Wave 4
  - **Blocks**: 25
  - **Blocked By**: 4, 6

  **References**:
  - Prototype finished screen: `thinkdeck_game.html` lines 251–265

  **WHY Each Reference Matters**:
  - Simple completion screen mirrors prototype while staying scope-tight.

  **Acceptance Criteria**:
  - [ ] `src/screens/FinishedScreen.tsx` exists.
  - [ ] Renders title, subtitle with count, replay button.
  - [ ] Replay button click triggers `replay()` store action.
  - [ ] `vitest run src/screens/__tests__/FinishedScreen.test.tsx` passes.

  **QA Scenarios**:

  ```
  Scenario: Renders count and replay action
    Tool: Bash (vitest + RTL)
    Preconditions: Task 24 complete
    Steps:
      1. Render FinishedScreen with state.screen='finished', totalSeen=15
      2. Assert "15" appears in document
      3. Click replay button; assert store dispatched replay
    Expected Result: Both pass
    Evidence: .sisyphus/evidence/task-24-finished.txt
  ```

  **Commit**: NO

- [x] 25. **App.tsx FSM root + screen switcher + scene mount**

  **What to do**:
  - Create `src/App.tsx`:
    - Wraps everything in `<ThemeProvider>` (Task 11).
    - Mounts `<Scene>` (Task 13) at the root with `<Particles>` (Task 15) + `<PostFX>` (Task 16) as children.
    - Reads `state.screen` from game store (Task 14) and switches:
      - `'home'` → `<HomeScreen />`
      - `'playing'` → `<PlayingScreen />`
      - `'finished'` → `<FinishedScreen />`
    - Wraps screen content in a centered max-width container with z-index above the canvas.
    - Uses exhaustive `switch(state.screen)` to ensure all cases handled (TS will catch missing).
  - Update `src/main.tsx`:
    - Import `./i18n` BEFORE App.
    - Import font CSS files (Task 5).
    - Render `<App />`.
  - Update `index.html`:
    - `<html lang="en">` (i18n will update on language change).
    - Set `<title>Provoke</title>` and meta description.
    - Add `<meta name="theme-color" content="oklch(0.08 0 0)">` to match dark theme.

  **Must NOT do**:
  - Do NOT branch on `state.screen` with `if/else` chains (use `switch` with exhaustiveness check).
  - Do NOT mount the Canvas inside individual screens (it must be persistent across screen changes to keep particles flowing).

  **Recommended Agent Profile**:
  - **Category**: `deep` — Wiring the whole tree correctly.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (integration node)
  - **Parallel Group**: Wave 4 (final task in wave)
  - **Blocks**: 26, 27, 31
  - **Blocked By**: 6, 11, 13, 14, 16, 20, 22, 23, 24

  **References**:
  - Prototype `render()` function: `thinkdeck_game.html` lines 267–271 (screen switch reference)

  **WHY Each Reference Matters**:
  - Persistent canvas across screen changes is critical — re-mounting would cause a particle "flash" on every screen transition.

  **Acceptance Criteria**:
  - [ ] `src/App.tsx` exists with FSM switcher.
  - [ ] Canvas/Scene is mounted at root, not per-screen.
  - [ ] All 3 screen cases handled in exhaustive switch.
  - [ ] `index.html` has `<title>Provoke</title>` and `lang="en"`.
  - [ ] `bun run dev` opens and shows home screen with particles.
  - [ ] `bun run build` exits 0.

  **QA Scenarios**:

  ```
  Scenario: Build produces working SPA
    Tool: Bash
    Preconditions: Task 25 complete
    Steps:
      1. Run `bun run build`
      2. Assert dist/index.html contains <title>Provoke</title>
      3. Assert dist/assets/*.js exists
    Expected Result: Build clean, brand baked in
    Evidence: .sisyphus/evidence/task-25-build.txt

  Scenario: All 3 screens reachable via store transitions
    Tool: Bash (vitest)
    Preconditions: Task 25 complete
    Steps:
      1. Render App; assert HomeScreen visible
      2. Dispatch start(['ethics'], 'easy', 0); assert PlayingScreen visible
      3. Advance to last card + nextCard; assert FinishedScreen visible
    Expected Result: Transitions work end-to-end
    Evidence: .sisyphus/evidence/task-25-transitions.txt
  ```

  **Commit**: NO

- [x] 26. **localStorage wiring (settings, seen, session restore)**

  **What to do**:
  - In `src/App.tsx` (or a small `src/store/sync.ts` hook), wire localStorage to the game store:
    - On mount: read `provoke_v1_settings`, apply language to i18n, apply qualityTier preference to the quality hook context (note: tier is mostly auto-detected but user can override later).
    - On every `state.screen === 'playing'` change: persist a snapshot of `{ selectedCategories, level, timerDur, idx, phase, deck (qids only) }` to `provoke_v1_session`.
    - On `revealPerspective()`: add the current qid to `provoke_v1_seen[category_id]`.
    - On `replay()` or `quit()`: clear `provoke_v1_session`.
  - On app mount, if a `provoke_v1_session` exists and is valid (Zod-validated):
    - Don't auto-resume (would surprise user). Instead, show a small toast/dialog: "Continue last session?" with Yes/No. (Use shadcn Dialog.)
    - This adds Wave-4 scope but is small.
  - Add unit tests:
    - Mock localStorage; trigger revealPerspective; assert seen updated.
    - Mock pre-existing valid session; assert resume dialog appears.

  **Must NOT do**:
  - Do NOT save full Question objects in `provoke_v1_session` — save qids only (re-resolve from `QUESTIONS` on resume).
  - Do NOT auto-resume without user confirmation.
  - Do NOT save persistence on every keystroke — only on meaningful state changes (debounced or event-driven).

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` — Cross-cutting concern; careful with edge cases.
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends T25)
  - **Parallel Group**: Wave 4
  - **Blocks**: 27, 31
  - **Blocked By**: 7, 14, 25

  **References**:
  - `src/store/persist.ts` (Task 7)
  - `src/store/game.store.ts` (Task 14)
  - Metis directive: "session = qids only", "resume needs user confirmation"

  **WHY Each Reference Matters**:
  - Storing qids only keeps the localStorage payload tiny (text remains in code/CSV).

  **Acceptance Criteria**:
  - [ ] Settings persist + restore on reload.
  - [ ] Seen list updates on perspective reveal.
  - [ ] Session snapshots use qids only, not full Question objects.
  - [ ] Resume dialog appears (does not auto-resume).
  - [ ] `vitest run src/store/__tests__/sync.test.ts` passes ≥4 tests.

  **QA Scenarios**:

  ```
  Scenario: Seen list grows on perspective reveal
    Tool: Bash (vitest)
    Preconditions: Task 26 complete
    Steps:
      1. Mock localStorage; render App; start game
      2. Advance to revealed phase on first card (qid 'ethics-easy-01')
      3. Assert localStorage `provoke_v1_seen.ethics` includes 'ethics-easy-01'
    Expected Result: Seen list updated
    Evidence: .sisyphus/evidence/task-26-seen.txt

  Scenario: Pre-existing session prompts resume dialog
    Tool: Bash (vitest)
    Preconditions: Task 26 complete
    Steps:
      1. Pre-populate `provoke_v1_session` with valid snapshot
      2. Render App
      3. Assert resume dialog visible
      4. Click "No"; assert dialog closes and session cleared
    Expected Result: Dialog flow works
    Evidence: .sisyphus/evidence/task-26-resume.txt
  ```

  **Commit**: NO

- [x] 27. **Vitest unit tests (FSM, CSV, i18n, persist, themes, quality)**

  **What to do**:
  - Create `vitest.config.ts` with:
    - JSDOM environment
    - `setupFiles: ['./vitest.setup.ts']` — register `vitest-canvas-mock` + reset localStorage between tests
    - Test path glob: `src/**/__tests__/**/*.test.{ts,tsx}`
  - Create `vitest.setup.ts`:
    ```ts
    import '@testing-library/jest-dom/vitest';
    import 'vitest-canvas-mock';
    afterEach(() => {
      localStorage.clear();
    });
    ```
  - Ensure each task that referenced a `__tests__` file actually shipped that test file. Cross-check the list:
    - `src/types/__tests__/category.test.ts` (T2)
    - `src/data/__tests__/categories.test.ts` (T3)
    - `src/i18n/__tests__/i18n.test.ts` (T6)
    - `src/store/__tests__/persist.test.ts` (T7)
    - `src/data/__tests__/questions.test.ts` (T9)
    - `src/data/__tests__/themes.test.ts` (T10)
    - `src/three/__tests__/ThemeProvider.test.tsx` (T11)
    - `src/three/__tests__/useQualityTier.test.ts` (T12)
    - `src/three/__tests__/Scene.test.tsx` (T13)
    - `src/store/__tests__/game.store.test.ts` (T14)
    - `src/three/__tests__/Particles.test.tsx` (T15)
    - `src/components/__tests__/Card.test.tsx` (T17)
    - `src/components/__tests__/CategoryGrid.test.tsx` (T18)
    - `src/components/__tests__/Timer.test.tsx` (T19)
    - `src/components/__tests__/LanguageToggle.test.tsx` (T20)
    - `src/screens/__tests__/HomeScreen.test.tsx` (T22)
    - `src/screens/__tests__/PlayingScreen.test.tsx` (T23)
    - `src/screens/__tests__/FinishedScreen.test.tsx` (T24)
    - `src/store/__tests__/sync.test.ts` (T26)
  - Add npm script `test`: `vitest run` and `test:watch`: `vitest`.
  - Run full suite, fix any flakes.

  **Must NOT do**:
  - Do NOT use Playwright.
  - Do NOT skip flaky tests with `it.skip` — fix them.
  - Do NOT lower coverage thresholds to make tests pass.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (consolidator)
  - **Parallel Group**: Wave 4
  - **Blocks**: 30, 31
  - **Blocked By**: 6, 7, 9, 14, 25, 26

  **References**:
  - Vitest config: `https://vitest.dev/config/`
  - `@testing-library/jest-dom`: `https://github.com/testing-library/jest-dom`
  - `vitest-canvas-mock`: `https://github.com/wobsoriano/vitest-canvas-mock`
  - `@react-three/test-renderer`: `https://github.com/pmndrs/react-three-fiber/tree/master/packages/test-renderer`

  **WHY Each Reference Matters**:
  - Canvas mock prevents jsdom from crashing when R3F mounts; test-renderer enables scene-graph inspection.

  **Acceptance Criteria**:
  - [ ] `vitest.config.ts` and `vitest.setup.ts` exist.
  - [ ] All test files listed above exist.
  - [ ] `bun test` (or `vitest run`) passes 100%.
  - [ ] No `it.skip` / `describe.skip` in any test file.
  - [ ] Coverage report shows non-zero coverage for state, persist, i18n, themes (informational, not gated).

  **QA Scenarios**:

  ```
  Scenario: Full test suite passes
    Tool: Bash
    Preconditions: Task 27 complete
    Steps:
      1. Run `vitest run`
      2. Assert exit 0
      3. Assert summary shows "Tests: X passed (X)" with X >= 30
    Expected Result: All pass, ≥30 tests total
    Evidence: .sisyphus/evidence/task-27-test-suite.txt

  Scenario: No skipped tests
    Tool: Bash
    Preconditions: Task 27 complete
    Steps:
      1. Run `rg -n "(it|test|describe)\.skip" src/`
      2. Assert ZERO matches
    Expected Result: No skipped tests
    Evidence: .sisyphus/evidence/task-27-no-skips.txt
  ```

  **Commit**: NO

- [x] 28. **README + content-editing guide + deployment docs**

  **What to do**:
  - Create `README.md` at repo root with sections:
    - **Provoke** — one-paragraph product description.
    - **Stack** — list (Vite, React 19, TS, Tailwind v4, shadcn/ui, R3F, i18next, Vitest, Zod).
    - **Getting Started** — `bun install` / `npm install`, `bun run dev`, opens at localhost:5173.
    - **Scripts** — `dev`, `build`, `preview`, `prebuild`, `lint`, `format`, `test`, `csv:validate`.
    - **Editing Questions** — point at `src/data/questions.csv`, explain schema, mention `prebuild` hook regenerates `questions.generated.ts`, mention `bun run csv:validate` for ad-hoc check.
    - **Adding Translations** — point at `public/locales/`, mention key parity test.
    - **Themes** — point at `src/data/themes.ts`, mention all 21 must remain.
    - **Building for Production** — `bun run build`, dist/ output, static hosting (Vercel/Netlify links).
    - **Project Structure** — file tree with one-line descriptions.
    - **Architecture Notes** — short summary: FSM discriminated union, R3F scene persistent across screens, theme refs avoid remount, quality tier hook, localStorage v1 schema.
  - Create `docs/EDITING-QUESTIONS.md` with detailed CSV guide (one row per question, escaping, qid convention, language equivalence).
  - Create `docs/DEPLOY.md` with steps for Vercel and Netlify.

  **Must NOT do**:
  - Do NOT add badges (CI, npm, license) unless already configured.
  - Do NOT include screenshots/GIFs (planner can't generate; defer to user).
  - Do NOT include API/backend setup (none exists).

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T29, T30 in Wave 5
  - **Parallel Group**: Wave 5
  - **Blocks**: F1, F4
  - **Blocked By**: 25, 26

  **References**:
  - All preceding tasks (for stack/structure summary)
  - Vercel SPA: `https://vercel.com/docs/frameworks/vite`
  - Netlify SPA: `https://docs.netlify.com/integrations/frameworks/vite/`

  **WHY Each Reference Matters**:
  - Editing-questions guide is critical because content expansion is a continuing user task.

  **Acceptance Criteria**:
  - [ ] `README.md` exists with all listed sections.
  - [ ] `docs/EDITING-QUESTIONS.md` exists.
  - [ ] `docs/DEPLOY.md` exists.
  - [ ] No broken links in markdown (basic check: no `[text](TODO)` placeholders).

  **QA Scenarios**:

  ```
  Scenario: All docs present
    Tool: Bash
    Preconditions: Task 28 complete
    Steps:
      1. ls README.md docs/EDITING-QUESTIONS.md docs/DEPLOY.md
      2. Assert all 3 files exist with non-zero size
    Expected Result: Files present
    Evidence: .sisyphus/evidence/task-28-docs.txt

  Scenario: README mentions key concepts
    Tool: Bash
    Preconditions: Task 28 complete
    Steps:
      1. grep -E "(Vite|React|Tailwind|R3F|three-fiber|i18next)" README.md
      2. Assert all keywords present
    Expected Result: All stack components mentioned
    Evidence: .sisyphus/evidence/task-28-readme.txt
  ```

  **Commit**: NO

- [x] 29. **Static-host build config + .env example**

  **What to do**:
  - Create `vercel.json`:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
      "headers": [
        {
          "source": "/assets/(.*)",
          "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
        }
      ]
    }
    ```
  - Create `netlify.toml`:
    ```toml
    [build]
    command = "bun run build"
    publish = "dist"
    [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
    ```
  - Create `.env.example` with placeholders for any env vars (none expected for v1, so document this fact with comment: `# Provoke v1 requires no runtime env vars`).
  - Update `.gitignore` to include: `dist/`, `node_modules/`, `.env`, `*.log`, `.vite/`, `coverage/`, `.DS_Store`. Do NOT add `src/data/questions.generated.ts` (must be committed).

  **Must NOT do**:
  - Do NOT add `src/data/questions.generated.ts` to `.gitignore`.
  - Do NOT introduce real env vars.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES with T28, T30
  - **Parallel Group**: Wave 5
  - **Blocks**: F1
  - **Blocked By**: 1, 25

  **References**:
  - Vercel SPA rewrites: docs link in T28
  - Netlify TOML reference: `https://docs.netlify.com/configure-builds/file-based-configuration/`

  **WHY Each Reference Matters**:
  - SPA rewrites ensure deep links work after refresh on static hosts.

  **Acceptance Criteria**:
  - [ ] `vercel.json` and `netlify.toml` both exist.
  - [ ] `.gitignore` lists the standard ignores AND does NOT list `src/data/questions.generated.ts`.
  - [ ] `.env.example` exists (even if empty with comment).

  **QA Scenarios**:

  ```
  Scenario: Deploy configs present
    Tool: Bash
    Preconditions: Task 29 complete
    Steps:
      1. ls vercel.json netlify.toml .env.example .gitignore
      2. Assert all present
      3. grep "src/data/questions.generated.ts" .gitignore
      4. Assert NO match (must be committed)
    Expected Result: Configs present; generated file not gitignored
    Evidence: .sisyphus/evidence/task-29-deploy.txt
  ```

  **Commit**: NO

- [x] 30. **Lint + format pass + AI-slop sweep**

  **What to do**:
  - Run `bun run lint` — fix all errors and warnings.
  - Run `bun run format` (Prettier) — apply formatting.
  - Manual code review pass on all changed files:
    - Remove unused imports.
    - Remove `console.log` (replace with debug guards if truly needed).
    - Remove commented-out code blocks.
    - Rename generic variables (`data`, `result`, `item`, `temp`) to domain-specific names.
    - Collapse single-use abstractions if obvious.
    - Remove excessive JSDoc that restates obvious code.
    - Remove try/catch with empty handlers.
    - Replace `as any` and `as unknown as X` with proper type narrowing.
  - Run AI-slop greps:
    - `rg "as any" src/` — investigate each
    - `rg "console\\.log" src/` — remove or guard
    - `rg "// TODO" src/` — verify each is intentional
    - `rg "// eslint-disable" src/` — verify each justified
  - Run full test suite again to ensure refactors didn't break anything.

  **Must NOT do**:
  - Do NOT change behavior — this is a hygiene pass, not a feature pass.
  - Do NOT mass-rename variables without reading context.
  - Do NOT delete tests to make them pass.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO (full-repo sweep)
  - **Parallel Group**: Wave 5
  - **Blocks**: F2
  - **Blocked By**: 27

  **References**:
  - All preceding tasks (this is a sweep)

  **WHY Each Reference Matters**:
  - F2 reviewer expects clean code; this task front-loads that cleanup.

  **Acceptance Criteria**:
  - [ ] `bun run lint` exits 0.
  - [ ] `bun run format` produces no diff (idempotent).
  - [ ] `bun test` exits 0 with same test count as before.
  - [ ] Greps: `rg "as any" src/` returns ZERO; `rg "console\\.log" src/` returns ZERO (or only inside `if (import.meta.env.DEV)` guards).
  - [ ] `npx tsc --noEmit` exits 0.

  **QA Scenarios**:

  ```
  Scenario: No 'as any' anywhere
    Tool: Bash
    Preconditions: Task 30 complete
    Steps:
      1. Run `rg "as any" src/`
      2. Assert ZERO matches
    Expected Result: Clean
    Evidence: .sisyphus/evidence/task-30-no-any.txt

  Scenario: Lint + format + tests all green after sweep
    Tool: Bash
    Preconditions: Task 30 complete
    Steps:
      1. Run `bun run lint && bun run format --check && bun test`
      2. Assert all exit 0
    Expected Result: All green
    Evidence: .sisyphus/evidence/task-30-green.txt
  ```

  **Commit**: NO

- [x] 31. **Final integration smoke (agent dev-server walkthrough — static analysis only)**

  **What to do**:
  - **Per AGENTS.md: Playwright is OFF. F3 reviewer wave uses static analysis.** This task is a code-trace smoke check.
  - Start the dev server: `bun run dev` in background; allow ~5s for startup.
  - Use `curl http://localhost:5173/` to confirm HTML is served and contains `<title>Provoke</title>`.
  - Trace the JSX render tree by reading these files in order and ensuring no obvious wiring bugs:
    1. `src/main.tsx` — i18n init → font imports → mount
    2. `src/App.tsx` — ThemeProvider → Scene with Particles+PostFX → screen switcher
    3. `src/screens/HomeScreen.tsx` — Brand + LanguageToggle + CategoryGrid + level/timer + Start
    4. `src/screens/PlayingScreen.tsx` — header (counter + Timer + close) + Card + actions
    5. `src/screens/FinishedScreen.tsx` — Trophy + count + replay
  - For each file, confirm:
    - All imported components exist.
    - No undefined refs.
    - Conditional rendering matches the expected phase logic from the prototype.
  - Kill the dev server.
  - Write a short summary file `.sisyphus/evidence/task-31-walkthrough.md` documenting the trace and any flags raised.

  **Must NOT do**:
  - Do NOT use Playwright.
  - Do NOT use a real browser via puppeteer/playwright/screenshot tools.
  - Do NOT skip the curl-served-HTML check.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5
  - **Blocks**: F1, F3
  - **Blocked By**: 25, 26, 27

  **References**:
  - AGENTS.md (skip Playwright on all tasks)
  - All preceding screen/component tasks

  **WHY Each Reference Matters**:
  - Static-analysis smoke catches integration bugs (e.g., import path typos, missing prop wiring) that unit tests wouldn't catch.

  **Acceptance Criteria**:
  - [ ] `curl http://localhost:5173/` returns HTML with `<title>Provoke</title>`.
  - [ ] All 5 traced files import cleanly (no missing components).
  - [ ] `.sisyphus/evidence/task-31-walkthrough.md` exists with trace summary.
  - [ ] No "TODO: wire this" comments remain in screens.

  **QA Scenarios**:

  ```
  Scenario: Dev server serves HTML
    Tool: Bash
    Preconditions: Task 31 in progress
    Steps:
      1. Start `bun run dev` in background
      2. Wait 5s
      3. Run `curl -s http://localhost:5173/ | grep -o "<title>[^<]*</title>"`
      4. Assert match contains "Provoke"
      5. Kill dev server
    Expected Result: Title present in served HTML
    Evidence: .sisyphus/evidence/task-31-curl-title.txt

  Scenario: Trace summary written
    Tool: Bash
    Preconditions: Task 31 complete
    Steps:
      1. ls .sisyphus/evidence/task-31-walkthrough.md
      2. Assert exists with non-zero size
      3. grep -E "(main.tsx|App.tsx|HomeScreen|PlayingScreen|FinishedScreen)" .sisyphus/evidence/task-31-walkthrough.md
      4. Assert all 5 files mentioned
    Expected Result: All traced
    Evidence: .sisyphus/evidence/task-31-walkthrough.md
  ```

  **Commit**: NO

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
>
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1–F4 as checked before getting user's okay.** Rejection or user feedback → fix → re-run → present again → wait for okay.

- [x] F1. **Plan Compliance Audit** — `oracle`

  **What to do**: Read this plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": grep codebase for forbidden patterns — reject with `file:line` on hit. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables list against actual file tree.

  **Specific greps (must all return ZERO matches)**:
  - `rg -n "as Question\[\]" src/`
  - `rg -n "as any" src/`
  - `rg -n "fonts.googleapis.com" .`
  - `rg -n "tailwindcss-animate" package.json src/`
  - `rg -n "@testing-library/react" src/three/` (R3F components must use test-renderer)
  - `rg -n "(score|points|streak|leaderboard)" src/` (out of scope)
  - `rg -n "(service-worker|workbox|sw\\.js)" .` (PWA out of scope)
  - `rg -n "DepthOfField" src/three/` (Bloom only)
  - `rg -n "dpr=\\{\\[1,\\s*2\\]\\}" src/` (DPR must be [1,1])

  **Output**: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | Greps [9/9 clean] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`

  **What to do**: Run `npx tsc --noEmit` + `bun run lint` + `vitest run`. Review all changed files for: `as any` / `@ts-ignore`, empty `catch {}`, `console.log` in production code paths, commented-out code blocks, unused imports/exports, generic names (`data`, `result`, `item`, `temp`, `Helper`, `Manager`). Check AI slop: excessive JSDoc, over-abstraction (single-use abstract classes / generic factories), comments restating obvious code.

  **Output**: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass / N fail] | Files [N clean / N issues] | AI-slop hotspots [N] | VERDICT: APPROVE/REJECT`

- [x] F3. **Static-Analysis QA** — `unspecified-high` (NO Playwright per AGENTS.md)

  **What to do**: Per AGENTS.md, F3 replaces Playwright with static analysis. Execute:
  - Read `src/screens/PlayingScreen.tsx` end-to-end; trace data flow: deck shuffle → card display → hint → reveal → next → finished.
  - Read `src/store/game.store.ts`; verify discriminated union exhaustiveness (no `as` casts to narrow state).
  - Read `src/three/Particles.tsx`; verify per-category change uses uniform/attribute mutation, NOT remount.
  - Read `src/store/persist.ts`; verify all reads are Zod-validated and return defaults on parse failure.
  - Read CSV → generated pipeline; verify Zod schema covers all columns, qid uniqueness enforced, all 21 category IDs present.
  - Read `src/i18n/index.ts`; verify `fallbackLng: 'en'`, `saveMissing: false`.
  - Read `src/three/Scene.tsx`; verify `aria-hidden="true"` + `role="presentation"` + `dpr={[1, 1]}` + `webglcontextlost` handler.
  - Read `src/components/Card.tsx`; verify Y-axis flip exists AND collapses to instant when `prefers-reduced-motion: reduce`.
  - Read `src/three/useQualityTier.ts`; verify all four tiers handled and `prefers-reduced-motion` returns `none`.

  **Output**: `Read-throughs [9/9] | Issues found [N] | Critical [N] | VERDICT: APPROVE/REJECT`

- [x] F4. **Scope Fidelity Check** — `deep`

  **What to do**: For each task in this plan, read its "What to do" section + acceptance criteria, then read the actual git diff for files it owns. Verify 1:1 — everything specified was built (no missing), nothing beyond was built (no creep). Check "Must NOT do" compliance per task. Detect cross-task contamination (Task N modifying Task M's files). Flag any file in the repo not accounted for by any task.

  **Output**: `Tasks [N/N compliant] | Contamination [CLEAN / N issues] | Unaccounted files [CLEAN / N files] | VERDICT: APPROVE/REJECT`

---

## Commit Strategy

> Per AGENTS.md: **no auto-commits**. Commits happen ONLY when user explicitly says "commit". Tasks track suggested commits below, but executor MUST NOT run `rtk git commit` without user instruction.

| Task | Suggested commit msg                      | Files                                                                           |
| ---- | ----------------------------------------- | ------------------------------------------------------------------------------- |
| 1    | `chore: scaffold vite react ts`           | `package.json`, `vite.config.ts`, `tsconfig.json`, `.eslintrc`, `.prettierrc`   |
| 2    | `feat(types): core type contracts`        | `src/types/*.ts`                                                                |
| 3    | `feat(data): locked 21 categories`        | `src/data/categories.ts`                                                        |
| 4    | `chore: tailwind v4 + shadcn init`        | `tailwind.config.ts`, `components.json`, `src/index.css`, `src/components/ui/*` |
| 5    | `chore: self-hosted fonts`                | `package.json`, `src/main.tsx`                                                  |
| 6    | `feat(i18n): en/id skeleton`              | `src/i18n/*`, `public/locales/**`                                               |
| 7    | `feat(store): persist helpers`            | `src/store/keys.ts`, `src/store/persist.ts`                                     |
| 8    | `feat(content): seed questions csv`       | `src/data/questions.csv`                                                        |
| 9    | `feat(build): csv to typed data pipeline` | `scripts/parse-csv.ts`, `src/data/questions.generated.ts`, `package.json`       |
| 10   | `feat(themes): 21 category themes`        | `src/data/themes.ts`                                                            |
| 11   | `feat(themes): provider + hook`           | `src/three/ThemeProvider.tsx`, `src/three/useTheme.ts`                          |
| 12   | `feat(three): quality tier hook`          | `src/three/useQualityTier.ts`                                                   |
| 13   | `feat(three): canvas scene shell`         | `src/three/Scene.tsx`                                                           |
| 14   | `feat(store): game fsm reducer`           | `src/store/game.store.ts`                                                       |
| 15   | `feat(three): constellation particles`    | `src/three/Particles.tsx`                                                       |
| 16   | `feat(three): bloom postprocessing`       | `src/three/postprocessing.ts`                                                   |
| 17   | `feat(ui): glass card y-axis flip`        | `src/components/Card.tsx`                                                       |
| 18   | `feat(ui): category grid`                 | `src/components/CategoryGrid.tsx`                                               |
| 19   | `feat(ui): timer`                         | `src/components/Timer.tsx`                                                      |
| 20   | `feat(ui): language toggle + brand`       | `src/components/LanguageToggle.tsx`, `src/components/Brand.tsx`                 |
| 21   | `feat(i18n): category labels injection`   | `public/locales/**`                                                             |
| 22   | `feat(screens): home`                     | `src/screens/HomeScreen.tsx`                                                    |
| 23   | `feat(screens): playing`                  | `src/screens/PlayingScreen.tsx`                                                 |
| 24   | `feat(screens): finished`                 | `src/screens/FinishedScreen.tsx`                                                |
| 25   | `feat: app root + scene mount`            | `src/App.tsx`, `src/main.tsx`, `index.html`                                     |
| 26   | `feat(store): localstorage wiring`        | `src/App.tsx`, `src/store/*`                                                    |
| 27   | `test: vitest unit suite`                 | `src/**/__tests__/*.test.ts(x)`, `vitest.config.ts`                             |
| 28   | `docs: readme + guides`                   | `README.md`, `docs/*.md`                                                        |
| 29   | `chore: deploy config`                    | `vercel.json` or `netlify.toml`, `.env.example`                                 |
| 30   | `refactor: lint + ai-slop sweep`          | various                                                                         |

---

## Success Criteria

### Verification Commands

```bash
# Install
bun install        # exits 0 (no peer-dep errors)

# Types
npx tsc --noEmit   # exits 0

# Lint
bun run lint       # exits 0

# Test
bun test           # all pass

# CSV pipeline
bun run prebuild   # produces src/data/questions.generated.ts with valid Zod-parsed data

# Build
bun run build      # exits 0, dist/ produced

# Dev (smoke)
bun run dev        # starts on localhost, no console errors, particles render

# Theme exhaustiveness
node -e "const t=require('./src/data/themes').THEMES;const c=require('./src/data/categories').CATEGORIES;console.assert(c.every(x=>t[x.id]),'theme missing');"

# CSV uniqueness
node -e "const q=require('./src/data/questions.generated').QUESTIONS;const s=new Set(q.map(x=>x.qid));console.assert(s.size===q.length,'duplicate qid');"

# Categories count
node -e "const c=require('./src/data/categories').CATEGORIES;console.assert(c.length===21,'expected 21 cats');"
```

### Final Checklist

- [ ] All "Must Have" items present (verified by F1 oracle audit)
- [ ] All "Must NOT Have" items absent (verified by F1 greps returning zero)
- [ ] All Vitest unit tests pass
- [ ] `npx tsc --noEmit` exits 0
- [ ] `bun run build` exits 0
- [ ] CSV pipeline runs cleanly on `prebuild`
- [ ] 21 themes match 21 categories exactly (no fallback path)
- [ ] EN/ID translation files have key parity
- [ ] localStorage keys all follow `provoke_v1_*` manifest
- [ ] `dpr={[1, 1]}` confirmed in Canvas
- [ ] `aria-hidden="true"` confirmed on Canvas
- [ ] `prefers-reduced-motion` collapses flip animation + particles
- [ ] F1, F2, F3, F4 all VERDICT: APPROVE
- [ ] User gives explicit "okay" before marking work complete
