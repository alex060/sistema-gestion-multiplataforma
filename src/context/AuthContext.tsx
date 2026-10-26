/**
 * Contexto de Autenticación y Autorización
 * Implementa gestión de estado predecible (Context API) y persistencia de sesión segura.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, AuthToken, UserRole, LoginCredentials, RegisterDTO } from '../models/auth.model';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  logout: () => void;
  hasRole: (requiredRole: UserRole | UserRole[]) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicialización de sesión persistida
  useEffect(() => {
    try {
      const session = authService.getStoredSession();
      if (session.user && session.token) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (err) {
      console.error('Error restaurando sesión inicial:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      setToken(res.token);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error durante el inicio de sesión';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (dto: RegisterDTO) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(dto);
      setUser(res.user);
      setToken(res.token);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar el usuario';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const hasRole = useCallback((requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoización para optimización de renderizado y evitar re-renders innecesarios
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    hasRole,
    clearError
  }), [user, token, isLoading, error, login, register, logout, hasRole, clearError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
