import { describe, it, expect } from 'vitest';
import { THEMES } from '../themes';
import { CATEGORY_IDS } from '../../types/category';

describe('THEMES', () => {
  it('has exactly 21 entries', () => {
    expect(Object.keys(THEMES).length).toBe(21);
  });

  it('covers all CategoryId literals', () => {
    CATEGORY_IDS.forEach((id) => {
      expect(THEMES[id]).toBeDefined();
    });
  });

  it('all colorPrimary use oklch()', () => {
    Object.values(THEMES).forEach((theme) => {
      expect(theme.colorPrimary).toMatch(/^oklch\(/);
    });
  });

  it('particleSpeed is in [0, 1]', () => {
    Object.values(THEMES).forEach((theme) => {
      expect(theme.particleSpeed).toBeGreaterThanOrEqual(0);
      expect(theme.particleSpeed).toBeLessThanOrEqual(1);
    });
  });

  it('bloomIntensity is in [0, 1.5]', () => {
    Object.values(THEMES).forEach((theme) => {
      expect(theme.bloomIntensity).toBeGreaterThanOrEqual(0);
      expect(theme.bloomIntensity).toBeLessThanOrEqual(1.5);
    });
  });

  it('particleColor is a hex color', () => {
    Object.values(THEMES).forEach((theme) => {
      expect(theme.particleColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
