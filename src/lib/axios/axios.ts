import axios, { AxiosRequestConfig } from 'axios';
import Router from 'next/router';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from './tokenUtils';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * HELPER: Simple URL-based Tenant Detection
 * Grabs the first part of the path (e.g., 'Pepsi' from '/Pepsi/dashboard')
 */
const getTenantDomain = (): string | null => {
  if (typeof window === 'undefined') return null;
  const pathParts = window.location.pathname.split('/');
  // Next.js dynamic path structure: /company/rest-of-path
  // Index 0 is empty, Index 1 is the company/tenant
  return pathParts[1] || null;
};

// ================= AXIOS INSTANCES ================= //

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ================= TENANT INTERCEPTOR ================= //

/**
 * Automatically attaches 'X-Tenant-Domain' to every request
 */
const attachTenantHeader = (config: any) => {
  const tenant = getTenantDomain();
  if (tenant) {
    config.headers['X-Tenant-Domain'] = tenant;
  }
  return config;
};

axiosPublic.interceptors.request.use(attachTenantHeader);

// ================= REFRESH LOGIC ================= //
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available. Please log in again.');
  }

  const response = await axiosPublic.post('/users/refresh-token', {
    refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } =
    response.data.data ?? response.data;

  setAccessToken(accessToken);
  if (newRefreshToken) {
    setRefreshToken(newRefreshToken);
  }

  return accessToken;
};

// ================= PRIVATE INTERCEPTORS ================= //

/**
 * REQUEST INTERCEPTOR (axiosPrivate)
 * 1. Checks token FIRST
 * 2. Attaches Authorization header
 * 3. Attaches Tenant header
 */
axiosPrivate.interceptors.request.use(
  (config) => {
    // 1. Attach Tenant Header first
    attachTenantHeader(config);

    // 2. Check token
    const token = getAccessToken();
    if (!token) {
      return Promise.reject(new Error('No access token. Please log in.'));
    }

    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Handles 401 (Unauthorized) and 403 (Forbidden) with queuing logic
 */
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const isAuthError = status === 401 || status === 403;

    if (isAuthError && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return axiosPrivate(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        processQueue(null, newToken);
        return axiosPrivate(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        Router.push('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivate;