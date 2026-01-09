"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { petsAPI, activitiesAPI, medicalAPI, remindersAPI } from "../services/api"
import { Card, CardContent, CardHeader } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import {
  ArrowLeft,
  PawPrint,
  Calendar,
  Weight,
  Palette,
  Activity,
  Stethoscope,
  Bell,
  ChevronRight,
  Footprints,
  Utensils,
  Pill,
  Syringe,
} from "lucide-react"
import { formatDate, formatDateTime, getActivityTypeLabel } from "../lib/utils"

export default function PetDetailPage() {
  const { petId } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [medicalSummary, setMedicalSummary] = useState(null)
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petRes, activitiesRes, medicalRes, remindersRes] = await Promise.all([
          petsAPI.getOne(petId),
          activitiesAPI.getByPet(petId, { limit: 5 }),
          medicalAPI.getSummary(petId),
          remindersAPI.getByPet(petId),
        ])

        setPet(petRes.data.pet)
        setRecentActivities(activitiesRes.data.activities)
        setMedicalSummary(medicalRes.data.summary)
        setReminders(remindersRes.data.reminders)
      } catch (error) {
        console.error("Error fetching pet data:", error)
        navigate("/pets")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [petId, navigate])

  const getActivityIcon = (type) => {
    const icons = {
      walk: Footprints,
      feeding: Utensils,
      medication: Pill,
      vet_visit: Stethoscope,
    }
    return icons[type] || Activity
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!pet) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/pets")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver a mis mascotas</span>
      </button>

      {/* Pet Header */}
      <Card>
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-primary-100 rounded-3xl flex items-center justify-center flex-shrink-0">
              {pet.photo_url ? (
                <img
                  src={pet.photo_url || "/placeholder.svg"}
                  alt={pet.name}
                  className="w-full h-full rounded-3xl object-cover"
                />
              ) : (
                <PawPrint className="w-12 h-12 lg:w-16 lg:h-16 text-primary-500" />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-lg text-gray-500 capitalize mt-1">
                {pet.species} {pet.breed && `- ${pet.breed}`}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                {pet.birth_date && (
                  <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(pet.birth_date)}
                  </Badge>
                )}
                {pet.weight && (
                  <Badge variant="info" className="flex items-center gap-1.5 px-3 py-1.5">
                    <Weight className="w-4 h-4" />
                    {pet.weight} kg
                  </Badge>
                )}
                {pet.color && (
                  <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1.5">
                    <Palette className="w-4 h-4" />
                    {pet.color}
                  </Badge>
                )}
              </div>

              {pet.notes && <p className="mt-4 text-gray-600">{pet.notes}</p>}
            </div>

            <div className="flex flex-col gap-2 lg:flex-shrink-0">
              <Link to={`/pets/${petId}/activities`}>
                <Button className="w-full lg:w-auto">
                  <Activity className="w-4 h-4 mr-2" />
                  Registrar Actividad
                </Button>
              </Link>
              <Link to={`/pets/${petId}/medical`}>
                <Button variant="outline" className="w-full lg:w-auto bg-transparent">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Historial Médico
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-primary-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{pet.activities_count}</p>
            <p className="text-sm text-gray-500">Actividades</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Stethoscope className="w-6 h-6 text-accent-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{medicalSummary?.total_records || 0}</p>
            <p className="text-sm text-gray-500">Registros Médicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Syringe className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{medicalSummary?.total_vaccinations || 0}</p>
            <p className="text-sm text-gray-500">Vacunas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
            <p className="text-sm text-gray-500">Recordatorios</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Actividades Recientes</h2>
            <Link to={`/pets/${petId}/activities`}>
              <Button variant="ghost" size="sm">
                Ver todas
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay actividades registradas</p>
              </div>
            ) : (
              recentActivities.map((activity) => {
                const Icon = getActivityIcon(activity.activity_type)
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{getActivityTypeLabel(activity.activity_type)}</p>
                    </div>
                    <p className="text-xs text-gray-400">{formatDateTime(activity.date)}</p>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Pending Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recordatorios Pendientes</h2>
            <Link to="/reminders">
              <Button variant="ghost" size="sm">
                Ver todos
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay recordatorios pendientes</p>
              </div>
            ) : (
              reminders.slice(0, 5).map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{reminder.title}</h4>
                    <p className="text-sm text-primary-600">{formatDate(reminder.due_date)}</p>
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
