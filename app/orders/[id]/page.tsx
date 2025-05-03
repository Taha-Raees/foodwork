"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar, Edit, FileText, Package, Truck, Building2 } from "lucide-react"
import Link from "next/link"
import { ordersData } from "@/data/orders-data"

export default function OrderDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchOrder = async () => {
      try {
        const foundOrder = ordersData.find((o) => o.id === params.id)

        if (!foundOrder) {
          toast({
            title: "Order not found",
            description: "The requested order could not be found.",
            variant: "destructive",
          })
          router.push("/orders")
          return
        }

        setOrder(foundOrder)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error",
          description: "Failed to load order details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) return null

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
          Back to Orders
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-gray-500">Placed on {formatDate(order.orderDate)}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/orders/${order.id}/print`}>
                <FileText className="mr-2 h-4 w-4" />
                Print
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/orders/${order.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Order
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Items
              </CardTitle>
              <CardDescription>Items included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.product}</p>
                          <p className="text-sm text-gray-500">{item.unit}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold">${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {order.notes && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                  <p>{formatDate(order.orderDate)}</p>
                </div>
              </div>
              {order.expectedDelivery && (
                <div>
                  <p className="text-sm text-gray-500">Expected Delivery</p>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                    <p>{formatDate(order.expectedDelivery)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supplier & Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <div className="flex items-center">
                  <Truck className="mr-1 h-4 w-4 text-gray-500" />
                  <p className="font-medium">{order.supplier}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Location</p>
                <div className="flex items-center">
                  <Building2 className="mr-1 h-4 w-4 text-gray-500" />
                  <p className="font-medium">{order.location}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/suppliers?search=${encodeURIComponent(order.supplier)}`}>View Supplier</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === "Pending" && <Button className="w-full">Mark as Shipped</Button>}
              {order.status === "Shipped" && <Button className="w-full">Mark as Delivered</Button>}
              {(order.status === "Pending" || order.status === "Shipped") && (
                <Button variant="outline" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50">
                  Cancel Order
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href="/orders/create">Create Similar Order</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
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
