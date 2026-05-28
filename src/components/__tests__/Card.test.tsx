// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Card } from '../Card';
import type { Question } from '../../types/question';
import '../../i18n/index';

const mockQuestion: Question = {
  qid: 'ethics-easy-01',
  category_id: 'ethics',
  level: 'easy',
  q_en: 'Can lying for a good cause be justified?',
  hint_en: 'Think about intent vs outcome.',
  persp_en: 'Kant would say no. Mill would say yes.',
  q_id: 'Apakah berbohong demi kebaikan bisa dibenarkan?',
  hint_id: 'Pikirkan niat vs hasil.',
  persp_id: 'Kant akan mengatakan tidak. Mill akan mengatakan ya.',
};

const defaultProps = {
  question: mockQuestion,
  phase: 'thinking' as const,
  lang: 'en' as const,
  onHint: vi.fn(),
  onReveal: vi.fn(),
  onNext: vi.fn(),
  isLastCard: false,
};

describe('Card', () => {
  it('renders question text', () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText('Can lying for a good cause be justified?')).toBeTruthy();
  });

  it('shows hint button when phase=thinking and hint exists', () => {
    render(<Card {...defaultProps} phase="thinking" />);
    const hintBtn = screen.getByRole('button', { name: /hint/i });
    expect(hintBtn).toBeTruthy();
  });

  it('hides hint button when question has no hint', () => {
    const noHintQ = { ...mockQuestion, hint_en: undefined, hint_id: undefined };
    render(<Card {...defaultProps} question={noHintQ} phase="thinking" />);
    expect(screen.queryByRole('button', { name: /hint/i })).toBeNull();
  });

  it('shows perspective text when phase=revealed', () => {
    render(<Card {...defaultProps} phase="revealed" />);
    expect(screen.getAllByText('Kant would say no. Mill would say yes.').length).toBeGreaterThan(0);
  });

  it('calls onReveal when reveal button clicked', () => {
    const onReveal = vi.fn();
    render(<Card {...defaultProps} onReveal={onReveal} />);
    fireEvent.click(screen.getByRole('button', { name: /reveal/i }));
    expect(onReveal).toHaveBeenCalled();
  });
});
