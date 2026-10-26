/**
 * Badge visual de Rol de Usuario
 */

import React from 'react';
import { UserRole } from '../../models/auth.model';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const isAdmin = role === 'ADMIN';
  return (
    <span
      className={`role-badge ${isAdmin ? 'role-badge-admin' : 'role-badge-standard'}`}
      aria-label={`Rol de usuario: ${isAdmin ? 'Administrador' : 'Usuario Estándar'}`}
    >
      {isAdmin ? 'Administrador' : 'Estándar'}
    </span>
  );
};
