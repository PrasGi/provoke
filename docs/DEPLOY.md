# Deploying Provoke

Provoke is a static Vite app. It does not require a backend, runtime API keys, authentication, analytics, or cloud sync.

## Production Build

Create the production output locally:

```bash
bun run build
```

Vite writes the static site to `dist/`.

## Vercel

1. Import the repository in Vercel.
2. Select the Vite framework preset if prompted.
3. Use `bun run build` as the build command.
4. Use `dist` as the output directory.
5. Leave environment variables empty for v1.

`vercel.json` includes an SPA rewrite to `index.html` and immutable caching for built assets.

## Netlify

1. Import the repository in Netlify.
2. Use `bun run build` as the build command.
3. Use `dist` as the publish directory.
4. Leave environment variables empty for v1.

`netlify.toml` includes the same SPA fallback so refreshed deep links resolve to the React app.

## Environment Variables

Provoke v1 requires no runtime environment variables. `.env.example` documents this intentionally.

## Pre-Deploy Checks

Run these before publishing:

```bash
bun run csv:validate
npx tsc --noEmit
bun run lint
bunx vitest run
bun run build
```

The build may emit a Vite chunk-size warning because Three.js is intentionally bundled for the particle scene; that warning is acceptable if the command exits with code 0.
