import { useTranslation } from 'react-i18next';

export function Brand() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start gap-1">
      <h1
        className="text-4xl sm:text-5xl font-normal tracking-tight bg-gradient-to-r from-white to-[oklch(0.85_0.12_70)] bg-clip-text text-transparent"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {t('app.title')}
      </h1>
      <div className="w-10 h-px bg-gradient-to-r from-white/25 to-transparent" />
      <p className="text-base text-white/55 tracking-wide" style={{ fontFamily: 'var(--font-sans)' }}>
        {t('app.tagline')}
      </p>
      <div className="w-8 h-px bg-gradient-to-r from-primary/60 to-transparent mt-2" />
    </div>
  );
}
