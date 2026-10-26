/**
 * Vista de Cuadro de Mando (Dashboard)
 * Paso 1.1 - Sistema de Enrutamiento y Navegación
 */

import React, { useState, useEffect } from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge
} from '@ionic/react';
import {
  folderOpenOutline,
  addCircleOutline,
  peopleOutline,
  shieldCheckmarkOutline,
  timeOutline,
  checkmarkDoneCircleOutline
} from 'ionicons/icons';
import { MainLayout } from '../../components/layout/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { recordService } from '../../services/record.service';
import { EnterpriseRecord } from '../../models/record.model';

export const DashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [records, setRecords] = useState<EnterpriseRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    recordService.getAllRecords().then((data) => {
      if (isMounted) {
        setRecords(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalBudget = records.reduce((acc, r) => acc + r.budget, 0);

  return (
    <MainLayout title="Cuadro de Mando Principal">
      {/* Banner de Bienvenida y Rol */}
      <IonCard style={{ margin: '0 0 1.5rem 0', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: '#ffffff' }}>
        <IonCardContent style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ margin: '0 0 0.25rem 0', opacity: 0.9, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sesión Iniciada · {user?.role === 'ADMIN' ? 'Privilegios de Administrador' : 'Acceso de Usuario Estándar'}
              </p>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: '#ffffff' }}>
                ¡Bienvenido/a, {user?.name}!
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.85, fontSize: '0.95rem' }}>
                Plataforma de Gestión Multiplataforma · Módulo de Desarrollo de Interfaces (0488)
              </p>
            </div>
            <div>
              <IonBadge
                color={user?.role === 'ADMIN' ? 'danger' : 'light'}
                style={{ fontSize: '0.9rem', padding: '0.5rem 0.9rem', borderRadius: '8px' }}
              >
                <IonIcon icon={shieldCheckmarkOutline} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                {user?.role === 'ADMIN' ? 'ROL: ADMINISTRADOR' : 'ROL: ESTÁNDAR'}
              </IonBadge>
            </div>
          </div>
        </IonCardContent>
      </IonCard>

      {/* Widgets Estadísticos / Métricas Rápidas */}
      <IonGrid style={{ padding: 0 }}>
        <IonRow>
          <IonCol size="12" sizeMd="4">
            <IonCard style={{ margin: 0, height: '100%' }}>
              <IonCardHeader>
                <IonCardSubtitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IonIcon icon={folderOpenOutline} color="primary" />
                  Expedientes Totales
                </IonCardSubtitle>
                <IonCardTitle style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>
                  {loading ? '...' : records.length}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Registros cargados de forma asíncrona desde el repositorio.
                </p>
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol size="12" sizeMd="4">
            <IonCard style={{ margin: 0, height: '100%' }}>
              <IonCardHeader>
                <IonCardSubtitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IonIcon icon={checkmarkDoneCircleOutline} color="success" />
                  Presupuesto Consolidado
                </IonCardSubtitle>
                <IonCardTitle style={{ fontSize: '2rem', fontWeight: 700, color: '#15803d' }}>
                  {loading ? '...' : `${totalBudget.toLocaleString('es-ES')} €`}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Suma total asignada a operaciones en curso.
                </p>
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol size="12" sizeMd="4">
            <IonCard style={{ margin: 0, height: '100%' }}>
              <IonCardHeader>
                <IonCardSubtitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IonIcon icon={timeOutline} color="warning" />
                  Estado del Sistema
                </IonCardSubtitle>
                <IonCardTitle style={{ fontSize: '2rem', fontWeight: 700, color: '#b45309' }}>
                  100% Operativo
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Token Bearer activo con persistencia y refresco seguro.
                </p>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      {/* Acciones Rápidas */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginTop: '2rem', marginBottom: '1rem' }}>
        Accesos Directos y Flujo de Trabajo
      </h3>
      <IonGrid style={{ padding: 0 }}>
        <IonRow>
          <IonCol size="12" sizeSm="6" sizeMd="4">
            <IonButton expand="block" routerLink="/records/new" style={{ fontWeight: 600 }}>
              <IonIcon slot="start" icon={addCircleOutline} />
              Alta de Nuevo Expediente
            </IonButton>
          </IonCol>
          <IonCol size="12" sizeSm="6" sizeMd="4">
            <IonButton expand="block" fill="outline" routerLink="/records" style={{ fontWeight: 600 }}>
              <IonIcon slot="start" icon={folderOpenOutline} />
              Consultar Expedientes
            </IonButton>
          </IonCol>
          {hasRole('ADMIN') && (
            <IonCol size="12" sizeSm="6" sizeMd="4">
              <IonButton expand="block" color="danger" fill="outline" routerLink="/admin/users" style={{ fontWeight: 600 }}>
                <IonIcon slot="start" icon={peopleOutline} />
                Gestión de Usuarios (Admin)
              </IonButton>
            </IonCol>
          )}
        </IonRow>
      </IonGrid>
    </MainLayout>
  );
};

export default DashboardPage;
