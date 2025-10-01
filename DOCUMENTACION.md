# Documentación Técnica - Yummy

## 🔐 Sistema de Autenticación

### Registro de Usuarios

El proceso de registro implementa las siguientes validaciones y pasos:

1. **Validación de Datos (Frontend)**:
   - Email válido con formato estándar (debe contener @, dominio válido)
   - Nombre: mínimo 2 caracteres
   - Contraseña: mínimo 8 caracteres, debe incluir:
     - Al menos 1 mayúscula
     - Al menos 1 minúscula
     - Al menos 1 número
     - Al menos 1 carácter especial

2. **Validación Backend (Zod)**:
   ```javascript
   const registerSchema = z.object({
     name: z.string().min(2, 'Name must be at least 2 characters'),
     email: z.string().email('Invalid email format'),
     password: z.string()
       .min(8, 'Password must be at least 8 characters')
       .regex(/[A-Z]/, 'Must contain uppercase')
       .regex(/[a-z]/, 'Must contain lowercase')
       .regex(/[0-9]/, 'Must contain number')
       .regex(/[^A-Za-z0-9]/, 'Must contain special character')
   });
   ```

3. **Proceso de Registro**:
   - Se validan los datos con Zod
   - Se verifica que el email no exista en la base de datos
   - Se hashea la contraseña con bcryptjs (10 rondas)
   - Se crea el usuario con rol 'user' por defecto
   - Se genera un token JWT con expiración de 7 días
   - Se retorna el usuario (sin contraseña) y el token

### Login de Usuarios

1. **Validación de Credenciales**:
   - Email con formato válido
   - Contraseña requerida (mínimo 1 carácter)

2. **Proceso de Login**:
   - Se busca el usuario por email
   - Se compara la contraseña con bcrypt.compare()
   - Se genera un token JWT válido por 7 días
   - Se retorna usuario y token
   - El token se guarda en localStorage (frontend)

3. **Manejo de Estado (Zustand)**:
   ```javascript
   // Se guarda en el store global
   - user (datos del usuario)
   - token (JWT)
   - isAuthenticated (booleano)
   ```

### Protección de Rutas

- **Middleware de Autenticación**: Verifica token JWT en header Authorization
- **Middleware de Admin**: Verifica que el usuario tenga rol 'admin'
- **Frontend**: ProtectedRoute y AdminRoute componentes

## ✅ Sistema de Validaciones

### Validaciones Implementadas

#### Email
- Formato estándar (con @)
- Debe tener dominio válido
- No puede estar duplicado en la DB

