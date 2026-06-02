import { useRef } from 'react';
import type { Question } from '../types/question';
import type { Phase } from '../types/phase';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { THEMES } from '../data/themes';

interface CardProps {
  question: Question;
  phase: Phase;
  lang: 'en' | 'id';
  onHint: () => void;
  onReveal: () => void;
  onNext: () => void;
  isLastCard: boolean;
  reducedMotion?: boolean;
}

const LEVEL_COLOR: Record<string, string> = {
  easy: 'text-emerald-400',
  medium: 'text-amber-400',
  hard: 'text-red-400',
};

export function Card({
  question,
  phase,
  lang,
  onHint,
  onReveal,
  onNext,
  isLastCard,
  reducedMotion = false,
}: CardProps) {
  const { t } = useTranslation();
  const isRevealed = phase === 'revealed';
  const questionText = lang === 'en' ? question.q_en : question.q_id;
  const hintText = lang === 'en' ? question.hint_en : question.hint_id;
  const perspText = lang === 'en' ? question.persp_en : question.persp_id;
  const hasHint = Boolean(hintText);
  const theme = THEMES[question.category_id];
  const categoryColor = theme?.colorPrimary ?? 'oklch(0.72 0.13 70)';

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - (e.changedTouches[0]?.clientX ?? touchStartX.current);
    if (delta > 60) onNext();
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full max-w-lg md:max-w-2xl mx-auto touch-pan-y"
      style={{ perspective: '1200px' }}
      onTouchStart={isRevealed ? handleTouchStart : undefined}
      onTouchEnd={isRevealed ? handleTouchEnd : undefined}
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: reducedMotion ? 'none' : 'transform 0.6s ease-in-out',
          minHeight: '320px',
        }}
      >
        {/* Front face — question */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-xl bg-[oklch(0.15_0_0_/_0.7)] border border-white/10 shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center bg-white/8 border border-white/10 rounded-full px-2.5 py-0.5 text-xs uppercase tracking-widest"
              style={{ color: categoryColor }}
            >
              {t(`category.${question.category_id}.label`)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium opacity-65 ${LEVEL_COLOR[question.level] ?? ''}`}
            >
              {t(`home.level.${question.level}`)}
            </span>
          </div>

          <p
            className="text-2xl leading-relaxed text-white/90"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {questionText}
          </p>

          {phase === 'hinted' && hintText && (
            <div className="animate-in fade-in-0 duration-300 bg-white/4 border border-white/10 rounded-xl p-4 text-sm text-white/80 italic">
              {hintText}
            </div>
          )}

          <div className="mt-auto flex gap-2">
            {phase === 'thinking' && hasHint && (
              <Button variant="outline" size="sm" onClick={onHint} className="flex-1">
                {t('play.hint')}
              </Button>
            )}
            {phase !== 'revealed' && (
              <Button onClick={onReveal} className="flex-1">
                {t('play.reveal')}
              </Button>
            )}
          </div>
        </div>

        {/* Back face — perspective */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-xl bg-[oklch(0.18_0.02_70_/_0.75)] border border-[oklch(0.72_0.13_70_/_0.2)] shadow-2xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="text-xs uppercase tracking-widest text-[oklch(0.72_0.13_70)]">
            {t('play.perspective_title')}
          </div>

          <p className="text-base leading-relaxed text-white/80">{perspText}</p>

          <div className="mt-auto">
            <Button onClick={onNext} className="w-full">
              {isLastCard ? t('play.finish') : t('play.next')}
            </Button>
          </div>
        </div>
      </div>

      {/* Swipe hint — touch devices only, fades in after reveal */}
      {isRevealed && !reducedMotion && (
        <p className="mt-3 text-center text-xs text-white/25 animate-in fade-in-0 duration-500 delay-700 [@media(pointer:coarse)]:block hidden">
          ← {t('play.next').toLowerCase()}
        </p>
      )}

      {/* Reduced-motion fallback: perspective rendered below the card */}
      {reducedMotion && isRevealed && (
        <div className="mt-4 rounded-2xl p-6 backdrop-blur-xl bg-[oklch(0.18_0.02_70_/_0.75)] border border-[oklch(0.72_0.13_70_/_0.2)]">
          <div className="text-xs uppercase tracking-widest text-[oklch(0.72_0.13_70)] mb-2">
            {t('play.perspective_title')}
          </div>
          <p className="text-base leading-relaxed text-white/80">{perspText}</p>
          <Button onClick={onNext} className="w-full mt-4">
            {isLastCard ? t('play.finish') : t('play.next')}
          </Button>
        </div>
      )}
    </div>
  );
}
