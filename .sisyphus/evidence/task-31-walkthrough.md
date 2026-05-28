# Task 31 Static Integration Walkthrough

## Dev Server Check

- Started `bun run dev` locally.
- `curl http://localhost:5173/` returned `<title>Provoke</title>`.
- Evidence: `.sisyphus/evidence/task-31-curl-title.txt`.

## Render Tree Trace

### `src/main.tsx`

- Initializes i18n before app render through `import './i18n/index'`.
- Imports self-hosted Inter and Instrument Serif font CSS.
- Mounts `<App />` into `#root` via `ReactDOM.createRoot`.

### `src/App.tsx`

- Wraps the app in `ThemeProvider`.
- Runs `StorageSync` for session persistence and resume handling.
- Mounts the persistent `Scene` once with `Particles` and `PostFX` children.
- Uses `ScreenSwitcher` to render `HomeScreen`, `PlayingScreen`, or `FinishedScreen` from the discriminated `state.screen` value.

### `src/screens/HomeScreen.tsx`

- Renders `Brand`, `LanguageToggle`, `CategoryGrid`, level picker, timer picker, available-card count, and Start button.
- Start is disabled until at least one selected category has available questions for the selected level.
- `handleStart` delegates to the game store `start(selected, level, timerDur)`.

### `src/screens/PlayingScreen.tsx`

- Renders only when `state.screen === 'playing'` and a guarded current card exists.
- Updates the active 3D category theme from the current card category.
- Runs the timer interval only while `running` is true and the timer duration is nonzero.
- Renders card counter, optional `Timer`, guarded quit button, stacked card background, and `Card` actions for hint, reveal, and next.

### `src/screens/FinishedScreen.tsx`

- Renders only when `state.screen === 'finished'`.
- Displays trophy, localized title, played-card count, and replay button wired to the game store `replay` action.

## Static Checks

- All traced imports resolve through TypeScript and lint validation.
- No undefined refs observed in the traced files.
- Conditional rendering matches the intended phase flow: home selection → playing card loop → finished summary.
- No `TODO` or `TODO: wire this` comments remain in `src/screens/`.
