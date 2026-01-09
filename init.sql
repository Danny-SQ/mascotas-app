-- Initial database setup for PetCare System

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created by Flask-Migrate
-- This file is for any initial setup or seed data

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE petcare TO postgres;
