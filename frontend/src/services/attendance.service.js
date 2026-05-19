import api from "@/lib/axios";

export const attendanceService = {
  checkIn: async (locationData) => {
    console.log("DEBUG: attendanceService.checkIn calling API with:", locationData);
    const response = await api.post("/attendance/check-in/", locationData);
    return response.data;
  },

  checkOut: async (locationData) => {
    const response = await api.post("/attendance/check-out/", locationData);
    return response.data;
  },

  getTodayStatus: async () => {
    const response = await api.get("/attendance/today/");
    return response.data;
  },

  getHistory: async (params) => {
    const response = await api.get("/attendance/history/", { params });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get("/attendance/statistics/");
    return response.data;
  },

  getMonthlyReport: async (params) => {
    const response = await api.get("/attendance/monthly-report/", { params });
    return response.data;
  },

  getStaffAttendance: async (staffId, params) => {
    const response = await api.get(`/attendance/staff/${staffId}/`, { params });
    return response.data;
  },

  verifyQR: async (qrData) => {
    const response = await api.post("/attendance/qr-verify/", qrData);
    return response.data;
  },
};
