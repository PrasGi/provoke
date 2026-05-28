# Provoke UI Fixes + Calm Redesign

## TL;DR

> **Quick Summary**: Fix two critical bugs (white background instead of dark, Vite warning from importing JSON out of `public/`) and replace the current "glowing neon" UI with a calmer, more elegant typography-first design.
>
> **Deliverables**:
>
> - Locales moved from `public/locales/` to `src/locales/` (resolves Vite warnings)
> - Dark theme actually applies (no more white background)
> - Restrained, elegant redesign of HomeScreen, LanguageToggle, Card, PlayingScreen, FinishedScreen
> - All 102 tests still pass; lint, tsc, format, build all green
>
> **Estimated Effort**: Short
> **Parallel Execution**: NO — sequential (each step depends on previous)
> **Critical Path**: T1 (move locales) → T2 (fix dark theme) → T3 (redesign Home) → T4 (LanguageToggle) → T5 (Card/Playing/Finished) → T6 (verify)

---

## Context

### Original Request

User screenshot shows the Provoke home screen with a **white background**, a barely-visible "Provoke" wordmark, only a CategoryGrid rendered, and the level/timer/start sections completely missing. The terminal also shows two repeating Vite warnings about importing JSON from the `public/` directory. The user said: _"i still not like it, please redesign again"_.

### Root Cause Analysis

**Bug 1 — White background**:

- `src/index.css` has `@theme` block setting `--color-background: oklch(0.08 0 0)` (correct, near-black)
- But it also has a `:root` block that **overrides** with `--background: oklch(1 0 0)` (white)
- Tailwind v4 maps `bg-background` to `--background`, so `body { @apply bg-background }` resolves to white
- The `.dark` class has correct dark tokens, but nothing applies `.dark` to `<html>` or `<body>`

**Bug 2 — Vite warning**:

