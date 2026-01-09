"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { petsAPI, activitiesAPI } from "../services/api"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Modal } from "../components/ui/Modal"
import { Badge } from "../components/ui/Badge"
import { ArrowLeft, Plus, Footprints, Utensils, Pill, Stethoscope, Activity, Trash2, Filter } from "lucide-react"
import { formatDateTime, getActivityTypeLabel } from "../lib/utils"

const activityTypes = [
  { value: "", label: "Todos los tipos" },
  { value: "walk", label: "Paseo" },
  { value: "feeding", label: "Alimentación" },
  { value: "medication", label: "Medicamento" },
  { value: "vet_visit", label: "Visita Veterinaria" },
  { value: "grooming", label: "Aseo" },
  { value: "training", label: "Entrenamiento" },
  { value: "play", label: "Juego" },
  { value: "other", label: "Otro" },
]

const initialFormState = {
  activity_type: "walk",
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 16),
  duration_minutes: "",
  distance_km: "",
  food_type: "",
  food_amount: "",
  medication_name: "",
  medication_dose: "",
  vet_clinic: "",
  vet_diagnosis: "",
  cost: "",
  notes: "",
}

export default function ActivitiesPage() {
  const { petId } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    fetchData()
  }, [petId, filterType])

  const fetchData = async () => {
    try {
      const [petRes, activitiesRes] = await Promise.all([
        petsAPI.getOne(petId),
        activitiesAPI.getByPet(petId, { type: filterType || undefined }),
      ])
      setPet(petRes.data.pet)
      setActivities(activitiesRes.data.activities)
    } catch (error) {
      console.error("Error fetching data:", error)
      navigate("/pets")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")

    try {
      const dataToSend = {
        ...formData,
        pet_id: Number.parseInt(petId),
        duration_minutes: formData.duration_minutes ? Number.parseInt(formData.duration_minutes) : null,
        distance_km: formData.distance_km ? Number.parseFloat(formData.distance_km) : null,
        cost: formData.cost ? Number.parseFloat(formData.cost) : null,
      }

      await activitiesAPI.create(dataToSend)
      setIsModalOpen(false)
      setFormData(initialFormState)
      fetchData()
    } catch (error) {
      setFormError(error.response?.data?.error || "Error al guardar la actividad")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (activityId) => {
    if (!window.confirm("¿Eliminar esta actividad?")) return

    try {
      await activitiesAPI.delete(activityId)
      fetchData()
    } catch (error) {
      console.error("Error deleting activity:", error)
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      walk: Footprints,
      feeding: Utensils,
      medication: Pill,
      vet_visit: Stethoscope,
    }
    return icons[type] || Activity
  }

  const getActivityColor = (type) => {
    const colors = {
      walk: "bg-green-100 text-green-600",
      feeding: "bg-orange-100 text-orange-600",
      medication: "bg-purple-100 text-purple-600",
      vet_visit: "bg-blue-100 text-blue-600",
      grooming: "bg-pink-100 text-pink-600",
      training: "bg-yellow-100 text-yellow-600",
      play: "bg-cyan-100 text-cyan-600",
      other: "bg-gray-100 text-gray-600",
    }
    return colors[type] || colors.other
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(`/pets/${petId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a {pet?.name}</span>
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Actividades de {pet?.name}</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Actividad
        </Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-5 h-5 text-gray-400" />
        <Select
          options={activityTypes}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Activities List */}
      <Card>
        <CardContent className="divide-y divide-gray-100">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay actividades</h3>
              <p className="text-gray-500 mb-4">
                {filterType ? "No hay actividades de este tipo" : "Registra la primera actividad de tu mascota"}
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.activity_type)
              return (
                <div key={activity.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.activity_type)}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <Badge variant="default" className="mt-1">
                          {getActivityTypeLabel(activity.activity_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 flex-shrink-0">{formatDateTime(activity.date)}</p>
                    </div>

                    {activity.description && <p className="text-gray-600 mt-2">{activity.description}</p>}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {activity.duration_minutes && <Badge variant="info">{activity.duration_minutes} min</Badge>}
                      {activity.distance_km && <Badge variant="success">{activity.distance_km} km</Badge>}
                      {activity.food_type && <Badge variant="warning">{activity.food_type}</Badge>}
                      {activity.medication_name && <Badge variant="primary">{activity.medication_name}</Badge>}
                      {activity.vet_clinic && <Badge variant="info">{activity.vet_clinic}</Badge>}
                      {activity.cost && <Badge variant="default">${activity.cost}</Badge>}
                    </div>

                    {activity.notes && <p className="text-sm text-gray-500 mt-2 italic">Notas: {activity.notes}</p>}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleDelete(activity.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* New Activity Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Actividad" size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tipo de actividad *"
              name="activity_type"
              value={formData.activity_type}
              onChange={handleInputChange}
              options={activityTypes.slice(1)}
            />
            <Input
              label="Fecha y hora *"
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <Input
            label="Título *"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ej: Paseo por el parque"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Campos específicos por tipo */}
          {formData.activity_type === "walk" && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duración (minutos)"
                type="number"
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleInputChange}
              />
              <Input
                label="Distancia (km)"
                type="number"
                step="0.1"
                name="distance_km"
                value={formData.distance_km}
                onChange={handleInputChange}
              />
            </div>
          )}

          {formData.activity_type === "feeding" && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tipo de alimento"
                name="food_type"
                value={formData.food_type}
                onChange={handleInputChange}
                placeholder="Ej: Croquetas, comida húmeda"
              />
              <Input
                label="Cantidad"
                name="food_amount"
                value={formData.food_amount}
                onChange={handleInputChange}
                placeholder="Ej: 200g, 1 taza"
              />
            </div>
          )}

          {formData.activity_type === "medication" && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre del medicamento"
                name="medication_name"
                value={formData.medication_name}
                onChange={handleInputChange}
              />
              <Input
                label="Dosis"
                name="medication_dose"
                value={formData.medication_dose}
                onChange={handleInputChange}
                placeholder="Ej: 10mg, 1 tableta"
              />
            </div>
          )}

          {formData.activity_type === "vet_visit" && (
            <div className="space-y-4">
              <Input
                label="Clínica veterinaria"
                name="vet_clinic"
                value={formData.vet_clinic}
                onChange={handleInputChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
                <textarea
                  name="vet_diagnosis"
                  value={formData.vet_diagnosis}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Costo"
              type="number"
              step="0.01"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="0.00"
            />
            <Input label="Notas adicionales" name="notes" value={formData.notes} onChange={handleInputChange} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={formLoading}>
              Guardar Actividad
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
