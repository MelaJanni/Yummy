# Yummy Backend - API de Recetas

Backend para aplicación de compartir recetas construido con Express.js, Sequelize y MySQL.

## Tecnologías

- **Node.js** + **Express.js**
- **MySQL** 8.0
- **Sequelize** ORM
- **JWT** para autenticación
- **Zod** para validación
- **bcryptjs** para hash de contraseñas
- **Docker** y **Docker Compose**

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (env, database)
│   ├── db/
│   │   ├── models/      # Modelos Sequelize
│   │   ├── migrations/  # Migraciones de DB
│   │   └── seeders/     # Datos de prueba
│   ├── modules/         # Módulos de negocio (auth, recipes, etc.)
│   ├── middlewares/     # Middlewares Express
│   ├── utils/           # Utilidades
│   └── index.js         # Punto de entrada
├── uploads/             # Carpeta para imágenes
├── Dockerfile
└── package.json
```

## Instalación y Setup

### 1. Con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Esperar a que los contenedores estén listos
# Ejecutar migraciones
docker exec -it yummy_backend npm run db:migrate

# Ejecutar seeders (datos de demo)
docker exec -it yummy_backend npm run db:seed
```

### 2. Sin Docker

```bash
cd backend

# Instalar dependencias
npm install

# Asegurarte de tener MySQL corriendo y crear la base de datos
mysql -u root -p
CREATE DATABASE yummy_recipes;

# Configurar .env con tus credenciales de MySQL local
# DB_HOST=localhost

# Ejecutar migraciones
npm run db:migrate

# Ejecutar seeders
npm run db:seed

# Iniciar servidor
npm run dev
```

## Scripts Disponibles

```bash
npm run dev              # Inicia servidor en modo desarrollo
npm start                # Inicia servidor en producción
npm run db:migrate       # Ejecuta migraciones
npm run db:migrate:undo  # Revierte última migración
npm run db:seed          # Ejecuta seeders
npm run db:seed:undo     # Revierte seeders
npm run db:reset         # Reset completo (undo all + migrate + seed)
```

## Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

## Usuarios de Demo

Después de ejecutar los seeders:

- **Admin**: `admin@demo.com` / `Admin123!`
- **User**: `user@demo.com` / `User123!`

## Modelos de Datos

- **User**: Usuarios del sistema (user/admin)
- **Recipe**: Recetas (con estados: draft, pending, approved, rejected)
- **Ingredient**: Catálogo de ingredientes
- **RecipeIngredient**: Ingredientes de cada receta
- **Step**: Pasos de preparación
- **Tag**: Etiquetas (desayuno, almuerzo, etc.)
- **Allergen**: Alérgenos
- **Diet**: Dietas (vegetariana, vegana, etc.)
- **Rating**: Calificaciones (1-5 estrellas)
- **Comment**: Comentarios en recetas
- **Favorite**: Recetas favoritas de usuarios

## Arquitectura

El backend sigue una arquitectura modular inspirada en Laravel:

- **Modelos** (`db/models/`): Definen la estructura de datos con Sequelize ORM
- **Servicios** (`modules/*/service.js`): Contienen la lógica de negocio
- **Controladores** (`modules/*/controller.js`): Manejan las peticiones HTTP
- **Rutas** (`modules/*/routes.js`): Definen los endpoints
- **Middlewares**: Autenticación, validación, manejo de errores
- **Schemas** (`modules/*/schemas.js`): Validación con Zod

Principios aplicados: **SOLID** y **KISS**

## API Endpoints

### Autenticación
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me
```

### Recetas
```
GET    /api/recipes          - Listar recetas (públicas)
GET    /api/recipes/:slug    - Ver detalle de receta
POST   /api/recipes          - Crear receta (requiere auth)
PATCH  /api/recipes/:id      - Editar receta (requiere auth)
DELETE /api/recipes/:id      - Eliminar receta (requiere auth)
GET    /api/recipes/my       - Mis recetas (requiere auth)
POST   /api/recipes/:id/upload-image - Subir imagen
```

### Comentarios y Ratings
```
POST   /api/recipes/:id/comments    - Agregar comentario
GET    /api/recipes/:id/comments    - Ver comentarios
POST   /api/recipes/:id/ratings     - Calificar receta
```

### Favoritos
```
POST   /api/favorites/:recipeId     - Agregar a favoritos
DELETE /api/favorites/:recipeId     - Quitar de favoritos
GET    /api/favorites               - Mis favoritos
```

### Admin
```
GET    /api/admin/stats                    - Estadísticas generales
GET    /api/admin/recipes/pending          - Recetas pendientes
PATCH  /api/admin/recipes/:id/approve      - Aprobar receta
PATCH  /api/admin/recipes/:id/reject       - Rechazar receta
GET    /api/admin/recipes                  - Todas las recetas
GET    /api/admin/users                    - Listar usuarios
POST   /api/admin/users                    - Crear usuario
PATCH  /api/admin/users/:id                - Editar usuario
PATCH  /api/admin/users/:id/role           - Cambiar rol
DELETE /api/admin/users/:id                - Eliminar usuario
```

## Notas de Desarrollo

- Las migraciones se ejecutan automáticamente en orden por timestamp
- Los seeders crean datos de demo (usuarios, recetas, ingredientes, etc.)
- Las recetas tienen soft delete (paranoid)
- JWT tokens expiran en 15min, refresh tokens en 7 días
