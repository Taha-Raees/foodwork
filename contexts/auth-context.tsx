"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { setCookie, deleteCookie, getCookie } from "cookies-next"

// Define the User type
type User = {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff"
} | null

// Define the AuthContext type
type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isLoading: boolean
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie("auth-token")

        if (token) {
          // In a real app, you would validate the token with your backend
          // For now, we'll simulate a user based on the token existence
          setUser({
            id: "user-1",
            name: "Demo User",
            email: "demo@example.com",
            role: "admin",
          })
        }
      } catch (error) {
        console.error("Authentication error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to your backend
      // For demo purposes, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Set a mock user
      const mockUser = {
        id: "user-1",
        name: email.split("@")[0],
        email,
        role: "admin" as const,
      }

      // Set the user in state and cookie
      setUser(mockUser)
      setCookie("auth-token", "demo-token-value", { maxAge: 60 * 60 * 24 * 7 }) // 1 week

      // Wait for state to update
      await new Promise((resolve) => setTimeout(resolve, 100))
      return true
    } catch (error) {
      console.error("Login error:", error)
      setUser(null)
      deleteCookie("auth-token")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      // In a real app, you would make an API call to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll just log the registration data
      console.log("Registration data:", userData)

      // In a real app, you might automatically log the user in after registration
      // or redirect them to login
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    deleteCookie("auth-token")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
