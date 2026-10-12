export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-trail border-t-transparent animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Loading</p>
      </div>
    </div>
  );
}
