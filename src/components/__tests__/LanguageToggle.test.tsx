// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import '../../i18n/index';
import { LanguageToggle } from '../LanguageToggle';

const changeLanguage = vi.fn();

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<typeof import('react-i18next')>('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        if (key === 'lang.toggle.en') return 'EN';
        if (key === 'lang.toggle.id') return 'ID';
        return key;
      },
      i18n: {
        language: 'en',
        changeLanguage,
      },
    }),
  };
});

vi.mock('../../store/persist', () => ({
  readSettings: vi.fn(() => ({ language: 'en', reducedMotion: false, qualityTier: 'high' })),
  writeSettings: vi.fn(),
}));

import { writeSettings } from '../../store/persist';

describe('LanguageToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders EN and ID buttons', () => {
    render(<LanguageToggle />);

    expect(screen.getByRole('button', { name: 'EN' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'ID' })).toBeTruthy();
  });

  it('calls changeLanguage and writeSettings when selecting another language', () => {
    render(<LanguageToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'ID' }));

    expect(changeLanguage).toHaveBeenCalledWith('id');
    expect(writeSettings).toHaveBeenCalledWith(expect.objectContaining({ language: 'id' }));
  });

  it('does not change language when clicking the active option', () => {
    render(<LanguageToggle />);

    fireEvent.click(screen.getByRole('button', { name: 'EN' }));

    expect(changeLanguage).not.toHaveBeenCalled();
    expect(writeSettings).not.toHaveBeenCalled();
  });

  it('disables both buttons when disabled prop is true', () => {
    render(<LanguageToggle disabled={true} />);

    screen.getAllByRole('button').forEach((button) => {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    });
  });
});
