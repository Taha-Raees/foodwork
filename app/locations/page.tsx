import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Building2, MapPin, Package, Phone, Plus, User } from "lucide-react"
import { locationsData } from "@/data/locations-data"

export default function LocationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-gray-500">Manage your store locations</p>
        </div>
        <Button asChild>
          <Link href="/locations/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locationsData.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  )
}

function LocationCard({ location }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "text-emerald-600"
      case "Warning":
        return "text-amber-600"
      case "Critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Building2 className="mr-2 h-5 w-5 text-emerald-600" />
            {location.name}
          </span>
          {location.alerts > 0 && (
            <Badge variant="destructive" className="flex items-center">
              <AlertCircle className="mr-1 h-3 w-3" />
              {location.alerts} {location.alerts === 1 ? "alert" : "alerts"}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="mr-1 h-4 w-4 text-gray-500" />
          {location.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Inventory Value</p>
            <p className="text-lg font-medium">{location.value}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-lg font-medium ${getStatusColor(location.status)}`}>{location.status}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Package className="mr-2 h-4 w-4" />
            <span>{location.products} products in inventory</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="mr-2 h-4 w-4" />
            <span>Manager: {location.manager}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="mr-2 h-4 w-4" />
            <span>{location.phone}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild variant="outline">
          <Link href={`/inventory?location=${location.id}`}>View Inventory</Link>
        </Button>
        <Button asChild>
          <Link href={`/locations/${location.id}`}>Manage</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
