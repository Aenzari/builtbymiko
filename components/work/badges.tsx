export function StackBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-black/[0.1] bg-surface-950/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-300">
      [{children}]
    </span>
  );
}

export function MetricStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-xl font-medium tracking-tight text-ink-100 sm:text-2xl">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
        {label}
      </span>
    </div>
  );
}
