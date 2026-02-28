import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthView } from '@/src/app/modules/Auth';
import { AuthMode } from '@/src/lib/types';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { toggleTheme } from '@/src/redux/themeSlice';
import { login, signup } from '@/src/redux/authSlice';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Use correct company-based routing
      let lastCompany = 'main';
      try {
        lastCompany = localStorage.getItem('lastCompany') || 'main';
      } catch { /* iOS private mode */ }
      router.replace(`/${lastCompany}/dashboard`);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAuthSuccess = async (data: { email: string; password: string; name?: string }) => {
    try {
      let result;
      if (mode === AuthMode.LOGIN) {
        result = await dispatch(login({ email: data.email, password: data.password }));
      } else {
        // Use the new grant-access flow for signup/admin creation
        result = await dispatch(login({ email: data.email, fullName: data.name }));
      }
      if (result && result.meta && result.meta.requestStatus === 'fulfilled') {
        router.push('/dashboard');
      }
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