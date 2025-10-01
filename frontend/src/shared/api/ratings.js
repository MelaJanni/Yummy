import api from '../lib/axios';

export const ratingsApi = {
  create: async (recipeId, data) => {
    const response = await api.post(`/ratings/recipes/${recipeId}`, data);
    return response.data;
  },

  update: async (recipeId, data) => {
    const response = await api.put(`/ratings/recipes/${recipeId}`, data);
    return response.data;
  },

  delete: async (recipeId) => {
    const response = await api.delete(`/ratings/recipes/${recipeId}`);
    return response.data;
  },

  getByRecipe: async (recipeId, params) => {
    const response = await api.get(`/ratings/recipes/${recipeId}`, { params });
    return response.data;
  },
};
