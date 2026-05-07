const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
    },
    NOTES: {
      BASE: "/api/notes",
      BY_ID: (id: string) => `/api/notes/${id}`,
      SHARE: (id: string) => `/api/notes/${id}/share`,
      UNSHARE: (noteId: string, idFriend: string) =>
        `/api/notes/${noteId}/share/${idFriend}`,
      SHARES: (id: string) => `/api/notes/${id}/shares`,
    },
    USERS: {
      BASE: "/api/user",
      PROFILE: "/api/user/profile",
    },
    QUOTES: {
      RANDOM: "/api/quotes/random",
    },
  },
} as const;

export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || "Ergo Notes",
  TOKEN_KEY: "__ep_session",
  MAX_TITLE_LENGTH: 255,
  MAX_CONTENT_LENGTH: 10000,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 60,
} as const;
