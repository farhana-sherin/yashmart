import { cn } from "@/lib/utils";

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  className 
}) {
  return (
    <div className={cn("bg-card p-6 rounded-xl border shadow-sm transition-all hover:shadow-md", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {trend && (
          <div className="flex items-center gap-1.5 text-sm">
            <span 
              className={cn(
                "font-medium",
                trend === "up" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {trend === "up" ? "+" : "-"}{trendValue}
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
