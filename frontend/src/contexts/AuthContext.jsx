"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      authAPI
        .getMe()
        .then((response) => {
          setUser(response.data.user)
        })
        .catch(() => {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password })
    const { user, access_token, refresh_token } = response.data
    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    setUser(user)
    return user
  }

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password })
    const { user, access_token, refresh_token } = response.data
    localStorage.setItem("access_token", access_token)
    localStorage.setItem("refresh_token", refresh_token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
