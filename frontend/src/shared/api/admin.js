import api from '../lib/axios';

export const adminApi = {
  getPendingRecipes: async (params) => {
    const response = await api.get('/admin/recipes/pending', { params });
    return response.data;
  },

  approveRecipe: async (recipeId, data) => {
    const response = await api.patch(`/admin/recipes/${recipeId}/approve`, data);
    return response.data;
  },

  rejectRecipe: async (recipeId, data) => {
    const response = await api.patch(`/admin/recipes/${recipeId}/reject`, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.patch(`/admin/users/${userId}`, userData);
    return response.data;
  },

  getAllRecipes: async (params) => {
    const response = await api.get('/admin/recipes', { params });
    return response.data;
  },

  updateRecipe: async (recipeId, recipeData) => {
    const response = await api.patch(`/admin/recipes/${recipeId}`, recipeData);
    return response.data;
  },

  deleteRecipe: async (recipeId) => {
    const response = await api.delete(`/admin/recipes/${recipeId}`);
    return response.data;
  },
};
