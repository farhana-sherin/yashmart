import { create } from "zustand";

export const useRewardStore = create((set) => ({
  history: [],
  summary: null,
  filters: {
    customerId: "",
    type: "", // Points, Balance, Conversion
    page: 1,
  },
  
  setHistory: (history) => set({ history }),
  setSummary: (summary) => set({ summary }),
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));
