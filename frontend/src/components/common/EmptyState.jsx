import { PackageX } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmptyState({ 
  title = "No data found", 
  description = "Get started by creating a new record.",
  icon: Icon = PackageX,
  action,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-card border-dashed min-h-[300px]", className)}>
      <div className="bg-secondary/50 p-4 rounded-full mb-4">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}
