import { useEffect, useState } from 'react';

export type QualityTier = 'high' | 'medium' | 'low' | 'none';

function detectTier(): QualityTier {
  if (typeof window === 'undefined') return 'medium';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (isMobile && cores < 4) return 'low';
  if (isMobile || cores < 4) return 'medium';
  if (cores >= 8) return 'high';

  return 'medium';
}

export function useQualityTier(): QualityTier {
  const [tier, setTier] = useState<QualityTier>(detectTier);

  useEffect(() => {
    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileMq = window.matchMedia('(max-width: 768px)');

    const handleChange = () => setTier(detectTier());

    reducedMotionMq.addEventListener('change', handleChange);
    mobileMq.addEventListener('change', handleChange);

    return () => {
      reducedMotionMq.removeEventListener('change', handleChange);
      mobileMq.removeEventListener('change', handleChange);
    };
  }, []);

  return tier;
}
