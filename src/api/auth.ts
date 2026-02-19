import { axiosPublic, axiosPrivate } from '../lib/axios/axios';
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  getAccessToken,
  clearTokens,
} from '../lib/axios/tokenUtils';
import Router from 'next/router';

// ================= AUTH API FUNCTIONS ================= //

// Login function (Unauthenticated — uses axiosPublic, no token required)
export const login = async (credentials: { email: string; password: string }) => {
  const response = await axiosPublic.post('/auth/login', credentials);
  const { accessToken, refreshToken } = response.data;

  if (accessToken) setAccessToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);

  return response.data;
};

// Refresh token function (Unauthenticated — uses axiosPublic)
export const refreshToken = async () => {
  const storedRefreshToken = getRefreshToken();
  if (!storedRefreshToken) {
    throw new Error('No refresh token found. Please log in again.');
  }

  const response = await axiosPublic.post('/auth/refresh-token', {
    refreshToken: storedRefreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } =
    response.data.data ?? response.data;

  if (accessToken) setAccessToken(accessToken);
  if (newRefreshToken) setRefreshToken(newRefreshToken);

  return response.data;
};

/**
 * Logout Flow — The "Best Way":
 * 1. Tries to notify the server (security session invalidation)
 * 2. Clears local storage tokens
 * 3. Redirects the user to the login page
 */
export const logout = async () => {
  try {
    // Only call logout API if we actually have an access token
    if (getAccessToken()) {
      await axiosPrivate.post('/auth/logout');
    }
  } catch (error) {
    // We catch the error but don't block the UI logout.
    // Even if the server fails, we MUST clear tokens locally.
    console.error('Logout API notification failed:', error);
  } finally {
    clearTokens();

    // Redirect ensures the user is kicked out of protected views
    if (typeof window !== 'undefined') {
      Router.push('/login');
    }
  }
};