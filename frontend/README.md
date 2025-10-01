# Yummy Frontend

Frontend de la aplicación Yummy, una plataforma de recetas desarrollada con React, Vite y TailwindCSS.

## Tecnologías

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **TanStack Query** - Manejo de estado del servidor
- **Zustand** - Manejo de estado local
- **TailwindCSS** - Estilos
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Formularios y validación
- **Lucide React** - Iconos

## Instalación

### Requisitos previos

- Node.js 18 o superior
- npm o yarn

### Pasos

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=http://localhost:3000/api
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera el build de producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del proyecto

```
src/
├── app/              # Configuración de la app (router, layouts, providers)
├── features/         # Funcionalidades por módulo (auth, recipes, admin, etc)
├── shared/           # Código compartido (components, api, stores, utils)
└── assets/           # Archivos estáticos
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del backend | `http://localhost:3000/api/v1` |

## Funcionalidades

### Usuario
- Registro y login
- Perfil de usuario
- Crear, editar y eliminar recetas
- Favoritos
- Calificaciones y comentarios

### Admin
- Dashboard con estadísticas
- Gestión de usuarios (crear, editar, eliminar, cambiar roles)
- Gestión de recetas (ver todas, aprobar, rechazar)
- Panel de recetas pendientes

## Notas

- El frontend usa JWT para autenticación, el token se almacena en localStorage
- Todas las rutas de administración están protegidas y solo accesibles para usuarios con rol `admin`
