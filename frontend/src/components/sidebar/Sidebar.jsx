import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Store, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { getSidebarConfig } from "./sidebarConfig";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const { user } = useAuthStore();
  const { isSidebarOpen, isSidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useUIStore();

  const role = user?.role || "CUSTOMER";
  const navItems = getSidebarConfig(role);

  // Close mobile sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer / Desktop Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-card border-r shadow-sm transition-all duration-300 ease-in-out",
          // Mobile classes
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Desktop classes
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b shrink-0">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shrink-0">
              <Store className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                YasMart
              </span>
            )}
          </Link>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.path} 
              item={item} 
              isCollapsed={isSidebarCollapsed} 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
            />
          ))}
        </nav>

        {/* Sidebar Footer (Collapse Toggle) */}
        <div className="p-3 border-t hidden lg:flex">
          <button
            onClick={toggleSidebarCollapse}
            className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
