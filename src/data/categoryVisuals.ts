import type { CategoryId } from '../types/category';

export type CategoryShape =
  | 'brokenSphere'
  | 'torus'
  | 'crown'
  | 'cubeGrid'
  | 'scales'
  | 'sphereCluster'
  | 'coinSpiral'
  | 'petals'
  | 'mirror'
  | 'orbitPair'
  | 'origami'
  | 'risingArrow'
  | 'crackedEarth'
  | 'lightRays'
  | 'brainMesh'
  | 'atom'
  | 'monolith'
  | 'voidRing'
  | 'impossible'
  | 'wayang'
  | 'screenShard';

export interface CategoryVisual {
  id: CategoryId;
  emotion: string;
  shape: CategoryShape;
  palette: readonly [string, string];
  movement: string;
  fusionWord: string;
}

export const CATEGORY_VISUALS: Record<CategoryId, CategoryVisual> = {
  ethics: {
    id: 'ethics',
    emotion: 'Guilt / Conscience',
    shape: 'brokenSphere',
    palette: ['#f4f7fb', '#8d929c'],
    movement: 'Slow pulsing, guilt-like',
    fusionWord: 'Conscience',
  },
  philosophy: {
    id: 'philosophy',
    emotion: 'Infinity / Mystery',
    shape: 'torus',
    palette: ['#4f2d9d', '#d6d7df'],
    movement: 'Infinite slow rotation',
    fusionWord: 'Mystery',
  },
  politics: {
    id: 'politics',
    emotion: 'Greed / Power',
    shape: 'crown',
    palette: ['#9b6a18', '#8d1022'],
    movement: 'Aggressive spin, erratic',
    fusionWord: 'Ambition',
  },
  technology: {
    id: 'technology',
    emotion: 'Control / Future',
    shape: 'cubeGrid',
    palette: ['#36e4ff', '#2577ff'],
    movement: 'Mechanical, grid-lock pulse',
    fusionWord: 'Control',
  },
  law: {
    id: 'law',
    emotion: 'Blind Justice',
    shape: 'scales',
    palette: ['#8f9bab', '#f8fbff'],
    movement: 'Slow pendulum swing',
    fusionWord: 'Judgment',
  },
  social: {
    id: 'social',
    emotion: 'Conformity / Crowd',
    shape: 'sphereCluster',
    palette: ['#b9afa3', '#d8c7aa'],
    movement: 'Flock/swarm behavior',
    fusionWord: 'Crowd',
  },
  economy: {
    id: 'economy',
    emotion: 'Greed / Cycle',
    shape: 'coinSpiral',
    palette: ['#e0aa2f', '#ffbf4f'],
    movement: 'Spinning vortex, downward',
    fusionWord: 'Hunger',
  },
  life: {
    id: 'life',
    emotion: 'Fragility / Bloom',
    shape: 'petals',
    palette: ['#ff9bbd', '#78d77a'],
    movement: 'Breathing, blooming motion',
    fusionWord: 'Bloom',
  },
  identity: {
    id: 'identity',
    emotion: 'Reflection / Fracture',
    shape: 'mirror',
    palette: ['#dce7ef', '#8fc6ff'],
    movement: 'Fragmented drift',
    fusionWord: 'Fracture',
  },
  relationship: {
    id: 'relationship',
    emotion: 'Love / Tension',
    shape: 'orbitPair',
    palette: ['#ff7aa8', '#8c1224'],
    movement: 'Orbit, attract/repel',
    fusionWord: 'Love',
  },
  education: {
    id: 'education',
    emotion: 'Growth / Structure',
    shape: 'origami',
    palette: ['#ffd166', '#b88b57'],
    movement: 'Slow unfolding loop',
    fusionWord: 'Growth',
  },
  career: {
    id: 'career',
    emotion: 'Pressure / Climb',
    shape: 'risingArrow',
    palette: ['#45ff6d', '#050706'],
    movement: 'Upward pulse, tension',
    fusionWord: 'Climb',
  },
  environment: {
    id: 'environment',
    emotion: 'Decay / Hope',
    shape: 'crackedEarth',
    palette: ['#7a4a28', '#36c76b'],
    movement: 'Slow crack-then-heal loop',
    fusionWord: 'Renewal',
  },
  religion: {
    id: 'religion',
    emotion: 'Transcendence / Doubt',
    shape: 'lightRays',
    palette: ['#ffd27d', '#17275c'],
    movement: 'Radial breathing glow',
    fusionWord: 'Faith',
  },
  psychology: {
    id: 'psychology',
    emotion: 'Chaos / Mirror',
    shape: 'brainMesh',
    palette: ['#8e42ff', '#ff45c8'],
    movement: 'Warping, morphing ripple',
    fusionWord: 'Mind',
  },
  science: {
    id: 'science',
    emotion: 'Precision / Discovery',
    shape: 'atom',
    palette: ['#9ee8ff', '#ffffff'],
    movement: 'Electron orbit spin',
    fusionWord: 'Discovery',
  },
  power: {
    id: 'power',
    emotion: 'Domination / Collapse',
    shape: 'monolith',
    palette: ['#050505', '#b01322'],
    movement: 'Slow topple, crack spread',
    fusionWord: 'Dominion',
  },
  future: {
    id: 'future',
    emotion: 'Uncertainty / Awe',
    shape: 'voidRing',
    palette: ['#073738', '#14ffd8'],
    movement: 'Outward expanding pulse',
    fusionWord: 'Awe',
  },
  paradox: {
    id: 'paradox',
    emotion: 'Contradiction',
    shape: 'impossible',
    palette: ['#ff5fd7', '#5fffdc'],
    movement: 'Escher-like loop transform',
    fusionWord: 'Contradiction',
  },
  local: {
    id: 'local',
    emotion: 'Roots / Tension',
    shape: 'wayang',
    palette: ['#b86d2b', '#e5b46e'],
    movement: 'Gentle sway, cultural drift',
    fusionWord: 'Roots',
  },
  popculture: {
    id: 'popculture',
    emotion: 'Noise / Dopamine',
    shape: 'screenShard',
    palette: ['#ff2fb7', '#ffd43b'],
    movement: 'Glitch effect, strobe pulse',
    fusionWord: 'Dopamine',
  },
};

