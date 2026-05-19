import { create } from "zustand";

export const useOfferStore = create((set) => ({
  offers: [],
  isLoading: false,
  filters: {
    status: "ACTIVE",
    search: "",
  },
  
  setOffers: (offers) => set({ offers }),
  setLoading: (isLoading) => set({ isLoading }),
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));
