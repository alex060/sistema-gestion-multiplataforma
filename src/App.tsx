/**
 * Componente Raíz de la Aplicación
 * Configura Enrutamiento Global, Lazy Loading diferido, Side Menu y Control de Acceso (RBAC).
 * Paso 1.1 - Sistema de Enrutamiento y Navegación
 */

import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// Estilos globales de Ionic y diseño empresarial accesible
import './theme/variables.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { SideMenu } from './components/layout/SideMenu';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Inicialización de Ionic Framework
setupIonicReact({
  mode: 'md', // Coherencia visual Material Design en todas las plataformas
  animated: true
});

// Carga Diferida (LAZY LOADING) de todas las páginas de la aplicación
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/dashboard/DashboardPage'));
const RecordsListPage = React.lazy(() => import('./pages/records/RecordsListPage'));
const NewRecordPage = React.lazy(() => import('./pages/records/NewRecordPage'));
const UserManagementPage = React.lazy(() => import('./pages/admin/UserManagementPage'));
const HelpPage = React.lazy(() => import('./pages/help/HelpPage'));
const UnauthorizedPage = React.lazy(() => import('./pages/common/UnauthorizedPage'));
const NotFoundPage = React.lazy(() => import('./pages/common/NotFoundPage'));

// Componente para redirigir fuera del login si ya tiene sesión activa
const PublicAuthRoute: React.FC<{ component: React.ComponentType<any>; path: string; exact?: boolean }> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) {
          return <LoadingSpinner fullscreen message="Iniciando sistema..." />;
        }
        if (isAuthenticated) {
          return <Redirect to="/dashboard" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

const AppRoutes: React.FC = () => {
  return (
    <IonSplitPane contentId="main-content" when="md">
      {/* Menú Lateral Global Dinámico */}
      <SideMenu />

      <IonRouterOutlet id="main-content">
        <Suspense
          fallback={
            <LoadingSpinner
              fullscreen
              message="Cargando módulo de la aplicación (Carga Diferida - Lazy Loading)..."
            />
          }
        >
          <Switch>
            {/* Rutas Públicas de Autenticación */}
            <PublicAuthRoute exact path="/login" component={LoginPage} />
            <PublicAuthRoute exact path="/register" component={RegisterPage} />

            {/* Rutas Protegidas Generales (Administrador y Estándar) */}
            <ProtectedRoute exact path="/dashboard" component={DashboardPage} />
            <ProtectedRoute exact path="/records" component={RecordsListPage} />
            <ProtectedRoute exact path="/records/new" component={NewRecordPage} />

            {/* Ruta Protegida Exclusiva para Rol Administrador (RBAC) */}
            <ProtectedRoute
              exact
              path="/admin/users"
              roles={['ADMIN']}
              component={UserManagementPage}
            />

            {/* Centro de Ayuda y Manual de Usuario Integrado (Fase 5 - RA 6) */}
            <ProtectedRoute exact path="/help" component={HelpPage} />

            {/* Errores y Redirecciones */}
            <Route exact path="/unauthorized" component={UnauthorizedPage} />
            <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
            <Route component={NotFoundPage} />
          </Switch>
        </Suspense>
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

export const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
