"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import { locationsData } from "@/data/locations-data"
import { usersData } from "@/data/users-data"

export default function EditLocationPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchLocation = async () => {
      try {
        const foundLocation = locationsData.find((l) => l.id === params.id)

        if (!foundLocation) {
          toast({
            title: "Location not found",
            description: "The requested location could not be found.",
            variant: "destructive",
          })
          router.push("/locations")
          return
        }

        setLocation(foundLocation)

        // Parse address into components (in a real app, this would be separate fields in the database)
        const addressParts = foundLocation.address.split(", ")
        const address = addressParts[0] || ""
        const city = addressParts[1] || ""
        const stateZip = addressParts[2] ? addressParts[2].split(" ") : ["", ""]
        const state = stateZip[0] || ""
        const zipCode = stateZip[1] || ""

        // Parse storage capacity
        const storageCapacity = foundLocation.storageCapacity ? foundLocation.storageCapacity.replace(" sq ft", "") : ""

        // Find manager ID
        const manager = usersData.find((user) => user.name === foundLocation.manager)
        const managerId = manager ? manager.id : ""

        // Set form data
        setFormData({
          name: foundLocation.name,
          address,
          city,
          state,
          zipCode,
          phone: foundLocation.phone,
          managerId,
          storageCapacity,
          type: foundLocation.type || "store",
          notes: foundLocation.notes || "",
        })
      } catch (error) {
        console.error("Error fetching location:", error)
        toast({
          title: "Error",
          description: "Failed to load location details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [params.id, router, toast])

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
      // In a real app, you would make an API call to update the location
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get manager details
      const manager = managers.find((m) => m.id === formData.managerId)

      // Create updated location (in a real app, this would be sent to the backend)
      const updatedLocation = {
        ...location,
        name: formData.name,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        phone: formData.phone,
        manager: manager ? manager.name : "Unassigned",
        type: formData.type,
        storageCapacity: formData.storageCapacity ? `${formData.storageCapacity} sq ft` : "Not specified",
        notes: formData.notes,
      }

      console.log("Location updated:", updatedLocation)

      toast({
        title: "Location updated successfully",
        description: `${formData.name} has been updated.`,
      })

      // Redirect to location details page
      router.push(`/locations/${params.id}`)
    } catch (error) {
      console.error("Error updating location:", error)
      toast({
        title: "Failed to update location",
        description: "There was an error updating the location. Please try again.",
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
          <p className="text-gray-500">Loading location details...</p>
        </div>
      </div>
    )
  }

  if (!location) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Edit Location</h1>
            <p className="text-gray-500">Update details for {location.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Location</CardTitle>
            <CardDescription>Update location details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
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
                      <Select
                        value={formData.managerId}
                        onValueChange={(value) => handleInputChange("managerId", value)}
                      >
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
            </CardContent>
            <CardFooter>
              <div className="flex w-full gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
