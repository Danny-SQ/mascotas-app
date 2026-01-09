# PetCare System - Sistema de Cuidado de Mascotas

Sistema completo para el registro y seguimiento de actividades de mascotas, similar a Homy Pett.

## Características

- Registro de múltiples mascotas por usuario
- Seguimiento de actividades: paseos, alimentación, medicamentos, visitas veterinarias
- Historial médico completo con vacunaciones
- Sistema de recordatorios recurrentes
- Autenticación segura con JWT

## Tecnologías

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Flask + SQLAlchemy
- **Base de datos**: PostgreSQL
- **Contenedores**: Docker + Docker Compose

## Requisitos previos

- Docker y Docker Compose instalados
- Git

## Inicio rápido

### Desarrollo

```bash
# Clonar el repositorio
git clone <repository-url>
cd petcare-system

# Copiar archivo de variables de entorno
cp .env.example .env

# Iniciar servicios en modo desarrollo
docker-compose -f docker-compose.dev.yml up --build

# El frontend estará en http://localhost:5173
# El backend estará en http://localhost:5000
# PostgreSQL estará en localhost:5432
```

### Producción

```bash
# Configurar variables de entorno de producción
# Asegúrate de cambiar SECRET_KEY y JWT_SECRET_KEY

# Iniciar servicios
docker-compose up --build -d

# La aplicación estará en http://localhost:80
```

## Migraciones de base de datos

```bash
# Acceder al contenedor del backend
docker exec -it petcare_backend bash

# Crear migración
flask db migrate -m "Descripción del cambio"

# Aplicar migraciones
flask db upgrade
```

## Estructura del proyecto

```
petcare-system/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── __init__.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/refresh` - Refrescar token
- `GET /api/auth/me` - Obtener usuario actual

### Mascotas
- `GET /api/pets` - Listar mascotas
- `POST /api/pets` - Crear mascota
- `GET /api/pets/:id` - Obtener mascota
- `PUT /api/pets/:id` - Actualizar mascota
- `DELETE /api/pets/:id` - Eliminar mascota

### Actividades
- `GET /api/activities/pet/:petId` - Listar actividades
- `POST /api/activities` - Crear actividad
- `PUT /api/activities/:id` - Actualizar actividad
- `DELETE /api/activities/:id` - Eliminar actividad

### Recordatorios
- `GET /api/reminders/pet/:petId` - Listar recordatorios
- `GET /api/reminders/upcoming` - Próximos recordatorios
- `POST /api/reminders` - Crear recordatorio
- `POST /api/reminders/:id/complete` - Completar recordatorio

### Historial Médico
- `GET /api/medical/records/pet/:petId` - Registros médicos
- `POST /api/medical/records` - Crear registro
- `GET /api/medical/vaccinations/pet/:petId` - Vacunas
- `POST /api/medical/vaccinations` - Registrar vacuna
- `GET /api/medical/summary/pet/:petId` - Resumen médico

## Licencia

MIT
