# 🚀 Despliegue en Render - Guía Completa

## 📋 Requisitos Previos

1. Base de datos PostgreSQL creada en Render
2. Cuenta de Render activa
3. Repositorio de GitHub conectado

---

## 🗄️ Paso 1: Crear Base de Datos PostgreSQL

1. En Render Dashboard, clic en **"New +"** → **"PostgreSQL"**
2. Nombre: `burger-database` (o el que prefieras)
3. Región: Selecciona la más cercana a tus usuarios
4. Plan: Free o el que necesites
5. Clic en **"Create Database"**
6. **Copia la "Internal Database URL"** - la necesitarás para las variables de entorno

---

## 🐳 Paso 2: Configurar Web Service

1. En Render Dashboard, clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: `burger-backend` (o el que prefieras)
   - **Region**: Misma que la base de datos
   - **Branch**: `master`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `Dockerfile` (por defecto)
   - **Docker Build Context Directory**: `.` (raíz del proyecto)

---

## 🔐 Paso 3: Variables de Entorno en Render

En la sección **"Environment"** de tu Web Service, agrega estas variables:

### 🔑 Variables Obligatorias:

```bash
# ============================================
# CONEXIÓN A LA BASE DE DATOS
# ============================================
ConnectionStrings__DefaultConnection
Valor: <Pega aquí tu "Internal Database URL" de PostgreSQL>
# Ejemplo: postgresql://user:password@hostname:5432/database


# ============================================
# JWT (IMPORTANTE: Genera una clave aleatoria)
# ============================================
Jwt__Key
Valor: <Clave secreta de mínimo 32 caracteres aleatorios>
# Ejemplo: kL9mN2pQ5rT8vW0yZ3bC6dF1gH4jK7lM9nP2qR5sT8uV

Jwt__Issuer
Valor: DigitalCatalog.Api

Jwt__Audience
Valor: DigitalCatalog.Frontend


# ============================================
# CONFIGURACIÓN DE ASP.NET CORE
# ============================================
ASPNETCORE_ENVIRONMENT
Valor: Production

ASPNETCORE_URLS
Valor: http://+:8080
```

### 📝 Notas Importantes:

- **ConnectionStrings\_\_DefaultConnection**: Usa doble guión bajo `__` en lugar de `:` para jerarquías JSON
- **Jwt\_\_Key**: Genera una clave aleatoria segura. Puedes usar:

  ```bash
  # En PowerShell:
  -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

  # Online: https://passwordsgenerator.net/ (selecciona 32+ caracteres)
  ```

- **Usuario Admin**: Se crea automáticamente con usuario `y contraseña`. Cámbiala después del primer despliegue.

---

## 🔧 Paso 4: Configuración Adicional

### Build Command (Opcional):

Si Render pide Build Command, déjalo **vacío** (Docker se encarga)

### Start Command (Opcional):

Si Render pide Start Command, déjalo **vacío** (definido en Dockerfile)

### Health Check Path (Recomendado):

```
/api/public/catalog
```

### Puerto:

Render asigna automáticamente el puerto. El Dockerfile ya está configurado para usar el puerto 8080.

---

## 🚀 Paso 5: Desplegar

1. Revisa todas las variables de entorno
2. Clic en **"Create Web Service"**
3. Render comenzará a construir la imagen Docker
4. Espera a que el deploy termine (5-10 minutos la primera vez)

---

## ✅ Paso 6: Verificar el Despliegue

Una vez desplegado, verifica:

1. **Endpoint de salud**:

   ```
   https://tu-app.onrender.com/api/public/catalog
   ```

   Debe devolver el catálogo público

2. **Login**:

   ```bash
   POST https://tu-app.onrender.com/api/auth/login
   Body: {
     "Usuario": "",
     "Password": ""
   }
   ```

   Debe devolver un token JWT (después cámbiala por seguridad)

3. **Swagger** (si está en Development):
   ```
   https://tu-app.onrender.com/swagger
   ```

---

## 🌐 Paso 7: Configurar CORS para Frontend

Una vez que tengas la URL de Render, actualiza el código del backend:

**En `Program.cs`, línea 64-73:**

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.WithOrigins("https://tu-frontend.vercel.app") // Cambia esto
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});
```

Luego haz commit y push para redesplegar.

---

## 🐛 Troubleshooting

### Error: "Application failed to start"

- Verifica que todas las variables de entorno estén configuradas correctamente
- Revisa los logs en Render Dashboard → tu servicio → "Logs"

### Error: "Connection refused" o "Database error"

- Verifica que `ConnectionStrings__DefaultConnection` sea la "Internal Database URL"
- Asegúrate de que la base de datos esté en la misma región

### Error: "Unauthorized" al hacer login

- Usa usuario `admin` y contraseña `admin` (creados automáticamente)
- Verifica que `Jwt__Key` tenga al menos 32 caracteres
- Verifica que la tabla Users exista en la base de datos

### La imagen del banner no se ve

- El banner estático debe estar en `Back/wwwroot/img/banner2.webp`
- Verifica que el Dockerfile copie correctamente la carpeta wwwroot

---

## 📊 Monitoreo

En Render Dashboard puedes:

- Ver logs en tiempo real
- Configurar alertas
- Ver métricas de rendimiento
- Configurar auto-scaling (planes de pago)

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a tu rama `master`, Render:

1. Detectará el cambio automáticamente
2. Reconstruirá la imagen Docker
3. Desplegará la nueva versión
4. Sin downtime (con planes de pago)

---

## 💰 Costos

- **Free Tier**: 750 horas/mes (suficiente para 1 servicio 24/7)
- **Limitaciones Free**:
  - Se duerme después de 15 minutos sin actividad
  - Primer request tarda ~30 segundos en "despertar"
  - 512 MB RAM

Para evitar que se duerma, considera el plan Starter ($7/mes).

---

## ✨ ¡Listo!

Tu backend ahora está en producción. Copia la URL de Render y úsala para configurar el frontend en Vercel.

**URL del backend**: `https://tu-app.onrender.com`

Configura esta URL en Vercel como variable de entorno:

```
VITE_API_URL=https://tu-app.onrender.com
```
