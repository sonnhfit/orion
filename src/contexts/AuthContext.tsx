import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types/auth';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.login(credentials);
      localStorage.setItem('access_token', response.token);
      localStorage.setItem('refresh_token', response.refresh);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.non_field_errors?.[0] || 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiService.register(data);
      localStorage.setItem('access_token', response.token);
      localStorage.setItem('refresh_token', response.refresh);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.non_field_errors?.[0] 
        || error.response?.data?.email?.[0]
        || error.response?.data?.password?.[0]
        || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    apiService.logout().catch(console.error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
