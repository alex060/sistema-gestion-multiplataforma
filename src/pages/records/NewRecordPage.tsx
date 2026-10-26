/**
 * Vista Declarativa: Alta de Nuevo Registro / Expediente Empresarial
 * Paso 1.2 - Formularios y Validaciones Asíncronas
 * Implementa Data Binding bidireccional y validación asíncrona de código único contra servicio.
 */

import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonTextarea
} from '@ionic/react';
import { arrowBackOutline, sparklesOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { FormInput } from '../../components/common/FormInput';
import { useRecordForm } from '../../hooks/useRecordForm';
import { RecordCategory } from '../../models/record.model';

export const NewRecordPage: React.FC = () => {
  const {
    formData,
    syncErrors,
    touched,
    codeAsyncStatus,
    codeAsyncMessage,
    isFormValid,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    generateSuggestedCode
  } = useRecordForm();

  return (
    <MainLayout title="Alta de Expediente">
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link
            to="/records"
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
            <IonIcon icon={arrowBackOutline} /> Volver al Listado de Expedientes
          </Link>
        </div>

        <IonCard style={{ margin: 0, borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <IonCardContent style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ margin: '0 0 0.35rem 0', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
                Registrar Nuevo Expediente Corporativo
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                Complete el formulario con validación asíncrona de código de expediente único.
              </p>
            </div>

            {/* Error de Envío */}
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

            <form onSubmit={handleSubmit} noValidate>
              {/* Código de Expediente con Validación Asíncrona y Botón de Sugerencia */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <FormInput
                    id="record-code"
                    name="code"
                    label="Código de Expediente (Validación Asíncrona)"
                    placeholder="EXP-2026-005"
                    value={formData.code}
                    required
                    error={syncErrors.code}
                    touched={touched.code}
                    asyncStatus={codeAsyncStatus}
                    asyncMessage={codeAsyncMessage}
                    onChange={(val) => handleChange('code', val)}
                    onBlur={() => handleBlur('code')}
                  />
                </div>
                <IonButton
                  fill="outline"
                  color="secondary"
                  onClick={generateSuggestedCode}
                  style={{ marginTop: '24px', height: '42px', fontSize: '0.8rem' }}
                  title="Generar código de prueba no registrado"
                >
                  <IonIcon slot="icon-only" icon={sparklesOutline} />
                </IonButton>
              </div>

              {/* Título del Expediente */}
              <FormInput
                id="record-title"
                name="title"
                label="Título del Expediente"
                placeholder="Ej. Implantación de Sistema ERP Multiplataforma"
                value={formData.title}
                required
                error={syncErrors.title}
                touched={touched.title}
                onChange={(val) => handleChange('title', val)}
                onBlur={() => handleBlur('title')}
              />

              {/* Categoría */}
              <div className="form-field-wrapper">
                <label htmlFor="record-category" className="form-field-label">
                  Categoría Operativa <span aria-hidden="true" style={{ color: '#b91c1c' }}>*</span>
                </label>
                <IonSelect
                  id="record-category"
                  name="category"
                  value={formData.category}
                  onIonChange={(e) => handleChange('category', e.detail.value as RecordCategory)}
                  interface="popover"
                  fill="outline"
                  mode="md"
                  style={{ '--border-radius': '8px', width: '100%' }}
                >
                  <IonSelectOption value="DESARROLLO">Desarrollo de Software</IonSelectOption>
                  <IonSelectOption value="INFRAESTRUCTURA">Infraestructura y Cloud</IonSelectOption>
                  <IonSelectOption value="AUDITORIA">Auditoría y Seguridad</IonSelectOption>
                  <IonSelectOption value="CONSULTORIA">Consultoría Tecnológica</IonSelectOption>
                </IonSelect>
              </div>

              {/* Presupuesto Asignado */}
              <FormInput
                id="record-budget"
                name="budget"
                type="number"
                label="Presupuesto Estimado (€)"
                placeholder="25000"
                value={formData.budget}
                required
                error={syncErrors.budget}
                touched={touched.budget}
                onChange={(val) => handleChange('budget', val)}
                onBlur={() => handleBlur('budget')}
              />

              {/* Memoria Descriptiva (Textarea) */}
              <div className="form-field-wrapper">
                <label htmlFor="record-description" className="form-field-label">
                  Memoria Descriptiva <span aria-hidden="true" style={{ color: '#b91c1c' }}>*</span>
                </label>
                <IonTextarea
                  id="record-description"
                  name="description"
                  value={formData.description}
                  placeholder="Detalle los objetivos técnicos, alcance y requisitos de accesibilidad..."
                  rows={4}
                  fill="outline"
                  mode="md"
                  aria-required="true"
                  aria-invalid={!!syncErrors.description && touched.description}
                  onIonInput={(e) => handleChange('description', e.detail.value ?? '')}
                  onIonBlur={() => handleBlur('description')}
                  style={{ '--border-radius': '8px' }}
                />
                {syncErrors.description && touched.description && (
                  <p className="form-field-error" role="alert" style={{ margin: '0.35rem 0 0 0' }}>
                    {syncErrors.description}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem' }}>
                <IonButton
                  expand="block"
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  style={{ flex: 1, fontWeight: 600, '--border-radius': '8px' }}
                >
                  {isSubmitting ? (
                    <>
                      <IonSpinner name="crescent" slot="start" /> Guardando Expediente...
                    </>
                  ) : (
                    <>
                      <IonIcon slot="start" icon={checkmarkCircleOutline} /> Guardar Expediente
                    </>
                  )}
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  routerLink="/records"
                  style={{ fontWeight: 600, '--border-radius': '8px' }}
                >
                  Cancelar
                </IonButton>
              </div>
            </form>
          </IonCardContent>
        </IonCard>
      </div>
    </MainLayout>
  );
};

export default NewRecordPage;
