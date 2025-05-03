"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { productsData } from "@/data/products-data"
import { locationsData } from "@/data/locations-data"

export default function AddInventoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    productId: "",
    locationId: "",
    quantity: "",
    notes: "",
  })

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.productId || !formData.locationId || !formData.quantity) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would make an API call to add inventory
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get product and location details
      const product = productsData.find((p) => p.id === formData.productId)
      const location = locationsData.find((l) => l.id === formData.locationId)

      // Create inventory item (in a real app, this would be sent to the backend)
      const newInventoryItem = {
        id: `inv-${Math.floor(Math.random() * 10000)}`,
        name: product.name,
        category: product.category,
        location: location.name,
        quantity: Number.parseInt(formData.quantity),
        unit: product.unit,
        value: product.price * Number.parseInt(formData.quantity),
        status: "Good",
        lastUpdated: new Date().toISOString(),
      }

      console.log("New inventory item added:", newInventoryItem)

      toast({
        title: "Inventory added successfully",
        description: `Added ${formData.quantity} ${product.unit} of ${product.name} to ${location.name}.`,
      })

      // Redirect to inventory page
      router.push("/inventory")
    } catch (error) {
      console.error("Error adding inventory:", error)
      toast({
        title: "Failed to add inventory",
        description: "There was an error adding the inventory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Get selected product details
  const selectedProduct = formData.productId ? productsData.find((p) => p.id === formData.productId) : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Add Inventory</h1>
          <p className="text-gray-500">Add new items to your inventory</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add Inventory</CardTitle>
            <CardDescription>Add new stock to your inventory</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={formData.productId} onValueChange={(value) => handleInputChange("productId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsData.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProduct && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unit</p>
                      <p className="font-medium">{selectedProduct.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price per Unit</p>
                      <p className="font-medium">${selectedProduct.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Supplier</p>
                      <p className="font-medium">{selectedProduct.supplier}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={formData.locationId} onValueChange={(value) => handleInputChange("locationId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationsData.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder={`Enter quantity (${selectedProduct ? selectedProduct.unit : "units"})`}
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Add any notes about this inventory addition"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              {selectedProduct && formData.quantity && (
                <div className="p-4 bg-emerald-50 rounded-md">
                  <p className="text-sm text-emerald-800">
                    Total Value:{" "}
                    <span className="font-bold">
                      ${(selectedProduct.price * Number.parseInt(formData.quantity || 0)).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Inventory"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
