/**
 * Vista de Listado de Expedientes Empresariales
 * Muestra los registros existentes y permite navegar al formulario de alta.
 */

import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonItem,
  IonList
} from '@ionic/react';
import { addCircleOutline, folderOutline, cashOutline, personCircleOutline } from 'ionicons/icons';
import { MainLayout } from '../../components/layout/MainLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { recordService } from '../../services/record.service';
import { EnterpriseRecord } from '../../models/record.model';

export const RecordsListPage: React.FC = () => {
  const [records, setRecords] = useState<EnterpriseRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    recordService.getAllRecords().then((data) => {
      if (active) {
        setRecords(data);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APROBADO': return 'success';
      case 'EN_REVISION': return 'warning';
      case 'RECHAZADO': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <MainLayout title="Expedientes Empresariales">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            Registro de Operaciones
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
            Listado consolidado de expedientes y contratos registrados en la plataforma.
          </p>
        </div>
        <IonButton routerLink="/records/new" style={{ fontWeight: 600 }}>
          <IonIcon slot="start" icon={addCircleOutline} />
          Nuevo Expediente
        </IonButton>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Cargando expedientes desde el servicio..." />
      ) : records.length === 0 ? (
        <IonCard>
          <IonCardContent style={{ textAlign: 'center', padding: '3rem' }}>
            <IonIcon icon={folderOutline} style={{ fontSize: '48px', color: '#94a3b8' }} />
            <h3 style={{ color: '#334155', fontWeight: 600, marginTop: '1rem' }}>No hay expedientes registrados</h3>
            <p style={{ color: '#64748b' }}>Utilice el botón de alta para registrar una nueva operación.</p>
            <IonButton routerLink="/records/new" fill="outline">
              Crear Primer Expediente
            </IonButton>
          </IonCardContent>
        </IonCard>
      ) : (
        <IonList lines="full" style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          {records.map((rec) => (
            <IonItem key={rec.id} style={{ '--padding-top': '1rem', '--padding-bottom': '1rem' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                      {rec.code}
                    </span>
                    <IonBadge color="tertiary" style={{ fontSize: '0.75rem' }}>
                      {rec.category}
                    </IonBadge>
                  </div>
                  <IonBadge color={getStatusColor(rec.status)} style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    {rec.status.replace('_', ' ')}
                  </IonBadge>
                </div>

                <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>
                  {rec.title}
                </h3>
                <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
                  {rec.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#15803d', fontWeight: 600 }}>
                    <IonIcon icon={cashOutline} />
                    {rec.budget.toLocaleString('es-ES')} €
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <IonIcon icon={personCircleOutline} />
                    Creado por {rec.createdByName}
                  </span>
                </div>
              </div>
            </IonItem>
          ))}
        </IonList>
      )}
    </MainLayout>
  );
};

export default RecordsListPage;
