import { create } from "zustand";

export const useCustomerStore = create((set) => ({
  customers: [],
  selectedCustomer: null,
  filters: {
    search: "",
    sortBy: "newest",
    page: 1,
  },
  
  setCustomers: (customers) => set({ customers }),
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => 
    set({ filters: { search: "", sortBy: "newest", page: 1 } }),
}));
