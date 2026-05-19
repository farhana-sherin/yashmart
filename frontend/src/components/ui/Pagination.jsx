import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-4", className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-md border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          // Simple pagination logic for many pages (placeholder)
          if (totalPages > 7) {
             if (page > 2 && page < totalPages - 1 && Math.abs(page - currentPage) > 1) {
                if (page === 3 || page === totalPages - 2) return <span key={page}>...</span>;
                return null;
             }
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-9 h-9 rounded-md border text-sm font-medium transition-colors",
                currentPage === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground hover:bg-secondary border-border"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md border bg-card hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
