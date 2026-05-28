import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

interface TutorialStep {
  target: string;
  titleKey: string;
  bodyKey: string;
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: TutorialStep[] = [
  {
    target: '[data-tutorial="categories"]',
    titleKey: 'tutorial.steps.categories.title',
    bodyKey: 'tutorial.steps.categories.body',
    tooltipPosition: 'bottom',
  },
  {
    target: '[data-tutorial="categories"]',
    titleKey: 'tutorial.steps.fusion.title',
    bodyKey: 'tutorial.steps.fusion.body',
    tooltipPosition: 'bottom',
  },
  {
    target: '[data-tutorial="settings"]',
    titleKey: 'tutorial.steps.settings.title',
    bodyKey: 'tutorial.steps.settings.body',
    tooltipPosition: 'top',
  },
  {
    target: '[data-tutorial="gameplay"]',
    titleKey: 'tutorial.steps.gameplay.title',
    bodyKey: 'tutorial.steps.gameplay.body',
    tooltipPosition: 'top',
  },
];

export function Tutorial({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const totalSteps = STEPS.length;
  const currentStep = STEPS[step];

  useEffect(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightRect(rect);
    } else {
      setSpotlightRect(null);
    }
  }, [currentStep]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else onClose();
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const spotlightStyle: CSSProperties | undefined = spotlightRect
    ? {
        left: spotlightRect.left - 8,
        top: spotlightRect.top - 8,
        width: spotlightRect.width + 16,
        height: spotlightRect.height + 16,
      }
    : undefined;

  const tooltipStyle: CSSProperties = spotlightRect
    ? currentStep?.tooltipPosition === 'bottom'
      ? { top: spotlightRect.bottom + 20, left: '50%', transform: 'translateX(-50%)' }
      : {
          bottom: window.innerHeight - spotlightRect.top + 20,
          left: '50%',
          transform: 'translateX(-50%)',
        }
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <div
      className="tutorial-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleNext();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleNext();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t('tutorial.button')}
    >
      {spotlightStyle && (
        <div
          className="tutorial-spotlight"
          style={spotlightStyle}
          aria-hidden="true"
        />
      )}

      <div
        className="tutorial-tooltip"
        style={{ position: 'fixed', ...tooltipStyle }}
      >
        <div className="tutorial-step-indicator">
          {t('tutorial.step_of', { current: step + 1, total: totalSteps })}
        </div>
        <h3 className="tutorial-tooltip-title">{t(currentStep?.titleKey ?? '')}</h3>
        <p className="tutorial-tooltip-body">{t(currentStep?.bodyKey ?? '')}</p>
        <div className="tutorial-tooltip-actions">
          {step > 0 && (
            <button type="button" className="tutorial-btn-secondary" onClick={handleBack}>
              {t('tutorial.back')}
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button type="button" className="tutorial-btn-skip" onClick={onClose}>
            {t('tutorial.skip')}
          </button>
          <button type="button" className="tutorial-btn-primary" onClick={handleNext}>
            {step === totalSteps - 1 ? t('tutorial.done') : t('tutorial.next')}
          </button>
        </div>
        <div className="tutorial-dots">
          {STEPS.map((s, i) => (
            <div key={s.titleKey} className={`tutorial-dot${i === step ? ' active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
