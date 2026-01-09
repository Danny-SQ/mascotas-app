"use client"

import { useState, useEffect } from "react"
import { petsAPI, remindersAPI } from "../services/api"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Modal } from "../components/ui/Modal"
import { Badge } from "../components/ui/Badge"
import { Plus, Bell, Check, Trash2, Calendar, RefreshCw } from "lucide-react"
import { formatDate, getReminderTypeLabel } from "../lib/utils"

const reminderTypes = [
  { value: "vaccination", label: "Vacunación" },
  { value: "medication", label: "Medicamento" },
  { value: "vet_appointment", label: "Cita Veterinaria" },
  { value: "grooming", label: "Aseo" },
  { value: "other", label: "Otro" },
]

const recurrenceOptions = [
  { value: "", label: "Sin repetición" },
  { value: "daily", label: "Diario" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
  { value: "yearly", label: "Anual" },
]

const initialFormState = {
  pet_id: "",
  title: "",
  description: "",
  reminder_type: "vaccination",
  due_date: "",
  is_recurring: false,
  recurrence_interval: "",
}

export default function RemindersPage() {
  const [pets, setPets] = useState([])
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(initialFormState)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const petsRes = await petsAPI.getAll()
      setPets(petsRes.data.pets)

      const allReminders = []
      for (const pet of petsRes.data.pets) {
        const remindersRes = await remindersAPI.getByPet(pet.id, { completed: showCompleted })
        const remindersWithPet = remindersRes.data.reminders.map((r) => ({
          ...r,
          pet_name: pet.name,
        }))
        allReminders.push(...remindersWithPet)
      }

      allReminders.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      setReminders(allReminders)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")

    try {
      const dataToSend = {
        ...formData,
        pet_id: Number.parseInt(formData.pet_id),
        due_date: new Date(formData.due_date).toISOString(),
      }

      await remindersAPI.create(dataToSend)
      setIsModalOpen(false)
      setFormData(initialFormState)
      fetchData()
    } catch (error) {
      setFormError(error.response?.data?.error || "Error al crear el recordatorio")
    } finally {
      setFormLoading(false)
    }
  }

  const handleComplete = async (reminderId) => {
    try {
      await remindersAPI.complete(reminderId)
      fetchData()
    } catch (error) {
      console.error("Error completing reminder:", error)
    }
  }

  const handleDelete = async (reminderId) => {
    if (!window.confirm("¿Eliminar este recordatorio?")) return

    try {
      await remindersAPI.delete(reminderId)
      fetchData()
    } catch (error) {
      console.error("Error deleting reminder:", error)
    }
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Recordatorios</h1>
          <p className="mt-1 text-gray-600">Gestiona los recordatorios de tus mascotas</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={pets.length === 0}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Recordatorio
        </Button>
      </div>

      {pets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes mascotas</h3>
            <p className="text-gray-500">Primero debes agregar una mascota para crear recordatorios</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={!showCompleted ? "primary" : "secondary"}
              size="sm"
              onClick={() => setShowCompleted(false)}
            >
              Pendientes
            </Button>
            <Button variant={showCompleted ? "primary" : "secondary"} size="sm" onClick={() => setShowCompleted(true)}>
              Completados
            </Button>
          </div>

          {/* Reminders List */}
          <Card>
            <CardContent className="divide-y divide-gray-100">
              {reminders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay recordatorios</h3>
                  <p className="text-gray-500">
                    {showCompleted ? "No tienes recordatorios completados" : "No tienes recordatorios pendientes"}
                  </p>
                </div>
              ) : (
                reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`flex items-start gap-4 py-4 first:pt-0 last:pb-0 ${reminder.is_completed ? "opacity-60" : ""}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        reminder.is_completed
                          ? "bg-green-100"
                          : isOverdue(reminder.due_date)
                            ? "bg-red-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {reminder.is_completed ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : (
                        <Bell
                          className={`w-6 h-6 ${isOverdue(reminder.due_date) ? "text-red-600" : "text-yellow-600"}`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                          <p className="text-sm text-gray-500">{reminder.pet_name}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant={
                              reminder.is_completed ? "success" : isOverdue(reminder.due_date) ? "danger" : "warning"
                            }
                          >
                            {getReminderTypeLabel(reminder.reminder_type)}
                          </Badge>
                        </div>
                      </div>

                      {reminder.description && <p className="text-gray-600 mt-2">{reminder.description}</p>}

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(reminder.due_date)}
                        </div>
                        {reminder.is_recurring && (
                          <div className="flex items-center gap-1.5 text-sm text-primary-600">
                            <RefreshCw className="w-4 h-4" />
                            {reminder.recurrence_interval === "daily"
                              ? "Diario"
                              : reminder.recurrence_interval === "weekly"
                                ? "Semanal"
                                : reminder.recurrence_interval === "monthly"
                                  ? "Mensual"
                                  : "Anual"}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {!reminder.is_completed && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleComplete(reminder.id)}
                          title="Marcar como completado"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* New Reminder Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Recordatorio">
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <Select
            label="Mascota *"
            name="pet_id"
            value={formData.pet_id}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Selecciona una mascota" },
              ...pets.map((p) => ({ value: p.id, label: p.name })),
            ]}
            required
          />

          <Input
            label="Título *"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ej: Vacuna antirrábica"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tipo *"
              name="reminder_type"
              value={formData.reminder_type}
              onChange={handleInputChange}
              options={reminderTypes}
            />
            <Input
              label="Fecha de vencimiento *"
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_recurring"
                checked={formData.is_recurring}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Es recurrente</span>
            </label>

            {formData.is_recurring && (
              <Select
                label="Frecuencia"
                name="recurrence_interval"
                value={formData.recurrence_interval}
                onChange={handleInputChange}
                options={recurrenceOptions}
              />
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={formLoading}>
              Crear Recordatorio
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
