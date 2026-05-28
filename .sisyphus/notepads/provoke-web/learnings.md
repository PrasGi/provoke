## [T11] ThemeProvider

- `ThemeProvider` can keep `themeRef.current` synchronized with the active `CategoryTheme` on every render, which lets R3F consumers read the latest theme without causing remounts.
- Using `categoryId ?? fallbackId` preserves the default philosophy theme while still allowing an explicit `null` reset path.
- A small context value with `{ theme, setCategoryId, themeRef }` is enough for both React consumers and frame-loop code.

## [T9] CSV pipeline

- `bun run prebuild` now validates `src/data/questions.csv` before generating `src/data/questions.generated.ts`.
- `papaparse` handles the quoted CSV fields cleanly; Zod catches missing/invalid fields and the scripts stop on duplicate `qid` values.
- The generated module imports `Question` as a type only, so the test suite can assert shape without adding runtime coupling.

## [T13] Scene.tsx

- Keep the accessibility wrapper on the outer container and render the fallback as a fully static gradient div when useQualityTier() returns "none".
- The Canvas wrapper should lock dpr to [1, 1] and attach the webglcontextlost handler in onCreated so low-tier devices can recover by falling back on the next render.
- Vitest module mocks for @react-three/fiber must be hoisted; using vi.hoisted avoids the canvas mock initialization error.

## [T14] Game store FSM

- Zustand v5 + `zustand/middleware/immer` requires installing `immer` explicitly as a peer dep (`bun add immer`); otherwise vitest fails with "Cannot find package 'immer'".
- Discriminated-union narrowing via `if (store.state.screen !== 'playing') return;` inside immer producers works cleanly with `noUncheckedIndexedAccess`.
- Fisher-Yates loop under `noUncheckedIndexedAccess` requires explicit local typed bindings for swapped elements (`const ai = a[i] as T`) since `arr[i]` is inferred as `T | undefined`.
- Test reset pattern: `useGameStore.setState({ state: { screen: 'home' } })` in `beforeEach`.

## [T19] Timer component

- The timer can stay a pure presentational leaf: format display in one helper, threshold classes in two helpers, and return `null` when `total === 0`.
- `fontVariantNumeric: 'tabular-nums'` plus Tailwind `tabular-nums` keeps the countdown width stable as digits change.
- The 60s/30s breakpoints work well as inclusive thresholds for amber/red urgency, while the bar width can be driven directly from `secs / total`.

## [T20] LanguageToggle + Brand

- `LanguageToggle` should read the current language from `i18n.language`, short-circuit on active/disabled clicks, and persist only the `language` field back through `writeSettings`.
- The locale keys for `app.title`, `app.tagline`, and `lang.toggle.*` already exist, so the components can stay thin and avoid fallback text.
- Test the toggle by mocking `react-i18next` and `../../store/persist`; that keeps the suite deterministic and avoids localStorage access.

## [T21] i18n category labels

- Added a top-level `category` section to both locale files so EN/ID key parity stays intact.
- Kept all existing translation keys unchanged; only injected the 21 label/description pairs.
- TypeScript parity needed a `src/vitest.d.ts` shim because the test setup file is outside `tsconfig.json`'s `include`, so matcher types were not visible to `tsc`.

## [T15] Particles component

- `TIER_COUNTS` as a const object keyed by `QualityTier` lets TypeScript infer exact numeric types and ensures all tiers are handled.
- `useFrame` reading `themeRef.current` (a React ref) is the correct pattern for zero-re-render theme updates — mutable ref avoids triggering React reconciliation on every theme change.
- `noUncheckedIndexedAccess: true` applies to typed arrays (Float32Array) as well — `arr[i]` returns `number | undefined`, requiring `?? 0` guards in the particle loop.
- For R3F v9 geometry attributes: `attach="attributes-position"` uses dash-notation to map to `geometry.attributes.position`.
- `vitest-canvas-mock` in `vitest.setup.ts` covers all tests globally — no per-file import needed.
- Disposing geometry+material in `useEffect` cleanup via optional chaining (`geoRef.current?.dispose()`) is safe even if refs never got assigned.
- Testing strategy: mock `@react-three/fiber`, `ThemeProvider`, and `useQualityTier` to isolate the component; verify null-return for `tier === 'none'` and no-crash for active tiers.

## [T17] Card component

