/**
 * ViewModel: useRecordForm
 * Gestión reactiva y validación asíncrona para Alta de Registros Empresariales (Expedientes)
 * Paso 1.2 - Formularios y Validaciones Asíncronas
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { CreateRecordDTO } from '../models/record.model';
import { AsyncValidationStatus } from '../models/validation.model';
import { recordService } from '../services/record.service';
import { sqlApiService } from '../services/sqlApi.service';
import { noSqlRealtimeService } from '../services/noSqlRealtime.service';
import { useAuth } from '../context/AuthContext';

export const useRecordForm = () => {
  const history = useHistory();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CreateRecordDTO>({
    code: '',
    title: '',
    category: 'DESARROLLO',
    budget: 15000,
    description: ''
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validación asíncrona del código de expediente
  const [codeAsyncStatus, setCodeAsyncStatus] = useState<AsyncValidationStatus>('idle');
  const [codeAsyncMessage, setCodeAsyncMessage] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((field: keyof CreateRecordDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);

    if (field === 'code') {
      setCodeAsyncStatus('idle');
      setCodeAsyncMessage(null);
    }
  }, []);

  const handleBlur = useCallback((field: keyof CreateRecordDTO) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Validación asíncrona con debounce para código único
  useEffect(() => {
    const rawCode = formData.code.trim().toUpperCase();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!rawCode) {
      setCodeAsyncStatus('idle');
      setCodeAsyncMessage(null);
      return;
    }

    if (!/^EXP-\d{4}-\d{3}$/.test(rawCode)) {
      setCodeAsyncStatus('idle');
      setCodeAsyncMessage(null);
      return;
    }

    setCodeAsyncStatus('validating');
    setCodeAsyncMessage('Comprobando unicidad del expediente en la base de datos...');

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await recordService.checkCodeAvailability(rawCode);
        if (res.available) {
          setCodeAsyncStatus('valid');
          setCodeAsyncMessage(res.message);
        } else {
          setCodeAsyncStatus('invalid');
          setCodeAsyncMessage(res.message);
        }
      } catch {
        setCodeAsyncStatus('invalid');
        setCodeAsyncMessage('Error al verificar el código.');
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.code]);

  // Validaciones Síncronas
  const syncErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!formData.code.trim()) {
      errs.code = 'El código de expediente es obligatorio.';
    } else if (!/^EXP-\d{4}-\d{3}$/.test(formData.code.trim().toUpperCase())) {
      errs.code = 'Debe seguir el formato EXP-AAAA-NNN (Ejemplo: EXP-2026-042).';
    }

    if (!formData.title.trim()) {
      errs.title = 'El título del expediente es obligatorio.';
    } else if (formData.title.trim().length < 5) {
      errs.title = 'El título debe tener al menos 5 caracteres.';
    }

    if (formData.budget <= 0) {
      errs.budget = 'El presupuesto asignado debe ser mayor a 0 €.';
    }

    if (!formData.description.trim()) {
      errs.description = 'La memoria descriptiva es obligatoria.';
    } else if (formData.description.trim().length < 15) {
      errs.description = 'La descripción debe tener al menos 15 caracteres.';
    }

    return errs;
  }, [formData.code, formData.title, formData.budget, formData.description]);

  const isFormValid = useMemo(() => {
    const hasSyncErrors = Object.keys(syncErrors).length > 0;
    const isCodeValidAsync = codeAsyncStatus === 'valid';
    return !hasSyncErrors && isCodeValidAsync && !isSubmitting;
  }, [syncErrors, codeAsyncStatus, isSubmitting]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTouched({
      code: true,
      title: true,
      category: true,
      budget: true,
      description: true
    });

    if (!isFormValid || !user) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const created = await recordService.createRecord(formData, user.id, user.name);

      // Consumo dual: Log relacional SQL y emisión a stream NoSQL en tiempo real
      await sqlApiService.logTransaction(
        'INSERT_RECORD',
        'EXPEDIENTE',
        created.code,
        { id: user.id, name: user.name },
        `Alta de expediente "${created.title}" con presupuesto de ${created.budget} €.`
      );

      noSqlRealtimeService.emitDocumentEvent(
        'NEW_RECORD',
        `Nuevo Expediente Registrado: ${created.code}`,
        `"${created.title}" creado por ${user.name} (${created.budget.toLocaleString('es-ES')} €).`,
        'medium',
        { code: created.code, budget: created.budget }
      );

      history.push('/records');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creando el expediente';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, user, formData, history]);

  // Generador de código aleatorio sugerido
  const generateSuggestedCode = useCallback(() => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const suggested = `EXP-2026-${randomNum}`;
    handleChange('code', suggested);
  }, [handleChange]);

  return {
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
  };
};
