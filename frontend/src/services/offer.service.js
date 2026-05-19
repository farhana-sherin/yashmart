import api from "@/lib/axios";

export const offerService = {
  getOffers: async (params) => {
    const response = await api.get("/offers/", { params });
    return response.data;
  },

  getOffer: async (id) => {
    const response = await api.get(`/offers/${id}/`);
    return response.data;
  },

  createOffer: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'banner' && data[key]) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });
    const response = await api.post("/offers/", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  updateOffer: async (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'banner' && data[key] instanceof FileList) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });
    const response = await api.put(`/offers/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },

  deleteOffer: async (id) => {
    const response = await api.delete(`/offers/${id}/`);
    return response.data;
  },
};
