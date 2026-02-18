import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthView } from '@/src/app/modules/Auth';
import { AuthMode } from '@/src/lib/types';
import { useAuth } from '@/src/contexts/AuthContext';
import { useTheme } from '@/src/contexts/ThemeContext';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const { isAuthenticated, login, signup } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleAuthSuccess = async (data: { email: string; password: string; name?: string; token?: string }) => {
    try {
      if (mode === AuthMode.LOGIN) {
        if (data.token) {
          login(data.email, data.password, data.token);
          router.push('/dashboard');
        }
      } else {
        if (data.token) {
          signup(data.email, data.password, data.name || '', data.token);
          router.push('/dashboard');
        }
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
      toggleTheme={toggleTheme}
    />
  );
};

export default AuthPage;