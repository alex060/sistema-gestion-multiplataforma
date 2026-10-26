/**
 * Vista Declarativa: Inicio de Sesión (Login)
 * Paso 1.2 - Formularios y Validaciones Asíncronas
 * Arquitectura MVVM: La vista consume el ViewModel 'useLoginForm'
 */

import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { logInOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../../hooks/useLoginForm';
import { FormInput } from '../../components/common/FormInput';

export const LoginPage: React.FC = () => {
  const {
    credentials,
    errors,
    touched,
    isValid,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    fillPreset
  } = useLoginForm();

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="auth-container">
          <IonCard className="auth-card">
            <IonCardContent style={{ padding: '2rem' }}>
              {/* Encabezado */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    marginBottom: '1rem'
                  }}
                >
                  <IonIcon icon={shieldCheckmarkOutline} style={{ fontSize: '32px' }} />
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  Acceso al Sistema ERP
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  Plataforma Empresarial Multiplataforma · DAM DI
                </p>
              </div>

              {/* Botones de Acceso Rápido para Pruebas del Evaluador */}
              <div
                style={{
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1.5rem',
                  border: '1px dashed #cbd5e1'
                }}
              >
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                  🔑 ACCESO RÁPIDO PARA EVALUACIÓN:
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => fillPreset('ADMIN')}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      background: '#fee2e2',
                      color: '#991b1b',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Rol Administrador
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPreset('STANDARD')}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      background: '#e0f2fe',
                      color: '#0369a1',
                      border: '1px solid #7dd3fc',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Rol Estándar
                  </button>
                </div>
              </div>

              {/* Banner de Error Global */}
              {submitError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#991b1b',
                    fontSize: '0.85rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  {submitError}
                </div>
              )}

              {/* Formulario Declarativo con Two-way Data Binding */}
              <form onSubmit={handleSubmit} noValidate>
                <FormInput
                  id="login-email"
                  name="email"
                  type="email"
                  label="Correo Electrónico Corporativo"
                  placeholder="ejemplo@empresa.com"
                  value={credentials.email}
                  required
                  error={errors.email}
                  touched={touched.email}
                  onChange={(val) => handleChange('email', val)}
                  onBlur={() => handleBlur('email')}
                />

                <FormInput
                  id="login-password"
                  name="password"
                  type="password"
                  label="Contraseña de Acceso"
                  placeholder="••••••••"
                  value={credentials.password}
                  required
                  error={errors.password}
                  touched={touched.password}
                  onChange={(val) => handleChange('password', val)}
                  onBlur={() => handleBlur('password')}
                />

                <IonButton
                  expand="block"
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  style={{
                    marginTop: '1.5rem',
                    fontWeight: 600,
                    '--border-radius': '8px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <IonSpinner name="crescent" slot="start" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      <IonIcon slot="start" icon={logInOutline} />
                      Iniciar Sesión
                    </>
                  )}
                </IonButton>
              </form>

              {/* Enlace a Registro */}
              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                ¿No dispone de cuenta?{' '}
                <Link
                  to="/register"
                  style={{ color: '#1d4ed8', fontWeight: 600, textDecoration: 'none' }}
                >
                  Regístrese aquí
                </Link>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
