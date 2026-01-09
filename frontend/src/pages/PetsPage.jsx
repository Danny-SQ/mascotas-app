"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { petsAPI } from "../services/api"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Select } from "../components/ui/Select"
import { Modal } from "../components/ui/Modal"
import { Badge } from "../components/ui/Badge"
import { Plus, PawPrint, Search, Calendar, Weight, Edit, Trash2 } from "lucide-react"
import { formatDate } from "../lib/utils"

const speciesOptions = [
  { value: "", label: "Selecciona una especie" },
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "ave", label: "Ave" },
  { value: "conejo", label: "Conejo" },
  { value: "hamster", label: "Hámster" },
  { value: "pez", label: "Pez" },
  { value: "reptil", label: "Reptil" },
  { value: "otro", label: "Otro" },
]

const initialFormState = {
  name: "",
  species: "",
  breed: "",
  birth_date: "",
  weight: "",
  color: "",
  notes: "",
}

export default function PetsPage() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [formData, setFormData] = useState(initialFormState)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await petsAPI.getAll()
      setPets(response.data.pets)
    } catch (error) {
      console.error("Error fetching pets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet)
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || "",
        birth_date: pet.birth_date || "",
        weight: pet.weight || "",
        color: pet.color || "",
        notes: pet.notes || "",
      })
    } else {
      setEditingPet(null)
      setFormData(initialFormState)
    }
    setFormError("")
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPet(null)
    setFormData(initialFormState)
    setFormError("")
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
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
      }

      if (editingPet) {
        await petsAPI.update(editingPet.id, dataToSend)
      } else {
        await petsAPI.create(dataToSend)
      }

      handleCloseModal()
      fetchPets()
    } catch (error) {
      setFormError(error.response?.data?.error || "Error al guardar la mascota")
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (petId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      await petsAPI.delete(petId)
      fetchPets()
    } catch (error) {
      console.error("Error deleting pet:", error)
    }
  }

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mis Mascotas</h1>
          <p className="mt-1 text-gray-600">Gestiona la información de tus mascotas</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Agregar Mascota
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, especie o raza..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Pets Grid */}
      {filteredPets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No se encontraron mascotas" : "Aún no tienes mascotas"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Intenta con otro término de búsqueda" : "Agrega tu primera mascota para comenzar"}
            </p>
            {!searchTerm && (
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-5 h-5 mr-2" />
                Agregar Mascota
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <Card key={pet.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <Link to={`/pets/${pet.id}`} className="block p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {pet.photo_url ? (
                        <img
                          src={pet.photo_url || "/placeholder.svg"}
                          alt={pet.name}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <PawPrint className="w-8 h-8 text-primary-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{pet.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{pet.species}</p>
                      {pet.breed && <p className="text-sm text-gray-400">{pet.breed}</p>}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {pet.birth_date && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(pet.birth_date)}
                      </Badge>
                    )}
                    {pet.weight && (
                      <Badge variant="info" className="flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        {pet.weight} kg
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">{pet.activities_count} actividades</span>
                    {pet.reminders_count > 0 && <Badge variant="warning">{pet.reminders_count} recordatorios</Badge>}
                  </div>
                </Link>

                <div className="px-6 pb-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleOpenModal(pet)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(pet.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Pet Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingPet ? "Editar Mascota" : "Nueva Mascota"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <Input label="Nombre *" name="name" value={formData.name} onChange={handleInputChange} required />

          <Select
            label="Especie *"
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            options={speciesOptions}
            required
          />

          <Input label="Raza" name="breed" value={formData.breed} onChange={handleInputChange} />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de nacimiento"
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleInputChange}
            />
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
            />
          </div>

          <Input label="Color" name="color" value={formData.color} onChange={handleInputChange} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" loading={formLoading}>
              {editingPet ? "Guardar Cambios" : "Agregar Mascota"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
