export const STORAGE_KEYS = {
  settings: 'provoke_v1_settings',
  seen: 'provoke_v1_seen',
  session: 'provoke_v1_session',
  lang: 'provoke_v1_lang',
  tutorial: 'provoke_v1_tutorial',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
export const SCHEMA_VERSION = 'v1' as const;
