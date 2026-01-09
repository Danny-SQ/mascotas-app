"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { petsAPI, medicalAPI } from "../services/api"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Modal } from "../components/ui/Modal"
import { Badge } from "../components/ui/Badge"
import { ArrowLeft, Plus, Stethoscope, Syringe, FileText, Trash2, Calendar, User, Building } from "lucide-react"
import { formatDate } from "../lib/utils"

const recordTypes = [
  { value: "checkup", label: "Chequeo General" },
  { value: "diagnosis", label: "Diagnóstico" },
  { value: "treatment", label: "Tratamiento" },
  { value: "surgery", label: "Cirugía" },
  { value: "emergency", label: "Emergencia" },
]

const initialRecordForm = {
  record_type: "checkup",
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  vet_name: "",
  clinic_name: "",
  diagnosis: "",
  treatment: "",
  medications: "",
  follow_up_date: "",
  cost: "",
}

const initialVaccinationForm = {
  vaccine_name: "",
  date_administered: new Date().toISOString().slice(0, 10),
  next_due_date: "",
  batch_number: "",
  vet_name: "",
  clinic_name: "",
  notes: "",
}

export default function MedicalPage() {
  const { petId } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [records, setRecords] = useState([])
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("records")

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [recordForm, setRecordForm] = useState(initialRecordForm)
  const [recordFormLoading, setRecordFormLoading] = useState(false)

  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false)
  const [vaccinationForm, setVaccinationForm] = useState(initialVaccinationForm)
  const [vaccinationFormLoading, setVaccinationFormLoading] = useState(false)

  const [formError, setFormError] = useState("")

  useEffect(() => {
    fetchData()
  }, [petId])

  const fetchData = async () => {
    try {
      const [petRes, recordsRes, vaccinationsRes] = await Promise.all([
        petsAPI.getOne(petId),
        medicalAPI.getRecords(petId),
        medicalAPI.getVaccinations(petId),
      ])
      setPet(petRes.data.pet)
      setRecords(recordsRes.data.records)
      setVaccinations(vaccinationsRes.data.vaccinations)
    } catch (error) {
      console.error("Error fetching data:", error)
      navigate("/pets")
    } finally {
      setLoading(false)
    }
  }

  const handleRecordSubmit = async (e) => {
    e.preventDefault()
    setRecordFormLoading(true)
    setFormError("")

    try {
      const dataToSend = {
        ...recordForm,
        pet_id: Number.parseInt(petId),
        cost: recordForm.cost ? Number.parseFloat(recordForm.cost) : null,
      }
      await medicalAPI.createRecord(dataToSend)
      setIsRecordModalOpen(false)
      setRecordForm(initialRecordForm)
      fetchData()
    } catch (error) {
      setFormError(error.response?.data?.error || "Error al guardar el registro")
    } finally {
      setRecordFormLoading(false)
    }
  }

  const handleVaccinationSubmit = async (e) => {
    e.preventDefault()
    setVaccinationFormLoading(true)
    setFormError("")

    try {
      const dataToSend = {
        ...vaccinationForm,
        pet_id: Number.parseInt(petId),
      }
      await medicalAPI.createVaccination(dataToSend)
      setIsVaccinationModalOpen(false)
      setVaccinationForm(initialVaccinationForm)
      fetchData()
    } catch (error) {
      setFormError(error.response?.data?.error || "Error al guardar la vacuna")
    } finally {
      setVaccinationFormLoading(false)
    }
  }

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("¿Eliminar este registro médico?")) return
    try {
      await medicalAPI.deleteRecord(recordId)
      fetchData()
    } catch (error) {
      console.error("Error deleting record:", error)
    }
  }

  const handleDeleteVaccination = async (vaccinationId) => {
    if (!window.confirm("¿Eliminar esta vacuna?")) return
    try {
      await medicalAPI.deleteVaccination(vaccinationId)
      fetchData()
    } catch (error) {
      console.error("Error deleting vaccination:", error)
    }
  }

  const getRecordTypeLabel = (type) => {
    const labels = {
      checkup: "Chequeo General",
      diagnosis: "Diagnóstico",
      treatment: "Tratamiento",
      surgery: "Cirugía",
      emergency: "Emergencia",
    }
    return labels[type] || type
  }

  const getRecordTypeColor = (type) => {
    const colors = {
      checkup: "bg-blue-100 text-blue-600",
      diagnosis: "bg-yellow-100 text-yellow-600",
      treatment: "bg-green-100 text-green-600",
      surgery: "bg-purple-100 text-purple-600",
      emergency: "bg-red-100 text-red-600",
    }
    return colors[type] || "bg-gray-100 text-gray-600"
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Historial Médico de {pet?.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsVaccinationModalOpen(true)} variant="outline" className="bg-transparent">
            <Syringe className="w-5 h-5 mr-2" />
            Nueva Vacuna
          </Button>
          <Button onClick={() => setIsRecordModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Registro
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("records")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "records"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Stethoscope className="w-4 h-4 inline mr-2" />
          Registros Médicos ({records.length})
        </button>
        <button
          onClick={() => setActiveTab("vaccinations")}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "vaccinations"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Syringe className="w-4 h-4 inline mr-2" />
          Vacunas ({vaccinations.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "records" ? (
        <Card>
          <CardContent className="divide-y divide-gray-100">
            {records.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay registros médicos</h3>
                <p className="text-gray-500">Agrega el primer registro médico de tu mascota</p>
              </div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getRecordTypeColor(record.record_type)}`}
                  >
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{record.title}</h3>
                        <Badge variant="default" className="mt-1">
                          {getRecordTypeLabel(record.record_type)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 flex-shrink-0">{formatDate(record.date)}</p>
                    </div>

                    {record.description && <p className="text-gray-600 mt-2">{record.description}</p>}

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      {record.vet_name && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {record.vet_name}
                        </div>
                      )}
                      {record.clinic_name && (
                        <div className="flex items-center gap-1.5">
                          <Building className="w-4 h-4" />
                          {record.clinic_name}
                        </div>
                      )}
                      {record.follow_up_date && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          Seguimiento: {formatDate(record.follow_up_date)}
                        </div>
                      )}
                    </div>

                    {record.diagnosis && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">Diagnóstico:</p>
                        <p className="text-sm text-yellow-700">{record.diagnosis}</p>
                      </div>
                    )}

                    {record.treatment && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Tratamiento:</p>
                        <p className="text-sm text-green-700">{record.treatment}</p>
                      </div>
                    )}

                    {record.cost && (
                      <Badge variant="info" className="mt-3">
                        ${record.cost}
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="divide-y divide-gray-100">
            {vaccinations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Syringe className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay vacunas registradas</h3>
                <p className="text-gray-500">Agrega la primera vacuna de tu mascota</p>
              </div>
            ) : (
              vaccinations.map((vaccination) => (
                <div key={vaccination.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-100">
                    <Syringe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{vaccination.vaccine_name}</h3>
                      <p className="text-sm text-gray-500 flex-shrink-0">{formatDate(vaccination.date_administered)}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      {vaccination.vet_name && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          {vaccination.vet_name}
                        </div>
                      )}
                      {vaccination.clinic_name && (
                        <div className="flex items-center gap-1.5">
                          <Building className="w-4 h-4" />
                          {vaccination.clinic_name}
                        </div>
                      )}
                      {vaccination.batch_number && <span>Lote: {vaccination.batch_number}</span>}
                    </div>

                    {vaccination.next_due_date && (
                      <Badge
                        variant={new Date(vaccination.next_due_date) < new Date() ? "danger" : "warning"}
                        className="mt-3"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        Próxima: {formatDate(vaccination.next_due_date)}
                      </Badge>
                    )}

                    {vaccination.notes && <p className="text-sm text-gray-500 mt-2">{vaccination.notes}</p>}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 flex-shrink-0"
                    onClick={() => handleDeleteVaccination(vaccination.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* New Record Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Nuevo Registro Médico"
        size="lg"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-5">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tipo de registro *"
              name="record_type"
              value={recordForm.record_type}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, record_type: e.target.value }))}
              options={recordTypes}
            />
            <Input
              label="Fecha *"
              type="date"
              name="date"
              value={recordForm.date}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Título *"
            name="title"
            value={recordForm.title}
            onChange={(e) => setRecordForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Ej: Chequeo anual"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              value={recordForm.description}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Veterinario"
              name="vet_name"
              value={recordForm.vet_name}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, vet_name: e.target.value }))}
            />
            <Input
              label="Clínica"
              name="clinic_name"
              value={recordForm.clinic_name}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, clinic_name: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
            <textarea
              name="diagnosis"
              value={recordForm.diagnosis}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, diagnosis: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tratamiento</label>
            <textarea
              name="treatment"
              value={recordForm.treatment}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, treatment: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Fecha de seguimiento"
              type="date"
              name="follow_up_date"
              value={recordForm.follow_up_date}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, follow_up_date: e.target.value }))}
            />
            <Input
              label="Costo"
              type="number"
              step="0.01"
              name="cost"
              value={recordForm.cost}
              onChange={(e) => setRecordForm((prev) => ({ ...prev, cost: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsRecordModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={recordFormLoading}>
              Guardar Registro
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Vaccination Modal */}
      <Modal isOpen={isVaccinationModalOpen} onClose={() => setIsVaccinationModalOpen(false)} title="Nueva Vacuna">
        <form onSubmit={handleVaccinationSubmit} className="space-y-5">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <Input
            label="Nombre de la vacuna *"
            name="vaccine_name"
            value={vaccinationForm.vaccine_name}
            onChange={(e) => setVaccinationForm((prev) => ({ ...prev, vaccine_name: e.target.value }))}
            placeholder="Ej: Antirrábica, Parvovirus"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Fecha de aplicación *"
              type="date"
              name="date_administered"
              value={vaccinationForm.date_administered}
              onChange={(e) => setVaccinationForm((prev) => ({ ...prev, date_administered: e.target.value }))}
              required
            />
            <Input
              label="Próxima fecha"
              type="date"
              name="next_due_date"
              value={vaccinationForm.next_due_date}
              onChange={(e) => setVaccinationForm((prev) => ({ ...prev, next_due_date: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Veterinario"
              name="vet_name"
              value={vaccinationForm.vet_name}
              onChange={(e) => setVaccinationForm((prev) => ({ ...prev, vet_name: e.target.value }))}
            />
            <Input
              label="Clínica"
              name="clinic_name"
              value={vaccinationForm.clinic_name}
              onChange={(e) => setVaccinationForm((prev) => ({ ...prev, clinic_name: e.target.value }))}
            />
          </div>

          <Input
            label="Número de lote"
            name="batch_number"
            value={vaccinationForm.batch_number}
            onChange={(e) => setVaccinationForm((prev) => ({ ...prev, batch_number: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              name="notes"
              value={vaccinationForm.notes}
              onChange={(e) => setVaccinationForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsVaccinationModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={vaccinationFormLoading}>
              Guardar Vacuna
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
