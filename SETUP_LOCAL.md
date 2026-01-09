# 🔧 Setup Local de PetCare

Instrucciones para ejecutar el proyecto localmente antes de hacer deploy.

## Requisitos Previos

- Node.js 18+ (para el frontend)
- Python 3.11+ (para el backend)
- PostgreSQL 12+ (local)
- Docker y Docker Compose (opcional, para usar contenedores)

## Opción 1: Ejecutar localmente sin Docker

### 1. Backend Setup

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
cp .env.example .env

# Editar .env con tus datos de PostgreSQL local
# DATABASE_URL=postgresql://postgres:password@localhost:5432/petcare

# Crear base de datos (opcional)
createdb petcare

# Ejecutar migraciones (si las hay)
# flask db upgrade

# Iniciar servidor
python run.py
```

El backend estará en `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# .env debe tener:
# VITE_API_URL=http://localhost:5000/api

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará en `http://localhost:5173`

### 3. Pruebas

1. Abre `http://localhost:5173` en tu navegador
2. Crea una cuenta
3. Agrega una mascota
4. Prueba todas las funcionalidades

## Opción 2: Ejecutar con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up --build

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
# PostgreSQL: localhost:5432
```

Espera a que todos los servicios estén listos (verás logs sin errores).

## Troubleshooting Local

### Error: "Address already in use"
```bash
# Si el puerto 5000 está en uso:
lsof -i :5000  # Ver qué está usando el puerto
kill -9 <PID>  # Matar el proceso

# O cambiar el puerto en backend/run.py
app.run(host='0.0.0.0', port=5001)
```

### Error: "Database connection refused"
- Verifica que PostgreSQL esté corriendo
- Revisa que DATABASE_URL sea correcta en .env
- Crea manualmente la DB: `createdb petcare`

### Error: "Module not found"
```bash
cd backend
pip install -r requirements.txt
```

### Frontend no conecta al API
- Verifica que VITE_API_URL sea `http://localhost:5000/api`
- Abre la consola del navegador (F12) para ver errores de CORS
- Revisa los logs del backend para ver si recibe las solicitudes

## Próximo Paso

Una vez que todo funcione localmente, sigue la guía `DEPLOYMENT_GUIDE.md` para hacer deploy en producción.
