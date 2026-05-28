import { useCallback, useRef, useState } from 'react';
import type React from 'react';
import type { CategoryId } from '../types/category';
import { THEMES } from '../data/themes';
import { ThemeContext } from './theme-context';
import type { CategoryTheme } from '../types/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  fallbackId?: CategoryId;
}

export function ThemeProvider({ children, fallbackId = 'philosophy' }: ThemeProviderProps) {
  const [categoryId, setCategoryIdState] = useState<CategoryId | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIdsState] = useState<readonly CategoryId[]>([]);
  const [transitionTick, setTransitionTick] = useState(0);

  const activeId = categoryId ?? fallbackId;
  const theme = THEMES[activeId];

  const themeRef = useRef<CategoryTheme>(theme);
  themeRef.current = theme;

  const setCategoryId = useCallback((id: CategoryId | null) => {
    setCategoryIdState(id);
  }, []);

  const setSelectedCategoryIds = useCallback((ids: readonly CategoryId[]) => {
    setSelectedCategoryIdsState([...ids]);
  }, []);

  const triggerTransition = useCallback(() => {
    setTransitionTick((tick) => tick + 1);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setCategoryId,
        selectedCategoryIds,
        setSelectedCategoryIds,
        transitionTick,
        triggerTransition,
        themeRef,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
