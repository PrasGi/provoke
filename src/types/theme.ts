import type { CategoryId } from './category';

export interface CategoryTheme {
  id: CategoryId;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  particleColor: string;
  particleSpeed: number;
  particleDensityMul: number;
  bloomIntensity: number;
  mood: string;
}
