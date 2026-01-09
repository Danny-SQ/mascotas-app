# 🚀 Guía de Deployment - PetCare System

Esta guía te ayudará a desplegar el sistema PetCare en producción utilizando Supabase, Netlify, Docker Hub y Render.

## Arquitectura de Deploy

```
┌─────────────────────────────────────────────────────────┐
│ Frontend (Netlify)                                      │
│ https://your-app.netlify.app                            │
└──────────────────┬──────────────────────────────────────┘
                   │ (API Calls)
                   │
        ┌──────────▼──────────┐
        │  Backend (Render)   │
        │  https://your-api   │
        └──────────┬──────────┘
                   │ (SQL Queries)
                   │
        ┌──────────▼──────────────┐
        │ Database (Supabase)     │
        │ PostgreSQL              │
        └─────────────────────────┘
```

## Paso 1: Preparar la Base de Datos en Supabase

### 1.1 Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "New Project"
3. Completa los datos del proyecto
4. Espera a que se cree la base de datos

### 1.2 Obtener credenciales
1. En Supabase, ve a Settings → Database → Connection string
2. Copia la URL de conexión (asegúrate de usar el formato PostgreSQL)
3. La URL será algo como: `postgresql://postgres:[password]@[host]:[port]/postgres`

### 1.3 Ejecutar el script SQL
1. Ve a SQL Editor en Supabase
2. Crea una nueva query
3. Copia el contenido de `database/petcare_schema.sql`
4. Ejecuta el script
5. Verifica que todas las tablas se hayan creado correctamente

## Paso 2: Backend - Crear Imagen Docker y Subir a Docker Hub

