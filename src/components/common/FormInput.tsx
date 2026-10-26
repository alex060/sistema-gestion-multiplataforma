/**
 * Componente Declarativo Reutilizable de Entrada de Datos
 * Cumple con normativas de Accesibilidad (WAI-ARIA, etiquetas semánticas)
 * y Gestión de Estados Asíncronos.
 */

import React, { memo } from 'react';
import { IonInput, IonSpinner, IonIcon } from '@ionic/react';
import { checkmarkCircle, alertCircle } from 'ionicons/icons';
import { AsyncValidationStatus } from '../../models/validation.model';

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | null;
  touched?: boolean;
  asyncStatus?: AsyncValidationStatus;
  asyncMessage?: string | null;
  onChange: (value: any) => void;
  onBlur?: () => void;
}

export const FormInput: React.FC<FormInputProps> = memo(({
  id,
  name,
  label,
  type = 'text',
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  touched = false,
  asyncStatus = 'idle',
  asyncMessage,
  onChange,
  onBlur
}) => {
  const hasError = !!error && touched;
  const errorId = `${id}-error`;
  const asyncId = `${id}-async`;

  return (
    <div className="form-field-wrapper">
      <label htmlFor={id} className="form-field-label">
        {label} {required && <span aria-hidden="true" style={{ color: '#b91c1c' }}>*</span>}
      </label>

      <IonInput
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-required={required}
        aria-invalid={hasError || asyncStatus === 'invalid'}
        aria-describedby={`${hasError ? errorId : ''} ${asyncStatus !== 'idle' ? asyncId : ''}`.trim() || undefined}
        onIonInput={(e) => onChange(e.detail.value ?? '')}
        onIonBlur={onBlur}
        fill="outline"
        mode="md"
        className={`custom-ion-input ${hasError ? 'ion-invalid ion-touched' : ''}`}
        style={{
          '--border-radius': '8px',
          '--highlight-color-focused': '#1d4ed8'
        }}
      />

      {/* Feedback de Validación Asíncrona */}
      {asyncStatus === 'validating' && (
        <div id={asyncId} className="form-field-validating" role="status" aria-live="polite">
          <IonSpinner name="dots" style={{ width: '16px', height: '16px' }} />
          <span>{asyncMessage || 'Validando con el servidor...'}</span>
        </div>
      )}

      {asyncStatus === 'valid' && (
        <div id={asyncId} className="form-field-success" role="status" aria-live="polite">
          <IonIcon icon={checkmarkCircle} style={{ fontSize: '16px' }} />
          <span>{asyncMessage || 'Dato válido y disponible'}</span>
        </div>
      )}

      {asyncStatus === 'invalid' && (
        <div id={asyncId} className="form-field-error" role="alert" aria-live="assertive">
          <IonIcon icon={alertCircle} style={{ fontSize: '16px' }} />
          <span>{asyncMessage || 'Valor no disponible'}</span>
        </div>
      )}

      {/* Feedback de Error Síncrono */}
      {hasError && asyncStatus !== 'invalid' && (
        <div id={errorId} className="form-field-error" role="alert" aria-live="assertive">
          <IonIcon icon={alertCircle} style={{ fontSize: '16px' }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';
