import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import PetsPage from "./pages/PetsPage"
import PetDetailPage from "./pages/PetDetailPage"
import ActivitiesPage from "./pages/ActivitiesPage"
import RemindersPage from "./pages/RemindersPage"
import MedicalPage from "./pages/MedicalPage"
import Layout from "./components/Layout"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="pets/:petId" element={<PetDetailPage />} />
            <Route path="pets/:petId/activities" element={<ActivitiesPage />} />
            <Route path="pets/:petId/medical" element={<MedicalPage />} />
            <Route path="reminders" element={<RemindersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
