# 📦 Despliegue PetCare - Guía Rápida

## Resumen
Este proyecto está configurado para desplegarse en:
- **Frontend**: Netlify
- **Backend**: Render (con imagen Docker desde Docker Hub)
- **Base de Datos**: Supabase PostgreSQL

## Archivos Importantes

### Backend
- `backend/Dockerfile` - Imagen Docker para Render
- `backend/.dockerignore` - Archivos a excluir de la imagen
- `backend/build-and-push.sh` - Script para construir y subir a Docker Hub
- `backend/config.py` - Configuración con variables de entorno
- `.env.example` - Variables de entorno necesarias

### Frontend
- `frontend/vite.config.js` - Configuración con proxy API
- `frontend/.env.example` - Variables de frontend
- `frontend/.env.production` - Variables de producción
- `frontend/package.json` - Scripts de build

### Base de Datos
- `database/petcare_schema.sql` - Script SQL para Supabase

## Pasos de Despliegue (Resumen)

```bash
# 1. Backend - Construir imagen Docker
cd backend
chmod +x build-and-push.sh
./build-and-push.sh <tu-usuario-docker-hub>

# 2. Esperar a que se suba a Docker Hub
# (Ver en https://hub.docker.com/<tu-usuario>/petcare-backend)

# 3. En Render: Crear Web Service con la imagen
# - URL de imagen: <tu-usuario>/petcare-backend:latest
# - Agregar variables de entorno (DATABASE_URL, CORS_ORIGINS, etc.)

# 4. En Supabase: Ejecutar script SQL
# - Ir a SQL Editor
# - Copiar contenido de database/petcare_schema.sql
# - Ejecutar

# 5. Frontend - Actualizar URL de API
# Editar frontend/.env.production:
VITE_API_URL=https://your-petcare-backend.onrender.com/api

# 6. Frontend - Desplegar en Netlify
# - Subir a GitHub
# - Conectar repo en Netlify
# - Build command: npm run build (en carpeta frontend)
# - Publish directory: frontend/dist
```

## Verificar que Todo Funciona

```bash
# 1. Prueba el health check del backend
curl https://your-backend.onrender.com/health

# 2. Abre el frontend en Netlify
# 3. Prueba registro e inicio de sesión
# 4. Crea una mascota y agrega actividades
```

Para más detalles, ve a `DEPLOYMENT_GUIDE.md`
