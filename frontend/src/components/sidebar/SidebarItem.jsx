import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SidebarItem({ item, isCollapsed, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group relative",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          isCollapsed ? "justify-center" : "justify-start"
        )
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      
      {!isCollapsed && (
        <span className="truncate">{item.title}</span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap transition-opacity">
          {item.title}
        </div>
      )}
    </NavLink>
  );
}
