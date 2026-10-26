# MEMORIA TÉCNICA Y DE DISEÑO — FASE 1
## MÓDULO: Desarrollo de Interfaces (Código: 0488)
### Ciclo Formativo: Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)

---

**Proyecto:** Sistema de Gestión Empresarial Multiplataforma (Nexus ERP)  
**Entregable:** Fase 1 — Estructuración y Renderizado Declarativo (RA 1 y RA 2)  
**Tecnologías:** Ionic Framework v8 · React 18 · TypeScript · Vite · React Router v5  
**Fecha:** 26 de Octubre de 2026  

---

## 1. Justificación Arquitectónica y Selección Tecnológica

Para el desarrollo del sistema se ha optado por la combinación de **Ionic Framework con React y TypeScript**, soportado por el bundler de alto rendimiento **Vite**:

- **Patrón Arquitectónico (MVVM):**
  - **Model (`src/models/`):** Interfaces tipadas de forma estricta (`auth.model.ts`, `record.model.ts`, `validation.model.ts`). Aseguran la inmutabilidad y coherencia de las entidades de negocio.
  - **ViewModel (`src/hooks/`):** Custom hooks (`useLoginForm`, `useRegisterForm`, `useRecordForm`) que desacoplan la lógica de estado, binding bidireccional, validaciones y orquestación con la API, manteniendo la vista totalmente limpia y agnóstica.
  - **View (`src/pages/`, `src/components/`):** Vistas declarativas en JSX (`LoginPage`, `RegisterPage`, `DashboardPage`, `RecordsListPage`, `NewRecordPage`, `UserManagementPage`) optimizadas para evitar ciclos de re-renderizado mediante `React.memo` y `useMemo`.
- **Gestión de Estado Predecible:** Implementada con **React Context API** (`AuthContext.tsx`), centralizando la sesión, roles y tokens de seguridad sin mutaciones descontroladas de estado.

---

## 2. Desarrollo de la Fase 1: Pasos y Requisitos

### 2.1. Paso 1.1 — Sistema de Enrutamiento y Navegación (RA 1)

1. **Carga Diferida (Lazy Loading):**
   - Todas las páginas de la aplicación se importan de forma asíncrona mediante `React.lazy()` en `src/App.tsx`.
   - Se gestiona el tiempo de espera con `<Suspense>` y un componente accesible de feedback (`<LoadingSpinner />`), reduciendo el tamaño del paquete inicial y optimizando el tiempo de carga (First Contentful Paint).
   - En el build de producción se comprueba la generación de chunks divididos independientes por cada vista (`LoginPage-*.js`, `RegisterPage-*.js`, etc.).

2. **Navegación Global (Side Menu):**
   - Configurado mediante `IonSplitPane` y `IonMenu` en `src/components/layout/SideMenu.tsx`.
   - **Comportamiento adaptativo:** En pantallas grandes (escritorio/tablet) se muestra fijo en panel lateral, mientras que en pantallas móviles se repliega en menú de hamburguesa flotante.
   - **Renderizado condicional por rol:** Oculta automáticamente las rutas administrativas si el usuario autenticado no posee el rol de Administrador.

3. **Control de Acceso Basado en Roles (RBAC) y Guards:**
   - Implementado a través del componente `ProtectedRoute.tsx`:
     - **Comprobación de sesión:** Si el usuario no está autenticado, redirige a `/login` preservando la ruta solicitada en `location.state.from`.
     - **Comprobación de roles:** Si la ruta requiere privilegios específicos (ej. `roles={['ADMIN']}` en `/admin/users`) y el usuario es de tipo `STANDARD`, redirige a la vista de error 403 (`/unauthorized`).

4. **Manejo Seguro de Tokens:**
   - La capa de servicios (`src/services/auth.service.ts` y `src/services/api.service.ts`) simula la emisión y almacenamiento de tokens en formato **JWT (Base64 Header.Payload.Signature)** con control de caducidad y persistencia en `localStorage`.

---

### 2.2. Paso 1.2 — Formularios y Validaciones Asíncronas (RA 2)

1. **Marcado Declarativo en JSX:**
   - Construcción de las interfaces de entrada mediante el componente reutilizable `FormInput.tsx`, eliminando cualquier manipulación directa del DOM (`document.getElementById`).

2. **Data Binding (Unidireccional y Bidireccional):**
   - Implementado mediante enlace bidireccional controlado: el valor del input fluye desde el estado del ViewModel (`value={formData.field}`) y se actualiza reactivamente mediante eventos (`onIonInput={(e) => handleChange('field', e.detail.value)}`).

3. **Validaciones Asíncronas en Tiempo Real con Debounce:**
   - **Formulario de Registro (`RegisterPage.tsx`):**
     - Al teclear en el campo de correo electrónico, se activa un temporizador debounce de **500 ms**.
     - Se invoca al servicio `authService.checkEmailAvailability(email)`, el cual simula una consulta asíncrona al backend.
     - Durante la consulta, el componente muestra el estado *"Comprobando disponibilidad del correo en el servidor..."* acompañado de un spinner animado.
     - Si el correo ya existe en la base de datos (por ejemplo `admin@empresa.com`), se notifica inmediatamente el error al usuario en tiempo real antes de enviar el formulario.
     - Si el correo está libre, se muestra una confirmación en verde.
     - El botón de envío permanece deshabilitado mientras se esté ejecutando la validación asíncrona o existan discrepancias.
   - **Formulario de Alta de Expedientes (`NewRecordPage.tsx`):**
     - Validación asíncrona de unicidad del código de expediente corporativo (con formato `EXP-AAAA-NNN`), impidiendo códigos duplicados.

