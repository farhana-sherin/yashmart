import { Menu, Search, Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useTheme } from "@/hooks/useTheme";
import ProfileDropdown from "./ProfileDropdown";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const { toggleSidebar } = useUIStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 shrink-0 bg-card border-b flex items-center justify-between px-4 lg:px-6 shadow-sm z-30 relative">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-muted-foreground hover:bg-secondary lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative group">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-64 rounded-full border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <NotificationDropdown />
        
        <div className="h-6 w-px bg-border hidden md:block mx-1"></div>
        
        <ProfileDropdown />
      </div>
    </header>
  );
}
