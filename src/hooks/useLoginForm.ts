/**
 * ViewModel: useLoginForm
 * Separa estrictamente la lógica de negocio y estado del formulario de la vista (MVVM)
 */

import { useState, useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { LoginCredentials } from '../models/auth.model';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  from?: { pathname: string };
}

export const useLoginForm = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { login } = useAuth();

  // Two-way data binding state
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: true
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Manejador genérico de cambio de campos (Two-way data binding)
  const handleChange = useCallback((field: keyof LoginCredentials, value: any) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  }, []);

  const handleBlur = useCallback((field: keyof LoginCredentials) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Validación reactiva síncrona
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!credentials.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email.trim())) {
      errs.email = 'Introduzca un correo electrónico corporativo válido.';
    }

    if (!credentials.password) {
      errs.password = 'La contraseña es obligatoria.';
    } else if (credentials.password.length < 6) {
      errs.password = 'La contraseña debe contener al menos 6 caracteres.';
    }

    return errs;
  }, [credentials.email, credentials.password]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  // Rellenar credenciales de demostración rápidamente
  const fillPreset = useCallback((role: 'ADMIN' | 'STANDARD') => {
    if (role === 'ADMIN') {
      setCredentials({ email: 'admin@empresa.com', password: 'Admin123!', rememberMe: true });
    } else {
      setCredentials({ email: 'user@empresa.com', password: 'User123!', rememberMe: true });
    }
    setSubmitError(null);
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await login(credentials);
      const destination = location.state?.from?.pathname || '/dashboard';
      history.replace(destination);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al autenticar';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, credentials, login, location.state, history]);

  return {
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
  };
};
