import { create } from "zustand";

export const useStaffStore = create((set) => ({
  staffs: [],
  selectedStaff: null,
  filters: {
    search: "",
    department: "",
    is_active: "",
    page: 1,
  },
  
  setStaffs: (staffs) => set({ staffs }),
  setSelectedStaff: (selectedStaff) => set({ selectedStaff }),
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  resetFilters: () => 
    set({ filters: { search: "", department: "", is_active: "", page: 1 } }),
}));
