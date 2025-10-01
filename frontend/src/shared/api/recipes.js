import api from '../lib/axios';

export const recipesApi = {
  getAll: async (params) => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/recipes/id/${id}`);
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/recipes/${slug}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/recipes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMyRecipes: async (params) => {
    const response = await api.get('/recipes/me', { params });
    return response.data;
  },
};
