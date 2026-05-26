import { beforeEach, describe, expect, it } from 'vitest';
import i18n from '../index';

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

describe('i18n', () => {
  it('defaults to English', () => {
    expect(i18n.language).toBe('en');
  });

  it('translates a known key in EN', () => {
    expect(i18n.t('home.start')).toBe('Start');
  });

  it('translates a known key in ID', async () => {
    await i18n.changeLanguage('id');
    expect(i18n.t('home.start')).toBe('Mulai');
  });

  it('falls back to EN for a missing ID key', async () => {
    i18n.addResource('en', 'translation', 'fallback_probe', 'Fallback Works');
    await i18n.changeLanguage('id');
    expect(i18n.t('fallback_probe')).toBe('Fallback Works');
  });

  it('saveMissing is false', () => {
    expect((i18n.options as { saveMissing?: boolean }).saveMissing).toBe(false);
  });

  it('EN and ID have key parity for home.start', () => {
    const enKeys = Object.keys(i18n.getResourceBundle('en', 'translation') as object);
    const idKeys = Object.keys(i18n.getResourceBundle('id', 'translation') as object);
    expect(enKeys.sort()).toEqual(idKeys.sort());
  });
});
