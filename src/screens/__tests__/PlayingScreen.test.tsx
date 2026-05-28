// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../i18n/index';
import { PlayingScreen } from '../PlayingScreen';
import { useGameStore } from '../../store/game.store';
import type { Question } from '../../types/question';

vi.mock('../../store/persist', () => ({
  readSettings: vi.fn(() => ({ language: 'en', reducedMotion: false, qualityTier: 'high' })),
  writeSettings: vi.fn(),
}));

vi.mock('../../three/theme-context', () => ({
  useTheme: vi.fn(() => ({ theme: {}, setCategoryId: vi.fn(), themeRef: { current: {} } })),
}));

const mockDeck: Question[] = [
  {
    qid: 'ethics-easy-01',
    category_id: 'ethics',
    level: 'easy',
    q_en: 'Test question EN',
    hint_en: 'Test hint EN',
    persp_en: 'Test perspective EN',
    q_id: 'Test question ID',
    hint_id: 'Test hint ID',
    persp_id: 'Test perspective ID',
  },
  {
    qid: 'philosophy-easy-01',
    category_id: 'philosophy',
    level: 'easy',
    q_en: 'Second question EN',
    persp_en: 'Second perspective EN',
    q_id: 'Second question ID',
    persp_id: 'Second perspective ID',
  },
];

function setPlayingState(overrides: Record<string, unknown> = {}) {
  useGameStore.setState({
    state: {
      screen: 'playing',
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 0,
      deck: mockDeck,
      idx: 0,
      phase: 'thinking',
      secs: 0,
      running: false,
      ...overrides,
    },
  });
}

beforeEach(() => {
  useGameStore.setState({ state: { screen: 'home' } });
});

describe('PlayingScreen', () => {
  it('renders null when not in playing state', () => {
    const { container } = render(<PlayingScreen />);
    expect(container.firstChild).toBeNull();
  });

  it('renders card counter', () => {
    setPlayingState();
    render(<PlayingScreen />);
    expect(screen.getByText('1 / 2')).toBeTruthy();
  });

  it('renders question text', () => {
    setPlayingState();
    render(<PlayingScreen />);
    expect(screen.getByText('Test question EN')).toBeTruthy();
  });

  it('shows Hint and Reveal buttons when phase=thinking and hint exists', () => {
    setPlayingState({ phase: 'thinking' });
    render(<PlayingScreen />);
    expect(screen.getByRole('button', { name: /hint/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /reveal/i })).toBeTruthy();
  });

  it('shows only Reveal when phase=hinted', () => {
    setPlayingState({ phase: 'hinted' });
    render(<PlayingScreen />);
    expect(screen.queryByRole('button', { name: /hint/i })).toBeNull();
    expect(screen.getByRole('button', { name: /reveal/i })).toBeTruthy();
  });

  it('shows Next button when phase=revealed', () => {
    setPlayingState({ phase: 'revealed' });
    render(<PlayingScreen />);
    expect(screen.getByRole('button', { name: /next|berikutnya/i })).toBeTruthy();
  });
});
