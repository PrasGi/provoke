import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useTheme } from './theme-context';
import { useQualityTier } from './useQualityTier';

export function PostFX() {
  const tier = useQualityTier();
  const { theme } = useTheme();

  if (tier === 'none' || tier === 'low') return null;

  const intensity = tier === 'medium' ? theme.bloomIntensity * 0.6 : theme.bloomIntensity;

  return (
    <EffectComposer>
      <Bloom intensity={intensity} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
    </EffectComposer>
  );
}
