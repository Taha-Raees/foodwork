"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Mail, MapPin, Phone, Plus, Search, Truck } from "lucide-react"
import { suppliersData } from "@/data/suppliers-data"

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  // Filter and sort the suppliers data
  const filteredSuppliers = suppliersData
    .filter((supplier) => {
      // Search term filter
      if (searchTerm && !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // Sort by the selected field
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "products") {
        return sortDirection === "asc" ? a.products - b.products : b.products - a.products
      } else if (sortField === "orders") {
        return sortDirection === "asc" ? a.orders - b.orders : b.orders - a.orders
      }
      return 0
    })

  // Handle sort toggle
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-gray-500">Manage your product suppliers</p>
        </div>
        <Button asChild>
          <Link href="/suppliers/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Suppliers
          </CardTitle>
          <CardDescription>{filteredSuppliers.length} suppliers found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button variant="ghost" onClick={() => toggleSort("name")} className="flex items-center">
                      Supplier Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => toggleSort("products")} className="flex items-center">
                      Products
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => toggleSort("orders")} className="flex items-center">
                      Orders
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No suppliers found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        <Link href={`/suppliers/${supplier.id}`} className="hover:underline">
                          {supplier.name}
                        </Link>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {supplier.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm flex items-center">
                            <Phone className="h-3 w-3 mr-1 text-gray-500" />
                            {supplier.phone}
                          </div>
                          <div className="text-sm flex items-center">
                            <Mail className="h-3 w-3 mr-1 text-gray-500" />
                            {supplier.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.products}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{supplier.orders} total</span>
                          {supplier.pendingOrders > 0 && (
                            <span className="text-sm text-amber-600">{supplier.pendingOrders} pending</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <SupplierStatusBadge status={supplier.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/suppliers/${supplier.id}`}>View</Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link href={`/suppliers/${supplier.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
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

function SupplierStatusBadge({ status }) {
  let variant

  switch (status) {
    case "Active":
      variant = "success"
      break
    case "Inactive":
      variant = "secondary"
      break
    case "On Hold":
      variant = "warning"
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
