import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getCategoryVisual, getFusionPalette } from '../data/categoryVisuals';
import type { CategoryId } from '../types/category';
import { useTheme } from './theme-context';
import { useQualityTier } from './useQualityTier';

const EASE = 0.08;
const SHOCKWAVE_DURATION = 1.2;

const QUADRANTS = [
  [0.32, 0.22],
  [-0.28, -0.2],
  [-0.3, 0.2],
  [0.3, -0.22],
] as const;

interface ShapeProps {
  categoryId: CategoryId;
  active: boolean;
  index: number;
  total: number;
  shockwave: number;
  viewportWidth: number;
  viewportHeight: number;
}

function makeMat(color: string, opacity = 0.72) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.35,
    roughness: 0.46,
    metalness: 0.26,
    transparent: true,
    opacity,
    depthWrite: false,
  });
}

function CategoryShape({
  categoryId,
  active,
  index,
  total,
  shockwave,
  viewportWidth,
  viewportHeight,
}: ShapeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visual = getCategoryVisual(categoryId);
  const [primary, secondary] = visual.palette;
  const material = useMemo(() => makeMat(primary), [primary]);
  const secondaryMaterial = useMemo(() => makeMat(secondary, 0.56), [secondary]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = clock.elapsedTime;
    const targetOpacity = active ? (total > 1 ? 0.42 : 0.68) : 0;
    const scale = active ? 2.2 + Math.sin(t * 1.7 + index) * 0.04 + shockwave * 0.16 : 0.74;

    const quad = QUADRANTS[index] ?? ([0.32, 0.22] as const);
    const targetX = quad[0] * viewportWidth;
    const targetY = quad[1] * viewportHeight;
    group.position.x += (targetX - group.position.x) * EASE;
    group.position.y += (targetY - group.position.y) * EASE;
    group.rotation.y +=
      delta * (visual.shape === 'crown' || visual.shape === 'screenShard' ? 1.6 : 0.42);
    group.rotation.x += delta * (visual.shape === 'scales' ? Math.sin(t) * 0.12 : 0.16);
    group.scale.lerp(new THREE.Vector3(scale, scale, scale), EASE);

    material.opacity += (targetOpacity - material.opacity) * 0.1;
    secondaryMaterial.opacity += (targetOpacity * 0.72 - secondaryMaterial.opacity) * 0.1;
  });

  useEffect(() => {
    return () => {
      material.dispose();
      secondaryMaterial.dispose();
    };
  }, [material, secondaryMaterial]);

  return (
    <group ref={groupRef} position={[0, 0, -1.5]}>
      <ShapeGeometry
        shape={visual.shape}
        material={material}
        secondaryMaterial={secondaryMaterial}
      />
    </group>
  );
}

