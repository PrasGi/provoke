import { type ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Brand } from '../components/Brand';
import { LanguageToggle } from '../components/LanguageToggle';
import { CategoryGrid } from '../components/CategoryGrid';
import { Tutorial } from '../components/Tutorial';
import { Button } from '../components/ui/button';
import { useGameStore } from '../store/game.store';
import { readSettings, writeSettings, writeTutorialSeen } from '../store/persist';
import { STORAGE_KEYS } from '../store/keys';
import { QUESTIONS } from '../data/questions.generated';
import { getFusionName } from '../data/categoryVisuals';
import { useOptionalTheme } from '../three/theme-context';
import type { CategoryId } from '../types/category';
import type { Level } from '../types/level';

type TimerOption = { label: string; value: number };

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary/80 to-primary/20" />
      <p className="text-[11px] text-white/60 uppercase tracking-[0.2em] font-semibold">
        {children}
      </p>
    </div>
  );
}

export function HomeScreen() {
  const { t } = useTranslation();
  const start = useGameStore((s) => s.start);
  const themeControls = useOptionalTheme();
  const [selected, setSelected] = useState<CategoryId[]>([]);
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [timerDur, setTimerDur] = useState<number>(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.tutorial)) {
      setShowTutorial(true);
    }
  }, []);

  const levels = [
    { key: 'all' as const, label: t('home.level.all') },
    { key: 'easy' as const, label: t('home.level.easy') },
    { key: 'medium' as const, label: t('home.level.medium') },
    { key: 'hard' as const, label: t('home.level.hard') },
  ];

  const timers: TimerOption[] = [
    { label: t('home.timer.1min'), value: 60 },
    { label: t('home.timer.2min'), value: 120 },
    { label: t('home.timer.3min'), value: 180 },
    { label: t('home.timer.free'), value: 0 },
  ];

  const availableCount = QUESTIONS.filter(
    (q) => selected.includes(q.category_id as CategoryId) && (level === 'all' || q.level === level),
  ).length;

  const canStart = selected.length > 0 && availableCount > 0;
  const fusionName = getFusionName(selected);

  const handleCategoryChange = (next: CategoryId[]) => {
    setSelected(next);
    themeControls?.setSelectedCategoryIds(next);
    themeControls?.setCategoryId(next[0] ?? null);
  };

  const handleStart = () => {
    if (!canStart) return;
    const settings = readSettings();
    writeSettings({ ...settings });
    start(selected, level, timerDur);
  };

  const handleTutorialClose = () => {
    writeTutorialSeen(true);
    setShowTutorial(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start px-4 pt-6 pb-32 gap-6 max-w-xl md:max-w-3xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTutorial(true)}
              className="provoke-button w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 border border-white/10 hover:border-white/25 text-sm font-semibold transition-colors"
              aria-label={t('tutorial.button')}
              title={t('tutorial.button')}
            >
              ?
            </button>
            <LanguageToggle />
          </div>
        </div>

        <div className="w-full flex flex-col gap-3" data-tutorial="categories">
          <SectionLabel>{t('home.categories.label')}</SectionLabel>
          <CategoryGrid selected={selected} onChange={handleCategoryChange} />
          {selected.length > 1 && (
            <div className="category-fusion-label">
              <span className="flex items-center gap-2">
                <span className="text-primary/60 text-xs">✦</span>
                <span>Fusion</span>
              </span>
              <strong>{fusionName}</strong>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-3" data-tutorial="settings">
          <SectionLabel>{t('home.level.label')}</SectionLabel>
          <div className="flex rounded-xl bg-black/30 border border-white/8 backdrop-blur-sm p-1 gap-0.5">
            {levels.map(({ key, label }) => (
              <button
                type="button"
                key={key}
                onClick={() => setLevel(key)}
                className={`provoke-button flex-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  level === key
                    ? 'bg-gradient-to-b from-white/15 to-white/8 text-white border border-white/20 shadow-[0_0_12px_oklch(0.72_0.13_70_/_0.15)]'
                    : 'text-white/60 hover:text-white/85 hover:bg-white/6'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          <SectionLabel>{t('home.timer.label')}</SectionLabel>
          <div className="flex rounded-xl bg-black/30 border border-white/8 backdrop-blur-sm p-1 gap-0.5">
            {timers.map(({ label, value }) => (
              <button
                type="button"
                key={value}
                onClick={() => setTimerDur(value)}
                className={`provoke-button flex-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  timerDur === value
                    ? 'bg-gradient-to-b from-white/15 to-white/8 text-white border border-white/20 shadow-[0_0_12px_oklch(0.72_0.13_70_/_0.15)]'
                    : 'text-white/60 hover:text-white/85 hover:bg-white/6'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Start bar — always visible at the bottom */}
      <div className="fixed bottom-0 inset-x-0 z-20 pointer-events-none">
        <div className="bg-gradient-to-t from-[oklch(0.08_0_0)] via-[oklch(0.08_0_0/0.92)] to-transparent px-4 pt-10 pb-6">
          <div className="max-w-xl md:max-w-3xl mx-auto pointer-events-auto flex flex-col gap-2">
            {selected.length > 0 && (
              <p className="text-center text-xs text-white/45">
                {t('home.cards_available', { count: availableCount })}
              </p>
            )}
            <Button
              type="button"
              data-tutorial="gameplay"
              className={`w-full py-5 text-base font-semibold ${canStart ? 'shadow-[0_0_28px_oklch(0.72_0.13_70_/_0.35)]' : ''}`}
              disabled={!canStart}
              onClick={handleStart}
            >
              {t('home.start')}
            </Button>
          </div>
        </div>
      </div>

      {showTutorial && <Tutorial onClose={handleTutorialClose} />}
    </>
  );
}
