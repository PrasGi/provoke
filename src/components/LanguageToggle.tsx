import { useTranslation } from 'react-i18next';
import { readSettings, writeSettings } from '../store/persist';

interface LanguageToggleProps {
  disabled?: boolean;
}

export function LanguageToggle({ disabled = false }: LanguageToggleProps) {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language === 'id' ? 'id' : 'en';

  const handleToggle = (lang: 'en' | 'id') => {
    if (disabled || lang === currentLang) return;
    i18n.changeLanguage(lang);
    const settings = readSettings();
    writeSettings({ ...settings, language: lang });
  };

  return (
    <fieldset
      className="flex gap-0 rounded-lg bg-white/5 border border-white/8 p-0.5"
      aria-label="Language"
    >
      {(['en', 'id'] as const).map((lang) => (
        <button
          type="button"
          key={lang}
          onClick={() => handleToggle(lang)}
          disabled={disabled}
          className={`provoke-button rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wider ${
            currentLang === lang ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white/80'
          } disabled:cursor-not-allowed disabled:opacity-40`}
          aria-pressed={currentLang === lang}
        >
          {t(`lang.toggle.${lang}`)}
        </button>
      ))}
    </fieldset>
  );
}
