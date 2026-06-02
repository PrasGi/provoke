import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card';
import { Timer } from '../components/Timer';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { useGameStore } from '../store/game.store';
import { useTheme } from '../three/theme-context';
import { readSettings } from '../store/persist';

export function PlayingScreen() {
  const { i18n, t } = useTranslation();
  const state = useGameStore((s) => s.state);
  const showHint = useGameStore((s) => s.showHint);
  const revealPerspective = useGameStore((s) => s.revealPerspective);
  const nextCard = useGameStore((s) => s.nextCard);
  const quit = useGameStore((s) => s.quit);
  const tick = useGameStore((s) => s.tick);
  const { setCategoryId, setSelectedCategoryIds, triggerTransition } = useTheme();
  const [stopOpen, setStopOpen] = useState(false);

  const isPlaying = state.screen === 'playing';
  const currentCard = isPlaying ? state.deck[state.idx] : undefined;
  const categoryId = currentCard?.category_id;
  const running = isPlaying ? state.running : false;
  const timerDur = isPlaying ? state.timerDur : 0;

  useEffect(() => {
    if (!categoryId) return;
    setCategoryId(categoryId);
    setSelectedCategoryIds?.([categoryId]);
    triggerTransition?.();
  }, [categoryId, setCategoryId, setSelectedCategoryIds, triggerTransition]);

  useEffect(() => {
    if (!running || timerDur === 0) return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [running, timerDur, tick]);

  if (!isPlaying) return null;
  if (!currentCard) return null;

  const { deck, idx, phase, secs } = state;
  const lang = (i18n.language === 'id' ? 'id' : 'en') as 'en' | 'id';
  const settings = readSettings();
  const reducedMotion = settings.reducedMotion;
  const isLastCard = idx === deck.length - 1;

  const handleStopConfirm = () => {
    setStopOpen(false);
    quit();
  };

  return (
    <>
      <div className="min-h-screen flex flex-col px-4 py-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-white/65 tabular-nums">
            {idx + 1} / {deck.length}
          </span>
          {timerDur > 0 && <Timer secs={secs} total={timerDur} running={running} />}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStopOpen(true)}
            className="text-red-400/60 hover:text-red-400 border border-red-400/20 hover:border-red-400/50 hover:bg-red-500/8"
          >
            {t('play.stop')}
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center py-4 pb-[15vh]">
          <div className="relative w-full">
            {deck.length > idx + 2 && (
              <div className="absolute inset-0 rounded-2xl bg-white/[0.04] border border-white/[0.06] translate-y-2 translate-x-1.5 scale-[0.96]" />
            )}
            {deck.length > idx + 1 && (
              <div className="absolute inset-0 rounded-2xl bg-white/[0.04] border border-white/[0.06] translate-y-1 translate-x-0.5 scale-[0.98]" />
            )}

            <Card
              question={currentCard}
              phase={phase}
              lang={lang}
              onHint={showHint}
              onReveal={revealPerspective}
              onNext={nextCard}
              isLastCard={isLastCard}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      </div>

      <Dialog open={stopOpen} onOpenChange={setStopOpen}>
        <DialogContent
          className="bg-[oklch(0.15_0_0)] border-white/15 text-white max-w-sm"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-semibold">
              {t('play.stop_title')}
            </DialogTitle>
            <DialogDescription className="text-white/55">{t('play.stop_desc')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-white/5 border-white/10">
            <Button
              type="button"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setStopOpen(false)}
            >
              {t('play.stop_cancel')}
            </Button>
            <Button
              type="button"
              onClick={handleStopConfirm}
              className="bg-red-500/80 hover:bg-red-500 text-white border-none"
            >
              {t('play.stop_confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
