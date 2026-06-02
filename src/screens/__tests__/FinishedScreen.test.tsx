// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '../../i18n/index';
import { FinishedScreen } from '../FinishedScreen';
import { useGameStore } from '../../store/game.store';

beforeEach(() => {
  useGameStore.setState({ state: { screen: 'home' } });
});

describe('FinishedScreen', () => {
  it('renders null when not in finished state', () => {
    const { container } = render(<FinishedScreen />);
    expect(container.firstChild).toBeNull();
  });

  it('renders count in subtitle', () => {
    useGameStore.setState({ state: { screen: 'finished', totalSeen: 15, categoryCounts: {} } });
    render(<FinishedScreen />);
    expect(screen.getByText(/15/)).toBeTruthy();
  });

  it('renders replay button', () => {
    useGameStore.setState({ state: { screen: 'finished', totalSeen: 5, categoryCounts: {} } });
    render(<FinishedScreen />);
    expect(screen.getByRole('button', { name: /play again|main lagi/i })).toBeTruthy();
  });

  it('replay button calls replay action', () => {
    useGameStore.setState({ state: { screen: 'finished', totalSeen: 5, categoryCounts: {} } });
    render(<FinishedScreen />);
    fireEvent.click(screen.getByRole('button', { name: /play again|main lagi/i }));
    expect(useGameStore.getState().state.screen).toBe('home');
  });
});
