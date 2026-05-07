import { API_CONFIG } from '../config/api.config';
import type { ApiError } from '../types/api.types';
import { useAuthStore } from '../store/auth.store';

let isRedirectingToRateLimit = false;

class ApiService {
  private getToken(): string | null {
    return useAuthStore.getState().token;
  }

  private buildUrl(endpoint: string): string {
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      throw { status: 401, message: 'Sesión expirada', error: 'Unauthorized', timestamp: new Date().toISOString() } as ApiError;
    }

    if (response.status === 403) {
      throw { status: 403, message: 'Acceso restringido', error: 'Forbidden', timestamp: new Date().toISOString() } as ApiError;
    }

    if (response.status === 429) {
      if (!isRedirectingToRateLimit && window.location.pathname !== '/rate-limit') {
        isRedirectingToRateLimit = true;
        window.location.href = '/rate-limit';
      }
      throw { status: 429, message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.', error: 'Too Many Requests', timestamp: new Date().toISOString() } as ApiError;
    }

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          timestamp: new Date().toISOString(),
          status: response.status,
          error: response.statusText,
          message: 'Error de conexión con el servidor',
        };
      }
      throw errorData;
    }

    return response.json();
  }

  async get<T>(endpoint: string, auth: boolean = true): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(auth),
      credentials: 'same-origin',
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: unknown, auth: boolean = true): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(auth),
      body: JSON.stringify(body),
      credentials: 'same-origin',
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: unknown, auth: boolean = true): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(auth),
      body: JSON.stringify(body),
      credentials: 'same-origin',
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, auth: boolean = true): Promise<T> {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(auth),
      credentials: 'same-origin',
    });
    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();
