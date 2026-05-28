// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '../../i18n/index';
import { CategoryGrid } from '../CategoryGrid';

describe('CategoryGrid', () => {
  it('renders 21 category chips', () => {
    render(<CategoryGrid selected={[]} onChange={vi.fn()} />);
    const allButtons = screen.getAllByRole('button');
    const chips = allButtons.filter((b) => b.hasAttribute('aria-pressed'));
    expect(chips.length).toBe(21);
  });

  it('shows Select All and Clear buttons', () => {
    render(<CategoryGrid selected={[]} onChange={vi.fn()} />);
    expect(screen.getByText(/select all/i)).toBeTruthy();
    expect(screen.getByText(/clear/i)).toBeTruthy();
  });

  it('toggles a chip on click', () => {
    const onChange = vi.fn();
    render(<CategoryGrid selected={[]} onChange={onChange} />);
    const chips = screen.getAllByRole('button').filter((b) => b.hasAttribute('aria-pressed'));
    fireEvent.click(chips[0]!);
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([expect.any(String)]));
  });

  it('Select All calls onChange with 21 ids', () => {
    const onChange = vi.fn();
    render(<CategoryGrid selected={[]} onChange={onChange} />);
    fireEvent.click(screen.getByText(/select all/i));
    const arg = onChange.mock.calls[0]?.[0] as string[];
    expect(arg?.length).toBe(21);
  });

  it('Clear calls onChange with empty array', () => {
    const onChange = vi.fn();
    render(<CategoryGrid selected={['ethics', 'life']} onChange={onChange} />);
    fireEvent.click(screen.getByText(/clear/i));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('selected chip has aria-pressed=true', () => {
    render(<CategoryGrid selected={['ethics']} onChange={vi.fn()} />);
    const chips = screen.getAllByRole('button').filter((b) => b.hasAttribute('aria-pressed'));
    const ethicsChip = chips.find((b) => b.getAttribute('aria-pressed') === 'true');
    expect(ethicsChip).toBeTruthy();
  });
});
