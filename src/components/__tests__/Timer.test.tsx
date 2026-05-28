// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Timer } from '../Timer';

describe('Timer', () => {
  it('formats 90 seconds as 1:30', () => {
    render(<Timer secs={90} total={120} running={true} />);
    expect(screen.getByText('1:30')).toBeTruthy();
  });

  it('formats 5 seconds as 0:05', () => {
    render(<Timer secs={5} total={120} running={true} />);
    expect(screen.getByText('0:05')).toBeTruthy();
  });

  it('returns null when total is 0', () => {
    const { container } = render(<Timer secs={60} total={0} running={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies amber color class at 60 seconds', () => {
    const { container } = render(<Timer secs={60} total={120} running={true} />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-amber-400');
  });

  it('applies red color class at 30 seconds', () => {
    const { container } = render(<Timer secs={30} total={120} running={true} />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-red-400');
  });

  it('applies normal color above 60 seconds', () => {
    const { container } = render(<Timer secs={61} total={120} running={true} />);
    const span = container.querySelector('span');
    expect(span?.className).toContain('text-white/70');
  });
});
