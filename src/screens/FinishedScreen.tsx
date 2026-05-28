import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useGameStore } from '../store/game.store';

export function FinishedScreen() {
  const { t } = useTranslation();
  const state = useGameStore((s) => s.state);
  const replay = useGameStore((s) => s.replay);

  if (state.screen !== 'finished') return null;

  const { totalSeen } = state;

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

      <Button type="button" onClick={replay} className="py-4 px-10 text-base">
        {t('finished.play_again')}
      </Button>
    </div>
  );
}
