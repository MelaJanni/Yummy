import api from '../lib/axios';

export const favoritesApi = {
  toggle: async (recipeId) => {
    const response = await api.post(`/favorites/recipes/${recipeId}`);
    return response.data;
  },

  getMyFavorites: async (params) => {
    const response = await api.get('/favorites/me', { params });
    return response.data;
  },
};
