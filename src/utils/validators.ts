import { APP_CONFIG } from '../config/api.config';

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,60}$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} es requerido` };
  }
  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) return { valid: false, error: 'El email es requerido' };
  if (!EMAIL_REGEX.test(email)) return { valid: false, error: 'Formato de email inválido' };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: 'La contraseña es requerida' };
  if (password.length < APP_CONFIG.PASSWORD_MIN_LENGTH)
    return { valid: false, error: `Mínimo ${APP_CONFIG.PASSWORD_MIN_LENGTH} caracteres` };
  if (password.length > APP_CONFIG.PASSWORD_MAX_LENGTH)
    return { valid: false, error: `Máximo ${APP_CONFIG.PASSWORD_MAX_LENGTH} caracteres` };
  if (!PASSWORD_REGEX.test(password))
    return { valid: false, error: 'Debe incluir mayúscula, minúscula, número y carácter especial (@$!%*?&._-)' };
  return { valid: true };
}

export function validatePhone(phone: string): ValidationResult {
  if (!phone.trim()) return { valid: false, error: 'El teléfono es requerido' };
  if (!PHONE_REGEX.test(phone)) return { valid: false, error: 'Formato de teléfono inválido (10-15 dígitos)' };
  return { valid: true };
}

export function validateUsername(username: string): ValidationResult {
  if (!username.trim()) return { valid: false, error: 'El nombre de usuario es requerido' };
  if (username.length < 3) return { valid: false, error: 'Mínimo 3 caracteres' };
  if (username.length > 50) return { valid: false, error: 'Máximo 50 caracteres' };
  return { valid: true };
}

export function validateNoteTitle(title: string): ValidationResult {
  if (!title.trim()) return { valid: false, error: 'El título es requerido' };
  if (title.length > APP_CONFIG.MAX_TITLE_LENGTH)
    return { valid: false, error: `Máximo ${APP_CONFIG.MAX_TITLE_LENGTH} caracteres` };
  return { valid: true };
}

export function validateNoteContent(content: string): ValidationResult {
  if (content.length > APP_CONFIG.MAX_CONTENT_LENGTH)
    return { valid: false, error: `Máximo ${APP_CONFIG.MAX_CONTENT_LENGTH} caracteres` };
  return { valid: true };
}

export function validateUUID(uuid: string): ValidationResult {
  if (!uuid.trim()) return { valid: false, error: 'El código es requerido' };
  if (!UUID_REGEX.test(uuid)) return { valid: false, error: 'Código de amigo inválido' };
  return { valid: true };
}
