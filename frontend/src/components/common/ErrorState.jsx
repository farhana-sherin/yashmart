import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content.",
  onRetry,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border rounded-xl bg-destructive/5 min-h-[300px]", className)}>
      <div className="bg-destructive/10 p-4 rounded-full mb-4">
        <AlertTriangle className="w-10 h-10 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-destructive">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-destructive/20 hover:bg-destructive/10">
          Try Again
        </Button>
      )}
    </div>
  );
}
