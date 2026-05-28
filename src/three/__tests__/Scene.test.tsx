// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderReact } from './react-test-helpers';

const canvasMock = vi.hoisted(() =>
  vi.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  )),
);

vi.mock('@react-three/fiber', () => ({
  Canvas: canvasMock,
}));

vi.mock('../useQualityTier', () => ({
  useQualityTier: vi.fn(),
}));

import { Scene } from '../Scene';
import { useQualityTier } from '../useQualityTier';

describe('Scene', () => {
  it('renders a static gradient when quality tier is none', () => {
    vi.mocked(useQualityTier).mockReturnValue('none');

    const { container, unmount } = renderReact(<Scene />);
    const gradient = container.querySelector('[role="presentation"]');

    expect(container.querySelector('canvas')).toBeNull();
    if (!gradient) {
      throw new Error('Expected gradient fallback');
    }

    expect(gradient.classList.contains('bg-gradient-to-br')).toBe(true);
    expect(gradient.classList.contains('pointer-events-none')).toBe(true);
    expect(canvasMock).not.toHaveBeenCalled();
    unmount();
  });

  it('renders Canvas with the expected props when quality tier is high', () => {
    vi.mocked(useQualityTier).mockReturnValue('high');

    const { container, unmount } = renderReact(
      <Scene>
        <span>scene-child</span>
      </Scene>,
    );

    expect(container.querySelector('[data-testid="r3f-canvas"]')).not.toBeNull();
    expect(canvasMock).toHaveBeenCalledTimes(1);

    const props = canvasMock.mock.calls[0]?.[0] as {
      onCreated?: (args: { gl: { domElement: { addEventListener: typeof vi.fn } } }) => void;
      dpr?: readonly [number, number];
      camera?: { position: readonly [number, number, number]; fov: number };
      gl?: { antialias: boolean; alpha: boolean; powerPreference: string };
    };

    expect(props.dpr).toEqual([1, 1]);
    expect(props.camera).toEqual({ position: [0, 0, 5], fov: 60 });
    expect(props.gl).toEqual({ antialias: true, alpha: true, powerPreference: 'high-performance' });

    const addEventListener = vi.fn();
    props.onCreated?.({ gl: { domElement: { addEventListener } } });

    expect(addEventListener).toHaveBeenCalledWith('webglcontextlost', expect.any(Function));
    unmount();
  });
});
