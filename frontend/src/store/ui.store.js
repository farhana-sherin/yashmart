import { create } from "zustand";

export const useUIStore = create((set) => ({
  isSidebarOpen: false, // For mobile drawer
  isSidebarCollapsed: false, // For desktop collapse
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebarCollapse: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
