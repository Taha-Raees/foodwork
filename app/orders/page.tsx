"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ordersData } from "@/data/orders-data"
import { ArrowUpDown, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { CreateOrderDialog } from "@/components/dialogs/create-order-dialog"

export default function OrdersPage() {
  const [orders, setOrders] = useState(ordersData)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "orderDate", direction: "desc" })

  // Handle order created from dialog
  const handleOrderCreated = (newOrder) => {
    setOrders([newOrder, ...orders])
  }

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.supplier.toLowerCase().includes(query) ||
      order.location.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    )
  })

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning"
      case "Shipped":
        return "info"
      case "Delivered":
        return "success"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-500">Manage your purchase orders and track deliveries</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <CreateOrderDialog onOrderCreated={handleOrderCreated} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-gray-500">All purchase orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((order) => order.status === "Pending").length}</div>
            <p className="text-xs text-gray-500">Awaiting delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((order) => order.status === "Delivered").length}</div>
            <p className="text-xs text-gray-500">Successfully delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {orders
                .reduce((total, order) => {
                  return total + order.total
                }, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">All purchase orders</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>View and manage your purchase orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("orderNumber")}>
                      Order #
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "orderNumber" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("orderDate")}>
                      Date
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "orderDate" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("supplier")}>
                      Supplier
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "supplier" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("location")}>
                      Location
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "location" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("total")}>
                      Total
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "total" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("status")}>
                      Status
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "status" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No orders found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link href={`/orders/${order.id}`} className="hover:underline">
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.location}</TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
