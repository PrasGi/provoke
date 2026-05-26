import type { CategoryId } from './category';
import type { Level } from './level';

export interface Question {
  qid: string;
  category_id: CategoryId;
  level: Level;
  q_en: string;
  hint_en?: string;
  persp_en: string;
  q_id: string;
  hint_id?: string;
  persp_id: string;
}
