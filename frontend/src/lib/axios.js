import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from "@/services/token.service";
import { useAuthStore } from "@/store/auth.store";

const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const response = await axios.post(`${baseURL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data.data || response.data;
          setTokens(access, null);
          api.defaults.headers.common.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          removeTokens();
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      } else {
        removeTokens();
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
