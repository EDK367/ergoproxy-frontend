import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import type { UserProfile, UserDTO } from '../types/user.types';

export const userService = {
  async getMyProfile(): Promise<ApiResponse<UserProfile>> {
    return apiService.get<ApiResponse<UserProfile>>(API_CONFIG.ENDPOINTS.USERS.PROFILE);
  },

  async getAllUsers(): Promise<ApiResponse<UserDTO[]>> {
    return apiService.get<ApiResponse<UserDTO[]>>(API_CONFIG.ENDPOINTS.USERS.BASE);
  },
};
