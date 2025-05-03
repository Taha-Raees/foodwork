"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickLogin = async () => {
    setIsLoading(true)
    await login("demo@foodworks.com", "demo123")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-600">FoodWorks</h1>
          <p className="text-gray-600 mt-1">Inventory Management</p>
        </div>

        <Button
          onClick={handleQuickLogin}
          className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Quick Login"}
        </Button>
      </div>
    </div>
  )
}
