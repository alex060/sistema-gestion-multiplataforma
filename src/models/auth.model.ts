/**
 * Definiciones de tipos y modelos para el dominio de Autenticación y Autorización
 * Arquitectura MVVM - Capa de Modelo
 */

export type UserRole = 'ADMIN' | 'STANDARD';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface AuthToken {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number; // segundos
  issuedAt: number;  // timestamp ms
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
