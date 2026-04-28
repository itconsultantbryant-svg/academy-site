function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/10 dark:bg-white/10 ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

export function PageSkeleton() {
  return (
    <section className="glass-card space-y-4 p-6 md:p-8" aria-label="Loading content">
      <SkeletonBlock className="h-8 w-1/2 max-w-sm" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-48 w-full" />
    </section>
  )
}

export function GridSkeleton({ count = 6 }) {
  return (
    <section className="space-y-4" aria-label="Loading list">
      <SkeletonBlock className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="glass-card space-y-3 p-5">
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="h-4 w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
