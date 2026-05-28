import { z } from 'zod';
import { STORAGE_KEYS } from './keys';

export const SettingsSchema = z.object({
  language: z.enum(['en', 'id']).default('en'),
  reducedMotion: z.boolean().default(false),
  qualityTier: z.enum(['high', 'medium', 'low', 'none']).default('high'),
});
export type Settings = z.infer<typeof SettingsSchema>;

export const SeenSchema = z.record(z.string(), z.array(z.string()));
export type Seen = z.infer<typeof SeenSchema>;

export const SessionSchema = z
  .object({
    selectedCategories: z.array(z.string()),
    level: z.enum(['easy', 'medium', 'hard', 'all']),
    timerDur: z.number(),
    idx: z.number(),
    phase: z.enum(['thinking', 'hinted', 'revealed']),
    deck: z.array(z.string()),
  })
  .nullable();
export type Session = z.infer<typeof SessionSchema>;

export const LangSchema = z.enum(['en', 'id']).default('en');
export type Lang = z.infer<typeof LangSchema>;

const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  reducedMotion: false,
  qualityTier: 'high',
};
const DEFAULT_SEEN: Seen = {};
const DEFAULT_SESSION = null;
const DEFAULT_LANG: Lang = 'en';

function safeRead<T>(key: string, schema: z.ZodTypeAny, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    const parsed = JSON.parse(raw) as unknown;
    const result = schema.safeParse(parsed);
    return result.success ? (result.data as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function readSettings(): Settings {
  return safeRead(STORAGE_KEYS.settings, SettingsSchema, DEFAULT_SETTINGS);
}

export function writeSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function readSeen(): Seen {
  return safeRead(STORAGE_KEYS.seen, SeenSchema, DEFAULT_SEEN);
}

export function writeSeen(seen: Seen): void {
  localStorage.setItem(STORAGE_KEYS.seen, JSON.stringify(seen));
}

export function readSession(): Session {
  return safeRead(STORAGE_KEYS.session, SessionSchema, DEFAULT_SESSION);
}

export function writeSession(session: NonNullable<Session>): void {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.session);
}

export function readLang(): Lang {
  return safeRead(STORAGE_KEYS.lang, LangSchema, DEFAULT_LANG);
}

export function writeLang(lang: Lang): void {
  localStorage.setItem(STORAGE_KEYS.lang, JSON.stringify(lang));
}

export function migrateIfNeeded(): void {
  // v1: no migration needed — this is the initial schema
}
