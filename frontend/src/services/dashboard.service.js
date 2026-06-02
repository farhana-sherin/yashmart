import api from "@/lib/axios";

export const dashboardService = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats/");
    return response.data;
  },
  
  getAttendanceSummary: async () => {
    const response = await api.get("/dashboard/attendance-summary/");
    return response.data;
  },

  getRewardSummary: async () => {
    const response = await api.get("/dashboard/reward-summary/");
    return response.data;
  },

  getCustomerSummary: async () => {
    const response = await api.get("/dashboard/customer-summary/");
    return response.data;
  },

  getOfferSummary: async () => {
    const response = await api.get("/dashboard/offer-summary/");
    return response.data;
  },

  getGraphs: async () => {
    const response = await api.get("/dashboard/graphs/");
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get("/dashboard/recent-activities/");
    return response.data;
  },
};
