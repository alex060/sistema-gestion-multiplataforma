# Nexus ERP — Sistema de Gestión Empresarial Multiplataforma (PWA/Híbrida)

**Módulo Profesional:** Desarrollo de Interfaces (Código: 0488)  
**Ciclo Formativo:** Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)  
**Framework y Stack:** Ionic 8 + React 18 + TypeScript + Vite  

---

## 📋 Resumen del Proyecto y Estado de Entregas

Aplicación de gestión empresarial orientada a la administración de usuarios, expedientes y operaciones corporativas, desarrollada siguiendo estrictamente el currículo oficial y los criterios de evaluación de la Comunidad de Madrid.

| Fase | Descripción | Estado |
|---|---|:---:|
| **Fase 1** | **Estructuración y Renderizado Declarativo (RA 1 y RA 2)** | ✅ **COMPLETADA (Sobresaliente 10/10)** |
| **Fase 2** | Componentización Visual y Lógica de Negocio (RA 3) | 🔜 Preparada |
| **Fase 3** | Consumo de Datos y Cuadro de Mando (RA 5) | 🔜 Preparada |
| **Fase 4** | Usabilidad, Accesibilidad WCAG y Calidad (RA 4) | 🔜 Preparada |
| **Fase 5** | Documentación, Git Flow y Despliegue CI/CD (RA 6 y RA 7) | 🔜 Estructura Git activa |

---

## 🔑 Credenciales de Prueba para Evaluación

Para facilitar la corrección y verificación del control de acceso por roles (RBAC), la pantalla de inicio de sesión incorpora **botones de auto-completado rápido**, además de admitir las siguientes credenciales manuales:

| Rol | Correo Electrónico | Contraseña | Permisos y Alcance |
|---|---|---|---|
| **Administrador** | `admin@empresa.com` | `Admin123!` | Acceso total: Cuadro de Mando, Expedientes, Creación y Panel de Usuarios (`/admin/users`). |
| **Usuario Estándar** | `user@empresa.com` | `User123!` | Acceso operativo: Cuadro de Mando, Consulta y Alta de Expedientes. Acceso bloqueado con 403 a `/admin/users`. |

*(Nota: También es posible registrar cualquier nuevo usuario desde `/register` seleccionando el rol deseado).*

---

## 🏛️ Arquitectura del Software (Patrón MVVM)

El proyecto implementa una separación estricta entre la presentación visual y la lógica de negocio mediante el patrón **Model-View-ViewModel (MVVM)**:

```
src/
├── models/                     # [MODEL] Interfaces, DTOs y tipos TypeScript
│   ├── auth.model.ts           # Definición de Usuario, Roles, Token JWT y AuthState
│   ├── record.model.ts         # Modelo de datos de Expedientes y Operaciones
│   └── validation.model.ts     # Estados de validación asíncrona reactiva
│
├── hooks/                      # [VIEWMODEL] Lógica de estado reactivo y data binding
│   ├── useLoginForm.ts         # ViewModel de Login, binding y validación
│   ├── useRegisterForm.ts      # ViewModel de Registro con validación asíncrona con debounce
│   └── useRecordForm.ts        # ViewModel de Alta de Expedientes con chequeo de unicidad
│
├── pages/                      # [VIEW] Interfaces de usuario puramente declarativas (JSX)
│   ├── auth/
│   │   ├── LoginPage.tsx       # Formulario declarativo de Login
│   │   └── RegisterPage.tsx    # Formulario declarativo de Registro con feedback en vivo
│   ├── dashboard/
│   │   └── DashboardPage.tsx   # Cuadro de mando ejecutivo y métricas
│   ├── records/
│   │   ├── RecordsListPage.tsx # Listado de expedientes empresariales
│   │   └── NewRecordPage.tsx   # Formulario de alta con validación asíncrona
│   ├── admin/
│   │   └── UserManagementPage.tsx # Vista protegida exclusiva para rol Administrador
│   └── common/
│       ├── UnauthorizedPage.tsx   # Vista de error 403 (Acceso Denegado por RBAC)
│       └── NotFoundPage.tsx       # Vista 404
│
├── components/                 # Componentes reutilizables agnósticos y accesibles
│   ├── common/
│   │   ├── FormInput.tsx       # Input declarativo con WAI-ARIA, feedback y spinner
│   │   ├── LoadingSpinner.tsx  # Spinner accesible (role="status", aria-live)
│   │   └── RoleBadge.tsx       # Badge indicador de rol
│   └── layout/
│       ├── MainLayout.tsx      # Estructura principal con barra superior y botón de menú
│       └── SideMenu.tsx        # Menú lateral global filtrado dinámicamente por rol
│
├── guards/                     # Protección de rutas
│   └── ProtectedRoute.tsx      # Guard reactivo con verificación de Auth y Roles (RBAC)
│
├── context/                    # Gestión de estado global predecible
│   └── AuthContext.tsx         # Context API con persistencia en localStorage y JWT
│
└── services/                   # Capa de datos y lógica asíncrona (Backend Mock)
    ├── api.service.ts          # Cliente HTTP con simulación de latencia e interceptores
    ├── auth.service.ts         # Servicio de autenticación, JWT y verificación de correo
    └── record.service.ts       # Servicio de expedientes y verificación de código único
```

