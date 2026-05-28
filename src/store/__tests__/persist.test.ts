// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearSession,
  readLang,
  readSeen,
  readSession,
  readSettings,
  writeLang,
  writeSeen,
  writeSession,
  writeSettings,
} from '../persist';

beforeEach(() => {
  localStorage.clear();
});

describe('persist helpers', () => {
  it('readSettings returns defaults when empty', () => {
    const settings = readSettings();

    expect(settings.language).toBe('en');
    expect(settings.reducedMotion).toBe(false);
    expect(settings.qualityTier).toBe('high');
  });

  it('readSettings returns defaults on corrupt JSON', () => {
    localStorage.setItem('provoke_v1_settings', '{invalid');

    expect(readSettings()).toEqual({
      language: 'en',
      reducedMotion: false,
      qualityTier: 'high',
    });
  });

  it('readSettings returns defaults on schema-invalid data', () => {
    localStorage.setItem('provoke_v1_settings', JSON.stringify({ language: 'fr' }));

    expect(readSettings()).toEqual({
      language: 'en',
      reducedMotion: false,
      qualityTier: 'high',
    });
  });

  it('writeSettings round-trips', () => {
    writeSettings({ language: 'id', reducedMotion: true, qualityTier: 'low' });

    expect(readSettings()).toEqual({ language: 'id', reducedMotion: true, qualityTier: 'low' });
  });

  it('readSeen returns empty object when empty', () => {
    expect(readSeen()).toEqual({});
  });

  it('writeSeen round-trips', () => {
    writeSeen({ ethics: ['ethics-easy-01', 'ethics-easy-02'] });

    expect(readSeen()).toEqual({ ethics: ['ethics-easy-01', 'ethics-easy-02'] });
  });

  it('readSession returns null when empty', () => {
    expect(readSession()).toBeNull();
  });

  it('writeSession round-trips', () => {
    writeSession({
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 60,
      idx: 0,
      phase: 'thinking',
      deck: ['ethics-easy-01'],
    });

    expect(readSession()).toEqual({
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 60,
      idx: 0,
      phase: 'thinking',
      deck: ['ethics-easy-01'],
    });
  });

  it('clearSession removes session', () => {
    writeSession({
      selectedCategories: ['ethics'],
      level: 'easy',
      timerDur: 60,
      idx: 0,
      phase: 'thinking',
      deck: ['ethics-easy-01'],
    });

    clearSession();

    expect(readSession()).toBeNull();
  });

  it('readLang returns defaults when empty and round-trips valid data', () => {
    expect(readLang()).toBe('en');

    writeLang('id');

    expect(readLang()).toBe('id');
  });
});
