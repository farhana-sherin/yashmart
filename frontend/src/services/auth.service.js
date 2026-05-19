import api from "@/lib/axios";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login/", { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register/", userData);
    return response.data;
  },
  logout: async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch (error) {
      console.error("Logout API error:", error);
    }
  },
  getProfile: async () => {
    const response = await api.get("/auth/profile/");
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile/", data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.post("/auth/change-password/", data);
    return response.data;
  },
};
