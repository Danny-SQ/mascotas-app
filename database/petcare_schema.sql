-- Script de inicialización para Supabase PostgreSQL
-- Ejecuta este script en el SQL Editor de Supabase

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Tabla de mascotas
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    date_of_birth DATE,
    weight DECIMAL(5, 2),
    color VARCHAR(100),
    microchip_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_user_id ON pets(user_id);

-- Tabla de actividades (paseos, comidas, medicinas)
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'walk', 'feeding', 'medication', 'vet_visit'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    location VARCHAR(200),
    date_time TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_pet_id ON activities(pet_id);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_datetime ON activities(date_time);

-- Tabla de recordatorios
CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    reminder_type VARCHAR(50) NOT NULL, -- 'vet_appointment', 'vaccination', 'medication', 'grooming', 'feeding'
    due_date DATE NOT NULL,
    due_time TIME,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'yearly'
    recurrence_end_date DATE,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reminders_pet_id ON reminders(pet_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_reminders_completed ON reminders(is_completed);

-- Tabla de registros médicos
CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL, -- 'diagnosis', 'treatment', 'surgery', 'allergy', 'general'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    diagnosis TEXT,
    treatment TEXT,
    vet_name VARCHAR(100),
    clinic_name VARCHAR(100),
    record_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_medical_records_type ON medical_records(record_type);

-- Tabla de vacunaciones
CREATE TABLE vaccinations (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    vaccine_name VARCHAR(100) NOT NULL,
    administration_date DATE NOT NULL,
    expiration_date DATE,
    vet_name VARCHAR(100),
    clinic_name VARCHAR(100),
    batch_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vaccinations_pet_id ON vaccinations(pet_id);
CREATE INDEX idx_vaccinations_expiration ON vaccinations(expiration_date);
