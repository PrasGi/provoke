import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './three/ThemeProvider';
import { Scene } from './three/Scene';
import { Particles } from './three/Particles';
import { CategoryAtmosphere } from './three/CategoryAtmosphere';
import { PostFX } from './three/postprocessing';
import { HomeScreen } from './screens/HomeScreen';
import { PlayingScreen } from './screens/PlayingScreen';
import { FinishedScreen } from './screens/FinishedScreen';
import { useGameStore } from './store/game.store';
import { clearSession } from './store/persist';
import { getResumeSession, useStorageSync } from './store/sync';

function StorageSync() {
  useStorageSync();
  const start = useGameStore((s) => s.start);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    if (getResumeSession()) {
      setShowResume(true);
    }
  }, []);

  if (!showResume) return null;

  const handleResume = () => {
    const session = getResumeSession();
    if (session) {
      start(session.selectedCategories, session.level, session.timerDur);
    }
    setShowResume(false);
  };

  const handleFreshStart = () => {
    clearSession();
    setShowResume(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-[oklch(0.15_0_0)] p-6">
        <h3 className="text-lg font-medium text-white">Continue last session?</h3>
        <p className="text-sm text-white/60">
          You have an unfinished session. Would you like to continue?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleResume}
            className="flex-1 rounded-lg bg-white/20 py-2 text-sm text-white hover:bg-white/30"
          >
            Yes, continue
          </button>
          <button
            type="button"
            onClick={handleFreshStart}
            className="flex-1 rounded-lg bg-white/5 py-2 text-sm text-white/60 hover:bg-white/10"
          >
            No, start fresh
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenSwitcher() {
  const state = useGameStore((s) => s.state);

  switch (state.screen) {
    case 'home':
      return <HomeScreen />;
    case 'playing':
      return <PlayingScreen />;
    case 'finished':
      return <FinishedScreen />;
    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = state;
      return null;
    }
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <StorageSync />
      {/* Persistent 3D scene — never unmounts between screens */}
      <Scene>
        <CategoryAtmosphere />
        <Particles />
        <PostFX />
      </Scene>

      {/* Screen content — above the canvas */}
      <div className="relative z-10">
        <ScreenSwitcher />
      </div>
    </ThemeProvider>
  );
}
