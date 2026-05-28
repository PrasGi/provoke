// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../theme-context';
import { renderHookValue } from './react-test-helpers';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('ThemeProvider + useTheme', () => {
  it('returns fallback theme (philosophy) when no category set', () => {
    const { result, unmount } = renderHookValue(() => useTheme(), wrapper);
    expect(result.current.theme.id).toBe('philosophy');
    unmount();
  });

  it('returns correct theme after setCategoryId', () => {
    const { result, unmount } = renderHookValue(() => useTheme(), wrapper);
    act(() => {
      result.current.setCategoryId('ethics');
    });
    expect(result.current.theme.id).toBe('ethics');
    unmount();
  });

  it('falls back to philosophy when setCategoryId(null)', () => {
    const { result, unmount } = renderHookValue(() => useTheme(), wrapper);
    act(() => {
      result.current.setCategoryId('technology');
    });
    act(() => {
      result.current.setCategoryId(null);
    });
    expect(result.current.theme.id).toBe('philosophy');
    unmount();
  });

  it('themeRef.current always matches current theme', () => {
    const { result, unmount } = renderHookValue(() => useTheme(), wrapper);
    act(() => {
      result.current.setCategoryId('ethics');
    });
    expect(result.current.themeRef.current?.id).toBe('ethics');
    unmount();
  });

  it('throws when used outside ThemeProvider', () => {
    expect(() => renderHookValue(() => useTheme())).toThrow(
      'useTheme must be used within ThemeProvider',
    );
  });
});
