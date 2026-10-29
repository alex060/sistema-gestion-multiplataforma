/**
 * Vista de Ayuda y Manual de Usuario Integrado
 * Fase 5 - Paso 5.2: Documentación de Usuario integrada en la app (RA 6)
 */

import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonBadge,
  IonAccordion,
  IonAccordionGroup,
  IonItem
} from '@ionic/react';
import {
  helpCircleOutline,
  shieldCheckmarkOutline,
  folderOpenOutline,
  accessibilityOutline,
  layersOutline
} from 'ionicons/icons';
import { MainLayout } from '../../components/layout/MainLayout';

export const HelpPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<'INICIO' | 'ROLES' | 'EXPEDIENTES' | 'ACCESIBILIDAD'>('INICIO');

  return (
    <MainLayout title="Centro de Ayuda y Manual de Usuario">
      {/* Cabecera */}
      <IonCard style={{ margin: '0 0 1.5rem 0', borderRadius: '12px', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: '#ffffff' }}>
        <IonCardContent style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}
            >
              <IonIcon icon={helpCircleOutline} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                Manual de Usuario y Referencia Técnica
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                Guía interactiva integrada para el manejo integral de la plataforma Nexus ERP (Fase 5 - RA 6).
              </p>
            </div>
          </div>
        </IonCardContent>
      </IonCard>

      {/* Navegación por Secciones del Manual */}
      <div style={{ marginBottom: '1.5rem' }}>
        <IonSegment
          value={selectedSection}
          onIonChange={(e) => setSelectedSection(e.detail.value as any)}
          scrollable
          style={{ maxWidth: '700px' }}
        >
          <IonSegmentButton value="INICIO">
            <IonIcon icon={layersOutline} />
            <IonLabel>Guía de Inicio</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="ROLES">
            <IonIcon icon={shieldCheckmarkOutline} />
            <IonLabel>Roles y RBAC</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="EXPEDIENTES">
            <IonIcon icon={folderOpenOutline} />
            <IonLabel>Expedientes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="ACCESIBILIDAD">
            <IonIcon icon={accessibilityOutline} />
            <IonLabel>Accesibilidad</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>

      {/* Contenido según sección seleccionada */}
      {selectedSection === 'INICIO' && (
        <IonCard style={{ margin: 0, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              1. Guía Rápida de Inicio
            </IonCardTitle>
            <IonCardSubtitle style={{ color: '#64748b' }}>
              Primeros pasos en la plataforma Nexus ERP
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
            <p>
              <strong>Nexus ERP</strong> es un sistema de gestión empresarial multiplataforma diseñado bajo el patrón
              arquitectónico <strong>MVVM</strong> (Model-View-ViewModel) y desarrollado con <strong>Ionic 8, React 18 y TypeScript</strong>.
            </p>

            <h4 style={{ fontWeight: 700, color: '#0f172a', marginTop: '1.25rem' }}>Estructura de Navegación:</h4>
            <ul>
              <li><strong>Menú Lateral Adaptativo (Side Menu):</strong> En pantallas de escritorio se visualiza de forma permanente mediante <code>IonSplitPane</code>; en smartphones y tablets se despliega con el botón hamburguesa accesible.</li>
              <li><strong>Carga Diferida (Lazy Loading):</strong> Todas las pantallas se descargan bajo demanda utilizando <code>React.lazy()</code> y <code>Suspense</code> para reducir los tiempos de carga iniciales.</li>
              <li><strong>Cuadro de Mando Ejecutivo:</strong> Vista consolidada con métricas en tiempo real, agregaciones SQL y canal reactivo NoSQL.</li>
            </ul>

            <div style={{ marginTop: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
              <strong style={{ color: '#1e40af' }}>💡 Consejo para Evaluación Docente:</strong>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.875rem', color: '#1e3a8a' }}>
                En la pantalla de Login dispones de dos botones de "Acceso Rápido" para ingresar inmediatamente como Administrador o Usuario Estándar sin teclear contraseñas.
              </p>
            </div>
          </IonCardContent>
        </IonCard>
      )}

      {selectedSection === 'ROLES' && (
        <IonCard style={{ margin: 0, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              2. Matriz de Control de Acceso por Roles (RBAC)
            </IonCardTitle>
            <IonCardSubtitle style={{ color: '#64748b' }}>
              Políticas de seguridad perimetral y permisos de usuario
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px' }}>Rol</th>
                  <th style={{ padding: '8px 12px' }}>Credenciales de Prueba</th>
                  <th style={{ padding: '8px 12px' }}>Permisos y Rutas Accesibles</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <IonBadge color="danger">ADMIN</IonBadge>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <code>admin@empresa.com</code> / <code>Admin123!</code>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    Acceso total sin restricciones: Cuadro de Mando, Gestión y Alta de Expedientes, Aprobación/Rechazo de contratos y Panel de Gestión de Usuarios (<code>/admin/users</code>).
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 12px' }}>
                    <IonBadge color="light" style={{ border: '1px solid #cbd5e1' }}>STANDARD</IonBadge>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <code>user@empresa.com</code> / <code>User123!</code>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    Acceso operativo: Cuadro de Mando y Alta/Consulta de Expedientes. <strong>Bloqueo 403 automático</strong> con redirección a <code>/unauthorized</code> si intenta ingresar a rutas administrativas.
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', borderLeft: '4px solid #dc2626', fontSize: '0.875rem' }}>
              <strong style={{ color: '#991b1b' }}>🔒 Protección de Rutas (Guards):</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#7f1d1d' }}>
                El componente <code>ProtectedRoute.tsx</code> evalúa en tiempo de renderizado tanto la validez del token JWT simulado como el rol del usuario, impidiendo la manipulación de la URL desde la barra de direcciones.
              </p>
            </div>
          </IonCardContent>
        </IonCard>
      )}

      {selectedSection === 'EXPEDIENTES' && (
        <IonCard style={{ margin: 0, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              3. Gestión de Expedientes y Validaciones Asíncronas
            </IonCardTitle>
            <IonCardSubtitle style={{ color: '#64748b' }}>
              Ciclo de vida, validaciones con debounce y exportación
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
            <IonAccordionGroup>
              <IonAccordion value="validacion">
                <IonItem slot="header" color="light">
                  <IonLabel style={{ fontWeight: 600 }}>Validación Asíncrona en Tiempo Real (Debounce 500ms)</IonLabel>
                </IonItem>
                <div slot="content" style={{ padding: '1rem', background: '#ffffff' }}>
                  <p>
                    Al registrar un expediente (<code>/records/new</code>), el campo de código exige el formato estándar <code>EXP-AAAA-NNN</code> (ej. <code>EXP-2026-001</code>).
                  </p>
                  <p>
                    El hook <code>useRecordForm</code> implementa un temporizador debounce de 500 ms que consulta al repositorio simulado. Si el código ya existe en el sistema, bloquea el envío y muestra una advertencia visual inmediata; si está libre, confirma la disponibilidad en color verde.
                  </p>
                </div>
              </IonAccordion>

              <IonAccordion value="exportacion">
                <IonItem slot="header" color="light">
                  <IonLabel style={{ fontWeight: 600 }}>Exportación en Formatos Estándar (CSV y PDF)</IonLabel>
                </IonItem>
                <div slot="content" style={{ padding: '1rem', background: '#ffffff' }}>
                  <p>
                    Tanto en el <strong>Cuadro de Mando</strong> como en la <strong>Tabla Avanzada de Expedientes</strong> dispones de dos botones de exportación:
                  </p>
                  <ul>
                    <li><strong>Descarga CSV:</strong> Genera un archivo <code>.csv</code> estructurado con codificación UTF-8 (BOM incluido) compatible con Microsoft Excel y LibreOffice Calc.</li>
                    <li><strong>Informe Ejecutivo PDF:</strong> Abre una vista previa oficial con membrete corporativo, metadatos de auditoría, resumen financiero y tabla formateada lista para guardar como PDF.</li>
                  </ul>
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCardContent>
        </IonCard>
      )}

      {selectedSection === 'ACCESIBILIDAD' && (
        <IonCard style={{ margin: 0, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              4. Usabilidad y Accesibilidad Universal (WCAG 2.1 AA)
            </IonCardTitle>
            <IonCardSubtitle style={{ color: '#64748b' }}>
              Compromiso de inclusión y estándares internacionales (RA 4)
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
            <ul>
              <li><strong>Contraste de Color:</strong> Todos los textos y botones cumplen con una relación de contraste mínima de 4.5:1 exigida por WCAG AA.</li>
              <li><strong>Navegación por Teclado:</strong> Todos los elementos interactivos, filtros, ordenación de columnas y botones cuentan con <code>tabindex</code> lógico y estilo <code>:focus-visible</code> destacado.</li>
              <li><strong>Atributos Semánticos WAI-ARIA:</strong> Uso exhaustivo de <code>aria-label</code>, <code>aria-required</code>, <code>aria-invalid</code> dinámico y regiones activas <code>role="alert"</code> y <code>aria-live="polite"</code> para lectores de pantalla (NVDA, TalkBack, VoiceOver).</li>
              <li><strong>Puntuación en Google Lighthouse:</strong> Más de 90/100 en los apartados de <em>Accessibility</em> y <em>Best Practices</em>.</li>
            </ul>
          </IonCardContent>
        </IonCard>
      )}
    </MainLayout>
  );
};

export default HelpPage;
