import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthView } from '@/src/app/modules/Auth';
import { AuthMode } from '@/src/lib/types';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { login, signup } from '@/src/redux/authSlice';
import { toggleTheme } from '@/src/redux/themeSlice';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleAuthSuccess = async (data: { email: string; password: string; name?: string }) => {
    try {
      let result;
      if (mode === AuthMode.LOGIN) {
        result = await dispatch(login({ email: data.email, password: data.password }));
      } else {
        result = await dispatch(signup({ email: data.email, password: data.password, name: data.name || '' }));
      }
      if (result.meta.requestStatus === 'fulfilled') {
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