- `src/i18n/index.ts` imports JSON from `'../../public/locales/en/translation.json'`
- Vite forbids JS imports from `public/` (it's for served-as-is assets only)
- Fix: move JSON files to `src/locales/` and update the import path

**Design issues**:

- Current redesign is too "neon glow heavy" — multiple primary-color box-shadows, rings, scales, oversize buttons
- White background on a dark theme app makes everything unreadable
- LanguageToggle as a giant prominent control overstates its importance; language is a setting, not a primary action
- "Provoke" wordmark text-shadow appears as ghostly blur on white background
- Particle background renders purple specks against white = chaos

### Interview Summary

**Implicit user preferences (from screenshot reaction)**:

- Restraint over flash — less neon, less glow
- Readability is non-negotiable
- Wants a real visual design, not just "bigger and brighter"

---

## Work Objectives

### Core Objective

Restore the dark background (fix the actual rendering bug), eliminate Vite warnings, and replace the neon-heavy UI with a quieter, more typographic design that puts the serif "Provoke" wordmark and the question prompts front and center.

### Concrete Deliverables

- `src/locales/en/translation.json` (moved from `public/locales/en/`)
- `src/locales/id/translation.json` (moved from `public/locales/id/`)
- `src/i18n/index.ts` — import from `../locales/...` instead of `../../public/locales/...`
- `src/index.css` — `:root` tokens point at dark values directly (no `.dark` class required); `--color-primary` shifted to a warmer hue
- `src/screens/HomeScreen.tsx` — calmer layout, smaller wordmark, simpler controls
- `src/components/LanguageToggle.tsx` — small pill in top-right of HomeScreen header
- `src/components/Card.tsx` — refined glass, no shadow glows
- `src/screens/PlayingScreen.tsx` — minimal sticky top bar
- `src/screens/FinishedScreen.tsx` — calm celebration, no `animate-ping`
- Delete `public/locales/` directory after move verified

### Definition of Done

- [ ] Loading `localhost:5173` shows a **dark** (near-black) background, not white
- [ ] Vite terminal shows **zero** warnings about `public/locales/...`
- [ ] "Provoke" wordmark renders crisp serif white-on-dark, no white-on-white ghost effect
- [ ] LanguageToggle is a small pill in the top-right corner, not a giant centered control
- [ ] `npx tsc --noEmit` exits 0
- [ ] `bun run lint` exits 0
- [ ] `bun run format --check` exits 0
- [ ] `bunx vitest run` — all 102 tests pass
- [ ] `bun run build` exits 0

### Must Have

- Dark background as a CSS-level guarantee (not dependent on `.dark` class being applied)
- Locales imported from `src/locales/` (no Vite warnings)
- All existing i18n keys still resolve (don't break translation JSON paths)
- All existing tests still pass without modification

### Must NOT Have (Guardrails)

- ❌ Do NOT modify `src/store/`, `src/data/`, `src/three/`, `src/types/`, `scripts/`
- ❌ Do NOT modify any test files
- ❌ Do NOT modify `src/components/ui/` shadcn primitives
- ❌ Do NOT add npm packages
- ❌ Do NOT use neon glow effects (`shadow-[0_0_30px_...]` etc.) on more than ONE element per screen
- ❌ Do NOT use `animate-ping` (chaotic on small screens)
- ❌ Do NOT make the LanguageToggle a giant centered control — it's a small setting, top-right
- ❌ Do NOT exceed `text-5xl` for the Provoke wordmark (current `text-7xl` is too dominant)
- ❌ Do NOT remove the persistent R3F Scene
- ❌ Do NOT change i18n key names — only translation file location

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES
- **Automated tests**: Tests-after (existing test suite must still pass — no new tests required)
- **Framework**: Vitest

### QA Policy

Static analysis only (no Playwright per AGENTS.md). Each task includes specific verification commands.

---

## Execution Strategy

```
Wave 1 (sequential — each blocks the next):
└── T1: Move locales from public/ → src/, update i18n import
└── T2: Fix dark theme in index.css
└── T3: Redesign HomeScreen (calmer layout, smaller wordmark)
└── T4: Redesign LanguageToggle (small pill, top-right)
└── T5: Redesign Card + PlayingScreen + FinishedScreen
└── T6: Verification — tsc, lint, format, tests, build

Sequential because: T2 depends on T1's import not breaking; T3-T5 depend on T2's dark background being visible; T6 depends on all prior tasks.
```

---

## TODOs

- [x] 1. **Move locale JSONs from `public/locales/` to `src/locales/` and update i18n import**

  **What to do**:
  - Create directory `src/locales/en/` and `src/locales/id/`
  - Move `public/locales/en/translation.json` → `src/locales/en/translation.json`
  - Move `public/locales/id/translation.json` → `src/locales/id/translation.json`
  - Update `src/i18n/index.ts` import paths from `'../../public/locales/{en,id}/translation.json'` to `'../locales/{en,id}/translation.json'`
  - Delete the now-empty `public/locales/` directory (and its `en/`, `id/` subdirs)

  **Must NOT do**:
  - Do NOT modify the JSON content
  - Do NOT change i18n configuration (fallbackLng, supportedLngs, detection options stay identical)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Acceptance Criteria**:
  - [ ] `src/locales/en/translation.json` exists with identical content to old `public/locales/en/translation.json`
  - [ ] `src/locales/id/translation.json` exists with identical content
  - [ ] `public/locales/` directory no longer exists
  - [ ] `src/i18n/index.ts` imports from `'../locales/en/translation.json'` and `'../locales/id/translation.json'`
  - [ ] `npx tsc --noEmit` exits 0

  **QA Scenarios**:

  ```
  Scenario: i18n loads from new location
    Tool: Bash
    Steps:
      1. cat src/i18n/index.ts | grep "locales/"
      2. Assert paths reference '../locales/' not '../../public/locales/'
    Expected: paths updated
    Evidence: terminal output

  Scenario: public/locales removed
    Tool: Bash
    Steps:
      1. ls public/locales 2>&1
      2. Assert "No such file or directory"
    Expected: directory gone
    Evidence: terminal output
  ```

  **Commit**: NO

---

- [x] 2. **Fix dark theme so background is actually dark**

  **What to do**:
  - Open `src/index.css`
  - In the `:root` block (line ~94), replace the light-theme values with the dark-theme values from the `.dark` block so the dark theme is the default — no `.dark` class needed:
    ```css
    :root {
      --background: oklch(0.08 0 0); /* was: oklch(1 0 0) */
      --foreground: oklch(0.95 0 0); /* was: oklch(0.145 0 0) */
      --card: oklch(0.15 0 0); /* was: oklch(1 0 0) */
      --card-foreground: oklch(0.95 0 0);
      --popover: oklch(0.15 0 0);
      --popover-foreground: oklch(0.95 0 0);
      --primary: oklch(0.72 0.13 70); /* warm amber, NOT cold blue */
      --primary-foreground: oklch(0.1 0 0);
      --secondary: oklch(0.18 0 0);
      --secondary-foreground: oklch(0.95 0 0);
      --muted: oklch(0.18 0 0);
      --muted-foreground: oklch(0.65 0 0);
      --accent: oklch(0.2 0 0);
      --accent-foreground: oklch(0.95 0 0);
      --destructive: oklch(0.6 0.2 25);
      --border: oklch(1 0 0 / 10%);
      --input: oklch(1 0 0 / 12%);
      --ring: oklch(0.7 0.13 70 / 50%);
      --radius: 0.625rem;
    }
    ```
  - You can DELETE the entire `.dark { ... }` block (lines ~129–161) since the dark theme is now the default
  - Also delete the unused sidebar/chart variables in `:root` to keep things tidy (they're not used by this app)
  - In the `@theme` block, update `--color-primary` to `oklch(0.72 0.13 70)` (warm amber) instead of `oklch(0.7 0.15 250)` (cold blue)

  **Must NOT do**:
  - Do NOT add `.dark` class to `<html>` or `<body>` — fix this at the CSS-token level instead
  - Do NOT remove the `@theme` block
  - Do NOT change `--font-sans`, `--font-serif`, or `--radius-*` tokens

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Acceptance Criteria**:
  - [ ] `:root` has `--background: oklch(0.08 0 0)` (or equivalent dark value)
  - [ ] `.dark { ... }` block removed or empty
  - [ ] `@theme` block's `--color-primary` is a warm amber (hue around 70), not blue (hue 250)
  - [ ] Open `localhost:5173` shows dark background, not white

  **QA Scenarios**:

  ```
  Scenario: Dark background by default
    Tool: Bash + curl
    Steps:
      1. bun run dev in background
      2. curl localhost:5173 (just check it serves)
      3. Open browser, screenshot
    Expected: dark near-black background visible
    Evidence: visual

  Scenario: No light-theme leak
    Tool: Bash
    Steps:
      1. grep -E "oklch\\(1 0 0\\)" src/index.css | head -5
      2. Assert no `:root` `--background` is oklch(1 0 0)
    Expected: dark values only
    Evidence: terminal
  ```

  **Commit**: NO

---

- [x] 3. **Redesign HomeScreen with calmer, more elegant layout**

  **What to do**:
  - Open `src/screens/HomeScreen.tsx`
  - **Layout**: change root container from `max-w-2xl` to `max-w-xl`; reduce padding `pt-10 pb-12` → `pt-16 pb-20`; reduce gap `gap-10` → `gap-12`
  - **Header**: Add a small flex row at the very top with `Brand` on the left and `LanguageToggle` on the right (default small variant, NOT prominent). Remove the existing "Language / Bahasa" label + prominent toggle block entirely.
  - **Wordmark**: Replace the current giant centered `<h1 text-7xl text-shadow...>` block with the existing `<Brand />` component shown left-aligned in the header (Brand already renders the wordmark + tagline cleanly). Delete the centered title/divider block.
  - **Section labels**: Change all `text-xs text-white/40 uppercase tracking-[0.2em]` labels to `text-[11px] text-white/50 uppercase tracking-[0.18em] font-medium`
  - **Level picker**: Keep segmented control but REMOVE the emoji prefixes (`✦ ○ ◐ ●`) — they look noisy. Just clean text. Active state uses `bg-white/12 text-white` instead of `bg-white/20`.
  - **Timer picker**: Same — REMOVE the `⏱` emoji prefixes. Just clean text.
  - **Cards available count**: Change from pill badge to inline subtle text: `text-xs text-white/45 -mt-2` (no border, no background)
  - **Start button**: Remove the `boxShadow` glow and the `hover:scale-[1.01]`. Just `py-5 text-base font-semibold`. Let the solid primary background carry weight.
  - **Remove unused** `ChevronRight` import if it's the only `lucide-react` import (keep button text as just `t('home.start')` with no icon)

  **Must NOT do**:
  - Do NOT add new animations or transitions
  - Do NOT add box-shadow glows
  - Do NOT change the i18n keys used
  - Do NOT touch CategoryGrid behavior (it's fine)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Acceptance Criteria**:
  - [ ] Top of HomeScreen shows Brand on left, small LanguageToggle on right (one row, justified between)
  - [ ] No centered giant `text-7xl` wordmark
  - [ ] Level/timer buttons have NO emoji prefixes
  - [ ] Start button has NO box-shadow glow and NO chevron icon
  - [ ] `npx tsc --noEmit` exits 0
  - [ ] `bun run lint` exits 0

  **References**:
  - `src/components/Brand.tsx` — already renders the wordmark properly, reuse it
  - `src/components/LanguageToggle.tsx` — default variant is the small pill we want

  **Commit**: NO

---

- [x] 4. **Redesign LanguageToggle — remove the prominent variant**

  **What to do**:
  - Open `src/components/LanguageToggle.tsx`
  - **Delete** the entire `if (variant === 'prominent') { ... }` block (lines 21–52)
  - **Delete** the `variant?: 'default' | 'prominent'` prop from `LanguageToggleProps`
  - The remaining default rendering stays the same but tighten it: `gap-0.5` → `gap-0`, `px-3 py-1` → `px-2.5 py-1`, and add `text-[11px] font-semibold tracking-wider` to make the EN/ID labels feel intentional
  - Active state: `bg-white/15 text-white` (less bright than current `bg-white/20`)
  - Border: add `border border-white/8` to the fieldset for a thin outline
  - Update the export — no need for the variant prop anymore

  **Must NOT do**:
  - Do NOT remove the `aria-pressed` or `aria-label` attributes (accessibility)
  - Do NOT change the toggle logic (i18n.changeLanguage + writeSettings)
  - Do NOT change the test file (`src/components/__tests__/LanguageToggle.test.tsx`)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Acceptance Criteria**:
  - [ ] `LanguageToggle` no longer exports a `variant` prop
  - [ ] HomeScreen call `<LanguageToggle variant="prominent" />` updated to `<LanguageToggle />` (this happens in T3 but verify)
  - [ ] LanguageToggle test still passes

  **References**:
  - `src/components/__tests__/LanguageToggle.test.tsx` — check what it asserts before changing

  **Commit**: NO

---

- [x] 5. **Redesign Card, PlayingScreen, FinishedScreen for restraint**

  **What to do**:

  **a) `src/components/Card.tsx`**:
  - Front face background: keep `backdrop-blur-xl` but reduce opacity: `bg-[oklch(0.15_0_0_/_0.7)]` (deeper, less foggy)
  - Front face border: `border-white/8` (was `border-white/10`)
  - Back face background: `bg-[oklch(0.18_0.02_70_/_0.75)]` (warm amber tint, not blue)
  - Back face border: `border-[oklch(0.72_0.13_70_/_0.2)]`
  - Category badge: keep colored pill but reduce opacity: `bg-white/5 border-white/8`
  - Question text: keep `text-2xl` but change `text-white/90` → `text-white/95` for slightly more pop
  - Hint box: keep fade-in but reduce intensity — `bg-white/4 border-white/10` instead of `bg-primary/10 border-primary/20`
  - Reveal button: REMOVE the `boxShadow` glow inline style
  - Perspective label: change `text-primary/80` → `text-[oklch(0.72_0.13_70)]` (the warm amber)

  **b) `src/screens/PlayingScreen.tsx`**:
  - Remove the progress bar `h-0.5 bg-primary/40` under the counter
  - Counter: just `text-sm text-white/55 tabular-nums` (was wrapped with a progress bar)
  - Stop button: keep red-on-hover affordance but tighten — `text-white/50 hover:text-red-400 border border-white/8 hover:border-red-400/30 px-3 py-1.5 text-xs`
  - Card stack background layers: reduce the offset — `translate-y-2 translate-x-1.5` and `translate-y-1 translate-x-0.5` (current values are too dramatic)
  - Stop dialog: change confirm button from `bg-red-500/80` to `bg-red-500/90 hover:bg-red-600` for crisper contrast on the dark dialog

  **c) `src/screens/FinishedScreen.tsx`**:
  - REMOVE the `animate-ping` ring entirely — it's chaotic
  - Trophy: reduce from `w-24 h-24` to `w-16 h-16` (current is overkill)
  - Glow: reduce blur from `blur-2xl scale-[2]` to `blur-3xl scale-150` (softer, smaller)
  - REMOVE all the decorative `✦ ◆` glyphs scattered around — they look like artifacts on small screens
  - Title: keep `text-4xl font-light`
  - Count text: keep at one line, `text-lg text-white/65`
  - Play Again button: REMOVE the `boxShadow` glow, just solid `py-4 px-10`

  **Must NOT do**:
  - Do NOT change phase-handling logic in Card
  - Do NOT change the Dialog structure in PlayingScreen
  - Do NOT remove any i18n keys
  - Do NOT touch test files

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `[]`

  **Acceptance Criteria**:
  - [ ] Card front and back faces are visually distinct (warm amber tint on back)
  - [ ] No `boxShadow` inline styles on Card buttons or FinishedScreen button
  - [ ] No `animate-ping` anywhere in `src/screens/`
  - [ ] No decorative `✦` or `◆` glyphs in `src/screens/FinishedScreen.tsx`
  - [ ] PlayingScreen card stack offset reduced
  - [ ] All tests still pass

  **Commit**: NO

---

- [x] 6. **Verification — tsc, lint, format, tests, build**

  **What to do**:

  ```bash
  npx tsc --noEmit              # must exit 0
  bun run lint                  # must exit 0
  bun run format                # apply
  bun run format --check        # must exit 0
  bunx vitest run               # all 102 tests pass
  bun run build                 # exits 0
  bun run dev                   # background, then check terminal output has NO public/locales warnings
  ```

  - If `bun run dev` still warns about `public/locales/`, T1 didn't fully delete the public dir. Investigate.
  - If any test fails, investigate which UI change broke it and fix the JSX (without touching the test).

  **Acceptance Criteria**:
  - [ ] All commands exit 0
  - [ ] Vitest reports `Tests 102 passed (102)` or higher (no regressions)
  - [ ] `bun run dev` shows ZERO warnings about `public/locales/...`
  - [ ] Visual smoke: open `localhost:5173`, confirm dark background, readable wordmark, small language toggle top-right

  **Commit**: NO

---

## Final Verification Wave

> Skip the formal F1–F4 wave for this small fix-up plan. The verification step T6 above is sufficient.

---

## Success Criteria

### Verification Commands

```bash
npx tsc --noEmit        # 0
bun run lint            # 0
bun run format --check  # 0
bunx vitest run         # 102 pass
bun run build           # 0
bun run dev             # 0 public/locales warnings in terminal output
```

### Final Checklist

- [ ] Dark background visible at localhost:5173
- [ ] No Vite warnings about `public/locales/`
- [ ] LanguageToggle is a small pill in top-right of HomeScreen
- [ ] Provoke wordmark is the standard `<Brand />` size (text-4xl), not text-7xl
- [ ] No emoji prefixes on level/timer buttons
- [ ] No `animate-ping` or scattered `✦ ◆` glyphs on FinishedScreen
- [ ] No `boxShadow` glow inline styles on Start, Reveal, or Play Again buttons
- [ ] All 102 tests still pass
