import { create } from "zustand";

export const useSettingsStore = create((set) => ({
  settings: null,
  company: null,
  isLoading: false,
  
  setSettings: (settings) => set({ settings }),
  setCompany: (company) => set({ company }),
  setLoading: (isLoading) => set({ isLoading }),
}));
