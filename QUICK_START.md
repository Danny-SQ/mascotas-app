# ⚡ Quick Start - PetCare System

¿Quieres comenzar rápidamente? Sigue estos pasos:

## 1️⃣ Clonar el Repositorio

```bash
git clone <tu-repo>
cd petcare
```

## 2️⃣ Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edita `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/petcare
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173
```

Inicia el backend:
```bash
python run.py
```

## 3️⃣ Setup Frontend

En otra terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 4️⃣ ¡Listo!

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

Crea una cuenta y comienza a usar PetCare! 🎉

## Hacer Deploy a Producción

Lee `DEPLOYMENT_GUIDE.md` para instrucciones detalladas.

### Resumen Rápido:
1. **Docker Hub**: `cd backend && ./build-and-push.sh tu-usuario`
2. **Render**: Crea Web Service con imagen Docker + env vars
3. **Supabase**: Ejecuta `database/petcare_schema.sql`
4. **Netlify**: Conecta tu repo + configura build

Más detalles en `DEPLOYMENT_GUIDE.md` 📚
