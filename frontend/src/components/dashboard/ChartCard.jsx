import { cn } from "@/lib/utils";

export default function ChartCard({ title, description, children, className }) {
  return (
    <div className={cn("bg-card rounded-xl border shadow-sm flex flex-col", className)}>
      <div className="p-6 border-b shrink-0">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="p-6 flex-1 min-h-[300px] flex items-center justify-center bg-muted/10 rounded-b-xl">
        {/* If no children provided, show placeholder */}
        {children || (
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-lg mb-3 mx-auto animate-pulse" />
            <p className="text-sm font-medium text-muted-foreground">Chart Area</p>
            <p className="text-xs text-muted-foreground mt-1">Data visualization will render here</p>
          </div>
        )}
      </div>
    </div>
  );
}
