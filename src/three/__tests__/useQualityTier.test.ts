// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQualityTier } from '../useQualityTier';
import { renderHookValue } from './react-test-helpers';

function mockMatchMedia(reducedMotion: boolean, isMobile: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        query === '(prefers-reduced-motion: reduce)'
          ? reducedMotion
          : query === '(max-width: 768px)'
            ? isMobile
            : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('useQualityTier', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { writable: true, value: 8 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns none when prefers-reduced-motion is set', () => {
    mockMatchMedia(true, false);

    const { result, unmount } = renderHookValue(() => useQualityTier());

    expect(result.current).toBe('none');
    unmount();
  });

  it('returns high for desktop with 12 cores', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { writable: true, value: 12 });
    mockMatchMedia(false, false);

    const { result, unmount } = renderHookValue(() => useQualityTier());

    expect(result.current).toBe('high');
    unmount();
  });

  it('returns low for mobile with 2 cores', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { writable: true, value: 2 });
    mockMatchMedia(false, true);

    const { result, unmount } = renderHookValue(() => useQualityTier());

    expect(result.current).toBe('low');
    unmount();
  });

  it('returns medium for mobile with 8 cores', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { writable: true, value: 8 });
    mockMatchMedia(false, true);

    const { result, unmount } = renderHookValue(() => useQualityTier());

    expect(result.current).toBe('medium');
    unmount();
  });

  it('returns medium for desktop with fewer than 8 cores', () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { writable: true, value: 4 });
    mockMatchMedia(false, false);

    const { result, unmount } = renderHookValue(() => useQualityTier());

    expect(result.current).toBe('medium');
    unmount();
  });
});
