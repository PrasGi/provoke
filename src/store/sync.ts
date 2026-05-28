import { useEffect, useRef } from 'react';
import i18n from '../i18n';
import { QUESTIONS } from '../data/questions.generated';
import type { CategoryId } from '../types/category';
import type { Level } from '../types/level';
import type { Phase } from '../types/phase';
import { useGameStore } from './game.store';
import {
  clearSession,
  readSeen,
  readSession,
  readSettings,
  writeSeen,
  writeSession,
} from './persist';

export function useStorageSync() {
  const state = useGameStore((s) => s.state);
  const prevPhaseRef = useRef<Phase | null>(null);
  const prevScreenRef = useRef(state.screen);

  useEffect(() => {
    const settings = readSettings();
    if (i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, []);

  useEffect(() => {
    if (state.screen !== 'playing') return;

    const { selectedCategories, level, timerDur, idx, phase, deck } = state;
    writeSession({
      selectedCategories,
      level,
      timerDur,
      idx,
      phase,
      deck: deck.map((q) => q.qid),
    });
  }, [state]);

  useEffect(() => {
    if (state.screen !== 'playing') {
      prevPhaseRef.current = null;
      return;
    }

    const { phase, idx, deck } = state;
    const card = deck[idx];

    if (phase === 'revealed' && prevPhaseRef.current !== 'revealed' && card) {
      const seen = readSeen();
      const catSeen = seen[card.category_id] ?? [];

      if (!catSeen.includes(card.qid)) {
        writeSeen({
          ...seen,
          [card.category_id]: [...catSeen, card.qid],
        });
      }
    }

    prevPhaseRef.current = phase;
  }, [state]);

  useEffect(() => {
    if (state.screen === 'home' && prevScreenRef.current !== 'home') {
      clearSession();
    }

    prevScreenRef.current = state.screen;
  }, [state.screen]);
}

export function getResumeSession() {
  const session = readSession();
  if (!session) return null;

  const deck = session.deck
    .map((qid) => QUESTIONS.find((q) => q.qid === qid))
    .filter((q): q is NonNullable<typeof q> => q !== undefined);

  if (deck.length === 0) return null;

  return {
    selectedCategories: session.selectedCategories as CategoryId[],
    level: session.level as Level | 'all',
    timerDur: session.timerDur,
    idx: session.idx,
    phase: session.phase as Phase,
    deck,
  };
}
