import { PawPrint, Download, Terminal, Database, Server, Layout, Bell, FileText, CheckCircle } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">PetCare System</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <PawPrint className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sistema de Cuidado de Mascotas</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Aplicación completa para registrar y gestionar todas las actividades de tus mascotas: visitas al
            veterinario, paseos, alimentación, medicamentos y más.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#instrucciones"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              Ver Instrucciones de Instalación
            </a>
            <a
              href="#caracteristicas"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Ver Características
            </a>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Stack Tecnológico</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Layout className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Frontend</h3>
              <p className="text-sm text-gray-500 mt-1">Vite + React + TailwindCSS</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Server className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Backend</h3>
              <p className="text-sm text-gray-500 mt-1">Flask + SQLAlchemy + JWT</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Base de Datos</h3>
              <p className="text-sm text-gray-500 mt-1">PostgreSQL</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Terminal className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Contenedores</h3>
              <p className="text-sm text-gray-500 mt-1">Docker + Docker Compose</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="caracteristicas" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Características</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: PawPrint,
                title: "Múltiples Mascotas",
                description:
                  "Registra todas tus mascotas con su información detallada: especie, raza, peso, fecha de nacimiento.",
                color: "bg-orange-100 text-orange-600",
              },
              {
                icon: FileText,
                title: "Registro de Actividades",
                description: "Lleva un registro de paseos, alimentación, medicamentos y visitas al veterinario.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Bell,
                title: "Recordatorios",
                description:
                  "Crea recordatorios para vacunas, citas médicas y medicamentos con soporte para recurrencia.",
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                icon: FileText,
                title: "Historial Médico",
                description: "Mantén un registro completo de diagnósticos, tratamientos, cirugías y vacunaciones.",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Server,
                title: "Autenticación Segura",
                description: "Sistema de autenticación con JWT, contraseñas hasheadas y tokens de refresco.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Layout,
                title: "Diseño Responsive",
                description: "Interfaz moderna y adaptable a cualquier dispositivo: móvil, tablet o escritorio.",
                color: "bg-cyan-100 text-cyan-600",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Instructions */}
      <section id="instrucciones" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Instrucciones de Instalación</h2>
          <p className="text-gray-600 text-center mb-12">
            Este proyecto está diseñado para ejecutarse localmente con Docker.
          </p>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Descargar el proyecto</h3>
                  <p className="text-gray-600 mb-3">
                    Haz clic en los tres puntos en la esquina superior derecha del panel de código y selecciona
                    <strong> &quot;Download ZIP&quot;</strong> o usa el comando de shadcn CLI.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Configurar variables de entorno</h3>
                  <p className="text-gray-600 mb-3">Copia el archivo de ejemplo y personaliza según necesites:</p>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>cp .env.example .env</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ejecutar en modo desarrollo</h3>
                  <p className="text-gray-600 mb-3">Inicia todos los servicios con Docker Compose:</p>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>docker-compose -f docker-compose.dev.yml up --build</code>
                  </pre>
                  <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500">
                    <span>
                      <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" /> Frontend: http://localhost:5173
                    </span>
                    <span>
                      <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" /> Backend: http://localhost:5000
                    </span>
                    <span>
                      <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" /> PostgreSQL: localhost:5432
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ejecutar en producción</h3>
                  <p className="text-gray-600 mb-3">Para producción, usa el docker-compose principal:</p>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>docker-compose up --build -d</code>
                  </pre>
                  <p className="text-sm text-gray-500 mt-2">La aplicación estará disponible en http://localhost:80</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Migraciones de base de datos</h3>
                  <p className="text-gray-600 mb-3">
                    Flask-Migrate maneja las migraciones automáticamente. Para ejecutarlas manualmente:
                  </p>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`# Acceder al contenedor del backend
docker exec -it petcare_backend bash

# Crear migración
flask db migrate -m "Initial migration"

# Aplicar migraciones
flask db upgrade`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">API Endpoints</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Autenticación",
                endpoints: [
                  "POST /api/auth/register",
                  "POST /api/auth/login",
                  "POST /api/auth/refresh",
                  "GET /api/auth/me",
                ],
              },
              {
                title: "Mascotas",
                endpoints: [
                  "GET /api/pets",
                  "POST /api/pets",
                  "GET /api/pets/:id",
                  "PUT /api/pets/:id",
                  "DELETE /api/pets/:id",
                ],
              },
              {
                title: "Actividades",
                endpoints: [
                  "GET /api/activities/pet/:petId",
                  "POST /api/activities",
                  "PUT /api/activities/:id",
                  "DELETE /api/activities/:id",
                ],
              },
              {
                title: "Recordatorios",
                endpoints: [
                  "GET /api/reminders/pet/:petId",
                  "GET /api/reminders/upcoming",
                  "POST /api/reminders",
                  "POST /api/reminders/:id/complete",
                ],
              },
            ].map((group, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">{group.title}</h3>
                <ul className="space-y-2">
                  {group.endpoints.map((endpoint, i) => (
                    <li key={i} className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                      {endpoint}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PawPrint className="w-6 h-6 text-orange-500" />
            <span className="font-bold">PetCare System</span>
          </div>
          <p className="text-gray-400 text-sm">Sistema de cuidado de mascotas con Vite + Flask + PostgreSQL + Docker</p>
        </div>
      </footer>
    </div>
  )
}
