import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import type { ApiResponse } from '../types/api.types';
import type { CreateNoteDTO, UpdateNoteDTO, ShareNoteDTO, NoteResponse, SharedNoteResponse } from '../types/note.types';
import { sanitizeInput } from '../utils/sanitize';

export const noteService = {
  async getMyNotes(): Promise<ApiResponse<NoteResponse[]>> {
    return apiService.get<ApiResponse<NoteResponse[]>>(API_CONFIG.ENDPOINTS.NOTES.BASE);
  },

  async getNoteById(id: string): Promise<ApiResponse<NoteResponse>> {
    return apiService.get<ApiResponse<NoteResponse>>(API_CONFIG.ENDPOINTS.NOTES.BY_ID(id));
  },

  async createNote(data: CreateNoteDTO): Promise<ApiResponse<NoteResponse>> {
    const sanitized: CreateNoteDTO = {
      title: sanitizeInput(data.title),
      content: sanitizeInput(data.content),
      important: data.important,
    };
    return apiService.post<ApiResponse<NoteResponse>>(API_CONFIG.ENDPOINTS.NOTES.BASE, sanitized);
  },

  async updateNote(id: string, data: UpdateNoteDTO): Promise<ApiResponse<NoteResponse>> {
    const sanitized: UpdateNoteDTO = {
      title: sanitizeInput(data.title),
      content: sanitizeInput(data.content),
      important: data.important,
    };
    return apiService.put<ApiResponse<NoteResponse>>(API_CONFIG.ENDPOINTS.NOTES.BY_ID(id), sanitized);
  },

  async deleteNote(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(API_CONFIG.ENDPOINTS.NOTES.BY_ID(id));
  },

  async shareNote(noteId: string, data: ShareNoteDTO): Promise<ApiResponse<SharedNoteResponse>> {
    return apiService.post<ApiResponse<SharedNoteResponse>>(API_CONFIG.ENDPOINTS.NOTES.SHARE(noteId), data);
  },

  async unshareNote(noteId: string, idFriend: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(API_CONFIG.ENDPOINTS.NOTES.UNSHARE(noteId, idFriend));
  },

  async getNoteShares(noteId: string): Promise<ApiResponse<SharedNoteResponse[]>> {
    return apiService.get<ApiResponse<SharedNoteResponse[]>>(API_CONFIG.ENDPOINTS.NOTES.SHARES(noteId));
  },
};
