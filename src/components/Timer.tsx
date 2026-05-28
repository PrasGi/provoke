interface TimerProps {
  secs: number;
  total: number;
  running: boolean;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getColorClass(secs: number): string {
  if (secs <= 30) return 'text-red-400';
  if (secs <= 60) return 'text-amber-400';
  return 'text-white/70';
}

function getBarColorClass(secs: number): string {
  if (secs <= 30) return 'bg-red-400';
  if (secs <= 60) return 'bg-amber-400';
  return 'bg-white/40';
}

export function Timer({ secs, total, running }: TimerProps) {
  if (total === 0) return null;

  const progress = total > 0 ? Math.max(0, secs / total) : 0;
  const colorClass = getColorClass(secs);
  const barColorClass = getBarColorClass(secs);

  return (
    <div className="flex min-w-[60px] flex-col gap-1">
      <span
        className={`text-sm font-mono tabular-nums ${colorClass} ${!running ? 'opacity-60' : ''}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatTime(secs)}
      </span>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColorClass}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