4. **Accesibilidad y WAI-ARIA:**
   - Cada campo cuenta con etiquetas semánticas vinculadas (`htmlFor`), atributos `aria-required`, `aria-invalid` dinámico, `aria-describedby` que vincula con los identificadores de error, y regiones activas `role="alert"` y `aria-live="polite"`.

---

## 3. Credenciales de Acceso para Pruebas (Evaluación)

La pantalla de Login incorpora botones automáticos de "Acceso Rápido" para pruebas instantáneas, además de admitir entrada manual:

| Rol | Correo Electrónico | Contraseña | Rutas Autorizadas |
|---|---|---|---|
| **Administrador** | `admin@empresa.com` | `Admin123!` | Acceso total: Cuadro de Mando, Expedientes, Alta y Panel de Usuarios (`/admin/users`) |
| **Usuario Estándar** | `user@empresa.com` | `User123!` | Cuadro de Mando, Consulta y Alta de Expedientes (Bloqueo 403 a `/admin/users`) |

---

## 4. Estructura del Repositorio y Ficheros

```
gestion-multiplataforma/
├── public/                     # Recursos públicos estáticos
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── FormInput.tsx       # Input declarativo con ARIA y estados asíncronos
│   │   │   ├── LoadingSpinner.tsx  # Indicador de carga accesible
│   │   │   └── RoleBadge.tsx       # Distintivo visual del rol
│   │   └── layout/
│   │       ├── MainLayout.tsx      # Estructura de cabecera y contenedor principal
│   │       └── SideMenu.tsx        # Menú lateral adaptativo y filtrado por RBAC
│   ├── context/
│   │   └── AuthContext.tsx         # Gestión de estado global con Context API
│   ├── guards/
│   │   └── ProtectedRoute.tsx      # Guard de protección de rutas y roles
│   ├── hooks/                      # Capa ViewModel
│   │   ├── useLoginForm.ts         # ViewModel del Login
│   │   ├── useRegisterForm.ts      # ViewModel de Registro con validación asíncrona
│   │   └── useRecordForm.ts        # ViewModel de Expedientes
│   ├── models/                     # Capa Model
│   │   ├── auth.model.ts           # Modelos de usuario, roles y JWT
│   │   ├── record.model.ts         # Modelo de datos de expedientes
│   │   └── validation.model.ts     # Tipos de estado de validación
│   ├── pages/                      # Capa View (Interfaces declarativas)
│   │   ├── admin/
│   │   │   └── UserManagementPage.tsx # Panel de control de usuarios (Solo Admin)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx       # Vista de inicio de sesión
│   │   │   └── RegisterPage.tsx    # Vista de alta de usuario
│   │   ├── common/
│   │   │   ├── NotFoundPage.tsx    # Vista 404
│   │   │   └── UnauthorizedPage.tsx # Vista 403 (Acceso no autorizado)
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx   # Cuadro de mando ejecutivo
│   │   └── records/
│   │       ├── NewRecordPage.tsx   # Formulario de alta de nuevo expediente
│   │       └── RecordsListPage.tsx # Listado de expedientes registrados
│   ├── services/                   # Servicios y consumo de datos simulado
│   │   ├── api.service.ts          # Interceptor HTTP y simulador de peticiones
│   │   ├── auth.service.ts         # Servicio de autenticación y validación de correo
│   │   └── record.service.ts       # Servicio de expedientes y unicidad de código
│   ├── theme/
│   │   └── variables.css           # Estilos corporativos y accesibilidad
│   ├── App.tsx                     # Enrutador principal con Lazy Loading diferido
│   ├── main.tsx                    # Punto de entrada de la aplicación React
│   └── vite-env.d.ts
├── index.html                      # Documento raíz con metadatos PWA y accesibilidad
├── package.json                    # Dependencias y scripts de construcción
├── tsconfig.json                   # Configuración del compilador TypeScript
├── vite.config.ts                  # Configuración de compilación con Vite
└── README.md                       # Manual de usuario y documentación técnica
```

---

## 5. Control de Versiones (Git Flow - RA 7)

El proyecto cuenta con un repositorio Git inicializado bajo la metodología estándar Git Flow:
- **`main`**: Rama de producción lista para despliegue automatizado.
- **`develop`**: Rama de integración de características.
- **`feature/fase-1-routing-forms`**: Rama con los commits específicos de enrutamiento, guardias y formularios de la Fase 1.

---

## 6. Instrucciones de Ejecución y Compilación

1. **Instalación:**
   ```bash
   cd gestion-multiplataforma
   npm install
   ```

2. **Servidor de Desarrollo:**
   ```bash
   npm run dev
   ```
   Disponible en `http://localhost:5173`.

3. **Compilación de Producción:**
   ```bash
   npm run build
   ```
   Genera la carpeta `dist/` con cero errores TypeScript y code-splitting verificado.
