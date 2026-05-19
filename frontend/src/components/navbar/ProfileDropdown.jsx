import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-secondary transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium overflow-hidden border">
          {user?.profile_image ? (
            <img src={user.profile_image} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <div className="hidden md:flex flex-col items-start text-sm">
          <span className="font-semibold leading-none">{user?.name || "User"}</span>
          <span className="text-xs text-muted-foreground">{user?.role || "CUSTOMER"}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          
          <div className="py-1">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              My Profile
            </Link>
            <Link 
              to="/change-password" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Security
            </Link>
          </div>
          
          <div className="border-t py-1">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
