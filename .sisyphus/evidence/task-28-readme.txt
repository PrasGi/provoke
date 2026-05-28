Provoke is a cinematic bilingual card game rebuilt from the ThinkDeck prototype with React, TypeScript, glass-morphism cards, and category-themed 3D particle backgrounds. Players choose one or more categories, draw reflective prompts, reveal hints and perspectives, and can switch between English and Indonesian content without any backend or runtime API calls.
- Vite
- React 19
- Tailwind CSS v4
- React Three Fiber (`@react-three/fiber`) with drei and postprocessing
- i18next and react-i18next
- Vitest
| `bun run dev` | Validates CSV, regenerates typed questions, and starts Vite. |
| `bun test` | Runs the Vitest/Bun-compatible unit test suite. |
| `bunx vitest run` | Runs Vitest directly. |
- [Vercel Vite deployments](https://vercel.com/docs/frameworks/vite)
- [Netlify Vite deployments](https://docs.netlify.com/integrations/frameworks/vite/)
  i18n/            i18next initialization.
  three/           Persistent R3F scene, particles, postprocessing, theme provider, and quality tier hook.
- The R3F scene is mounted once at the app root and persists across screen changes.
