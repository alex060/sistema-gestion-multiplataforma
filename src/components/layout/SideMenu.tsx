/**
 * Menú Lateral Global (Side Menu)
 * Paso 1.1 - Sistema de Enrutamiento y Navegación
 * Adapta dinámicamente las rutas visibles según el rol del usuario autenticado (RBAC).
 */

import React from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonFooter,
  IonButton,
  IonAvatar
} from '@ionic/react';
import {
  speedometerOutline,
  folderOpenOutline,
  addCircleOutline,
  peopleOutline,
  logOutOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/RoleBadge';

interface NavItem {
  title: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: 'Cuadro de Mando',
    path: '/dashboard',
    icon: speedometerOutline
  },
  {
    title: 'Expedientes Empresariales',
    path: '/records',
    icon: folderOpenOutline
  },
  {
    title: 'Nuevo Registro',
    path: '/records/new',
    icon: addCircleOutline
  },
  {
    title: 'Gestión de Usuarios',
    path: '/admin/users',
    icon: peopleOutline,
    adminOnly: true
  }
];

export const SideMenu: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout, hasRole } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <IonMenu contentId="main-content" type="overlay">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Nexus ERP
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Perfil del Usuario Activo */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <IonAvatar style={{ width: '48px', height: '48px', border: '2px solid #3b82f6' }}>
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={`Avatar de ${user.name}`}
              />
            </IonAvatar>
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
                {user.name}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user.email}
              </p>
            </div>
          </div>
          <RoleBadge role={user.role} />
        </div>

        {/* Lista de Navegación Declarativa */}
        <IonList lines="none" style={{ padding: '0.75rem' }}>
          {NAV_ITEMS.map((item) => {
            // Filtrado por rol RBAC
            if (item.adminOnly && !hasRole('ADMIN')) {
              return null;
            }

            const isSelected = location.pathname === item.path;

            return (
              <IonMenuToggle key={item.path} autoHide={false}>
                <IonItem
                  routerLink={item.path}
                  routerDirection="none"
                  detail={false}
                  className={isSelected ? 'selected' : ''}
                  style={{
                    '--border-radius': '8px',
                    '--background': isSelected ? '#eff6ff' : 'transparent',
                    '--color': isSelected ? '#1d4ed8' : '#334155',
                    marginBottom: '0.35rem',
                    fontWeight: isSelected ? 600 : 500
                  }}
                >
                  <IonIcon
                    slot="start"
                    icon={item.icon}
                    style={{ color: isSelected ? '#1d4ed8' : '#64748b' }}
                  />
                  <IonLabel>{item.title}</IonLabel>
                  {item.adminOnly && (
                    <IonIcon
                      icon={shieldCheckmarkOutline}
                      slot="end"
                      style={{ color: '#dc2626', fontSize: '16px' }}
                      title="Ruta restringida a Administradores"
                    />
                  )}
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>

      <IonFooter>
        <div style={{ padding: '1rem' }}>
          <IonButton
            expand="block"
            fill="outline"
            color="danger"
            onClick={logout}
            style={{ fontWeight: 600 }}
          >
            <IonIcon slot="start" icon={logOutOutline} />
            Cerrar Sesión
          </IonButton>
        </div>
      </IonFooter>
    </IonMenu>
  );
};
