import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Dropdown({ 
  trigger, 
  children, 
  align = "right", 
  className 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignments = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2"
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={cn(
            "absolute mt-2 w-56 rounded-md shadow-lg bg-card border ring-1 ring-black ring-opacity-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200",
            alignments[align] || alignments.right,
            className
          )}
        >
          <div className="py-1" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, icon: Icon, className, destructive }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition-colors",
        destructive 
          ? "text-destructive hover:bg-destructive/10" 
          : "text-foreground hover:bg-secondary",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
