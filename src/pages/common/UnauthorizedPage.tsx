/**
 * Vista de Error 403 - Acceso Denegado / No Autorizado
 * Mostrada por ProtectedRoute cuando un usuario autenticado carece del rol necesario.
 */

import React from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon
} from '@ionic/react';
import { lockClosedOutline, arrowBackOutline, homeOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../../components/common/RoleBadge';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="auth-container">
          <IonCard className="auth-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
            <IonCardContent style={{ padding: '2.5rem 2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  color: '#dc2626',
                  marginBottom: '1.25rem'
                }}
              >
                <IonIcon icon={lockClosedOutline} style={{ fontSize: '32px' }} />
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                Acceso Restringido (403)
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Su cuenta actual no dispone de los privilegios necesarios para visualizar esta sección.
              </p>

              {user && (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    textAlign: 'left'
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                    <strong>Usuario autenticado:</strong> {user.name} ({user.email})
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <strong>Su Rol Actual:</strong> <RoleBadge role={user.role} />
                  </div>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#dc2626' }}>
                    <strong>Rol Requerido:</strong> Administrador
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <IonButton routerLink="/dashboard" style={{ fontWeight: 600 }}>
                  <IonIcon slot="start" icon={homeOutline} /> Volver al Inicio
                </IonButton>
                <IonButton fill="outline" routerLink="/records" style={{ fontWeight: 600 }}>
                  <IonIcon slot="start" icon={arrowBackOutline} /> Ir a Expedientes
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UnauthorizedPage;
