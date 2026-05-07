export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  name: string;
  lastname: string;
  role: string;
}

export type UserRole = 'ADMIN' | 'USER';
