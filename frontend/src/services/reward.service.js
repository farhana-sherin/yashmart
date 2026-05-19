import api from "@/lib/axios";

export const rewardService = {
  getHistory: async (params) => {
    const response = await api.get("/rewards/history/", { params });
    return response.data.data;
  },

  getCustomerRewards: async (id) => {
    const response = await api.get(`/rewards/customer/${id}/`);
    return response.data.data;
  },

  addPoints: async (data) => {
    const response = await api.post("/rewards/add-points/", data);
    return response.data; // Success message is at top level in views.py Response
  },

  addBalance: async (data) => {
    const response = await api.post("/rewards/add-balance/", data);
    return response.data;
  },

  convertBalance: async (data) => {
    const response = await api.post("/rewards/convert/", data);
    return response.data;
  },
};
