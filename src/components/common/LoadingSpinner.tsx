/**
 * Spinner de Carga Accesible
 * Cumple con normativas WAI-ARIA (role="status", aria-live)
 */

import React from 'react';
import { IonSpinner } from '@ionic/react';

interface LoadingSpinnerProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando contenido...',
  fullscreen = false
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        minHeight: fullscreen ? '100vh' : '200px',
        width: '100%'
      }}
    >
      <IonSpinner name="crescent" color="primary" style={{ width: '40px', height: '40px' }} />
      <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};
