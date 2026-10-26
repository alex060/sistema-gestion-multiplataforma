/**
 * Vista de Error 404 - Ruta No Encontrada
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
import { alertCircleOutline, homeOutline } from 'ionicons/icons';

export const NotFoundPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="auth-container">
          <IonCard className="auth-card" style={{ textAlign: 'center' }}>
            <IonCardContent style={{ padding: '2.5rem 2rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#64748b',
                  marginBottom: '1rem'
                }}
              >
                <IonIcon icon={alertCircleOutline} style={{ fontSize: '36px' }} />
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                404 - Página No Encontrada
              </h1>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                La ruta solicitada no existe o ha sido trasladada.
              </p>

              <IonButton routerLink="/dashboard" style={{ fontWeight: 600 }}>
                <IonIcon slot="start" icon={homeOutline} /> Regresar al Cuadro de Mando
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFoundPage;
