export interface UserProfile {
  id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface LogsInfo {
  ip: string;
  createdAt: string;
}

export interface UserDTO {
  id: string;
  username: string;
  enabled: boolean;
  metadata: string | null;
  role: string;
  logsInfo: LogsInfo[];
}
