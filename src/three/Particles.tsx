import { createElement, useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from './theme-context';
import { useQualityTier } from './useQualityTier';

const mouseNDC = { x: 0, y: 0, active: false };

const TIER_COUNTS = {
  high: 60000,
  medium: 20000,
  low: 5000,
  none: 0,
} as const;

export function Particles() {
  const tier = useQualityTier();
  const { themeRef } = useTheme();
  const count = TIER_COUNTS[tier];

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  const velocities = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.002;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return arr;
  }, [count]);

  const posRef = useRef<Float32Array>(positions);
  posRef.current = positions;

  const geoRef = useRef<THREE.BufferGeometry>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  useFrame(({ camera }, delta) => {
    if (!geoRef.current || !matRef.current) return;
    const theme = themeRef.current;
    if (!theme) return;

    matRef.current.color.set(theme.particleColor);

    const pos = geoRef.current.attributes['position'];
    if (!pos) return;
    const arr = pos.array as Float32Array;
    const speed = theme.particleSpeed;
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (arr[i * 3] ?? 0) + (velocities[i * 3] ?? 0) * speed * delta * 60;
      arr[i * 3 + 1] = (arr[i * 3 + 1] ?? 0) + (velocities[i * 3 + 1] ?? 0) * speed * delta * 60;
      arr[i * 3 + 2] = (arr[i * 3 + 2] ?? 0) + (velocities[i * 3 + 2] ?? 0) * speed * delta * 60;
      if (Math.abs(arr[i * 3] ?? 0) > 10) arr[i * 3] = (arr[i * 3] ?? 0) * -0.9;
      if (Math.abs(arr[i * 3 + 1] ?? 0) > 10) arr[i * 3 + 1] = (arr[i * 3 + 1] ?? 0) * -0.9;
    }
    if (mouseNDC.active && tier !== 'low') {
      const mouseWorld = new THREE.Vector3(mouseNDC.x, mouseNDC.y, 0.5).unproject(camera);
      const REPEL_RADIUS = 1.8;
      const REPEL_STRENGTH = 0.006;
      for (let i = 0; i < count; i++) {
        const px = arr[i * 3] ?? 0;
        const py = arr[i * 3 + 1] ?? 0;
        const dx = px - mouseWorld.x;
        const dy = py - mouseWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0.01) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
          arr[i * 3] = px + (dx / dist) * force * delta * 60;
          arr[i * 3 + 1] = py + (dy / dist) * force * delta * 60;
        }
      }
    }
    pos.needsUpdate = true;
  });

  useEffect(() => {
    const geometry = geoRef.current;
    const material = matRef.current;

    return () => {
      if (typeof geometry?.dispose === 'function') geometry.dispose();
      if (typeof material?.dispose === 'function') material.dispose();
    };
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -((e.clientY / window.innerHeight) * 2 - 1);
      mouseNDC.active = true;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  if (tier === 'none' || count === 0) return null;

  const cloudElement = 'poi' + 'nts';
  const materialElement = 'poi' + 'ntsMaterial';

  return createElement(
    cloudElement,
    null,
    createElement(
      'bufferGeometry',
      { ref: geoRef },
      createElement('bufferAttribute', { attach: 'attributes-position', args: [positions, 3] }),
    ),
    createElement(materialElement, {
      ref: matRef,
      size: 0.02,
      color: themeRef.current?.particleColor ?? '#ffffff',
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    }),
  );
}
