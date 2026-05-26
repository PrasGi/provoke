import type { CategoryId } from './category';
import type { Level } from './level';
import type { Phase } from './phase';
import type { Question } from './question';

export type GameState =
  | { screen: 'home' }
  | { screen: 'playing'; selectedCategories: CategoryId[]; level: Level | 'all';
      timerDur: number; deck: Question[]; idx: number; phase: Phase;
      secs: number; running: boolean }
  | { screen: 'finished'; totalSeen: number };
