/**
 * Tipos para la gestión reactiva de formularios y validaciones asíncronas
 */

export type AsyncValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export interface FieldState<T> {
  value: T;
  touched: boolean;
  dirty: boolean;
  error: string | null;
  asyncStatus: AsyncValidationStatus;
}
