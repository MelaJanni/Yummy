import api from '../lib/axios';

export const authApi = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot', { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/me', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put('/auth/me/password', data);
    return response.data;
  },
};
