import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useQualityTier } from './useQualityTier';

interface SceneProps {
  children?: React.ReactNode;
}

export function Scene({ children }: SceneProps) {
  const tier = useQualityTier();

  if (tier === 'none') {
    return (
      <div
        className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-[oklch(0.08_0_0)] to-[oklch(0.12_0.05_270)]"
        aria-hidden="true"
        role="presentation"
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true" role="presentation">
      <Canvas
        dpr={[1, 1]}
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
          });
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}
