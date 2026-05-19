import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className, size = 24 }) {
  return <Loader2 size={size} className={cn("animate-spin", className)} />;
}
