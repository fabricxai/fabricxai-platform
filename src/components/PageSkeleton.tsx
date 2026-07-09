import { Skeleton } from './ui/skeleton';

export function PageSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-white/5" />
          <Skeleton className="h-4 w-72 bg-white/5" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 bg-white/5 rounded-xl" />
          <Skeleton className="h-9 w-32 bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 bg-white/5" />
              <Skeleton className="h-8 w-8 rounded-lg bg-white/5" />
            </div>
            <Skeleton className="h-8 w-20 bg-white/5" />
            <Skeleton className="h-3 w-28 bg-white/5" />
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4">
          <Skeleton className="h-5 w-36 bg-white/5" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl bg-white/5 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full bg-white/5" />
                  <Skeleton className="h-3 w-3/4 bg-white/5" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full bg-white/5" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-4">
          <Skeleton className="h-5 w-28 bg-white/5" />
          <Skeleton className="h-40 w-full bg-white/5 rounded-xl" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 bg-white/5" />
                <Skeleton className="h-3 w-12 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
