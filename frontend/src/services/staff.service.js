import api from "@/lib/axios";

export const staffService = {
  getStaffs: async (params) => {
    const response = await api.get("/staff/", { params });
    return response.data.data;
  },

  getStaff: async (id) => {
    const response = await api.get(`/staff/${id}/`);
    return response.data.data;
  },

  createStaff: async (data) => {
    const response = await api.post("/staff/", data);
    return response.data;
  },

  updateStaff: async (id, data) => {
    const response = await api.put(`/staff/${id}/`, data);
    return response.data;
  },

  deleteStaff: async (id) => {
    const response = await api.delete(`/staff/${id}/`);
    return response.data;
  },

  getStaffAttendance: async (id, params) => {
    const response = await api.get(`/staff/${id}/attendance/`, { params });
    return response.data.data;
  },

  getStaffStatistics: async (id) => {
    const response = await api.get(`/staff/${id}/statistics/`);
    return response.data.data;
  },
};
