/**
 * Layout Principal de la Aplicación
 * Proporciona la estructura común con Header, Side Menu Button y Contenedor Principal.
 */

import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';

interface MainLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  const { user, logout } = useAuth();

  return (
    <IonPage id="main-content">
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot="end">
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '0.5rem' }}>
                <div className="ion-hide-sm-down">
                  <RoleBadge role={user.role} />
                </div>
                <IonButton
                  fill="clear"
                  color="light"
                  onClick={logout}
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <IonIcon slot="icon-only" icon={logOutOutline} />
                </IonButton>
              </div>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </div>
      </IonContent>
    </IonPage>
  );
};
