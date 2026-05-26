## [T2] Core type contracts
- Added the `src/types/` contract layer as small, single-purpose files with a barrel export in `src/types/index.ts`.
- Kept `CategoryId` as a literal union and `GameState` as a `screen`-discriminated union to satisfy strict TS narrowing.
- `vitest` was not present initially, so the test dependency set was installed with Bun before running the `src/types` test slice.
