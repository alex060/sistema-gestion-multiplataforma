/**
 * Modelo de datos para Registros Empresariales (Expedientes / Operaciones)
 * Capa de Modelo - Arquitectura MVVM
 */

export type RecordCategory = 'CONSULTORIA' | 'DESARROLLO' | 'AUDITORIA' | 'INFRAESTRUCTURA';
export type RecordStatus = 'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';

export interface EnterpriseRecord {
  id: string;
  code: string;           // Código único (ej. EXP-2026-001) verificado asíncronamente
  title: string;
  category: RecordCategory;
  budget: number;
  status: RecordStatus;
  description: string;
  createdBy: string;      // User ID
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecordDTO {
  code: string;
  title: string;
  category: RecordCategory;
  budget: number;
  description: string;
}
