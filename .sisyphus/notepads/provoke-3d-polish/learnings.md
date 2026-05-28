## [INIT] Inherited from provoke-web notepad

### Architecture
- R3F Canvas: `fixed inset-0 -z-10 pointer-events-none` — always behind UI
- `Scene.tsx`: Canvas with `dpr={[1,1]}`, camera `position=[0,0,5] fov=60`
- `CategoryAtmosphere.tsx`: shapes grouped at `position=[0,0,-2]`, radius 1.35 for multi-select spread
- `Particles.tsx`: 60k/20k/5k particles, random velocities, no mouse interaction yet
- `ThemeProvider.tsx`: holds `selectedCategoryIds`, `transitionTick`, `triggerTransition`
- `useOptionalTheme()` for components that may render outside ThemeProvider (tests)

### CSS
- Tailwind v4 + `tw-animate-css` — NO `tailwindcss-animate`
- `@fontsource-variable/geist` self-hosted — NO Google Fonts CDN
- `provoke-button` class: cubic-bezier transitions, ripple span
- `category-button` class: glow vars, ripple/burst hooks

### Constraints
- dpr MUST stay `[1,1]` in Scene.tsx
- Do NOT add npm packages
- Do NOT modify test files
- No Playwright — static analysis QA only
- No auto-commit/push

### Key Issues to Fix
1. 3D shapes cluster at center (radius 1.35, position z=-2) — need to spread across full viewport
2. Particles have no mouse interaction — need mouse repulsion/attraction
3. Playing screen: card covers 3D — need card centered with shapes orbiting around it
4. Home screen: too basic — needs premium typography, layout, visual hierarchy

## [Task: viewport-spread + mouse-repulsion + card-centering]

### CategoryAtmosphere.tsx — viewport spread
- Added module-level `QUADRANTS` array (4 entries, `as const`) for corner positions
- `useThree().viewport` destructured inside `CategoryAtmosphere`; `viewport.width/height` passed as props to `CategoryShape`
- `ShapeProps` extended with `viewportWidth: number; viewportHeight: number`
- Removed `angle`/`radius` approach; replaced with `QUADRANTS[index] ?? ([0.32, 0.22] as const)` guard pattern to satisfy `noUncheckedIndexedAccess`
- Base scale raised from 1.0 to 2.2 in active state
- Outer group `position` moved from `[0,0,-2]` to `[0,0,0]`; inner group from `[0,0,-1]` to `[0,0,-1.5]`

### Particles.tsx — mouse repulsion
- Module-level `mouseNDC` object (no React state = no re-renders)
- Window `mousemove` listener in `useEffect` with proper cleanup
- Camera obtained from `useFrame(({ camera }, delta) =>` state argument — NOT `useThree()` because test mock for `@react-three/fiber` only provides `useFrame`/`Canvas`
- Repulsion skipped for `tier === 'low'` (performance)
- `new THREE.Vector3(...).unproject(camera)` inside mouseNDC.active guard — runs only when mouse has moved

### PlayingScreen.tsx — card centering
- Outer container: removed `py-6 gap-6`, added `py-4`
- Top bar: added `py-2`
- Card stack wrapped in `flex-1 flex items-center justify-center py-4`; inner div gets `w-full`

### Key Gotcha
- `@react-three/fiber` Vitest mock in `Particles.test.tsx` only mocks `useFrame` + `Canvas`
- Adding `useThree()` to Particles component breaks ALL 3 Particles tests
- Solution: use `useFrame` callback's `state.camera` instead — same object, test-compatible

## [Task: HomeScreen + Brand premium redesign]

### Brand.tsx
- Gradient text: `bg-gradient-to-r from-white to-[oklch(0.85_0.12_70)] bg-clip-text text-transparent` — removes need for textShadow (transparent text can't show shadow)
- Responsive title: `text-4xl sm:text-5xl` — mobile/desktop breakpoint via Tailwind responsive prefix
- Separator line: `<div className="w-10 h-px bg-gradient-to-r from-white/25 to-transparent" />` between title and tagline
- Decorative rule: `<div className="w-8 h-px bg-gradient-to-r from-primary/60 to-transparent mt-2" />` after tagline

### HomeScreen.tsx
- SectionLabel helper component: `ReactNode` children, amber accent bar `w-1 h-4 rounded-full bg-gradient-to-b from-primary/80 to-primary/20`
- `import { type ReactNode, useState } from 'react'` — use named type import, avoid `React.ReactNode` namespace pattern
- Glassmorphism controls: `bg-black/30 border border-white/8 backdrop-blur-sm`
- Active button glow: `bg-gradient-to-b from-white/15 to-white/8 border border-white/20 shadow-[0_0_12px_oklch(0.72_0.13_70_/_0.15)]`
- Start button glow: conditional `shadow-[0_0_28px_oklch(0.72_0.13_70_/_0.35)]` via template literal
- Fusion label ✦ icon: nested spans `<span className="text-primary/60 text-xs">✦</span>`
- Available count pill: `inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/8`
- `border-white/8` and `border-white/6` — valid Tailwind v4 opacity modifiers (same pattern as existing `border-white/10`)

### index.css — .category-fusion-label gradient border
- `border: 1px solid transparent` + `background-clip: padding-box` + `box-shadow: 0 0 0 1px oklch(0.72 0.13 70 / 20%)` = gradient border effect using box-shadow trick
- Inset highlight: `inset 0 1px 0 oklch(1 0 0 / 8%)` — subtle top edge catch light
