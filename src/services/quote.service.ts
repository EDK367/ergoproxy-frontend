import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';

export interface QuoteResponse {
  phrase: string;
}

export const quoteService = {
  getRandomQuote: () => 
    apiService.get<ApiResponse<QuoteResponse>>(API_CONFIG.ENDPOINTS.QUOTES.RANDOM),
};
