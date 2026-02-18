import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string, token: string) => void;
  signup: (email: string, password: string, name: string, token: string) => void;
  logout: () => void;
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app start
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      const storedToken = localStorage.getItem('token');
      if (authStatus === 'true' && storedToken) {
        setIsAuthenticated(true);
        setToken(storedToken);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (email: string, password: string, token: string) => {
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('token', token);
  };

  const signup = (email: string, password: string, name: string, token: string) => {
    setIsAuthenticated(true);
    setToken(token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};