import { describe, expect, it } from 'vitest';
import { QUESTIONS, QUESTION_COUNT } from '../questions.generated';
import { CATEGORY_IDS } from '../../types/category';

describe('QUESTIONS (generated)', () => {
  it('has the correct count', () => {
    expect(QUESTIONS.length).toBe(QUESTION_COUNT);
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(315);
  });

  it('has no duplicate qids', () => {
    const qids = QUESTIONS.map((q) => q.qid);
    expect(new Set(qids).size).toBe(qids.length);
  });

  it('all category_ids are valid', () => {
    const validIds = new Set(CATEGORY_IDS);
    QUESTIONS.forEach((q) => {
      expect(validIds.has(q.category_id)).toBe(true);
    });
  });

  it('all levels are valid', () => {
    QUESTIONS.forEach((q) => {
      expect(['easy', 'medium', 'hard']).toContain(q.level);
    });
  });

  it('every category × level has at least 1 question', () => {
    const combos = new Set(QUESTIONS.map((q) => `${q.category_id}:${q.level}`));
    CATEGORY_IDS.forEach((id) => {
      ['easy', 'medium', 'hard'].forEach((level) => {
        expect(combos.has(`${id}:${level}`)).toBe(true);
      });
    });
  });
});