### 2.1 Instalar Docker
- Descarga e instala Docker desde [docker.com](https://docker.com)
- Verifica: `docker --version`

### 2.2 Crear cuenta en Docker Hub
1. Ve a [hub.docker.com](https://hub.docker.com)
2. Crea una cuenta gratuita
3. Anota tu nombre de usuario

### 2.3 Construir y subir imagen
```bash
cd backend

# Hacer el script ejecutable (Linux/Mac)
chmod +x build-and-push.sh

# Ejecutar el script (reemplaza <username> con tu usuario de Docker Hub)
./build-and-push.sh <username>

# En Windows, ejecuta manualmente:
docker build -f Dockerfile -t <username>/petcare-backend:latest .
docker login
docker push <username>/petcare-backend:latest
```

Después de esto, tu imagen estará disponible en Docker Hub como:
```
<username>/petcare-backend:latest
```

## Paso 3: Backend - Desplegar en Render

### 3.1 Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Crea una cuenta gratuita
3. Conecta tu cuenta de GitHub (opcional pero recomendado)

### 3.2 Crear Web Service desde Docker
1. En el dashboard de Render, haz clic en "New +"
2. Selecciona "Web Service"
3. Elige "Public Image Registry"
4. En el campo de imagen, escribe: `<username>/petcare-backend:latest`
5. Configura lo siguiente:
   - **Name**: petcare-backend
   - **Region**: Elige la más cercana a ti
   - **Plan**: Free (o Starter si necesitas mejor rendimiento)

### 3.3 Configurar variables de entorno en Render
En la sección "Environment", agrega estas variables:

```
FLASK_ENV=production
SECRET_KEY=<genera-una-cadena-aleatoria-segura>
JWT_SECRET_KEY=<genera-otra-cadena-aleatoria-segura>
DATABASE_URL=<copia-la-URL-de-Supabase>
CORS_ORIGINS=https://your-netlify-app.netlify.app,http://localhost:5173
WORKERS=4
```

**Para generar claves seguras, usa:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3.4 Esperar a que se despliegue
- Render automaticamente construirá y ejecutará el contenedor
- Verifica que el servicio esté "Live" (verde)
- Copia la URL del servicio (será algo como: `https://petcare-backend-xxxxx.onrender.com`)

## Paso 4: Frontend - Desplegar en Netlify

### 4.1 Preparar el código del frontend
1. Actualiza `frontend/.env.example` con tu URL de Render:
```env
VITE_API_URL=https://petcare-backend-xxxxx.onrender.com/api
```

2. Copia este contenido a `frontend/.env.production`

### 4.2 Crear cuenta en Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Haz clic en "Sign up"
3. Usa GitHub o tu email

### 4.3 Desplegar en Netlify (Opción 1: Conexión GitHub)
1. Sube tu proyecto a GitHub
2. En Netlify, haz clic en "Add new site" → "Import an existing project"
3. Conecta tu repositorio de GitHub
4. Configura lo siguiente:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Environment variables**:
     ```
     VITE_API_URL=https://petcare-backend-xxxxx.onrender.com/api
     ```
5. Haz clic en "Deploy"

### 4.4 Desplegar en Netlify (Opción 2: Drag and Drop)
1. Construye localmente: `cd frontend && npm run build`
2. En Netlify, arrastra la carpeta `frontend/dist`
3. Configura las variables de entorno después en Site settings

### 4.5 Configurar dominio personalizado (opcional)
1. Ve a Site settings → Domain settings
2. Haz clic en "Add custom domain"
3. Sigue las instrucciones para configurar tu dominio

## Paso 5: Verificar Conexiones

### 5.1 Prueba el backend
```bash
curl https://petcare-backend-xxxxx.onrender.com/health
# Debería responder: {"status":"ok"}
```

### 5.2 Prueba el frontend
1. Abre tu sitio en Netlify
2. Intenta registrarte e iniciar sesión
3. Verifica que las actividades se guarden correctamente

### 5.3 Verificar logs
- **Backend (Render)**: Ve a "Logs" en el dashboard de Render
- **Frontend (Netlify)**: Ve a "Deploys" y haz clic en el deploy

## Paso 6: Solución de Problemas

### Error de CORS
Si ves errores de CORS en la consola:
1. Ve a Render → Environment variables
2. Actualiza `CORS_ORIGINS` con la URL correcta de Netlify:
```
CORS_ORIGINS=https://your-netlify-domain.netlify.app
```
3. Redeploy el servicio

### Error de conexión a base de datos
1. Verifica que `DATABASE_URL` sea correcto en Render
2. Asegúrate de que Supabase esté activo
3. Revisa los logs de Render para más detalles

### Backend tarda en responder
- El plan Free de Render se ralentiza después de inactividad
- Upgrade a Starter si necesitas mejor rendimiento
- Considera agregar un uptime monitor

### Variables de entorno no se aplican
1. Después de cambiar variables de entorno en Render, debes "Redeploy"
2. En Render, haz clic en "Redeploy" en la sección de deploys

## Actualizar el Backend

Cuando hagas cambios en el código:

```bash
# Construir nueva imagen
cd backend
./build-and-push.sh <username>

# En Render, automáticamente detectará la nueva imagen (si está configurado)
# O manualmente ve a "Manual deploy" y selecciona la nueva imagen
```

## Monitoreo en Producción

### Logs de Backend (Render)
- Ve al dashboard de Render
- Haz clic en tu Web Service
- Ve a "Logs"

### Logs de Frontend (Netlify)
- Ve al dashboard de Netlify
- Haz clic en tu sitio
- Ve a "Deploys" y selecciona el deploy activo

### Health Check
```bash
# Verificar que el backend está vivo
curl https://your-api-url.onrender.com/health
```

## Seguridad en Producción

✅ **Hacer:**
- Cambiar todas las claves `SECRET_KEY` y `JWT_SECRET_KEY` en producción
- Usar HTTPS (automático en Render y Netlify)
- Configurar CORS correctamente
- Monitorear logs regularmente

❌ **No hacer:**
- Usar las claves por defecto de desarrollo
- Exponer DATABASE_URL en el frontend
- Desactivar JWT verification
- Permitir CORS desde cualquier origen (`*`)

## Próximos Pasos

1. **Agregar dominio personalizado**: Configura un dominio propio en ambas plataformas
2. **CI/CD avanzado**: Usa GitHub Actions para automatizar deployments
3. **Monitoreo**: Configura alerts en Sentry o similar
4. **Backup de BD**: Configura backups automáticos en Supabase
5. **API Rate Limiting**: Implementa rate limiting en Flask

## Contacto y Soporte

- Documentación de Render: https://render.com/docs
- Documentación de Netlify: https://docs.netlify.com
- Documentación de Supabase: https://supabase.com/docs
- Documentación de Flask: https://flask.palletsprojects.com

---

**¡Tu sistema PetCare está ahora en producción! 🎉**
