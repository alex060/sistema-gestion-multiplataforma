/**
 * Servicio de Autenticación y Autorización
 * Implementa persistencia local, generación de JWT simulado y validaciones asíncronas.
 */

import { User, LoginCredentials, RegisterDTO, AuthToken } from '../models/auth.model';
import { apiService, ApiError } from './api.service';

const STORAGE_KEY_USER = 'nexus_erp_user';
const STORAGE_KEY_TOKEN = 'nexus_erp_token';
const STORAGE_KEY_USERS_DB = 'nexus_erp_users_db';

// Semilla de usuarios iniciales para pruebas y evaluación
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-001',
    name: 'Carlos Mendoza (Admin)',
    email: 'admin@empresa.com',
    role: 'ADMIN',
    createdAt: '2026-01-15T09:00:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-std-002',
    name: 'Lucía Fernández (Estándar)',
    email: 'user@empresa.com',
    role: 'STANDARD',
    createdAt: '2026-02-10T11:30:00.000Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  }
];

class AuthService {
  private users: User[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS_DB);
      if (stored) {
        this.users = JSON.parse(stored);
      } else {
        this.users = [...INITIAL_USERS];
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(this.users));
      }
    } catch {
      this.users = [...INITIAL_USERS];
    }
  }

  private saveUsers(): void {
    try {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(this.users));
    } catch (e) {
      console.error('Error persistiendo usuarios en localStorage', e);
    }
  }

  /**
   * Genera un token con formato estándar JWT (Header.Payload.Signature en Base64)
   */
  private generateMockJwt(user: User): AuthToken {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const now = Date.now();
    const expiresIn = 3600 * 8; // 8 horas
    const payload = btoa(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        iat: Math.floor(now / 1000),
        exp: Math.floor(now / 1000) + expiresIn
      })
    );
    const signature = btoa(`nexus-erp-mock-signature-${user.id}-${now}`);
    const accessToken = `${header}.${payload}.${signature}`;

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
      issuedAt: now
    };
  }

  /**
   * Validación Asíncrona: Comprueba si un correo ya está registrado en la base de datos
   * Simula consulta remota indexada con retardo de 500ms
   */
  public async checkEmailAvailability(email: string): Promise<{ available: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    
    // Regla de formato básico antes de llamar al backend
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { available: false, message: 'El formato de correo no es válido' };
    }

    const response = await apiService.simulateRequest(() => {
      const exists = this.users.some((u) => u.email.toLowerCase() === cleanEmail);
      if (exists) {
        return {
          available: false,
          message: `El correo '${cleanEmail}' ya se encuentra registrado en el sistema.`
        };
      }
      return {
        available: true,
        message: 'Correo disponible para registro.'
      };
    }, 550);

    return response.data;
  }

  /**
   * Autenticación asíncrona de usuario
   */
  public async login(credentials: LoginCredentials): Promise<{ user: User; token: AuthToken }> {
    const response = await apiService.simulateRequest(() => {
      const email = credentials.email.trim().toLowerCase();
      const password = credentials.password;

      // Validación de credenciales de prueba preconfiguradas
      const validAdmin = email === 'admin@empresa.com' && password === 'Admin123!';
      const validUser = email === 'user@empresa.com' && password === 'User123!';

      // Para usuarios creados dinámicamente en el registro
      const dynamicUser = this.users.find((u) => u.email.toLowerCase() === email);
      const isDynamicValid = dynamicUser && password.length >= 6;

      if (!validAdmin && !validUser && !isDynamicValid) {
        throw new ApiError(401, 'Credenciales incorrectas. Verifique el email y la contraseña.');
      }

      const matchedUser = this.users.find((u) => u.email.toLowerCase() === email) || {
        id: email.includes('admin') ? 'usr-admin-001' : 'usr-std-002',
        name: email.includes('admin') ? 'Carlos Mendoza (Admin)' : 'Lucía Fernández (Estándar)',
        email,
        role: email.includes('admin') ? 'ADMIN' : 'STANDARD',
        createdAt: new Date().toISOString()
      };

      const userWithLogin: User = {
        ...matchedUser,
        lastLogin: new Date().toISOString()
      };

      const token = this.generateMockJwt(userWithLogin);
      apiService.setAuthToken(token.accessToken);

      // Persistencia en Storage
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userWithLogin));
      localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(token));

      return { user: userWithLogin, token };
    }, 600);

    return response.data;
  }

  /**
   * Registro asíncrono de un nuevo usuario con rol asignado
   */
  public async register(dto: RegisterDTO): Promise<{ user: User; token: AuthToken }> {
    const response = await apiService.simulateRequest(() => {
      const email = dto.email.trim().toLowerCase();

      if (this.users.some((u) => u.email.toLowerCase() === email)) {
        throw new ApiError(409, `El email '${email}' ya existe en la base de datos.`);
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: dto.name.trim(),
        email,
        role: dto.role,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      this.users.push(newUser);
      this.saveUsers();

      const token = this.generateMockJwt(newUser);
      apiService.setAuthToken(token.accessToken);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, JSON.stringify(token));

      return { user: newUser, token };
    }, 700);

    return response.data;
  }

  /**
   * Recupera la sesión persistida al arrancar la app
   */
  public getStoredSession(): { user: User | null; token: AuthToken | null } {
    try {
      const userStr = localStorage.getItem(STORAGE_KEY_USER);
      const tokenStr = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (userStr && tokenStr) {
        const user = JSON.parse(userStr) as User;
        const token = JSON.parse(tokenStr) as AuthToken;

        // Comprobación de caducidad del token
        const now = Date.now();
        const expirationTime = token.issuedAt + token.expiresIn * 1000;
        if (now > expirationTime) {
          this.logout();
          return { user: null, token: null };
        }

        apiService.setAuthToken(token.accessToken);
        return { user, token };
      }
    } catch (e) {
      console.warn('Error leyendo sesión almacenada:', e);
    }
    return { user: null, token: null };
  }

  /**
   * Cierra la sesión activa y purga el token
   */
  public logout(): void {
    apiService.setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }

  /**
   * Retorna lista de todos los usuarios (para panel de Administrador)
   */
  public async getAllUsers(): Promise<User[]> {
    const res = await apiService.simulateRequest(() => [...this.users], 400, true);
    return res.data;
  }
}

export const authService = new AuthService();
