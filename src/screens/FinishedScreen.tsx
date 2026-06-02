import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useGameStore } from '../store/game.store';
import { THEMES } from '../data/themes';
import type { CategoryId } from '../types/category';

export function FinishedScreen() {
  const { t } = useTranslation();
  const state = useGameStore((s) => s.state);
  const replay = useGameStore((s) => s.replay);
  const quit = useGameStore((s) => s.quit);

  if (state.screen !== 'finished') return null;

  const { totalSeen, categoryCounts } = state;

  const sortedCategories = (Object.entries(categoryCounts) as [CategoryId, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 gap-8 text-center overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl scale-150 bg-amber-400/15 rounded-full" />
        <Trophy className="relative w-16 h-16 text-amber-300" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-4xl font-light text-white" style={{ fontFamily: 'var(--font-serif)' }}>
          {t('finished.title')}
        </h2>
        <p className="text-lg font-light text-white/70 tracking-wide">
          {t('finished.cards_played', { count: totalSeen })}
        </p>
      </div>

      {sortedCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {sortedCategories.map(([id, count]) => {
            const color = THEMES[id]?.colorPrimary ?? 'oklch(0.7 0.15 250)';
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/6 border border-white/10 text-xs text-white/70"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                {t(`category.${id}.label`)}
                <span className="text-white/35">{count}</span>
              </span>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <Button type="button" onClick={replay} className="py-4 px-10 text-base">
          {t('finished.play_again')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={quit}
          className="text-white/60 hover:text-white"
        >
          {t('finished.home')}
        </Button>
      </div>
    </div>
  );
}
