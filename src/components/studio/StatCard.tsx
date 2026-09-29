interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-card border border-border p-6">
      <p className="text-[10px] uppercase tracking-widest text-muted">{label}</p>
      <p className="font-display text-4xl mt-2">{value}</p>
      {sub && <p className="text-sm text-muted mt-1">{sub}</p>}
    </div>
  );
}
