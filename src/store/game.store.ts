import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState } from '../types/game';
import type { CategoryId } from '../types/category';
import type { Level } from '../types/level';
import { QUESTIONS } from '../data/questions.generated';

// Fisher-Yates shuffle
function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const ai = a[i] as T;
    const aj = a[j] as T;
    a[i] = aj;
    a[j] = ai;
  }
  return a;
}

interface GameStore {
  state: GameState;
  start: (selectedCategories: CategoryId[], level: Level | 'all', timerDur: number) => void;
  revealPerspective: () => void;
  showHint: () => void;
  nextCard: () => void;
  tick: () => void;
  replay: () => void;
  quit: () => void;
}

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    state: { screen: 'home' } as GameState,

    start: (selectedCategories, level, timerDur) =>
      set((store) => {
        if (store.state.screen !== 'home') return;
        const filtered = QUESTIONS.filter(
          (q) =>
            selectedCategories.includes(q.category_id) && (level === 'all' || q.level === level),
        );
        const deck = shuffle(filtered);
        if (deck.length === 0) return;
        store.state = {
          screen: 'playing',
          selectedCategories,
          level,
          timerDur,
          deck,
          idx: 0,
          phase: 'thinking',
          secs: timerDur,
          running: timerDur > 0,
        };
      }),

    revealPerspective: () =>
      set((store) => {
        if (store.state.screen !== 'playing') return;
        if (store.state.phase === 'revealed') return;
        store.state.phase = 'revealed';
        store.state.running = false;
      }),

    showHint: () =>
      set((store) => {
        if (store.state.screen !== 'playing') return;
        if (store.state.phase !== 'thinking') return;
        store.state.phase = 'hinted';
      }),

    nextCard: () =>
      set((store) => {
        if (store.state.screen !== 'playing') return;
        const { idx, deck, timerDur } = store.state;
        const nextIdx = idx + 1;
        if (nextIdx >= deck.length) {
          const categoryCounts = deck.reduce<Partial<Record<CategoryId, number>>>((acc, q) => {
            acc[q.category_id] = (acc[q.category_id] ?? 0) + 1;
            return acc;
          }, {});
          store.state = { screen: 'finished', totalSeen: deck.length, categoryCounts };
        } else {
          store.state.idx = nextIdx;
          store.state.phase = 'thinking';
          store.state.secs = timerDur;
          store.state.running = timerDur > 0;
        }
      }),

    tick: () =>
      set((store) => {
        if (store.state.screen !== 'playing') return;
        if (!store.state.running) return;
        if (store.state.secs <= 0) {
          store.state.running = false;
          return;
        }
        store.state.secs -= 1;
        if (store.state.secs <= 0) {
          store.state.running = false;
        }
      }),

    replay: () =>
      set((store) => {
        if (store.state.screen !== 'finished') return;
        store.state = { screen: 'home' };
      }),

    quit: () =>
      set((store) => {
        store.state = { screen: 'home' };
      }),
  })),
);
