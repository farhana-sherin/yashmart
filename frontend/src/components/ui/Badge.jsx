import { cn } from "@/lib/utils";

export default function Badge({ 
  children, 
  variant = "default", 
  className 
}) {
  const variants = {
    default: "bg-primary/10 text-primary border-primary/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    outline: "bg-transparent text-foreground border-border",
    secondary: "bg-secondary text-secondary-foreground border-transparent"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  );
}
