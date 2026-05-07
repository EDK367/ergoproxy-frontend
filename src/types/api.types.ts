export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