function ShapeGeometry({
  shape,
  material,
  secondaryMaterial,
}: {
  shape: ReturnType<typeof getCategoryVisual>['shape'];
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  switch (shape) {
    case 'brokenSphere':
      return (
        <group>
          <mesh material={material} position={[-0.16, 0.05, 0]} scale={[0.88, 1, 0.72]}>
            <sphereGeometry args={[0.56, 24, 16, 0.2, 2.5]} />
          </mesh>
          <mesh
            material={secondaryMaterial}
            position={[0.26, -0.08, 0.08]}
            rotation={[0.5, -0.3, 0.2]}
          >
            <tetrahedronGeometry args={[0.42, 0]} />
          </mesh>
        </group>
      );
    case 'torus':
      return (
        <mesh material={material} rotation={[0.85, 0.2, 0]}>
          <torusKnotGeometry args={[0.45, 0.12, 96, 10]} />
        </mesh>
      );
    case 'crown':
      return (
        <group>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh
              key={i}
              material={i % 2 ? secondaryMaterial : material}
              position={[(i - 2) * 0.22, 0, 0]}
              rotation={[0.4, 0, (i - 2) * 0.18]}
            >
              <coneGeometry args={[0.13, 0.72 + i * 0.04, 4]} />
            </mesh>
          ))}
        </group>
      );
    case 'cubeGrid':
      return (
        <group>
          {[-0.45, 0, 0.45].map((x) =>
            [-0.45, 0, 0.45].map((y) => (
              <mesh key={`${x}-${y}`} material={material} position={[x, y, 0]}>
                <boxGeometry args={[0.22, 0.22, 0.22]} />
              </mesh>
            )),
          )}
        </group>
      );
    case 'scales':
      return (
        <group>
          <mesh material={material}>
            <boxGeometry args={[0.08, 1.05, 0.08]} />
          </mesh>
          <mesh material={secondaryMaterial} position={[0, 0.32, 0]}>
            <boxGeometry args={[1.2, 0.06, 0.06]} />
          </mesh>
          <mesh material={material} position={[-0.45, -0.05, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 32]} />
          </mesh>
          <mesh material={material} position={[0.45, -0.05, 0]}>
            <torusGeometry args={[0.18, 0.02, 8, 32]} />
          </mesh>
        </group>
      );
    case 'sphereCluster':
      return <Cluster material={material} secondaryMaterial={secondaryMaterial} />;
    case 'coinSpiral':
      return <Spiral material={material} secondaryMaterial={secondaryMaterial} />;
    case 'petals':
      return <Petals material={material} secondaryMaterial={secondaryMaterial} />;
    case 'mirror':
      return <Fragments material={material} secondaryMaterial={secondaryMaterial} />;
    case 'orbitPair':
      return (
        <group>
          <mesh material={material} position={[-0.42, 0, 0]}>
            <sphereGeometry args={[0.25, 24, 16]} />
          </mesh>
          <mesh material={secondaryMaterial} position={[0.42, 0, 0]}>
            <sphereGeometry args={[0.25, 24, 16]} />
          </mesh>
          <mesh material={material} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.68, 0.012, 8, 64]} />
          </mesh>
        </group>
      );
    case 'origami':
      return <Fragments material={material} secondaryMaterial={secondaryMaterial} flat />;
    case 'risingArrow':
      return (
        <group>
          <mesh material={material} position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 5]} />
          </mesh>
          <mesh material={secondaryMaterial} position={[0, 0.38, 0]}>
            <coneGeometry args={[0.28, 0.44, 4]} />
          </mesh>
        </group>
      );
    case 'crackedEarth':
      return (
        <group>
          <mesh material={material}>
            <sphereGeometry args={[0.55, 24, 16]} />
          </mesh>
          <mesh material={secondaryMaterial} rotation={[0.2, 0.6, 0.3]}>
            <torusGeometry args={[0.56, 0.018, 8, 64]} />
          </mesh>
        </group>
      );
    case 'lightRays':
      return <Rays material={material} secondaryMaterial={secondaryMaterial} />;
    case 'brainMesh':
      return (
        <mesh material={material} scale={[1.1, 0.72, 0.64]}>
          <torusKnotGeometry args={[0.42, 0.1, 80, 8, 3, 5]} />
        </mesh>
      );
    case 'atom':
      return <Atom material={material} secondaryMaterial={secondaryMaterial} />;
    case 'monolith':
      return (
        <group rotation={[0.08, 0, -0.15]}>
          <mesh material={material}>
            <boxGeometry args={[0.42, 1.18, 0.2]} />
          </mesh>
          <mesh material={secondaryMaterial} position={[0.04, 0.04, 0.12]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.035, 1, 0.03]} />
          </mesh>
        </group>
      );
    case 'voidRing':
      return (
        <mesh material={material}>
          <torusGeometry args={[0.55, 0.08, 16, 80]} />
        </mesh>
      );
    case 'impossible':
      return <Impossible material={material} secondaryMaterial={secondaryMaterial} />;
    case 'wayang':
      return <Wayang material={material} secondaryMaterial={secondaryMaterial} />;
    case 'screenShard':
      return <Fragments material={material} secondaryMaterial={secondaryMaterial} />;
  }
}

function Cluster({
  material,
  secondaryMaterial,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  const points = [
    [0, 0, 0],
    [0.35, 0.12, 0.05],
    [-0.3, 0.18, 0],
    [0.12, -0.3, 0.12],
    [-0.18, -0.18, -0.08],
  ] as const;
  return (
    <group>
      {points.map((p, i) => (
        <mesh
          key={`${p[0]}:${p[1]}:${p[2]}`}
          material={i % 2 ? secondaryMaterial : material}
          position={p}
        >
          <sphereGeometry args={[0.18, 16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

function Spiral({
  material,
  secondaryMaterial,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  return (
    <group>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          material={i % 2 ? secondaryMaterial : material}
          position={[Math.cos(i) * i * 0.07, 0.34 - i * 0.12, Math.sin(i) * i * 0.07]}
          rotation={[Math.PI / 2, 0, i]}
        >
          <cylinderGeometry args={[0.18, 0.18, 0.035, 32]} />
        </mesh>
      ))}
    </group>
  );
}

function Petals({
  material,
  secondaryMaterial,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  return (
    <group>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          material={i % 2 ? secondaryMaterial : material}
          rotation={[0, 0, (i / 6) * Math.PI * 2]}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 0.25,
            Math.sin((i / 6) * Math.PI * 2) * 0.25,
            0,
          ]}
        >
          <sphereGeometry args={[0.22, 16, 12]} />
        </mesh>
      ))}
    </group>
  );
}

function Fragments({
  material,
  secondaryMaterial,
  flat = false,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
  flat?: boolean;
}) {
  return (
    <group>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          material={i % 2 ? secondaryMaterial : material}
          position={[(i - 2) * 0.2, Math.sin(i) * 0.18, flat ? 0 : Math.cos(i) * 0.16]}
          rotation={[i * 0.3, i * 0.7, i * 0.25]}
        >
          <tetrahedronGeometry args={[0.24, 0]} />
        </mesh>
      ))}
    </group>
  );
}

