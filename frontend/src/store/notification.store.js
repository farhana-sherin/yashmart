import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setLoading: (isLoading) => set({ isLoading }),
  
  addNotification: (notification) => 
    set((state) => ({ 
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    })),
}));
