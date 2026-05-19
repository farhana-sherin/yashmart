import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Breadcrumbs({ className }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/") return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex mb-4", className)}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <Link 
            to="/" 
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </li>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const label = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, " ");

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 shrink-0" />
              {last ? (
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {label}
                </span>
              ) : (
                <Link to={to} className="hover:text-foreground transition-colors truncate max-w-[100px]">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
