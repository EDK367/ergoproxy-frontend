import { create } from 'zustand';
import type { AuthResponse, UserRole } from '../types/auth.types';
import { APP_CONFIG } from '../config/api.config';

interface AuthState {
  token: string | null;
  username: string | null;
  name: string | null;
  lastname: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;

  setAuth: (data: AuthResponse) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  name: null,
  lastname: null,
  role: null,
  isAuthenticated: false,

  setAuth: (data: AuthResponse) => {
    try {
      sessionStorage.setItem(APP_CONFIG.TOKEN_KEY, JSON.stringify({
        token: data.token,
        username: data.username,
        name: data.name,
        lastname: data.lastname,
        role: data.role,
      }));
    } catch {
      // sessionStorage unavailable — memory-only mode
    }

    set({
      token: data.token,
      username: data.username,
      name: data.name,
      lastname: data.lastname,
      role: data.role as UserRole,
      isAuthenticated: true,
    });
  },

  logout: () => {
    try {
      sessionStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    } catch {
      // ignore
    }

    set({
      token: null,
      username: null,
      name: null,
      lastname: null,
      role: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    try {
      const raw = sessionStorage.getItem(APP_CONFIG.TOKEN_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.token) {
          set({
            token: data.token,
            username: data.username,
            name: data.name,
            lastname: data.lastname,
            role: data.role as UserRole,
            isAuthenticated: true,
          });
        }
      }
    } catch {
      sessionStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    }
  },
}));
