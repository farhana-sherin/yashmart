import Skeleton from "./Skeleton";

export default function CardLoader() {
  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col h-full gap-4">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-1/4 mt-auto" />
    </div>
  );
}
