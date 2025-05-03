"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Edit,
  Building2,
  MapPin,
  Phone,
  User,
  Package,
  AlertCircle,
  BarChart3,
  ShoppingCart,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { locationsData } from "@/data/locations-data"
import { inventoryData } from "@/data/inventory-data"
import { ordersData } from "@/data/orders-data"

export default function LocationDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [locationInventory, setLocationInventory] = useState([])
  const [locationOrders, setLocationOrders] = useState([])

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchLocation = async () => {
      try {
        const foundLocation = locationsData.find((l) => l.id === params.id)

        if (!foundLocation) {
          toast({
            title: "Location not found",
            description: "The requested location could not be found.",
            variant: "destructive",
          })
          router.push("/locations")
          return
        }

        setLocation(foundLocation)

        // Get inventory items for this location
        const relatedInventory = inventoryData.filter((item) => item.location === foundLocation.name)
        setLocationInventory(relatedInventory)

        // Get orders for this location
        const relatedOrders = ordersData.filter((order) => order.location === foundLocation.name)
        setLocationOrders(relatedOrders)
      } catch (error) {
        console.error("Error fetching location:", error)
        toast({
          title: "Error",
          description: "Failed to load location details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading location details...</p>
        </div>
      </div>
    )
  }

  if (!location) return null

  // Calculate inventory statistics
  const totalInventoryValue = locationInventory.reduce((total, item) => total + item.value, 0)
  const lowStockItems = locationInventory.filter((item) => item.status === "Low").length
  const warningStockItems = locationInventory.filter((item) => item.status === "Warning").length
  const goodStockItems = locationInventory.filter((item) => item.status === "Good").length

  // Calculate order statistics
  const pendingOrders = locationOrders.filter((order) => order.status === "Pending").length
  const shippedOrders = locationOrders.filter((order) => order.status === "Shipped").length
  const deliveredOrders = locationOrders.filter((order) => order.status === "Delivered").length

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Locations
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{location.name}</h1>
              <LocationStatusBadge status={location.status} />
            </div>
            <p className="text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {location.address}
            </p>
          </div>
          <Button asChild>
            <Link href={`/locations/${location.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Location
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inventory Value</p>
                <p className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</p>
              </div>
              <Package className="h-8 w-8 text-emerald-600 bg-emerald-100 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold">{locationInventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600 bg-blue-100 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alerts</p>
                <p className="text-2xl font-bold">{lowStockItems}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-600 bg-amber-100 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="mr-2 h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{location.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium">{location.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <div className="flex items-center">
                            <Phone className="mr-1 h-4 w-4 text-gray-500" />
                            <p className="font-medium">{location.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Management</h3>
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Manager</p>
                          <div className="flex items-center">
                            <User className="mr-1 h-4 w-4 text-gray-500" />
                            <p className="font-medium">{location.manager}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <LocationStatusBadge status={location.status} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Alerts</p>
                          <p className="font-medium">
                            {location.alerts} {location.alerts === 1 ? "alert" : "alerts"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Inventory Status</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-emerald-50 p-3 rounded-md">
                        <p className="text-sm text-emerald-800">Good Stock</p>
                        <p className="text-xl font-bold text-emerald-700">{goodStockItems}</p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-md">
                        <p className="text-sm text-amber-800">Warning</p>
                        <p className="text-xl font-bold text-amber-700">{warningStockItems}</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-sm text-red-800">Low Stock</p>
                        <p className="text-xl font-bold text-red-700">{lowStockItems}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                  <CardDescription>Latest orders for this location</CardDescription>
                </CardHeader>
                <CardContent>
                  {locationOrders.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No orders found for this location.</p>
                      <Button asChild className="mt-4">
                        <Link href="/orders/create">Create Order</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Order #
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Supplier
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {locationOrders.slice(0, 5).map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link
                                  href={`/orders/${order.id}`}
                                  className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                  {order.orderNumber}
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{order.supplier}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <OrderStatusBadge status={order.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/orders?location=${encodeURIComponent(location.name)}`}>View All Orders</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/inventory/add">Add Inventory</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/orders/create">Create Order</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/locations/${location.id}/edit`}>Edit Location</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-xl font-bold text-amber-600">{pendingOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shipped</p>
                      <p className="text-xl font-bold text-blue-600">{shippedOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivered</p>
                      <p className="text-xl font-bold text-emerald-600">{deliveredOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Top Suppliers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {locationOrders.length === 0 ? (
                    <p className="text-sm text-gray-500">No supplier data available.</p>
                  ) : (
                    <div className="space-y-3">
                      {/* Get top 3 suppliers by order count */}
                      {Array.from(new Set(locationOrders.map((order) => order.supplier)))
                        .slice(0, 3)
                        .map((supplier) => (
                          <div key={supplier} className="flex items-center justify-between">
                            <p className="text-sm font-medium">{supplier}</p>
                            <Badge variant="outline">
                              {locationOrders.filter((order) => order.supplier === supplier).length} orders
                            </Badge>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Inventory at {location.name}
              </CardTitle>
              <CardDescription>All inventory items at this location</CardDescription>
            </CardHeader>
            <CardContent>
              {locationInventory.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No inventory found for this location.</p>
                  <Button asChild className="mt-4">
                    <Link href="/inventory/add">Add Inventory</Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Value
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {locationInventory.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/inventory/${item.id}`}
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              {item.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {item.quantity} {item.unit}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">${item.value.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <InventoryStatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/inventory?location=${encodeURIComponent(location.name)}`}>View All Inventory</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href="/inventory/add">Add Inventory</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Orders for {location.name}
              </CardTitle>
              <CardDescription>All orders for this location</CardDescription>
            </CardHeader>
            <CardContent>
              {locationOrders.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">No orders found for this location.</p>
                  <Button asChild className="mt-4">
                    <Link href="/orders/create">Create Order</Link>
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Order #
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Supplier
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {locationOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              {order.orderNumber}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(order.orderDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.supplier}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/orders/${order.id}`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/orders/create">Create New Order</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Location Analytics
              </CardTitle>
              <CardDescription>Performance metrics for this location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Inventory by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {locationInventory.length === 0 ? (
                        <p className="text-sm text-gray-500">No inventory data available.</p>
                      ) : (
                        <div className="space-y-4">
                          {/* Group inventory by category and show percentages */}
                          {Object.entries(
                            locationInventory.reduce((acc, item) => {
                              acc[item.category] = (acc[item.category] || 0) + 1
                              return acc
                            }, {}),
                          ).map(([category, count]) => {
                            const percentage = ((count as number) / locationInventory.length) * 100
                            return (
                              <div key={category} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{category}</span>
                                  <span className="font-medium">
                                    {count} ({percentage.toFixed(1)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Inventory Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {locationInventory.length === 0 ? (
                        <p className="text-sm text-gray-500">No inventory data available.</p>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-emerald-50 p-3 rounded-md">
                              <p className="text-sm text-emerald-800">Good</p>
                              <p className="text-xl font-bold text-emerald-700">{goodStockItems}</p>
                              <p className="text-xs text-emerald-600">
                                {((goodStockItems / locationInventory.length) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-md">
                              <p className="text-sm text-amber-800">Warning</p>
                              <p className="text-xl font-bold text-amber-700">{warningStockItems}</p>
                              <p className="text-xs text-amber-600">
                                {((warningStockItems / locationInventory.length) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-md">
                              <p className="text-sm text-red-800">Low</p>
                              <p className="text-xl font-bold text-red-700">{lowStockItems}</p>
                              <p className="text-xs text-red-600">
                                {((lowStockItems / locationInventory.length) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {locationOrders.length === 0 ? (
                      <p className="text-sm text-gray-500">No order data available.</p>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Orders by Status</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Pending</span>
                                <span className="font-medium text-amber-600">{pendingOrders}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Shipped</span>
                                <span className="font-medium text-blue-600">{shippedOrders}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Delivered</span>
                                <span className="font-medium text-emerald-600">{deliveredOrders}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Cancelled</span>
                                <span className="font-medium text-red-600">
                                  {locationOrders.filter((order) => order.status === "Cancelled").length}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Top Suppliers</h4>
                            <div className="space-y-2">
                              {/* Get top suppliers by order count */}
                              {Array.from(
                                locationOrders
                                  .reduce((acc, order) => {
                                    acc.set(order.supplier, (acc.get(order.supplier) || 0) + 1)
                                    return acc
                                  }, new Map())
                                  .entries(),
                              )
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 3)
                                .map(([supplier, count]) => (
                                  <div key={supplier} className="flex justify-between text-sm">
                                    <span>{supplier}</span>
                                    <span className="font-medium">{count} orders</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/reports">View Full Reports</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LocationStatusBadge({ status }) {
  let variant

  switch (status) {
    case "Good":
      variant = "success"
      break
    case "Warning":
      variant = "warning"
      break
    case "Critical":
      variant = "destructive"
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

function OrderStatusBadge({ status }) {
  let variant

  switch (status) {
    case "Pending":
      variant = "warning"
      break
    case "Delivered":
      variant = "success"
      break
    case "Shipped":
      variant = "info"
      break
    case "Cancelled":
      variant = "destructive"
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

function InventoryStatusBadge({ status }) {
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
