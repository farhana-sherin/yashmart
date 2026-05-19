import api from "@/lib/axios";

export const customerService = {
  getCustomers: async (params) => {
    const response = await api.get("/customers/", { params });
    return response.data.data; // StandardResultsSetPagination wraps it in 'data'
  },

  getCustomer: async (id) => {
    const response = await api.get(`/customers/${id}/`);
    return response.data.data;
  },

  createCustomer: async (data) => {
    const response = await api.post("/customers/", data);
    return response.data;
  },

  updateCustomer: async (id, data) => {
    const response = await api.put(`/customers/${id}/`, data);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}/`);
    return response.data;
  },
};
