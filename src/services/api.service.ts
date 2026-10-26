/**
 * Cliente HTTP y orquestador de peticiones asíncronas con Interceptores
 * Simula comunicación con API REST backend con retardo de red realista y seguridad JWT.
 */

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private token: string | null = null;

  public setAuthToken(token: string | null) {
    this.token = token;
  }

  public getAuthToken(): string | null {
    return this.token;
  }

  /**
   * Interceptor de salida (Request Interceptor)
   */
  private applyRequestInterceptors(headers: Record<string, string>): Record<string, string> {
    const finalHeaders = { ...headers };
    if (this.token) {
      finalHeaders['Authorization'] = `Bearer ${this.token}`;
    }
    finalHeaders['Content-Type'] = 'application/json';
    finalHeaders['X-Client-Platform'] = 'Ionic-React-PWA';
    return finalHeaders;
  }

  /**
   * Simula llamada asíncrona con retardo de red configurable
   */
  public async simulateRequest<T>(
    action: () => T | Promise<T>,
    delayMs: number = 400,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    const headers = this.applyRequestInterceptors({});

    // Verificación de interceptor de seguridad
    if (requiresAuth && !headers['Authorization']) {
      throw new ApiError(401, 'No autorizado: Cabecera Authorization requerida');
    }

    // Simulación de latencia de red asíncrona
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    try {
      const result = await action();
      return {
        data: result,
        status: 200,
        message: 'Operación completada con éxito'
      };
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      const message = err instanceof Error ? err.message : 'Error en la petición al servidor';
      throw new ApiError(500, message);
    }
  }
}

export const apiService = new ApiService();
