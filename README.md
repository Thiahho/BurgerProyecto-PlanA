# Digital Catalog - Proyecto Burger

Sistema de catálogo digital con panel de administración para gestión de productos y configuración del negocio.

## 🚀 Stack Tecnológico

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS

**Backend:**
- .NET 8
- ASP.NET Core Web API
- PostgreSQL
- Entity Framework Core
- JWT Authentication
- ImageSharp (procesamiento de imágenes)

## 📋 Requisitos Previos

- Node.js 18+ y npm
- .NET 8 SDK
- PostgreSQL 14+

## 🔧 Configuración Local

### 1. Configurar Backend

1. Navega a la carpeta del backend:
```bash
cd Back
```

2. Copia el archivo de ejemplo y renómbralo:
```bash
cp appsettings.Example.json appsettings.json
```

3. Edita `appsettings.json` con tus credenciales reales:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=TU_BD;Username=TU_USUARIO;Password=TU_PASSWORD"
  },
  "Jwt": {
    "Key": "una_clave_secreta_muy_larga_y_aleatoria_minimo_32_caracteres"
  }
}
```

4. Restaura dependencias y ejecuta:
```bash
dotnet restore
dotnet run
```

El backend estará disponible en `http://localhost:5277`

### 2. Configurar Frontend

1. Instala dependencias:
```bash
npm install
```

2. Crea un archivo `.env` (opcional) si quieres usar una URL diferente para el backend:
```
VITE_API_URL=http://localhost:5277
```

3. Ejecuta el frontend:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🔒 Seguridad

**⚠️ IMPORTANTE:**
- **NUNCA** subas `appsettings.json` a GitHub (ya está en `.gitignore`)
- **NUNCA** subas archivos `.env` a GitHub
- Cambia todas las credenciales por defecto antes de desplegar a producción
- Genera una clave JWT segura de al menos 32 caracteres

## 🗄️ Base de Datos

El sistema utiliza PostgreSQL. Las tablas se crean automáticamente al iniciar el backend por primera vez.

**Credenciales de administrador por defecto:**
- Usuario: `admin`
- Contraseña: La configurada en `appsettings.json` → `Admin.Password`

## 📦 Despliegue a Producción

### Frontend (Vercel)

1. Construye el proyecto:
```bash
npm run build
```

2. Despliega a Vercel:
```bash
vercel
```

3. Configura la variable de entorno en Vercel:
```
VITE_API_URL=https://tu-backend-url.onrender.com
```

### Backend (Render)

1. Crea una base de datos PostgreSQL en Render

2. Configura las variables de entorno en Render:
```
ConnectionStrings__DefaultConnection=tu_connection_string_de_render
Jwt__Key=tu_clave_jwt_secreta
Jwt__Issuer=DigitalCatalog.Api
Jwt__Audience=DigitalCatalog.Frontend
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
```

3. Despliega el backend a Render

**Credenciales de admin por defecto:** usuario `admin`, contraseña `admin` (cámbiala después del primer despliegue)

## 🌐 Características

- ✅ Catálogo público de productos con categorías
- ✅ Panel de administración protegido con JWT
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de categorías (CRUD)
- ✅ Configuración del negocio (nombre, horarios, contacto)
- ✅ Banner estático personalizable
- ✅ Procesamiento automático de imágenes (WebP)
- ✅ Enlace directo a WhatsApp con mensaje predefinido
- ✅ Sesiones temporales (se cierran al cerrar el navegador)
- ✅ Responsive design

## 📱 WhatsApp

El sistema genera automáticamente enlaces de WhatsApp con el código de país +54 (Argentina) y el mensaje:
> "Hola, vengo desde la web. Quisiera hacer un pedido"

Para cambiar el código de país, edita `components/public/Footer.tsx`

## 🛠️ Desarrollo

**Scripts disponibles:**

Frontend:
```bash
npm run dev          # Desarrollo
npm run build        # Compilar para producción
npm run preview      # Preview de producción
```

Backend:
```bash
dotnet run           # Ejecutar en desarrollo
dotnet build         # Compilar
```

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 🤝 Contribuir

Este es un proyecto privado. No se aceptan contribuciones externas.
