"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { inventoryData } from "@/data/inventory-data"

export default function AdjustInventoryPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    adjustmentType: "add",
    quantity: "",
    reason: "restock",
    notes: "",
  })

  // Adjustment reasons
  const reasons = {
    add: [
      { value: "restock", label: "Restock" },
      { value: "transfer", label: "Transfer In" },
      { value: "correction", label: "Inventory Correction" },
      { value: "return", label: "Customer Return" },
      { value: "other", label: "Other" },
    ],
    remove: [
      { value: "sale", label: "Sale" },
      { value: "damage", label: "Damaged/Expired" },
      { value: "transfer", label: "Transfer Out" },
      { value: "correction", label: "Inventory Correction" },
      { value: "other", label: "Other" },
    ],
  }

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

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      // If changing adjustment type, reset the reason to the first option for that type
      if (field === "adjustmentType") {
        return {
          ...prev,
          [field]: value,
          reason: reasons[value][0].value,
        }
      }
      return { ...prev, [field]: value }
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity greater than zero.",
        variant: "destructive",
      })
      return
    }

    // If removing, check if there's enough inventory
    if (formData.adjustmentType === "remove" && Number(formData.quantity) > item.quantity) {
      toast({
        title: "Insufficient inventory",
        description: `You cannot remove more than the current quantity (${item.quantity} ${item.unit}).`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would make an API call to adjust the inventory
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Calculate new quantity and value
      const quantityChange = Number(formData.quantity)
      const newQuantity =
        formData.adjustmentType === "add" ? item.quantity + quantityChange : item.quantity - quantityChange

      // Calculate unit price (value / quantity)
      const unitPrice = item.value / item.quantity
      const newValue = newQuantity * unitPrice

      // Determine new status based on quantity
      let newStatus = "Good"
      if (newQuantity <= 10) {
        newStatus = "Low"
      } else if (newQuantity <= 25) {
        newStatus = "Warning"
      }

      // Create updated inventory item (in a real app, this would be sent to the backend)
      const updatedItem = {
        ...item,
        quantity: newQuantity,
        value: newValue,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      }

      console.log("Inventory adjusted:", {
        item: item.name,
        location: item.location,
        adjustmentType: formData.adjustmentType,
        quantity: quantityChange,
        reason: formData.reason,
        notes: formData.notes,
        before: { quantity: item.quantity, value: item.value },
        after: { quantity: newQuantity, value: newValue },
      })

      toast({
        title: "Inventory adjusted successfully",
        description: `${formData.adjustmentType === "add" ? "Added" : "Removed"} ${quantityChange} ${
          item.unit
        } of ${item.name}.`,
      })

      // Redirect to inventory item page
      router.push(`/inventory/${params.id}`)
    } catch (error) {
      console.error("Error adjusting inventory:", error)
      toast({
        title: "Failed to adjust inventory",
        description: "There was an error adjusting the inventory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Adjust Inventory</h1>
            <p className="text-gray-500">
              {item.name} at {item.location}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Adjust Inventory</CardTitle>
            <CardDescription>Add or remove inventory for this item</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Current Inventory Info */}
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Current Quantity</p>
                    <p className="font-medium">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Value</p>
                    <p className="font-medium">${item.value.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{item.status}</p>
                  </div>
                </div>
              </div>

              {/* Adjustment Type */}
              <div className="space-y-3">
                <Label>Adjustment Type</Label>
                <RadioGroup
                  value={formData.adjustmentType}
                  onValueChange={(value) => handleInputChange("adjustmentType", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="add" />
                    <Label htmlFor="add" className="flex items-center">
                      <Plus className="mr-1 h-4 w-4 text-emerald-600" />
                      Add
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remove" id="remove" />
                    <Label htmlFor="remove" className="flex items-center">
                      <Minus className="mr-1 h-4 w-4 text-red-600" />
                      Remove
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity ({item.unit})</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder={`Enter quantity in ${item.unit}`}
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  required
                />
              </div>

              {/* Reason */}
              <div className="space-y-3">
                <Label>Reason</Label>
                <RadioGroup
                  value={formData.reason}
                  onValueChange={(value) => handleInputChange("reason", value)}
                  className="grid grid-cols-2 gap-2"
                >
                  {reasons[formData.adjustmentType].map((reason) => (
                    <div key={reason.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason.value} id={reason.value} />
                      <Label htmlFor={reason.value}>{reason.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this adjustment"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Preview */}
              {formData.quantity && Number(formData.quantity) > 0 && (
                <div className={`p-4 rounded-md ${formData.adjustmentType === "add" ? "bg-emerald-50" : "bg-red-50"}`}>
                  <h4
                    className={`text-sm font-medium ${
                      formData.adjustmentType === "add" ? "text-emerald-800" : "text-red-800"
                    } mb-2`}
                  >
                    Adjustment Preview
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">New Quantity</p>
                      <p className="font-medium">
                        {formData.adjustmentType === "add"
                          ? item.quantity + Number(formData.quantity)
                          : item.quantity - Number(formData.quantity)}{" "}
                        {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Value Change</p>
                      <p className="font-medium">
                        {formData.adjustmentType === "add" ? "+" : "-"}$
                        {((item.value / item.quantity) * Number(formData.quantity)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 ${formData.adjustmentType === "add" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : `${formData.adjustmentType === "add" ? "Add to" : "Remove from"} Inventory`}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
