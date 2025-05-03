"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { inventoryData } from "@/data/inventory-data"

export default function ExportInventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Export options
  const [exportFormat, setExportFormat] = useState("csv")
  const [locationFilter, setLocationFilter] = useState("all")
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    category: true,
    location: true,
    quantity: true,
    unit: true,
    value: true,
    status: true,
    lastUpdated: false,
  })

  // Get unique locations for filter
  const locations = [...new Set(inventoryData.map((item) => item.location))]

  // Handle checkbox change
  const handleCheckboxChange = (field) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Handle export
  const handleExport = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would generate and download the file
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Filter data based on location
      let filteredData = [...inventoryData]
      if (locationFilter !== "all") {
        filteredData = filteredData.filter((item) => item.location === locationFilter)
      }

      // Filter fields
      const fieldsToExport = Object.entries(selectedFields)
        .filter(([_, selected]) => selected)
        .map(([field]) => field)

      // Create export data (in a real app, this would be converted to CSV/Excel)
      const exportData = filteredData.map((item) => {
        const exportItem = {}
        fieldsToExport.forEach((field) => {
          exportItem[field] = item[field]
        })
        return exportItem
      })

      console.log(`Exporting ${filteredData.length} items as ${exportFormat}:`, exportData)

      toast({
        title: "Export successful",
        description: `${filteredData.length} inventory items have been exported as ${exportFormat.toUpperCase()}.`,
      })

      // In a real app, this would trigger a file download
      // For demo purposes, we'll just redirect back to inventory
      setTimeout(() => {
        router.push("/inventory")
      }, 1000)
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the inventory data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Export Inventory</h1>
          <p className="text-gray-500">Export your inventory data to CSV or Excel</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Configure your export settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Export Format</Label>
              <RadioGroup value={exportFormat} onValueChange={setExportFormat} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="flex items-center">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Excel
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="location">Filter by Location</Label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Fields to Export</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="name"
                    checked={selectedFields.name}
                    onCheckedChange={() => handleCheckboxChange("name")}
                  />
                  <Label htmlFor="name">Product Name</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="category"
                    checked={selectedFields.category}
                    onCheckedChange={() => handleCheckboxChange("category")}
                  />
                  <Label htmlFor="category">Category</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="location"
                    checked={selectedFields.location}
                    onCheckedChange={() => handleCheckboxChange("location")}
                  />
                  <Label htmlFor="location">Location</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quantity"
                    checked={selectedFields.quantity}
                    onCheckedChange={() => handleCheckboxChange("quantity")}
                  />
                  <Label htmlFor="quantity">Quantity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unit"
                    checked={selectedFields.unit}
                    onCheckedChange={() => handleCheckboxChange("unit")}
                  />
                  <Label htmlFor="unit">Unit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="value"
                    checked={selectedFields.value}
                    onCheckedChange={() => handleCheckboxChange("value")}
                  />
                  <Label htmlFor="value">Value</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status"
                    checked={selectedFields.status}
                    onCheckedChange={() => handleCheckboxChange("status")}
                  />
                  <Label htmlFor="status">Status</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lastUpdated"
                    checked={selectedFields.lastUpdated}
                    onCheckedChange={() => handleCheckboxChange("lastUpdated")}
                  />
                  <Label htmlFor="lastUpdated">Last Updated</Label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                {locationFilter === "all"
                  ? `Exporting all ${inventoryData.length} inventory items`
                  : `Exporting ${inventoryData.filter((item) => item.location === locationFilter).length} items from ${locationFilter}`}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleExport}
                disabled={isLoading || Object.values(selectedFields).every((v) => !v)}
              >
                {isLoading ? (
                  "Exporting..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export {exportFormat.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
