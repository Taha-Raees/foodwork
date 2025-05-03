"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 space-y-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-emerald-600">FoodWorks</h1>
          <p className="text-gray-600 mt-1">Inventory Management</p>
        </div>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg"
        >
          Login
        </Button>
      </form>
    </div>
  )
}
