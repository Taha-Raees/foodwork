"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { inventoryData } from "@/data/inventory-data"
import { ArrowUpDown, FileDown, Filter, Search } from "lucide-react"
import { AddInventoryDialog } from "@/components/dialogs/add-inventory-dialog"

export default function InventoryPage() {
  const [inventory, setInventory] = useState(inventoryData)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" })

  // Handle inventory added from dialog
  const handleInventoryAdded = (newItem) => {
    setInventory([newItem, ...inventory])
  }

  // Filter inventory based on search query
  const filteredInventory = inventory.filter((item) => {
    const query = searchQuery.toLowerCase()
    return (
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    )
  })

  // Sort inventory
  const sortedInventory = [...filteredInventory].sort((a, b) => {
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

  // Format currency
  const formatCurrency = (value) => {
    if (typeof value === "string" && value.startsWith("$")) {
      return value
    }
    return `$${value.toFixed(2)}`
  }

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "Low":
        return "warning"
      case "Critical":
        return "destructive"
      case "Good":
        return "success"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500">Manage and track your inventory across all locations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <AddInventoryDialog onInventoryAdded={handleInventoryAdded} />
          <Link href="/inventory/export">
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-gray-500">Across all locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {inventory
                .reduce((total, item) => {
                  const value =
                    typeof item.value === "string" ? Number.parseFloat(item.value.replace("$", "")) : item.value
                  return total + value
                }, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">Current inventory value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.filter((item) => item.status === "Low" || item.status === "Critical").length}
            </div>
            <p className="text-xs text-gray-500">Items that need reordering</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>View and manage your inventory across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search inventory..."
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
                  <TableHead className="w-[300px]">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                      Product Name
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "name" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("category")}>
                      Category
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "category" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("location")}>
                      Location
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "location" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("quantity")}>
                      Quantity
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "quantity" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("value")}>
                      Value
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "value" ? "opacity-100" : "opacity-50"}`}
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
                {sortedInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No inventory items found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <Link href={`/inventory/${item.id}`} className="hover:underline">
                          {item.name}
                        </Link>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="text-right">
                        {item.quantity} {item.unit}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
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
