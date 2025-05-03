"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { usersData } from "@/data/users-data"
import { PlusCircle } from "lucide-react"

export function AddLocationDialog({ onLocationAdded }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    managerId: "",
    storageCapacity: "",
    type: "store",
    notes: "",
  })

  // Location types
  const locationTypes = [
    { value: "store", label: "Retail Store" },
    { value: "warehouse", label: "Warehouse" },
    { value: "distribution", label: "Distribution Center" },
    { value: "production", label: "Production Facility" },
  ]

  // Get managers (filter users with manager role)
  const managers = usersData.filter((user) => user.role === "manager" || user.role === "admin")

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      managerId: "",
      storageCapacity: "",
      type: "store",
      notes: "",
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would make an API call to add the location
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get manager details
      const manager = managers.find((m) => m.id === formData.managerId)

      // Create location (in a real app, this would be sent to the backend)
      const newLocation = {
        id: `loc-${Math.floor(Math.random() * 10000)}`,
        name: formData.name,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        value: "$0.00",
        status: "Good",
        alerts: 0,
        products: 0,
        manager: manager ? manager.name : "Unassigned",
        phone: formData.phone,
        type: formData.type,
        storageCapacity: formData.storageCapacity ? `${formData.storageCapacity} sq ft` : "Not specified",
        notes: formData.notes,
      }

      console.log("New location added:", newLocation)

      toast({
        title: "Location added successfully",
        description: `${formData.name} has been added to your locations.`,
      })

      // Call the callback function if provided
      if (onLocationAdded) {
        onLocationAdded(newLocation)
      }

      // Close the dialog and reset form
      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error adding location:", error)
      toast({
        title: "Failed to add location",
        description: "There was an error adding the location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Location</DialogTitle>
          <DialogDescription>Enter details for the new location</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Location Name*</Label>
                    <Input
                      id="name"
                      placeholder="Enter location name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Location Type*</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address*</Label>
                  <Input
                    id="address"
                    placeholder="Enter street address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 md:col-span-2 space-y-2">
                    <Label htmlFor="city">City*</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State*</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code*</Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter zip code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Management & Capacity */}
            <div>
              <h3 className="text-lg font-medium mb-4">Management & Capacity</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager">Location Manager</Label>
                    <Select value={formData.managerId} onValueChange={(value) => handleInputChange("managerId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storageCapacity">Storage Capacity (sq ft)</Label>
                    <Input
                      id="storageCapacity"
                      type="number"
                      placeholder="Enter storage capacity"
                      value={formData.storageCapacity}
                      onChange={(e) => handleInputChange("storageCapacity", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional information about this location"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
