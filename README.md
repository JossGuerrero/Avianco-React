# Avianco Web

Frontend web del sistema de gestión de aerolínea **Avianco**, construido con **React 19 + TypeScript + Vite** y **Tailwind CSS v4**. Consume la API REST del backend Django desplegada en `https://jguerrer.me/api` y cubre la operación completa de la aerolínea: catálogo público de vuelos y promociones, autenticación JWT, y 25+ módulos CRUD de administración (vuelos, reservas, pasajeros, asientos, check-ins, facturación, notificaciones, etc.) con permisos diferenciados por rol (cliente / staff).

## Stack

- **React 19** con componentes funcionales y hooks
- **TypeScript** en modo estricto (`erasableSyntaxOnly`: enums modelados como const-objects)
- **Vite 8** como bundler
- **Tailwind CSS v4** (plugin de Vite, paleta rojo-negro personalizada vía `@theme`)
- **React Router 7** (rutas públicas, privadas y solo-staff)
- **Zustand** para estado global (sesión y notificaciones)
- **Axios** con interceptores (JWT automático, manejo global de 401)
- **Oxlint** como linter

## Instalación y ejecución

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/JossGuerrero/Avianco-React.git
cd Avianco-React
npm install

# 2. Configurar variables de entorno (ver sección siguiente)
cp .env.example .env

# 3. Levantar en desarrollo (http://localhost:5173)
npm run dev

# 4. Build de producción (genera dist/)
npm run build

# 5. Linter
npm run lint
```

## Variables de entorno

| Variable       | Descripción                 | Valor por defecto        |
| -------------- | --------------------------- | ------------------------ |
| `VITE_API_URL` | URL base de la API REST     | `https://jguerrer.me/api` |

Se definen en `.env` (hay una plantilla en `.env.example`) y se exponen a la app a través de `src/infrastructure/config/env.ts`. Si la variable no está definida, se usa la URL de producción como fallback.

## Credenciales de prueba

| Rol                   | Usuario | Contraseña   | Permisos                                                        |
| --------------------- | ------- | ------------ | --------------------------------------------------------------- |
| Staff / Administrador | `admin` | `Admin1234!` | CRUD completo en todos los módulos                              |
| Cliente               | —       | —            | Crear cuenta desde `/register`; ve/gestiona solo sus propios datos |

## Estructura de carpetas (arquitectura limpia)

```
src/
├── domain/                  # Núcleo: sin dependencias externas
│   ├── entities/            # Modelos (Vuelo, Reserva, Pasajero, ...) con los
│   │                        # nombres de campo EXACTOS de la API (snake_case)
│   ├── enums/               # Uniones de valores (EstadoVuelo, ClaseTarifa, ...)
│   ├── exceptions/          # ApiException, AuthException, ValidationException
│   ├── ports/               # Contratos: CrudRepository genérico + ports por módulo
│   └── services/            # (reservado para lógica de dominio)
├── application/
│   ├── use-cases/           # LoginUseCase, CrudUseCases genérico, ReservaUseCases...
│   └── dtos/                # Formas de la API (auth, paginación DRF)
├── infrastructure/
│   ├── config/              # env.ts (variables de entorno)
│   ├── http/                # axios-client.ts (interceptores) + api-error.ts
│   ├── storage/             # local-token-storage.ts (tokens y usuario en localStorage)
│   ├── adapters/            # AxiosCrudRepository genérico + adaptadores por módulo
│   └── factories/           # repository.factory.ts: cablea repos → use cases
└── presentation/
    ├── theme/               # colors.ts (paleta rojo-negro #D32F2F / #1A1A1A)
    ├── utils/               # formatters, labels, useLista, países
    ├── store/               # authStore y notificacionesStore (Zustand)
    ├── pages/               # public/ (Home), auth/ (Login, Register), private/ (25+ módulos)
    ├── components/          # DataTable, Modal, CrudPage, FormInput, Button, Badge...
    └── router/              # AppRouter, PrivateRoute, StaffRoute
```

La regla de dependencias va hacia adentro: `presentation → application → domain`, e `infrastructure` implementa los ports del dominio. Los módulos CRUD estándar reutilizan tres piezas genéricas: `CrudRepository` (port), `AxiosCrudRepository` (adaptador HTTP) y `CrudUseCases`; en la UI, el componente `CrudPage` genera tabla + modal + formulario a partir de una configuración declarativa de columnas y campos.

## Conexión con la API

- `src/infrastructure/http/axios-client.ts` crea la instancia de Axios con `baseURL = VITE_API_URL`.
- Un **interceptor de request** agrega `Authorization: Bearer <access>` leyendo el token de localStorage.
- Un **interceptor de response** captura los `401`: limpia la sesión y redirige a `/login`.
- Login (`POST /auth/login/`) devuelve `{access, refresh, user_id, username, email, is_staff}`; el refresh token se usa en el logout (`POST /auth/logout/`).
- Las listas usan la paginación estándar de DRF (`{count, next, previous, results}`), desenvuelta en `application/dtos/common.dto.ts`.
- Endpoints públicos (sin token): `GET /vuelos/` y `GET /promociones/` — los consume la home pública.
- Permisos: los usuarios autenticados gestionan sus propios datos (reservas, facturas, notificaciones); solo el staff puede crear/editar/eliminar catálogos. La UI oculta las acciones según `is_staff` y el router protege las rutas de administración con `StaffRoute`.

## CI/CD — Despliegue automático

El proyecto se despliega automáticamente con **GitHub Actions**. El workflow está en [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) y se dispara **en cada push a `main`**:

1. GitHub Actions se conecta por **SSH** al VPS (**DigitalOcean**) usando los secrets del repositorio (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`).
2. En el servidor ejecuta: `git pull origin main` → `npm install` → `npm run build` (el build se genera directamente en el VPS, en `/var/www/Avianco-React`).
3. Recarga **Nginx** (`systemctl reload nginx`), que sirve los archivos estáticos de `dist/`.
4. El certificado **HTTPS** lo gestiona **Let's Encrypt** con **Certbot** (renovación automática).

Es decir: hacer `git push origin main` es suficiente para publicar una nueva versión en producción.
