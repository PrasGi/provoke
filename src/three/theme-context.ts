import { createContext, useContext } from 'react';
import type React from 'react';
import type { CategoryId } from '../types/category';
import type { CategoryTheme } from '../types/theme';

export interface ThemeContextValue {
  theme: CategoryTheme;
  setCategoryId: (id: CategoryId | null) => void;
  selectedCategoryIds: readonly CategoryId[];
  setSelectedCategoryIds: (ids: readonly CategoryId[]) => void;
  transitionTick: number;
  triggerTransition: () => void;
  themeRef: React.RefObject<CategoryTheme>;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useOptionalTheme(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
