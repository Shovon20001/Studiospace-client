export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100">
      <div className="sk aspect-[4/3] !rounded-none" />
      <div className="space-y-3 p-4">
        <div className="sk h-4 w-1/3" />
        <div className="sk h-5 w-4/5" />
        <div className="sk h-4 w-1/2" />
        <div className="sk h-10 w-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function RowsSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="sk h-24 w-full" />)}
    </div>
  );
}
