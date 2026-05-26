export type CategoryId =
  | 'ethics' | 'philosophy' | 'politics' | 'technology' | 'law'
  | 'social' | 'economy' | 'life' | 'identity' | 'relationship'
  | 'education' | 'career' | 'environment' | 'religion' | 'psychology'
  | 'science' | 'power' | 'future' | 'paradox' | 'local' | 'popculture';

export const CATEGORY_IDS: readonly CategoryId[] = [
  'ethics', 'philosophy', 'politics', 'technology', 'law',
  'social', 'economy', 'life', 'identity', 'relationship',
  'education', 'career', 'environment', 'religion', 'psychology',
  'science', 'power', 'future', 'paradox', 'local', 'popculture',
] as const;