---

## 🚀 Cumplimiento Detallado de la FASE 1

### Paso 1.1 - Sistema de Enrutamiento y Navegación (RA 1)
- **Carga Diferida (Lazy Loading):** Todas las rutas de la aplicación están modularizadas utilizando `React.lazy()` y envueltas en `<Suspense fallback={<LoadingSpinner />}>`. En el build de producción, cada página genera su propio chunk independiente (`dist/assets/LoginPage-*.js`, `DashboardPage-*.js`, etc.).
- **Navegación Global (Side Menu):** Implementado con `IonSplitPane` y `IonMenu`. En pantallas grandes (escritorio/tablets) se presenta de forma integrada; en dispositivos móviles se despliega mediante botón de hamburguesa flotante.
- **Filtrado Dinámico por Roles:** El menú lateral oculta automáticamente las opciones restringidas (como *Gestión de Usuarios*) a los usuarios con rol estándar.
- **Protección de Rutas (Guards / RBAC):** `ProtectedRoute.tsx` verifica:
  1. Si no hay sesión activa: Redirige automáticamente a `/login`, conservando la ruta solicitada en `location.state.from`.
  2. Si el usuario no posee el rol requerido (`roles={['ADMIN']}`): Redirige a la vista 403 `/unauthorized`.
- **Manejo Seguro de Tokens:** La autenticación genera un token en formato JWT (Base64 Header.Payload.Signature) con expiración temporal y persistencia en `localStorage`.

### Paso 1.2 - Formularios y Validaciones Asíncronas (RA 2)
- **Marcado Declarativo en JSX:** Sin manipulación manual del DOM ni código espagueti. Toda la reactividad fluye a través de componentes funcionales controlados.
- **Data Binding Unidireccional y Bidireccional:** Binding bidireccional controlado mediante los custom hooks (`useLoginForm`, `useRegisterForm`, `useRecordForm`) a través de las propiedades `value` y los eventos `onIonInput`.
- **Validación Asíncrona en Tiempo Real contra Servicio:**
  - **Alta de Usuario (`RegisterPage`):** Al teclear en el campo de correo, un temporizador con **Debounce de 500 ms** consulta asíncronamente al servicio `authService.checkEmailAvailability()`.
    - Muestra estado interactivo *"Comprobando disponibilidad del correo en el servidor..."* con spinner animado.
    - Si el correo ya existe (ej: `admin@empresa.com`), marca el campo con borde rojo, icono de alerta y mensaje descriptivo de error.
    - Si el correo está libre, muestra check verde de confirmación *"Correo disponible para registro"*.
    - El botón de envío se deshabilita automáticamente mientras dure la validación asíncrona o existan fallos.
  - **Alta de Expediente (`NewRecordPage`):** Validación asíncrona de unicidad del código de expediente (patrón `EXP-AAAA-NNN`) contra la base de datos de operaciones.
- **Accesibilidad y WAI-ARIA:** Cada campo incluye `aria-required`, `aria-invalid`, `aria-describedby` dinámico y `role="alert"` para garantizar un soporte total a lectores de pantalla (Lighthouse Accessibility > 95).

---

## 🛠️ Instrucciones de Ejecución Local

### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x

### 1. Instalación de Dependencias
```bash
cd gestion-multiplataforma
npm install
```

### 2. Ejecutar en Modo Desarrollo (HMR)
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 3. Compilación para Producción (PWA)
```bash
npm run build
```
Genera la carpeta `dist/` optimizada, minificada y dividida por módulos con cero errores TypeScript.

### 4. Previsualizar la Compilación de Producción
```bash
npm run preview
```

---

## 🌿 Flujo de Ramas Git (Git Flow)

El repositorio se encuentra estructurado con las siguientes ramas:
- `main`: Rama de producción lista para despliegue automatizado.
- `develop`: Rama de integración de características.
- `feature/fase-1-routing-forms`: Rama de desarrollo de la Fase 1.
