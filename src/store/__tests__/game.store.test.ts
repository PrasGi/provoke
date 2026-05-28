// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../game.store';

beforeEach(() => {
  useGameStore.setState({ state: { screen: 'home' } });
});

describe('game store FSM', () => {
  it('starts in home state', () => {
    expect(useGameStore.getState().state.screen).toBe('home');
  });

  it('start() transitions home -> playing', () => {
    useGameStore.getState().start(['ethics'], 'easy', 120);
    const state = useGameStore.getState().state;
    expect(state.screen).toBe('playing');
    if (state.screen === 'playing') {
      expect(state.deck.length).toBeGreaterThan(0);
      expect(state.idx).toBe(0);
      expect(state.phase).toBe('thinking');
      expect(state.secs).toBe(120);
      expect(state.running).toBe(true);
    }
  });

  it('showHint() transitions thinking -> hinted', () => {
    useGameStore.getState().start(['ethics'], 'easy', 0);
    useGameStore.getState().showHint();
    const state = useGameStore.getState().state;
    if (state.screen === 'playing') {
      expect(state.phase).toBe('hinted');
    }
  });

  it('revealPerspective() transitions to revealed', () => {
    useGameStore.getState().start(['ethics'], 'easy', 0);
    useGameStore.getState().revealPerspective();
    const state = useGameStore.getState().state;
    if (state.screen === 'playing') {
      expect(state.phase).toBe('revealed');
      expect(state.running).toBe(false);
    }
  });

  it('nextCard() advances idx', () => {
    useGameStore.getState().start(['ethics', 'philosophy', 'politics'], 'easy', 0);
    useGameStore.getState().revealPerspective();
    useGameStore.getState().nextCard();
    const state = useGameStore.getState().state;
    if (state.screen === 'playing') {
      expect(state.idx).toBe(1);
      expect(state.phase).toBe('thinking');
    }
  });

  it('nextCard() past last card transitions to finished', () => {
    useGameStore.getState().start(['ethics'], 'easy', 0);
    const playingState = useGameStore.getState().state;
    if (playingState.screen !== 'playing') return;
    const deckLen = playingState.deck.length;
    for (let i = 0; i < deckLen; i++) {
      useGameStore.getState().revealPerspective();
      useGameStore.getState().nextCard();
    }
    const state = useGameStore.getState().state;
    expect(state.screen).toBe('finished');
    if (state.screen === 'finished') {
      expect(state.totalSeen).toBe(deckLen);
    }
  });

  it('tick() decrements secs', () => {
    useGameStore.getState().start(['ethics'], 'easy', 60);
    useGameStore.getState().tick();
    const state = useGameStore.getState().state;
    if (state.screen === 'playing') {
      expect(state.secs).toBe(59);
    }
  });

  it('replay() transitions finished -> home', () => {
    useGameStore.getState().start(['ethics'], 'easy', 0);
    const playingState = useGameStore.getState().state;
    if (playingState.screen !== 'playing') return;
    for (let i = 0; i < playingState.deck.length; i++) {
      useGameStore.getState().revealPerspective();
      useGameStore.getState().nextCard();
    }
    useGameStore.getState().replay();
    expect(useGameStore.getState().state.screen).toBe('home');
  });

  it('quit() from any state returns home', () => {
    useGameStore.getState().start(['ethics'], 'easy', 0);
    useGameStore.getState().quit();
    expect(useGameStore.getState().state.screen).toBe('home');
  });

  it('showHint() from home is a no-op', () => {
    useGameStore.getState().showHint();
    expect(useGameStore.getState().state.screen).toBe('home');
  });

  it('revealPerspective() from home is a no-op', () => {
    useGameStore.getState().revealPerspective();
    expect(useGameStore.getState().state.screen).toBe('home');
  });
});
