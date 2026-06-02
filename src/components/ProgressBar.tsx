interface ProgressBarProps {
  value: number;
  color: string;
}

export function ProgressBar({ value, color }: ProgressBarProps) {
  return (
    <div
      className="fixed top-0 inset-x-0 z-30 h-[3px] bg-white/5 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full transition-[width] duration-300 ease-out"
        style={{ width: `${Math.min(1, value) * 100}%`, backgroundColor: color }}
      />
    </div>
  );
}
