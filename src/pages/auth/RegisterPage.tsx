/**
 * Vista Declarativa: Alta de Usuario / Registro
 * Paso 1.2 - Formularios y Validaciones Asíncronas
 * Implementa marcado declarativo JSX, Two-way Data Binding y validación asíncrona de email contra API.
 */

import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { personAddOutline, arrowBackOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { FormInput } from '../../components/common/FormInput';
import { UserRole } from '../../models/auth.model';

export const RegisterPage: React.FC = () => {
  const {
    formData,
    syncErrors,
    touched,
    emailAsyncStatus,
    emailAsyncMessage,
    isFormValid,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit
  } = useRegisterForm();

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="auth-container">
          <IonCard className="auth-card">
            <IonCardContent style={{ padding: '2rem' }}>
              {/* Botón Volver */}
              <div style={{ marginBottom: '1rem' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  <IonIcon icon={arrowBackOutline} /> Volver al Inicio de Sesión
                </Link>
              </div>

              {/* Encabezado */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  Alta de Nuevo Usuario
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Registro corporativo con validación asíncrona de identidad
                </p>
              </div>

              {/* Mensaje de Error en Submit */}
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

              {/* Formulario */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Nombre Completo */}
                <FormInput
                  id="reg-name"
                  name="name"
                  label="Nombre y Apellidos"
                  placeholder="Ej. Laura González Gómez"
                  value={formData.name}
                  required
                  error={syncErrors.name}
                  touched={touched.name}
                  onChange={(val) => handleChange('name', val)}
                  onBlur={() => handleBlur('name')}
                />

                {/* Email con Validación Asíncrona */}
                <FormInput
                  id="reg-email"
                  name="email"
                  type="email"
                  label="Correo Electrónico (Verificación Asíncrona en Tiempo Real)"
                  placeholder="ejemplo@empresa.com"
                  value={formData.email}
                  required
                  error={syncErrors.email}
                  touched={touched.email}
                  asyncStatus={emailAsyncStatus}
                  asyncMessage={emailAsyncMessage}
                  onChange={(val) => handleChange('email', val)}
                  onBlur={() => handleBlur('email')}
                />

                {/* Selección de Rol Declarativo */}
                <div className="form-field-wrapper">
                  <label htmlFor="reg-role" className="form-field-label">
                    Rol Asignado en el Sistema <span aria-hidden="true" style={{ color: '#b91c1c' }}>*</span>
                  </label>
                  <IonSelect
                    id="reg-role"
                    name="role"
                    value={formData.role}
                    onIonChange={(e) => handleChange('role', e.detail.value as UserRole)}
                    interface="popover"
                    fill="outline"
                    mode="md"
                    style={{
                      '--border-radius': '8px',
                      width: '100%'
                    }}
                  >
                    <IonSelectOption value="STANDARD">Usuario Estándar (Acceso a Operaciones)</IonSelectOption>
                    <IonSelectOption value="ADMIN">Administrador (Control Total & RBAC)</IonSelectOption>
                  </IonSelect>
                </div>

                {/* Contraseña */}
                <FormInput
                  id="reg-password"
                  name="password"
                  type="password"
                  label="Contraseña (mínimo 6 caracteres)"
                  placeholder="••••••••"
                  value={formData.password}
                  required
                  error={syncErrors.password}
                  touched={touched.password}
                  onChange={(val) => handleChange('password', val)}
                  onBlur={() => handleBlur('password')}
                />

                {/* Confirmar Contraseña */}
                <FormInput
                  id="reg-confirm-password"
                  name="confirmPassword"
                  type="password"
                  label="Confirmar Contraseña"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  required
                  error={syncErrors.confirmPassword}
                  touched={touched.confirmPassword}
                  onChange={(val) => handleChange('confirmPassword', val)}
                  onBlur={() => handleBlur('confirmPassword')}
                />

                <IonButton
                  expand="block"
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  style={{
                    marginTop: '1.5rem',
                    fontWeight: 600,
                    '--border-radius': '8px'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <IonSpinner name="crescent" slot="start" />
                      Registrando Usuario...
                    </>
                  ) : (
                    <>
                      <IonIcon slot="start" icon={personAddOutline} />
                      Crear Cuenta Corporativa
                    </>
                  )}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
