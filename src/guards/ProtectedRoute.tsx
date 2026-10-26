/**
 * Route Guard para Protección de Rutas y Control de Acceso basado en Roles (RBAC)
 * Paso 1.1 - Sistema de Enrutamiento y Navegación
 */

import React from 'react';
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/auth.model';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface ProtectedRouteProps extends RouteProps {
  roles?: UserRole[];
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  roles,
  ...rest
}) => {
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={(props) => {
        // Mientras se verifica el token persistido
        if (isLoading) {
          return <LoadingSpinner message="Verificando credenciales y permisos..." />;
        }

        // 1. Verificación de Autenticación
        if (!isAuthenticated || !user) {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location }
              }}
            />
          );
        }

        // 2. Verificación de Rol (RBAC)
        if (roles && roles.length > 0 && !hasRole(roles)) {
          return (
            <Redirect
              to={{
                pathname: '/unauthorized',
                state: { requiredRoles: roles, userRole: user.role }
              }}
            />
          );
        }

        // Autorizado: Renderiza el componente de la página
        return <Component {...props} />;
      }}
    />
  );
};
