export function StackBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-400">
      {children}
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
