import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_URL}/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            },
          )

          const { access_token } = response.data
          localStorage.setItem("access_token", access_token)

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          window.location.href = "/login"
        }
      }
    }

    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateMe: (data) => api.put("/auth/me", data),
}

// Pets API
export const petsAPI = {
  getAll: () => api.get("/pets"),
  getOne: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post("/pets", data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
}

// Activities API
export const activitiesAPI = {
  getByPet: (petId, params) => api.get(`/activities/pet/${petId}`, { params }),
  create: (data) => api.post("/activities", data),
  update: (id, data) => api.put(`/activities/${id}`, data),
  delete: (id) => api.delete(`/activities/${id}`),
  getStats: (petId) => api.get(`/activities/stats/${petId}`),
}

// Reminders API
export const remindersAPI = {
  getByPet: (petId, params) => api.get(`/reminders/pet/${petId}`, { params }),
  getUpcoming: () => api.get("/reminders/upcoming"),
  create: (data) => api.post("/reminders", data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  complete: (id) => api.post(`/reminders/${id}/complete`),
  delete: (id) => api.delete(`/reminders/${id}`),
}

// Medical API
export const medicalAPI = {
  getRecords: (petId, params) => api.get(`/medical/records/pet/${petId}`, { params }),
  createRecord: (data) => api.post("/medical/records", data),
  updateRecord: (id, data) => api.put(`/medical/records/${id}`, data),
  deleteRecord: (id) => api.delete(`/medical/records/${id}`),
  getVaccinations: (petId) => api.get(`/medical/vaccinations/pet/${petId}`),
  createVaccination: (data) => api.post("/medical/vaccinations", data),
  deleteVaccination: (id) => api.delete(`/medical/vaccinations/${id}`),
  getSummary: (petId) => api.get(`/medical/summary/pet/${petId}`),
}

export default api