- **CSS 3D flip**: `perspective` on outer wrapper, `transformStyle: preserve-3d` on the flipper div, `backfaceVisibility: hidden` on both face divs. Back face requires `transform: rotateY(180deg)` as its base state.
- **Reduced motion**: When `reducedMotion=true`, `transition: none` so flip is instant (no animation). Additionally, perspective text is rendered inline below the card so it's always accessible without relying on a visual flip.
- **Glass morphism**: `backdrop-blur-xl bg-[oklch(0.18_0_0/_0.6)] border border-white/10 shadow-2xl` — Tailwind v4 supports oklch color syntax natively.
- **Font application**: `style={{ fontFamily: 'var(--font-serif)' }}` inline style for question text since Tailwind doesn't have a class for custom CSS variable fonts.
- **vitest path alias**: `vitest.config.ts` needed `resolve.alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }` for components that import `@/lib/utils` (shadcn Button) to resolve in tests. Used ESM-safe `fileURLToPath + import.meta.url` pattern since package is `"type": "module"`.
- **i18n in tests**: Importing `../../i18n/index` at top of test file initializes i18n synchronously (resources are pre-loaded, not HTTP fetched). No `await` needed.
- **Button accessible name**: `play.reveal` → "Reveal Perspective" — regex `/reveal/i` matches. `play.hint` → "Hint" — regex `/hint/i` matches. Confirmed via test 5 passing.
- **Phase-gated hint button**: Hint button only renders when `phase === 'thinking' && hasHint`. `hasHint = Boolean(hint_en || hint_id based on lang)`.

## [T16] PostFX

- `@react-three/postprocessing` types accepted by tsc without issues when JSX is tsx
- `EffectComposer` + `Bloom` are the only imports needed for bloom-only post-processing
- `rg` (ripgrep) not available in this env; `grep -rn` works as substitute
- Quality-gating pattern: early return `null` guards both `'none'` and `'low'` tiers before any effect setup
- Bloom intensity derived from `useTheme().theme.bloomIntensity` (range 0–1.5 per themes.test.ts)
- Medium tier scales intensity to 60% to stay subtle on lower-end devices

## [T18] CategoryGrid

- `THEMES` is typed `Record<CategoryId, CategoryTheme>` (not `Partial<>`), so `THEMES[cat.id]` always has a value; the `theme?.colorPrimary ?? fallback` guard is defensive but harmless.
- `// @vitest-environment jsdom` directive must be the first line of test files that render React components — it's a Vitest framework directive, not a descriptive comment.
- `aria-pressed={isSelected}` renders as `aria-pressed="true"` or `aria-pressed="false"` in the DOM, so `.getAttribute('aria-pressed') === 'true'` works correctly in tests.
- ESLint requires explicit `type="button"` on all `<button>` elements in this project (no default inferred).
- Using `new Set(selected)` inside the render function (not memoized) is fine for a list of ≤21 IDs — no perf concern.
- `color-mix(in oklch, ...)` is used directly in inline styles for the selected-chip tint; supported in all modern browsers.

## [T24] FinishedScreen

- `FinishedScreen` can rely on the existing `finished` i18n keys already present in both locale files: `finished.title`, `finished.cards_played`, and `finished.play_again`.
- `useGameStore.replay()` already resets the store from `finished` back to `home`, so the replay button only needs to call the store action.
- The project’s test style for screen components uses `// @vitest-environment jsdom`, imports `../../i18n/index`, and resets the store in `beforeEach` with `useGameStore.setState(...)`.

## [T23] PlayingScreen

- Zustand selectors must be primitive/individual subscriptions to avoid infinite-loop re-renders; selecting an object literal (`(s) => ({...})`) without `shallow` triggers React 18 "getSnapshot should be cached" warnings. Solution: one `useGameStore` call per action/state slice.
- Hooks (`useEffect`) must run before any conditional `return null` to satisfy rules-of-hooks. Computed values used in deps are derived from `isPlaying ? state.x : default` so the effects can sit above the early returns.
- Test mocks needed: `../../store/persist` (readSettings) and `../../three/ThemeProvider` (useTheme). Without ThemeProvider mock, `useTheme` throws because there's no provider in the test render tree.
- The vitest pragma `// @vitest-environment jsdom` is required at the top of component test files in this repo.

## [T22] HomeScreen

