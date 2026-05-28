// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '../../i18n/index';
import { HomeScreen } from '../HomeScreen';
import { useGameStore } from '../../store/game.store';

vi.mock('../../store/persist', () => ({
  readSettings: vi.fn(() => ({ language: 'en', reducedMotion: false, qualityTier: 'high' })),
  writeSettings: vi.fn(),
}));

beforeEach(() => {
  useGameStore.setState({ state: { screen: 'home' } });
});

describe('HomeScreen', () => {
  it('renders Brand wordmark', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Provoke')).toBeTruthy();
  });

  it('Start button is disabled with no categories selected', () => {
    render(<HomeScreen />);
    const startBtn = screen.getByRole('button', { name: /start|mulai/i });
    expect(startBtn).toBeDisabled();
  });

  it('Start button enables after selecting a category', async () => {
    render(<HomeScreen />);
    const categoryChips = screen
      .getAllByRole('button')
      .filter(
        (b) => b.hasAttribute('aria-pressed') && b.textContent !== 'EN' && b.textContent !== 'ID',
      );
    fireEvent.click(categoryChips[0]!);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /start|mulai/i })).not.toBeDisabled();
    });
  });

  it('renders level picker buttons', () => {
    render(<HomeScreen />);
    expect(screen.getByRole('button', { name: /all levels|semua/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /easy|mudah/i })).toBeTruthy();
  });

  it('renders timer picker buttons', () => {
    render(<HomeScreen />);
    expect(screen.getByRole('button', { name: /free|bebas/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /1 min|1 menit/i })).toBeTruthy();
  });
});
