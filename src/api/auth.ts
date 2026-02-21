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

// Grant Access function (Unauthenticated — uses axiosPublic)
export const grantAccess = async (data: { email: string; fullName: string }) => {
  const response = await axiosPublic.post('/auth/grant-access', data);
  const result = response.data;

  if (result.isSuccess) {
    // Save tokens if they exist in the response
    const { accessToken, refreshToken, token } = result.data ?? result;
    const finalToken = accessToken || token;

    if (finalToken) setAccessToken(finalToken);
    if (refreshToken) setRefreshToken(refreshToken);
  }

  return result;
};


export const logout = async () => {
  try {
    // Only call logout API if we actually have an access token
    if (getAccessToken()) {
      await axiosPrivate.post('/auth/logout');
    }
  } catch (error) {
    
    console.error('Logout API notification failed:', error);
  } finally {
    clearTokens();

    if (typeof window !== 'undefined') {
      Router.push('/login');
    }
  }
};