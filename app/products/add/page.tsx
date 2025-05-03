"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { suppliersData } from "@/data/suppliers-data"

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    unit: "",
    supplierId: "",
    reorderThreshold: "",
    description: "",
  })

  // Categories
  const categories = [
    "Fresh Produce",
    "Dairy Products",
    "Meat & Poultry",
    "Seafood",
    "Bakery Items",
    "Frozen Foods",
    "Canned Goods",
    "Dry Goods",
    "Beverages",
    "Snacks",
    "Condiments",
    "Spices",
  ]

  // Units
  const units = [
    "kg",
    "g",
    "lb",
    "oz",
    "liter",
    "ml",
    "gallon",
    "unit",
    "case",
    "box",
    "pack",
    "dozen",
    "container",
    "bottle",
    "jar",
  ]

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Generate SKU
  const generateSKU = () => {
    const prefix = "PROD"
    const category = formData.category ? formData.category.substring(0, 2).toUpperCase() : "XX"
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    const sku = `${prefix}-${category}-${random}`
    handleInputChange("sku", sku)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (
      !formData.name ||
      !formData.sku ||
      !formData.category ||
      !formData.price ||
      !formData.unit ||
      !formData.supplierId
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would make an API call to add the product
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get supplier details
      const supplier = suppliersData.find((s) => s.id === formData.supplierId)

      // Create product (in a real app, this would be sent to the backend)
      const newProduct = {
        id: `prod-${Math.floor(Math.random() * 10000)}`,
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        unit: formData.unit,
        supplier: supplier.name,
        reorderThreshold: Number.parseInt(formData.reorderThreshold) || 10,
        description: formData.description,
      }

      console.log("New product added:", newProduct)

      toast({
        title: "Product added successfully",
        description: `${formData.name} has been added to your product catalog.`,
      })

      // Redirect to products page
      router.push("/products")
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Failed to add product",
        description: "There was an error adding the product. Please try again.",
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
          <h1 className="text-3xl font-bold">Add Product</h1>
          <p className="text-gray-500">Add a new product to your catalog</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
            <CardDescription>Add a new product to your catalog</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      placeholder="Product SKU"
                      value={formData.sku}
                      onChange={(e) => handleInputChange("sku", e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateSKU}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="pl-7"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select value={formData.supplierId} onValueChange={(value) => handleInputChange("supplierId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliersData.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorderThreshold">Reorder Threshold</Label>
                  <Input
                    id="reorderThreshold"
                    type="number"
                    min="1"
                    placeholder="Minimum stock level"
                    value={formData.reorderThreshold}
                    onChange={(e) => handleInputChange("reorderThreshold", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