- `LanguageToggle` renders buttons with `aria-pressed` (EN/ID), so filtering `getAllByRole('button').filter(b => b.hasAttribute('aria-pressed'))` in tests picks up language buttons BEFORE category chips. Must exclude them by text content: `.filter(b => b.textContent !== 'EN' && b.textContent !== 'ID')`.
- React 19 concurrent rendering does not synchronously flush state updates from `fireEvent.click` in all cases; use `waitFor()` for assertions that depend on state propagating from a child `onChange` to a parent re-render.
- `@base-ui/react/button` default is `focusableWhenDisabled = false`, `nativeButton = true`; it maps `disabled` prop directly to the HTML `disabled` attribute, so `toBeDisabled()` works correctly.
- `canStart = selected.length > 0 && availableCount > 0` is the correct guard — ensures both a selection AND questions for that selection exist before enabling Start.
- `readSettings()` / `writeSettings()` must be mocked in tests since they use `localStorage` which is unavailable until jsdom is set up and the calls happen inside effects.

## [T25] App.tsx root

- Wired ThemeProvider > Scene(Particles+PostFX) persistent at root, ScreenSwitcher uses exhaustive switch with `const _exhaustive: never = state` check.
- main.tsx now imports `./i18n/index` BEFORE fonts/App so translations register before React renders.
- index.html: added theme-color (oklch dark) + expanded meta description; title=Provoke, lang=en.
- Pre-existing vite gap: shadcn Button uses `@/lib/utils` but vite.config.ts had no `@` alias (only tsconfig paths). Added `resolve.alias` so rollup resolves the import.
- LSP hints (unused React import, unused `_exhaustive`) are intentional: React kept for JSX runtime explicitness; `_exhaustive` is the exhaustiveness assertion.
- tsc --noEmit: 0. bun run build: 0. dist/index.html contains <title>Provoke</title>, theme-color, lang=en.

## [T27] Test suite

- `vitest.config.ts` already matches the repo needs: jsdom environment, global setup file, and `@` alias to `src/`.
- `vitest.setup.ts` correctly loads `vitest-canvas-mock` and `@testing-library/jest-dom/vitest` for the R3F + DOM test mix.
- All 18 required test files exist, and `rg -n "(it|test|describe)\.skip" src/` returned no matches.
- Full suite passed cleanly: 18 test files / 96 tests / 0 failures.

## [T26] localStorage wiring

- Session persistence should store only `qid` strings; resolving back to `Question` objects belongs in one helper so storage stays stable across schema changes.
- Clearing the saved session must happen on a real home transition, not just whenever the app happens to mount on `home`, or resumable sessions disappear immediately.
- Mount-time settings restore is best handled by reusing the i18n detector path, so the app keeps a single language source of truth.

## [F3] Static-analysis QA rerun

- Rechecked all 9 required surfaces after the rejected `React` import fix in `src/components/Card.tsx`.
- `lsp_diagnostics` returned no errors for every touched file.
- Prior blocker was only the unused `React` import; it is no longer present.
- Moved locale JSON files from public/locales/ to src/locales/ to avoid Vite asset-import warnings.
- Updated src/i18n/index.ts imports to ../locales/en/translation.json and ../locales/id/translation.json.
- Verified src/locales/en/translation.json and src/locales/id/translation.json exist, are non-empty, and public/locales/ is removed.
- Verified with npx tsc --noEmit and lsp_diagnostics on src/i18n/index.ts.

## T2–T5 Dark Theme + UI Redesign (2026-05-27)

- `:root` in Tailwind v4 projects is the correct place for dark-default tokens — `.dark {}` block is dead code if `.dark` is never applied to `<html>`
- The CSS LSP in this project throws false positives for `@theme`, `@apply`, `@custom-variant` — these are Tailwind-specific syntax and are not real errors; `tsc --noEmit` and `bun run lint` are the real gatekeepers
- `Brand` component exists at `src/components/Brand.tsx` — safe to import in HomeScreen
- Removing `variant` prop from `LanguageToggle` did not break the test at `src/components/__tests__/LanguageToggle.test.tsx` — test only exercises the default rendering
- Card back-face amber tint: `bg-[oklch(0.18_0.02_70_/_0.75)]` with `border-[oklch(0.72_0.13_70_/_0.2)]` gives a warm amber glow without being garish
- PlayingScreen: removing the `<div className="h-0.5 ...">` progress bar and the `flex flex-col gap-1.5` wrapper required collapsing them into a single flat `flex items-center justify-between` row