function Rays({
  material,
  secondaryMaterial,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  return (
    <group>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={i}
          material={i % 2 ? secondaryMaterial : material}
          rotation={[0, 0, (i / 8) * Math.PI * 2]}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 0.32,
            Math.sin((i / 8) * Math.PI * 2) * 0.32,
            0,
          ]}
        >
          <coneGeometry args={[0.06, 0.62, 8]} />
        </mesh>
      ))}
    </group>
  );
}

function Atom({
  material,
  secondaryMaterial,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  return (
    <group>
      <mesh material={secondaryMaterial}>
        <sphereGeometry args={[0.14, 16, 12]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} material={material} rotation={[i * 0.75, Math.PI / 2, i * 0.55]}>
          <torusGeometry args={[0.56, 0.012, 8, 72]} />
        </mesh>
      ))}
    </group>
  );
}

function Impossible({
  material,
  secondaryMaterial,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          material={i === 1 ? secondaryMaterial : material}
          rotation={[0, 0, (i / 3) * Math.PI * 2]}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 0.28,
            Math.sin((i / 3) * Math.PI * 2) * 0.28,
            0,
          ]}
        >
          <boxGeometry args={[0.65, 0.12, 0.12]} />
        </mesh>
      ))}
    </group>
  );
}

function Wayang({
  material,
  secondaryMaterial,
}: {
  material: THREE.Material;
  secondaryMaterial: THREE.Material;
}) {
  return (
    <group>
      <mesh material={material} scale={[0.58, 1, 0.08]}>
        <coneGeometry args={[0.5, 1.15, 3]} />
      </mesh>
      <mesh material={secondaryMaterial} position={[0, 0.38, 0.05]}>
        <sphereGeometry args={[0.16, 16, 12]} />
      </mesh>
    </group>
  );
}

export function CategoryAtmosphere() {
  const tier = useQualityTier();
  const { camera, scene, viewport } = useThree();
  const { theme, selectedCategoryIds, transitionTick } = useTheme();
  const shockRef = useRef(0);
  const lastTransitionRef = useRef(transitionTick);
  const backgroundRef = useRef(new THREE.Color('#050505'));
  const activeIds = selectedCategoryIds.length > 0 ? selectedCategoryIds : [theme.id];
  const palette = getFusionPalette(activeIds);

  useEffect(() => {
    scene.fog = new THREE.FogExp2(backgroundRef.current, 0.055);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (lastTransitionRef.current !== transitionTick) {
      lastTransitionRef.current = transitionTick;
      shockRef.current = SHOCKWAVE_DURATION;
    }
    shockRef.current = Math.max(0, shockRef.current - delta);
    const target = new THREE.Color(palette[0]).multiplyScalar(0.16);
    backgroundRef.current.lerp(target, 0.045);
    scene.background = backgroundRef.current;
    if (scene.fog instanceof THREE.FogExp2) scene.fog.color.copy(backgroundRef.current);
    camera.rotation.z += (Math.sin(transitionTick * 0.7) * 0.08 - camera.rotation.z) * 0.035;
  });

  if (tier === 'none') return null;

  const visibleIds = tier === 'low' ? activeIds.slice(0, 1) : activeIds.slice(0, 4);
  const shockwave = shockRef.current / SHOCKWAVE_DURATION;

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.45} />
      <pointLight position={[2, 2, 3]} intensity={2.2} color={palette[1]} />
      <mesh scale={[1 + shockwave * 1.8, 1 + shockwave * 1.8, 1]}>
        <torusGeometry args={[1.25, 0.018, 8, 96]} />
        <meshBasicMaterial
          color={palette[1]}
          transparent
          opacity={shockwave * 0.32}
          depthWrite={false}
        />
      </mesh>
      {visibleIds.map((id, index) => (
        <CategoryShape
          key={id}
          categoryId={id}
          active
          index={index}
          total={visibleIds.length}
          shockwave={shockwave}
          viewportWidth={viewport.width}
          viewportHeight={viewport.height}
        />
      ))}
    </group>
  );
}
