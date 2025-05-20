"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"
import { login, logout, register, getCurrentUser, updateUser } from "@/lib/data-service"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  updateUserLevel: (newLevel: "Principiante" | "Intermedio" | "Avanzado") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await login(email, password)

      if (result.success) {
        // Fetch the user data
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const handleRegister = async (userData: Omit<User, "id" | "createdAt">): Promise<boolean> => {
    try {
      const result = await register(userData)

      if (result.success) {
        // Fetch the user data
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        return true
      }

      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleUpdateUser = async (userData: Partial<User>): Promise<void> => {
    if (!user) return

    try {
      const success = await updateUser(userData)

      if (success) {
        // Update local user state
        setUser((prev) => (prev ? { ...prev, ...userData } : null))
      }
    } catch (error) {
      console.error("Update user error:", error)
    }
  }

  const handleUpdateUserLevel = async (newLevel: "Principiante" | "Intermedio" | "Avanzado"): Promise<void> => {
    if (!user || user.level === newLevel) return
    await handleUpdateUser({ level: newLevel })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser: handleUpdateUser,
        updateUserLevel: handleUpdateUserLevel,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
