/**
 * Vista de Listado de Expedientes Empresariales
 * Fases 2 y 3: Integra el componente reutilizable AdvancedDataTable (RA 3),
 * ordenación dinámica, búsqueda reactiva, paginación, exportación CSV/PDF y eventos NoSQL.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  IonButton,
  IonIcon,
  IonBadge,
  IonAlert,
  IonToast
} from '@ionic/react';
import {
  addCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  eyeOutline,
  cashOutline
} from 'ionicons/icons';
import { MainLayout } from '../../components/layout/MainLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { AdvancedDataTable, ColumnConfig } from '../../components/common/AdvancedDataTable';
import { recordService } from '../../services/record.service';
import { exportService } from '../../services/export.service';
import { noSqlRealtimeService } from '../../services/noSqlRealtime.service';
import { useAuth } from '../../context/AuthContext';
import { EnterpriseRecord } from '../../models/record.model';

export const RecordsListPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [records, setRecords] = useState<EnterpriseRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRecord, setSelectedRecord] = useState<EnterpriseRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await recordService.getAllRecords();
      setRecords(data);
    } catch (err) {
      console.error('Error al cargar expedientes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Manejo de cambio de estado de expediente (Solo Admin)
  const handleUpdateStatus = async (record: EnterpriseRecord, newStatus: 'APROBADO' | 'RECHAZADO') => {
    try {
      const updated = await recordService.updateRecordStatus(record.id, newStatus);
      if (updated) {
        setRecords((prev) => prev.map((r) => (r.id === record.id ? updated : r)));
        setToastMessage(`Expediente ${record.code} actualizado a ${newStatus}.`);

        // Emitir evento al stream NoSQL en tiempo real
        noSqlRealtimeService.emitDocumentEvent(
          'STATUS_CHANGE',
          `Estado Actualizado: ${record.code}`,
          `El expediente "${record.title}" ha sido marcado como ${newStatus} por ${user?.name}.`,
          newStatus === 'APROBADO' ? 'high' : 'medium'
        );
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APROBADO':
        return <IonBadge color="success">APROBADO</IonBadge>;
      case 'EN_REVISION':
        return <IonBadge color="warning">EN REVISIÓN</IonBadge>;
      case 'RECHAZADO':
        return <IonBadge color="danger">RECHAZADO</IonBadge>;
      default:
        return <IonBadge color="medium">{status}</IonBadge>;
    }
  };

  // Configuración de Columnas para el componente agnóstico AdvancedDataTable
  const columns: ColumnConfig<EnterpriseRecord>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      width: '130px',
      render: (r) => (
        <span
          style={{
            background: '#0f172a',
            color: '#ffffff',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}
        >
          {r.code}
        </span>
      )
    },
    {
      key: 'title',
      header: 'Título y Descripción',
      sortable: true,
      render: (r) => (
        <div>
          <strong style={{ color: '#0f172a', fontSize: '0.9rem', display: 'block' }}>{r.title}</strong>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{r.description}</span>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Departamento / Cat.',
      sortable: true,
      width: '160px',
      render: (r) => <IonBadge color="tertiary">{r.category}</IonBadge>
    },
    {
      key: 'budget',
      header: 'Presupuesto',
      sortable: true,
      align: 'right',
      width: '140px',
      render: (r) => (
        <span style={{ fontWeight: 700, color: '#15803d', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <IonIcon icon={cashOutline} />
          {r.budget.toLocaleString('es-ES')} €
        </span>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      align: 'center',
      width: '130px',
      render: (r) => getStatusBadge(r.status)
    },
    {
      key: 'createdByName',
      header: 'Responsable',
      sortable: true,
      width: '150px',
      render: (r) => <span style={{ fontSize: '0.85rem', color: '#475569' }}>{r.createdByName}</span>
    }
  ];

  // Exportaciones
  const handleExportCSV = (dataToExport: EnterpriseRecord[]) => {
    exportService.exportToCSV(
      'Listado_Expedientes_Empresariales',
      dataToExport,
      [
        { key: 'code', header: 'Código' },
        { key: 'title', header: 'Título' },
        { key: 'category', header: 'Categoría' },
        { key: 'budget', header: 'Presupuesto (€)' },
        { key: 'status', header: 'Estado' },
        { key: 'createdByName', header: 'Responsable' },
        { key: 'createdAt', header: 'Fecha de Alta' }
      ]
    );
  };

  const handleExportPDF = (dataToExport: EnterpriseRecord[]) => {
    exportService.exportRecordsToPDF(
      'Informe Detallado de Expedientes Corporativos',
      dataToExport,
      { name: user?.name || 'Usuario', role: user?.role || 'ESTÁNDAR' }
    );
  };

  return (
    <MainLayout title="Expedientes Corporativos">
      {/* Encabezado y botón de alta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Registro de Operaciones Corporativas
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
            Visualización avanzada, búsqueda multi-campo, paginación dinámica y auditoría de estado.
          </p>
        </div>

        <IonButton routerLink="/records/new" style={{ fontWeight: 600 }}>
          <IonIcon slot="start" icon={addCircleOutline} />
          Nuevo Expediente
        </IonButton>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Cargando expedientes desde el repositorio relacional..." />
      ) : (
        /* FASE 2: Integración de la Tabla de Datos Avanzada Reutilizable */
        <AdvancedDataTable<EnterpriseRecord>
          data={records}
          columns={columns}
          searchable
          searchPlaceholder="Buscar por código, título, responsable..."
          searchFields={['code', 'title', 'description', 'createdByName', 'category']}
          filterCategoryKey="status"
          filterCategories={[
            { label: 'Aprobados', value: 'APROBADO' },
            { label: 'En Revisión', value: 'EN_REVISION' },
            { label: 'Rechazados', value: 'RECHAZADO' }
          ]}
          initialPageSize={5}
          pageSizeOptions={[5, 10, 25]}
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          actions={(r) => (
            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
              <IonButton
                size="small"
                fill="clear"
                color="primary"
                onClick={() => setSelectedRecord(r)}
                title="Ver detalle del expediente"
                aria-label={`Ver detalles de ${r.code}`}
              >
                <IonIcon slot="icon-only" icon={eyeOutline} />
              </IonButton>

              {hasRole('ADMIN') && r.status === 'EN_REVISION' && (
                <>
                  <IonButton
                    size="small"
                    fill="clear"
                    color="success"
                    onClick={() => handleUpdateStatus(r, 'APROBADO')}
                    title="Aprobar expediente"
                    aria-label={`Aprobar expediente ${r.code}`}
                  >
                    <IonIcon slot="icon-only" icon={checkmarkCircleOutline} />
                  </IonButton>
                  <IonButton
                    size="small"
                    fill="clear"
                    color="danger"
                    onClick={() => handleUpdateStatus(r, 'RECHAZADO')}
                    title="Rechazar expediente"
                    aria-label={`Rechazar expediente ${r.code}`}
                  >
                    <IonIcon slot="icon-only" icon={closeCircleOutline} />
                  </IonButton>
                </>
              )}
            </div>
          )}
        />
      )}

      {/* Modal / Alerta de Detalle de Expediente */}
      {selectedRecord && (
        <IonAlert
          isOpen={!!selectedRecord}
          header={`Detalle: ${selectedRecord.code}`}
          subHeader={selectedRecord.title}
          message={`
            Categoría: ${selectedRecord.category}
            Presupuesto: ${selectedRecord.budget.toLocaleString('es-ES')} €
            Estado: ${selectedRecord.status}
            Responsable: ${selectedRecord.createdByName}
            Fecha: ${new Date(selectedRecord.createdAt).toLocaleString('es-ES')}
            Descripción: ${selectedRecord.description}
          `}
          buttons={['Cerrar']}
          onDidDismiss={() => setSelectedRecord(null)}
        />
      )}

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || ''}
        duration={3000}
        color="dark"
        onDidDismiss={() => setToastMessage(null)}
      />
    </MainLayout>
  );
};

export default RecordsListPage;
