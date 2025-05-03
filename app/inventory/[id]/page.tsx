"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Edit, Package, Tag, Building2, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import { inventoryData } from "@/data/inventory-data"

export default function InventoryDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchInventoryItem = async () => {
      try {
        const foundItem = inventoryData.find((i) => i.id === params.id)

        if (!foundItem) {
          toast({
            title: "Item not found",
            description: "The requested inventory item could not be found.",
            variant: "destructive",
          })
          router.push("/inventory")
          return
        }

        setItem(foundItem)
      } catch (error) {
        console.error("Error fetching inventory item:", error)
        toast({
          title: "Error",
          description: "Failed to load inventory details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInventoryItem()
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading inventory details...</p>
        </div>
      </div>
    )
  }

  if (!item) return null

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{item.name}</h1>
              <Badge variant="outline" className="flex items-center">
                <Tag className="mr-1 h-3 w-3" />
                {item.category}
              </Badge>
            </div>
            <p className="text-gray-500">ID: {item.id}</p>
          </div>
          <Button asChild>
            <Link href={`/inventory/${item.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Item
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Inventory Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Product Name</p>
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{item.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <div className="flex items-center">
                        <Building2 className="mr-1 h-4 w-4 text-gray-500" />
                        <p className="font-medium">{item.location}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                        <p>{formatDate(item.lastUpdated)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quantity & Value</h3>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unit</p>
                      <p className="font-medium">{item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="font-medium">${item.value.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/inventory/${item.id}/adjust`}>Adjust Quantity</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/orders/create">Order More</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/inventory/${item.id}/edit`}>Edit Item</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <div className="flex items-center mt-1">
                    <StatusIndicator status={item.status} />
                    <p className="font-medium ml-2">{item.status}</p>
                  </div>
                </div>

                {item.status === "Low" && (
                  <div className="p-3 bg-red-50 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
                      <p className="text-sm text-red-700">
                        This item is below the minimum stock level. Consider ordering more.
                      </p>
                    </div>
                  </div>
                )}

                {item.status === "Warning" && (
                  <div className="p-3 bg-amber-50 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Stock Warning</p>
                      <p className="text-sm text-amber-700">This item is approaching the minimum stock level.</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  let variant

  switch (status) {
    case "Low":
      variant = "destructive"
      break
    case "Warning":
      variant = "warning"
      break
    case "Good":
      variant = "success"
      break
    default:
      variant = "secondary"
  }

  return (
    <Badge variant={variant} className="w-fit">
      {status}
    </Badge>
  )
}

function StatusIndicator({ status }) {
  let colorClass

  switch (status) {
    case "Low":
      colorClass = "bg-red-500"
      break
    case "Warning":
      colorClass = "bg-amber-500"
      break
    case "Good":
      colorClass = "bg-emerald-500"
      break
    default:
      colorClass = "bg-gray-500"
  }

  return <span className={`inline-block w-3 h-3 rounded-full ${colorClass}`}></span>
}
