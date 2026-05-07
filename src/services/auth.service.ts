import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';
import { sanitizeInput } from '../utils/sanitize';

export const authService = {
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const sanitized: LoginRequest = {
      username: sanitizeInput(data.username),
      password: data.password,
    };
    return apiService.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      sanitized,
      false
    );
  },

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const sanitized: RegisterRequest = {
      name: sanitizeInput(data.name),
      lastname: sanitizeInput(data.lastname),
      email: sanitizeInput(data.email),
      username: sanitizeInput(data.username),
      password: data.password,
      phoneNumber: sanitizeInput(data.phoneNumber),
    };
    return apiService.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      sanitized,
      false
    );
  },
};
