"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { PawPrint } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      await register(name, email, password)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear la cuenta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:flex-1 bg-accent-500 items-center justify-center p-12">
        <div className="max-w-lg text-center text-white">
          <img src="/pets-playing-illustration-colorful.jpg" alt="Mascotas jugando" className="w-64 h-64 mx-auto mb-8 rounded-3xl" />
          <h2 className="text-3xl font-bold mb-4">Únete a PetCare</h2>
          <p className="text-accent-100 text-lg">
            Miles de dueños de mascotas ya confían en nosotros para mantener el registro de la salud y actividades de
            sus compañeros.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center">
                <PawPrint className="w-9 h-9 text-white" />
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Crea tu cuenta</h1>
            <p className="mt-2 text-gray-600">Empieza a cuidar mejor de tus mascotas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Nombre completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan García"
              required
            />

            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
            />

            <Button type="submit" variant="success" className="w-full" loading={loading}>
              Crear Cuenta
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-medium text-accent-600 hover:text-accent-500">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
