import { describe, it, expect } from 'vitest';
import { CATEGORIES, getCategoryById } from '../categories';
import { CATEGORY_IDS } from '../../types/category';

describe('CATEGORIES', () => {
  it('has exactly 21 entries', () => {
    expect(CATEGORIES.length).toBe(21);
  });
  it('has no duplicate ids', () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(21);
  });
  it('covers all CategoryId literals', () => {
    const ids = new Set(CATEGORIES.map((c) => c.id));
    CATEGORY_IDS.forEach((id) => expect(ids.has(id)).toBe(true));
  });
  it('has no empty strings', () => {
    CATEGORIES.forEach((c) => {
      expect(c.label_id).not.toBe('');
      expect(c.label_en).not.toBe('');
      expect(c.description_id).not.toBe('');
      expect(c.description_en).not.toBe('');
    });
  });
  it('getCategoryById returns correct entry', () => {
    expect(getCategoryById('ethics').label_en).toBe('Ethics');
  });
});
