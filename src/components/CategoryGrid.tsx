import React from 'react';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../data/categories';
import { THEMES } from '../data/themes';
import { getCategoryVisual } from '../data/categoryVisuals';
import type { CategoryId } from '../types/category';

interface CategoryGridProps {
  selected: CategoryId[];
  onChange: (next: CategoryId[]) => void;
}

export function CategoryGrid({ selected, onChange }: CategoryGridProps) {
  const { t } = useTranslation();
  const selectedSet = new Set(selected);

  const toggle = (id: CategoryId) => {
    if (selectedSet.has(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const setPointerVars = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--y', `${event.clientY - rect.top}px`);
  };

  const selectAll = () => onChange(CATEGORIES.map((c) => c.id));
  const clear = () => onChange([]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="provoke-button text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
        >
          {t('home.categories.select_all')}
        </button>
        <button
          type="button"
          onClick={clear}
          className="provoke-button text-xs px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
        >
          {t('home.categories.clear')}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {CATEGORIES.map((cat) => {
          const theme = THEMES[cat.id];
          const isSelected = selectedSet.has(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onPointerMove={setPointerVars}
              onPointerDown={setPointerVars}
              onClick={() => toggle(cat.id)}
              aria-pressed={isSelected}
              className={`
                category-button group/category relative min-h-[48px] overflow-visible px-3 py-2 rounded-xl text-sm font-medium text-left
                border flex items-center gap-2
                ${isSelected ? 'scale-[1.02] text-white' : 'text-white/55 hover:text-white/85'}
              `}
              style={
                {
                  '--category-color': theme?.colorPrimary ?? 'oklch(0.7 0.15 250)',
                  '--category-accent': theme?.colorAccent ?? 'oklch(0.72 0.13 70)',
                  borderColor: isSelected
                    ? (theme?.colorPrimary ?? 'oklch(0.7 0.15 250)')
                    : 'oklch(0.28 0 0)',
                  backgroundColor: isSelected
                    ? `color-mix(in oklch, ${theme?.colorPrimary ?? 'oklch(0.7 0.15 250)'} 18%, oklch(0.12 0 0 / 0.8))`
                    : 'oklch(0.14 0 0 / 0.65)',
                  boxShadow: isSelected
                    ? `0 0 0 1.5px ${theme?.colorPrimary ?? 'oklch(0.7 0.15 250)'}, 0 0 12px color-mix(in oklch, ${theme?.colorPrimary ?? 'oklch(0.7 0.15 250)'} 30%, transparent)`
                    : 'none',
                } as React.CSSProperties
              }
            >
              {isSelected && (
                <span className="category-mini-orbit" aria-hidden="true">
                  <span data-shape={getCategoryVisual(cat.id).shape} />
                </span>
              )}
              <span className="category-ripple" aria-hidden="true" />
              <span className="category-burst" aria-hidden="true" />
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: theme?.colorPrimary ?? 'oklch(0.7 0.15 250)',
                  opacity: isSelected ? 1 : 0.45,
                }}
              />
              {t(`category.${cat.id}.label`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
