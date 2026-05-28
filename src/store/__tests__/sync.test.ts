// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameStore } from '../game.store';
import { clearSession, readSeen, readSession, writeSeen, writeSession } from '../persist';
import { getResumeSession, useStorageSync } from '../sync';

beforeEach(() => {
  localStorage.clear();
  useGameStore.setState({ state: { screen: 'home' } });
  vi.clearAllMocks();
});

describe('sync helpers', () => {
  it('getResumeSession returns null when no session exists', () => {
    expect(getResumeSession()).toBeNull();
  });

  it('getResumeSession returns null when qids do not resolve', () => {
    writeSession({
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 0,
      idx: 0,
      phase: 'thinking',
      deck: ['nonexistent-qid-xyz'],
    });

    expect(getResumeSession()).toBeNull();
  });

  it('getResumeSession resolves valid qids to questions', () => {
    writeSession({
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 0,
      idx: 0,
      phase: 'thinking',
      deck: ['ethics-easy-01'],
    });

    const session = getResumeSession();

    expect(session).not.toBeNull();
    expect(session?.deck[0]?.qid).toBe('ethics-easy-01');
  });

  it('seen list round-trips correctly', () => {
    writeSeen({ ethics: ['ethics-easy-01'] });

    expect(readSeen()).toEqual({ ethics: ['ethics-easy-01'] });
  });

  it('clearSession removes the saved session', () => {
    writeSession({
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 0,
      idx: 0,
      phase: 'thinking',
      deck: ['ethics-easy-01'],
    });

    clearSession();

    expect(readSession()).toBeNull();
  });
});

describe('useStorageSync', () => {
  it('writes qid-only sessions and seen cards on reveal', () => {
    const { rerender, unmount } = renderHook(() => useStorageSync());

    useGameStore.getState().start(['ethics'], 'easy', 0);
    rerender();

    const playingState = useGameStore.getState().state;
    expect(playingState.screen).toBe('playing');

    if (playingState.screen !== 'playing') return;

    expect(readSession()).toEqual({
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 0,
      idx: 0,
      phase: 'thinking',
      deck: playingState.deck.map((q) => q.qid),
    });

    act(() => {
      useGameStore.getState().revealPerspective();
    });
    rerender();

    const revealedState = useGameStore.getState().state;
    if (revealedState.screen === 'playing') {
      const card = revealedState.deck[revealedState.idx];
      expect(card).toBeDefined();
      if (!card) return;
      expect(readSeen()[card.category_id]).toContain(card.qid);
      expect(readSession()?.deck.every((qid) => typeof qid === 'string')).toBe(true);
    }

    act(() => {
      useGameStore.getState().quit();
    });
    rerender();

    expect(readSession()).toBeNull();

    unmount();
  });
});
