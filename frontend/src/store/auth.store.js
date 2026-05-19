import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setTokens, removeTokens } from "@/services/token.service";
import { authService } from "@/services/auth.service";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          const { access, refresh, user } = response.data;
          setTokens(access, refresh);
          set({ user, isAuthenticated: true, isLoading: false });
          return response;
        } catch (error) {
          const respData = error.response?.data;
          let errorMsg = "Login failed";
          if (respData) {
            errorMsg = respData.errors?.non_field_errors?.[0] || respData.message || errorMsg;
          } else if (error.message === "Network Error") {
            errorMsg = "Network error. Please check your connection.";
          }
          set({ isLoading: false, error: errorMsg });
          throw error;
        }
      },

      logout: async () => {
        await authService.logout();
        removeTokens();
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const response = await authService.getProfile();
          set({ user: response.data });
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
