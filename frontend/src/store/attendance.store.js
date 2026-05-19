import { create } from "zustand";

export const useAttendanceStore = create((set) => ({
  todayStatus: null,
  history: [],
  statistics: null,
  isLoading: false,
  error: null,

  setTodayStatus: (status) => set({ todayStatus: status }),
  setHistory: (history) => set({ history }),
  setStatistics: (stats) => set({ statistics: stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  reset: () => set({ todayStatus: null, history: [], statistics: null, error: null }),
}));
