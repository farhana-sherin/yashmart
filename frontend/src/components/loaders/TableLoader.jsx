import Skeleton from "./Skeleton";

export default function TableLoader({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full border rounded-xl bg-card overflow-hidden">
      <div className="bg-muted/50 px-4 py-3 border-b">
        <div className="flex gap-4">
          {[...Array(cols)].map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-4 py-4 flex gap-4">
            {[...Array(cols)].map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
