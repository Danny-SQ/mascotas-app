"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { petsAPI, remindersAPI } from "../services/api"
import { Card, CardContent, CardHeader } from "../components/ui/Card"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { PawPrint, Bell, Calendar, Plus, ChevronRight, Clock } from "lucide-react"
import { formatDate, getReminderTypeLabel } from "../lib/utils"

export default function DashboardPage() {
  const { user } = useAuth()
  const [pets, setPets] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, remindersRes] = await Promise.all([petsAPI.getAll(), remindersAPI.getUpcoming()])
        setPets(petsRes.data.pets)
        setReminders(remindersRes.data.reminders)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Hola, {user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-gray-600">Bienvenido al panel de control de tus mascotas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <Card className="bg-primary-500 text-white border-0">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <PawPrint className="w-7 h-7" />
            </div>
            <div>
              <p className="text-primary-100 text-sm">Mis Mascotas</p>
              <p className="text-3xl font-bold">{pets.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent-500 text-white border-0">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <p className="text-accent-100 text-sm">Recordatorios Pendientes</p>
              <p className="text-3xl font-bold">{reminders.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500 text-white border-0 sm:col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <p className="text-blue-100 text-sm">Hoy</p>
              <p className="text-xl font-bold">{formatDate(new Date())}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pets Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Mis Mascotas</h2>
            <Link to="/pets">
              <Button variant="ghost" size="sm">
                Ver todas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PawPrint className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">Aún no tienes mascotas registradas</p>
                <Link to="/pets">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Mascota
                  </Button>
                </Link>
              </div>
            ) : (
              pets.slice(0, 3).map((pet) => (
                <Link
                  key={pet.id}
                  to={`/pets/${pet.id}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                    {pet.photo_url ? (
                      <img
                        src={pet.photo_url || "/placeholder.svg"}
                        alt={pet.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <PawPrint className="w-7 h-7 text-primary-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                    <p className="text-sm text-gray-500">
                      {pet.species} {pet.breed && `- ${pet.breed}`}
                    </p>
                  </div>
                  <Badge variant="primary">{pet.activities_count} actividades</Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Próximos Recordatorios</h2>
            <Link to="/reminders">
              <Button variant="ghost" size="sm">
                Ver todos
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {reminders.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No tienes recordatorios pendientes</p>
              </div>
            ) : (
              reminders.slice(0, 4).map((reminder) => (
                <div key={reminder.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                    <p className="text-sm text-gray-500">
                      {reminder.pet_name} - {getReminderTypeLabel(reminder.reminder_type)}
                    </p>
                    <p className="text-xs text-primary-600 mt-1">{formatDate(reminder.due_date)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
