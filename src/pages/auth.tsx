import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthView } from '@/src/app/modules/Auth';
import { AuthMode } from '@/src/lib/types';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { toggleTheme } from '@/src/redux/themeSlice';
import { login, signup } from '@/src/redux/authSlice';
import { tenantConfig } from '@/src/config/tenant-color';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const router = useRouter();

  // Fallback: if somehow isAuthenticated changes (e.g. page reload), also redirect
  useEffect(() => {
    if (isAuthenticated) {
      let lastCompany = tenantConfig.id;
      try {
        lastCompany = localStorage.getItem('lastCompany') || tenantConfig.id;
      } catch { /* iOS private mode */ }
      router.replace(`/${lastCompany}/dashboard`);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuthSuccess = async (data: { email: string; password: string; name?: string }) => {
    try {
      if (mode === AuthMode.LOGIN) {
        await dispatch(login({ email: data.email, password: data.password }));
      } else {
        await dispatch(login({ email: data.email, fullName: data.name }));
      }
      // Redirect immediately after dispatch resolves — don't rely solely on useEffect on iOS
      let lastCompany = tenantConfig.id;
      try {
        lastCompany = localStorage.getItem('lastCompany') || tenantConfig.id;
      } catch { /* iOS private mode */ }
      router.replace(`/${lastCompany}/dashboard`);
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  // Don't return null — let router.replace handle navigation
  // Returning null causes unmount race condition on iOS before redirect fires
  if (isAuthenticated && typeof window !== 'undefined' && !window.location.pathname.includes('/dashboard')) {
    return null;
  }

  return (
    <AuthView
      mode={mode}
      onSwitchMode={handleSwitchMode}
      onSuccess={handleAuthSuccess}
      isDarkMode={isDarkMode}
      toggleTheme={() => dispatch(toggleTheme())}
    />
  );
};

export default AuthPage;