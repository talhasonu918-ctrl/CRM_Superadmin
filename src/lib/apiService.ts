import axiosInstance from './axios';

// Generic API Service structure
export const apiService = {
  // Example for handling Product Categories
  categories: {
    getAll: (params?: any) => axiosInstance.get('product-categories', { params }),
    getById: (id: string) => axiosInstance.get(`product-categories/${id}`),
    create: (data: any) => axiosInstance.post('product-categories', data),
    update: (id: string, data: any) => axiosInstance.put(`product-categories/${id}`, data),
    delete: (id: string) => axiosInstance.delete(`product-categories/${id}`),
  },

  // Auth related calls (already partially covered in Auth.tsx)
  auth: {
    login: (credentials: any) => axiosInstance.post('auth/login', credentials),
    register: (userData: any) => axiosInstance.post('auth/register', userData),
    getProfile: () => axiosInstance.get('auth/profile'),
  },

  // Example for Dashboard stats
  dashboard: {
    getStats: (timeframe: string) => axiosInstance.get(`dashboard/stats`, { params: { timeframe } }),
  },
};

export default apiService;
