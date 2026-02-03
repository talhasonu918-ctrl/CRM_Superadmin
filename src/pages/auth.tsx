import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthView } from '../app/modules/Auth';
import { AuthMode } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

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

  const handleAuthSuccess = async (data: { email: string; password: string; name?: string }) => {
    try {
      let success = false;
      if (mode === AuthMode.LOGIN) {
        success = await login(data.email, data.password);
      } else {
        success = await signup(data.email, data.password, data.name || '');
      }

      if (success) {
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
      toggleTheme={toggleTheme}
    />
  );
};

export default AuthPage;