const SPECIAL_FUSIONS = new Map<string, string>([
  ['ethics|relationship', 'Tortured Love'],
  ['economy|politics', 'Golden Appetite'],
  ['identity|psychology', 'Broken Self'],
  ['environment|future', 'Green Omen'],
  ['law|power', 'Iron Verdict'],
  ['philosophy|paradox', 'Infinite Contradiction'],
  ['popculture|technology', 'Electric Noise'],
]);

export function getCategoryVisual(id: CategoryId): CategoryVisual {
  return CATEGORY_VISUALS[id];
}

export function getFusionName(ids: readonly CategoryId[]): string {
  if (ids.length === 0) return 'Quiet Atmosphere';
  const first = ids[0];
  if (!first) return 'Quiet Atmosphere';
  if (ids.length === 1) return CATEGORY_VISUALS[first].emotion;

  const key = [...ids].sort().join('|');
  const special = SPECIAL_FUSIONS.get(key);
  if (special) return special;

  const second = ids[1] ?? first;
  return `${CATEGORY_VISUALS[first].fusionWord} of ${CATEGORY_VISUALS[second].fusionWord}`;
}

export function getFusionPalette(ids: readonly CategoryId[]): readonly [string, string] {
  if (ids.length === 0) return ['#4f2d9d', '#d6d7df'];
  const first = ids[0];
  if (!first) return ['#4f2d9d', '#d6d7df'];
  if (ids.length === 1) return CATEGORY_VISUALS[first].palette;

  const lastId = ids[ids.length - 1] ?? first;
  return [CATEGORY_VISUALS[first].palette[0], CATEGORY_VISUALS[lastId].palette[1]];
}
