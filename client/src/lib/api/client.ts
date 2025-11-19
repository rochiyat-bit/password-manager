import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Attempt to refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        authStore.getState().setTokens(accessToken, newRefreshToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        authStore.getState().logout();
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