#### Contraseñas
- Mínimo 8 caracteres
- Debe contener mayúsculas
- Debe contener minúsculas
- Debe contener números
- Debe contener caracteres especiales (!@#$%^&*, etc.)

#### Recetas
- Título: 3-200 caracteres
- Descripción: 10-500 caracteres
- Tiempo de preparación: número positivo (min: 1)
- Porciones: número positivo (min: 1)
- Ingredientes: array no vacío, cada uno con nombre, cantidad y unidad
- Pasos: array no vacío de strings con mínimo 10 caracteres cada uno
- Categoría: enum predefinido (desayuno, almuerzo, cena, postre, snack)
- Dificultad: enum (fácil, media, difícil)

#### Usuarios (Admin)
- **Nombre**:
  - Mínimo 2 caracteres
  - Máximo 100 caracteres
  - Requerido
- **Email**:
  - Formato válido con @ y dominio
  - Único en la base de datos
  - Requerido
- **Contraseña** (al crear o actualizar):
  - Mínimo 8 caracteres
  - Debe contener al menos 1 mayúscula
  - Debe contener al menos 1 minúscula
  - Debe contener al menos 1 número
  - Debe contener al menos 1 carácter especial (!@#$%^&*, etc.)
  - Se hashea con bcryptjs antes de guardar
- **Rol**:
  - Valores permitidos: 'user' o 'admin'
  - Por defecto: 'user'
- **Avatar**:
  - Opcional
  - Puede ser URL externa o archivo subido
  - Si es archivo, debe cumplir validaciones de imágenes

#### Imágenes (Upload)
- **Tipos permitidos**: JPEG, JPG, PNG, WebP
- **Tamaño máximo**: 5MB (5242880 bytes)
- **Validación en backend**: Multer con fileFilter
- **Almacenamiento**: Directorio `backend/uploads/` con nombre único
- **Nombre de archivo**: `{fieldname}-{timestamp}-{random}.{ext}`
- **Acceso**: Servido como archivo estático en `/uploads/{filename}`
- **Errores comunes**:
  - `LIMIT_FILE_SIZE`: Archivo excede 5MB
  - `Invalid file type`: Tipo de archivo no permitido
  - `NO_FILE`: No se envió ningún archivo

### Herramientas de Validación

**Backend**: Zod (esquemas de validación tipados)
**Frontend**: React Hook Form + validación en tiempo real

## 🎨 Funcionalidades Implementadas

### Usuarios Públicos
1. **Registro y Login**: Sistema completo de autenticación
2. **Explorar Recetas**: Vista de todas las recetas aprobadas
3. **Ver Detalle**: Página detallada de cada receta con ingredientes, pasos, etc.
4. **Buscar/Filtrar**: Búsqueda por nombre, filtros por categoría y dificultad
5. **Favoritos**: Sistema de favoritos para recetas (requiere login)

### Usuarios Autenticados
1. **Crear Recetas**: Formulario completo con validaciones
2. **Mis Recetas**: Ver, editar y eliminar recetas propias
3. **Editar Recetas**: Actualizar recetas existentes
4. **Subir Imágenes**: Sistema de upload para fotos de recetas
5. **Perfil**: Ver y editar información personal, avatar

### Administradores
1. **Dashboard**: Estadísticas generales (usuarios, recetas por estado)
2. **Gestión de Recetas Pendientes**: Aprobar/rechazar con razón
3. **Todas las Recetas**: Ver, editar, eliminar cualquier receta, filtrar por estado
4. **Gestión de Usuarios**: CRUD completo de usuarios
   - Crear usuarios con contraseña
   - Editar información, cambiar rol
   - Subir avatar
   - Eliminar usuarios
5. **Panel Admin Responsive**: Sidebar con offcanvas en móvil

### Sistema de Estados de Recetas
- **draft**: Borrador (no visible públicamente)
- **pending**: Pendiente de aprobación por admin
- **approved**: Aprobada (visible públicamente)
- **rejected**: Rechazada (con razón de rechazo)

## 🏗️ Arquitectura del Proyecto

### Backend (Laravel-style)

```
backend/src/
├── controllers/      # Manejan requests HTTP
├── services/         # Lógica de negocio
├── routes/           # Definición de endpoints
├── validators/       # Esquemas Zod
├── middleware/       # Auth, admin, etc.
├── db/
│   ├── models/       # Modelos Sequelize
│   ├── migrations/   # Migraciones DB
│   └── seeders/      # Datos de prueba
└── utils/            # Helpers, responses
```

### Frontend (Feature-based)

```
frontend/src/
├── app/
│   ├── layouts/      # Layouts principales
│   └── routes/       # Configuración de rutas
├── features/
│   ├── admin/        # Módulo admin
│   ├── auth/         # Módulo auth
│   └── recipes/      # Módulo recetas
└── shared/
    ├── api/          # Clientes API
    ├── components/   # Componentes compartidos
    ├── hooks/        # Custom hooks
    └── stores/       # Estado global (Zustand)
```

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** + Express.js
- **MySQL** 8.0 con Sequelize ORM
- **bcryptjs** para hashing de contraseñas
- **jsonwebtoken** para autenticación
- **Zod** para validaciones
- **multer** para upload de archivos
- **Docker** para containerización

### Frontend
- **React** 18 con Vite
- **TailwindCSS** para estilos
- **TanStack Query** (React Query) para server state
- **Zustand** para client state
- **React Hook Form** para formularios
- **Axios** para requests HTTP
- **React Router** v6 para navegación
- **Lucide React** para iconos

## 🎯 Principios de Diseño

- **SOLID**: Separación de responsabilidades (controllers, services)
- **KISS**: Código simple y legible
- **DRY**: Reutilización de componentes y lógica
- **Mobile-first**: Diseño responsive con offcanvas en móvil
- **Security**: Hash de passwords, JWT, validaciones en backend y frontend

## 🚀 Reglas de Negocio

1. **Usuarios regulares** solo pueden:
   - Ver recetas aprobadas
   - Crear/editar sus propias recetas
   - Ver sus favoritos

2. **Admins** pueden:
   - Todo lo de usuarios regulares
   - Aprobar/rechazar cualquier receta
   - Ver todas las recetas (cualquier estado)
   - Gestionar usuarios (CRUD completo)

3. **Recetas**:
   - Solo las aprobadas son públicas
   - El autor puede editar sus recetas (vuelven a pending)
   - Los admins pueden editar sin cambiar el estado

4. **Validaciones de seguridad**:
   - Tokens JWT con expiración
   - Passwords hasheados (nunca en texto plano)
   - Validación en backend (nunca confiar solo en frontend)
   - Sanitización de inputs
