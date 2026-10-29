/**
 * Servicio: SqlApiService
 * Fase 3 - Paso 3.1: Consumo asíncrono de API REST relacional (SQL) (RA 5)
 * Simula operaciones relacionales con transacciones, joins y agregaciones.
 */

export interface DepartmentSQL {
  id: string;
  code: string;
  name: string;
  manager: string;
  allocatedBudget: number;
}

export interface DepartmentBudgetSummary {
  departmentCode: string;
  departmentName: string;
  totalRecords: number;
  totalCommittedBudget: number;
  percentageUsed: number;
}

export interface AuditLogSQL {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  userId: string;
  userName: string;
  details: string;
}

class SqlApiService {
  private departments: DepartmentSQL[] = [
    { id: 'dep-1', code: 'DEV', name: 'Desarrollo & Software', manager: 'Carlos Gómez', allocatedBudget: 150000 },
    { id: 'dep-2', code: 'INFRA', name: 'Infraestructura & Cloud', manager: 'Elena Martínez', allocatedBudget: 120000 },
    { id: 'dep-3', code: 'CYBER', name: 'Ciberseguridad', manager: 'David López', allocatedBudget: 80000 },
    { id: 'dep-4', code: 'QA', name: 'Calidad & Testing', manager: 'Laura Sánchez', allocatedBudget: 60000 },
    { id: 'dep-5', code: 'BI', name: 'Analítica & BI', manager: 'Marcos Rubio', allocatedBudget: 90000 }
  ];

  private auditLogs: AuditLogSQL[] = [
    {
      id: 'log-101',
      action: 'SYSTEM_BOOT',
      entity: 'DATABASE_SQL',
      entityId: 'CONN_POOL_01',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      userId: 'usr-admin-1',
      userName: 'Administrador General',
      details: 'Pool de conexiones SQL relacionales inicializado con 20 conexiones activas.'
    },
    {
      id: 'log-102',
      action: 'RECORD_APPROVED',
      entity: 'EXPEDIENTE',
      entityId: 'EXP-2026-001',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      userId: 'usr-admin-1',
      userName: 'Administrador General',
      details: 'Aprobación definitiva de presupuesto de infraestructura Kubernetes.'
    }
  ];

  /**
   * Obtiene la lista de departamentos relacionales (SQL SELECT * FROM departments)
   */
  public async getDepartments(): Promise<DepartmentSQL[]> {
    await this.simulateLatency(180);
    return [...this.departments];
  }

  /**
   * Ejecuta un JOIN relacional simulado entre expedientes y departamentos
   * para calcular totales agregados (GROUP BY department)
   */
  public async getDepartmentBudgetSummary(records: Array<{ category: string; budget: number }>): Promise<DepartmentBudgetSummary[]> {
    await this.simulateLatency(250);

    return this.departments.map((dept) => {
      // Mapeo entre categorías del expediente y departamento relacional
      const matching = records.filter((r) => {
        if (dept.code === 'DEV' && (r.category === 'SOFTWARE' || r.category === 'DESARROLLO')) return true;
        if (dept.code === 'INFRA' && (r.category === 'INFRAESTRUCTURA' || r.category === 'CLOUD')) return true;
        if (dept.code === 'CYBER' && (r.category === 'SEGURIDAD' || r.category === 'AUDITORIA')) return true;
        if (dept.code === 'QA' && r.category === 'CALIDAD') return true;
        if (dept.code === 'BI' && (r.category === 'DATOS' || r.category === 'CONSULTORIA')) return true;
        return r.category === dept.code;
      });

      const totalCommitted = matching.reduce((acc, curr) => acc + curr.budget, 0);
      const percentage = dept.allocatedBudget > 0 ? Math.min(100, Math.round((totalCommitted / dept.allocatedBudget) * 100)) : 0;

      return {
        departmentCode: dept.code,
        departmentName: dept.name,
        totalRecords: matching.length,
        totalCommittedBudget: totalCommitted,
        percentageUsed: percentage
      };
    });
  }

  /**
   * Devuelve el historial de auditoría de transacciones SQL
   */
  public async getAuditLogs(): Promise<AuditLogSQL[]> {
    await this.simulateLatency(200);
    return [...this.auditLogs];
  }

  /**
   * Registra una transacción SQL en el log de auditoría
   */
  public async logTransaction(action: string, entity: string, entityId: string, user: { id: string; name: string }, details: string): Promise<void> {
    await this.simulateLatency(120);
    const newLog: AuditLogSQL = {
      id: `log-${Date.now()}`,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      details
    };
    this.auditLogs.unshift(newLog);
  }

  private simulateLatency(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const sqlApiService = new SqlApiService();
export default sqlApiService;
