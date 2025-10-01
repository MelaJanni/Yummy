import api from '../lib/axios';

export const commentsApi = {
  create: async (recipeId, data) => {
    const response = await api.post(`/comments/recipes/${recipeId}`, data);
    return response.data;
  },

  delete: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  getByRecipe: async (recipeId, params) => {
    const response = await api.get(`/comments/recipes/${recipeId}`, { params });
    return response.data;
  },
};
