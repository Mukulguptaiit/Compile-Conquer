import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const currentUser = authApi.getCurrentUser();
    if (currentUser && authApi.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await authApi.login({ email, password });
      console.log('AuthContext: Login response:', response);
      authApi.setCurrentUser(response.user);
      setUser(response.user);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.signup({ name, email, password });
      authApi.setCurrentUser(response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    authApi.removeCurrentUser();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 