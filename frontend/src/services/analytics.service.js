import api from "@/lib/axios";

export const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get("/analytics/dashboard/");
    return response.data;
  },

  getRevenueAnalytics: async (params) => {
    const response = await api.get("/analytics/revenue/", { params });
    return response.data;
  },

  getCustomerGrowth: async (params) => {
    const response = await api.get("/analytics/growth/", { params });
    return response.data;
  },

  getOfferPerformance: async () => {
    const response = await api.get("/analytics/offers/");
    return response.data;
  },

  getTopPerformers: async () => {
    const response = await api.get("/analytics/top-performers/");
    return response.data;
  },
};
