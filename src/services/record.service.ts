/**
 * Servicio de Registros Empresariales (Expedientes)
 * Soporta operaciones asíncronas, validación remota de código único y persistencia local.
 */

import { EnterpriseRecord, CreateRecordDTO } from '../models/record.model';
import { apiService, ApiError } from './api.service';

const STORAGE_KEY_RECORDS = 'nexus_erp_records_db';

const INITIAL_RECORDS: EnterpriseRecord[] = [
  {
    id: 'rec-001',
    code: 'EXP-2026-001',
    title: 'Migración Cloud Azure & Modernización de Microservicios',
    category: 'INFRAESTRUCTURA',
    budget: 45000,
    status: 'APROBADO',
    description: 'Actualización integral de la arquitectura legacy hacia Kubernetes y Azure DevOps.',
    createdBy: 'usr-admin-001',
    createdByName: 'Carlos Mendoza (Admin)',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-05T12:00:00.000Z'
  },
  {
    id: 'rec-002',
    code: 'EXP-2026-002',
    title: 'Auditoría de Ciberseguridad ISO 27001',
    category: 'AUDITORIA',
    budget: 18500,
    status: 'EN_REVISION',
    description: 'Análisis de vulnerabilidades, pentesting de APIs e informe de cumplimiento RGPD.',
    createdBy: 'usr-std-002',
    createdByName: 'Lucía Fernández (Estándar)',
    createdAt: '2026-03-10T14:30:00.000Z',
    updatedAt: '2026-03-12T16:00:00.000Z'
  },
  {
    id: 'rec-003',
    code: 'EXP-2026-003',
    title: 'Desarrollo de Portal PWA B2B con Ionic y React',
    category: 'DESARROLLO',
    budget: 32000,
    status: 'APROBADO',
    description: 'Implementación de aplicación multiplataforma con capacidades offline y accesibilidad WCAG.',
    createdBy: 'usr-admin-001',
    createdByName: 'Carlos Mendoza (Admin)',
    createdAt: '2026-03-15T09:15:00.000Z',
    updatedAt: '2026-03-18T11:45:00.000Z'
  }
];

class RecordService {
  private records: EnterpriseRecord[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (stored) {
        this.records = JSON.parse(stored);
      } else {
        this.records = [...INITIAL_RECORDS];
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(this.records));
      }
    } catch {
      this.records = [...INITIAL_RECORDS];
    }
  }

  private saveRecords(): void {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(this.records));
    } catch (e) {
      console.error('Error guardando registros en localStorage', e);
    }
  }

  /**
   * Validación Asíncrona: Comprueba si un código de expediente ya existe en la base de datos
   */
  public async checkCodeAvailability(code: string): Promise<{ available: boolean; message: string }> {
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      return { available: false, message: 'El código es requerido.' };
    }

    const formatRegex = /^EXP-\d{4}-\d{3}$/;
    if (!formatRegex.test(cleanCode)) {
      return {
        available: false,
        message: 'Formato inválido. Debe seguir el patrón EXP-AAAA-NNN (Ej: EXP-2026-005)'
      };
    }

    const response = await apiService.simulateRequest(() => {
      const exists = this.records.some((r) => r.code.toUpperCase() === cleanCode);
      if (exists) {
        return {
          available: false,
          message: `El código '${cleanCode}' ya existe en otro expediente.`
        };
      }
      return {
        available: true,
        message: `Código '${cleanCode}' disponible y válido.`
      };
    }, 450);

    return response.data;
  }

  /**
   * Obtener todos los registros empresariales
   */
  public async getAllRecords(): Promise<EnterpriseRecord[]> {
    const res = await apiService.simulateRequest(() => [...this.records], 400);
    return res.data;
  }

  /**
   * Alta de un nuevo registro empresarial
   */
  public async createRecord(
    dto: CreateRecordDTO,
    userId: string,
    userName: string
  ): Promise<EnterpriseRecord> {
    const res = await apiService.simulateRequest(() => {
      const cleanCode = dto.code.trim().toUpperCase();

      if (this.records.some((r) => r.code.toUpperCase() === cleanCode)) {
        throw new ApiError(409, `El código '${cleanCode}' ya existe.`);
      }

      const now = new Date().toISOString();
      const newRecord: EnterpriseRecord = {
        id: `rec-${Date.now()}`,
        code: cleanCode,
        title: dto.title.trim(),
        category: dto.category,
        budget: Number(dto.budget),
        status: 'EN_REVISION',
        description: dto.description.trim(),
        createdBy: userId,
        createdByName: userName,
        createdAt: now,
        updatedAt: now
      };

      this.records.unshift(newRecord);
      this.saveRecords();
      return newRecord;
    }, 600, true);

    return res.data;
  }
}

export const recordService = new RecordService();
