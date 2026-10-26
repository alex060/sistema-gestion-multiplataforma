/**
 * ViewModel: useRegisterForm
 * Implementa Data Binding bidireccional, validaciones reactivas y
 * Validación Asíncrona contra servicio con Debounce para verificar duplicidad de email.
 * Paso 1.2 - Formularios y Validaciones Asíncronas
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { RegisterDTO } from '../models/auth.model';
import { AsyncValidationStatus } from '../models/validation.model';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

export interface RegisterFormState extends RegisterDTO {
  confirmPassword: string;
}

export const useRegisterForm = () => {
  const history = useHistory();
  const { register } = useAuth();

  // Two-way data binding
  const [formData, setFormData] = useState<RegisterFormState>({
    name: '',
    email: '',
    role: 'STANDARD',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Estado de la validación asíncrona de email
  const [emailAsyncStatus, setEmailAsyncStatus] = useState<AsyncValidationStatus>('idle');
  const [emailAsyncMessage, setEmailAsyncMessage] = useState<string | null>(null);

  // Referencia para cancelar llamadas pendientes de debounce
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((field: keyof RegisterFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);

    // Si cambia el email, reseteamos el estado asíncrono
    if (field === 'email') {
      setEmailAsyncStatus('idle');
      setEmailAsyncMessage(null);
    }
  }, []);

  const handleBlur = useCallback((field: keyof RegisterFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Efecto para la VALIDACIÓN ASÍNCRONA con Debounce (500ms)
  useEffect(() => {
    const rawEmail = formData.email.trim();

    // Limpieza de temporizador previo
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!rawEmail) {
      setEmailAsyncStatus('idle');
      setEmailAsyncMessage(null);
      return;
    }

    // Comprobación de formato sintáctico antes de consultar la API
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rawEmail)) {
      setEmailAsyncStatus('idle');
      setEmailAsyncMessage(null);
      return;
    }

    // Inicia estado de validación en progreso
    setEmailAsyncStatus('validating');
    setEmailAsyncMessage('Comprobando disponibilidad del correo en el servidor...');

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const result = await authService.checkEmailAvailability(rawEmail);
        if (result.available) {
          setEmailAsyncStatus('valid');
          setEmailAsyncMessage(result.message);
        } else {
          setEmailAsyncStatus('invalid');
          setEmailAsyncMessage(result.message);
        }
      } catch (err: unknown) {
        setEmailAsyncStatus('invalid');
        setEmailAsyncMessage('Error al verificar disponibilidad del correo.');
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.email]);

  // Validaciones Síncronas
  const syncErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'El nombre completo es obligatorio.';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'El nombre debe contener al menos 3 caracteres.';
    }

    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'El formato del correo es inválido.';
    }

    if (!formData.password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      errs.password = 'Debe tener al menos 6 caracteres.';
    }

    if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Las contraseñas no coinciden.';
    }

    return errs;
  }, [formData.name, formData.email, formData.password, formData.confirmPassword]);

  // El formulario es válido solo si no hay errores síncronos, y el email está asíncronamente validado
  const isFormValid = useMemo(() => {
    const hasSyncErrors = Object.keys(syncErrors).length > 0;
    const isEmailValidAsync = emailAsyncStatus === 'valid';
    return !hasSyncErrors && isEmailValidAsync && !isSubmitting;
  }, [syncErrors, emailAsyncStatus, isSubmitting]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      role: true
    });

    if (!isFormValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      history.replace('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en el proceso de registro';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, formData, register, history]);

  return {
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
  };
};
