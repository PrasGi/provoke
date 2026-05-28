// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../theme-context', () => ({
  useTheme: vi.fn(() => ({
    theme: {
      id: 'ethics',
      particleColor: '#ff8800',
      particleSpeed: 0.5,
      bloomIntensity: 0.5,
      mood: 'contemplative',
      colorPrimary: 'oklch(0.7 0.12 70)',
      colorSecondary: 'oklch(0.6 0.1 70)',
      colorAccent: 'oklch(0.8 0.15 70)',
      particleDensityMul: 1.0,
    },
    themeRef: {
      current: {
        id: 'ethics',
        particleColor: '#ff8800',
        particleSpeed: 0.5,
        bloomIntensity: 0.5,
        mood: 'contemplative',
        colorPrimary: 'oklch(0.7 0.12 70)',
        colorSecondary: 'oklch(0.6 0.1 70)',
        colorAccent: 'oklch(0.8 0.15 70)',
        particleDensityMul: 1.0,
      },
    },
    setCategoryId: vi.fn(),
  })),
}));

vi.mock('../useQualityTier', () => ({
  useQualityTier: vi.fn(() => 'high'),
}));

import { Particles } from '../Particles';
import { useQualityTier } from '../useQualityTier';
import { renderReact } from './react-test-helpers';

describe('Particles', () => {
  it('renders without crashing at high tier', () => {
    vi.mocked(useQualityTier).mockReturnValue('high');
    let unmount: (() => void) | undefined;
    expect(() => {
      unmount = renderReact(<Particles />).unmount;
    }).not.toThrow();
    unmount?.();
  });

  it('returns null when tier is none', () => {
    vi.mocked(useQualityTier).mockReturnValue('none');
    const { container, unmount } = renderReact(<Particles />);
    expect(container.firstChild).toBeNull();
    unmount();
  });

  it('returns null when tier is none (no canvas)', () => {
    vi.mocked(useQualityTier).mockReturnValue('none');
    const { container, unmount } = renderReact(<Particles />);
    expect(container.innerHTML).toBe('');
    unmount();
  });
});
