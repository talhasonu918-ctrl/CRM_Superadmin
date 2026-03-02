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

  useEffect(() => {
    if (isAuthenticated) {
      // Use correct company-based routing
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
      // ✅ DO NOT redirect here — useEffect watches isAuthenticated and redirects
      // to /${lastCompany}/dashboard correctly. Dual router.push causes iOS nav crash.
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
  };

  if (isAuthenticated) {
    return null; // Will redirect
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