// ============================================
// AUTHENTICATION CONTEXT
// ============================================
// This file manages global authentication state using React Context.
// It handles login, logout, user session, and makes this data available throughout the app.

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthResponse } from "./types"
import { authAPI } from "./api-client"

/**
 * Auth Context Type
 * Defines what data and functions are available in the auth context
 */
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, role: string) => Promise<void>
  logout: () => void
}

// Create the context (initially with undefined value)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state to all children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Check if user is already logged in on component mount
   * This restores session if token exists in localStorage
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await authAPI.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Login function
   * Calls backend API to authenticate user
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response: AuthResponse = await authAPI.login(email, password)

      // Store token in localStorage for future requests
      localStorage.setItem("token", response.token)
      setUser(response.user)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Register function
   * Creates new user account
   */
  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      setIsLoading(true)
      const response: AuthResponse = await authAPI.register(email, password, name, role)

      // Store token and user data
      localStorage.setItem("token", response.token)
      setUser(response.user)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout function
   * Clears user session
   */
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth Hook
 * Custom hook to access auth context throughout the app
 * Usage: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
