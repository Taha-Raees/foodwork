"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { locationsData } from "@/data/locations-data"
import { ArrowUpDown, Filter, Search } from "lucide-react"
import { AddLocationDialog } from "@/components/dialogs/add-location-dialog"

export default function LocationsPage() {
  const [locations, setLocations] = useState(locationsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" })

  // Handle location added from dialog
  const handleLocationAdded = (newLocation) => {
    setLocations([newLocation, ...locations])
  }

  // Filter locations based on search query
  const filteredLocations = locations.filter((location) => {
    const query = searchQuery.toLowerCase()
    return (
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.manager.toLowerCase().includes(query)
    )
  })

  // Sort locations
  const sortedLocations = [...filteredLocations].sort((a, b) => {
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

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case "Warning":
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
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-gray-500">Manage your stores, warehouses, and distribution centers</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <AddLocationDialog onLocationAdded={handleLocationAdded} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-gray-500">Active locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {locations
                .reduce((total, location) => {
                  const value =
                    typeof location.value === "string"
                      ? Number.parseFloat(location.value.replace("$", ""))
                      : location.value
                  return total + value
                }, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-gray-500">Across all locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Locations with Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.filter((location) => location.alerts > 0).length}</div>
            <p className="text-xs text-gray-500">Locations requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
          <CardDescription>View and manage your business locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search locations..."
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
                  <TableHead className="w-[250px]">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                      Location Name
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "name" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("address")}>
                      Address
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "address" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("manager")}>
                      Manager
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "manager" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("value")}>
                      Inventory Value
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "value" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">
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
                {sortedLocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No locations found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedLocations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell className="font-medium">
                        <Link href={`/locations/${location.id}`} className="hover:underline">
                          {location.name}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{location.address}</TableCell>
                      <TableCell>{location.manager}</TableCell>
                      <TableCell className="text-right">{location.value}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusVariant(location.status)}>{location.status}</Badge>
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
