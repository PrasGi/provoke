import { describe, it, expect } from 'vitest';
import { CATEGORY_IDS } from '../category';

describe('CategoryId', () => {
  it('has exactly 21 ids', () => {
    expect(CATEGORY_IDS.length).toBe(21);
  });
  it('has no duplicates', () => {
    expect(new Set(CATEGORY_IDS).size).toBe(21);
  });
});
