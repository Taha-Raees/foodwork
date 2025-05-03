import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's an overview of your inventory.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/reports">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
          <Button asChild>
            <Link href="/inventory/add">
              <Package className="mr-2 h-4 w-4" />
              Add Inventory
            </Link>
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <div className="mb-8 space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Stock Alert</AlertTitle>
          <AlertDescription>
            5 products are below minimum stock levels.{" "}
            <Link href="/inventory/low-stock" className="font-medium underline underline-offset-4">
              View items
            </Link>
          </AlertDescription>
        </Alert>
        <Alert>
          <ShoppingCart className="h-4 w-4" />
          <AlertTitle>Pending Orders</AlertTitle>
          <AlertDescription>
            3 orders are awaiting delivery confirmation.{" "}
            <Link href="/orders/pending" className="font-medium underline underline-offset-4">
              View orders
            </Link>
          </AlertDescription>
        </Alert>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Inventory Value"
          value="$124,532.80"
          change="+2.5%"
          trend="up"
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Total Products"
          value="1,284"
          change="+12"
          trend="up"
          icon={<Package className="h-5 w-5 text-emerald-600" />}
        />
        <StatCard
          title="Low Stock Items"
          value="24"
          change="-3"
          trend="down"
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          title="Pending Orders"
          value="8"
          change="+2"
          trend="up"
          icon={<ShoppingCart className="h-5 w-5 text-emerald-600" />}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Overview of current inventory levels across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InventoryStatusItem
                  name="Fresh Produce"
                  status="Good"
                  value="$24,532.50"
                  percentage={85}
                  color="bg-emerald-500"
                />
                <InventoryStatusItem
                  name="Dairy Products"
                  status="Warning"
                  value="$12,845.75"
                  percentage={45}
                  color="bg-amber-500"
                />
                <InventoryStatusItem
                  name="Meat & Poultry"
                  status="Low"
                  value="$18,321.30"
                  percentage={25}
                  color="bg-red-500"
                />
                <InventoryStatusItem
                  name="Bakery Items"
                  status="Good"
                  value="$9,876.25"
                  percentage={72}
                  color="bg-emerald-500"
                />
                <InventoryStatusItem
                  name="Frozen Foods"
                  status="Good"
                  value="$15,432.80"
                  percentage={68}
                  color="bg-emerald-500"
                />
              </div>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/inventory">
                    View All Inventory
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest inventory changes and order updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem
                  action="Stock Added"
                  item="Organic Apples"
                  quantity="50 kg"
                  location="Downtown Store"
                  user="John Smith"
                  time="2 hours ago"
                />
                <ActivityItem
                  action="Order Received"
                  item="Dairy Products"
                  quantity="120 units"
                  location="Westside Location"
                  user="Maria Garcia"
                  time="4 hours ago"
                />
                <ActivityItem
                  action="Stock Removed"
                  item="Chicken Breast"
                  quantity="25 kg"
                  location="Downtown Store"
                  user="Robert Johnson"
                  time="Yesterday"
                />
                <ActivityItem
                  action="Waste Logged"
                  item="Expired Yogurt"
                  quantity="15 units"
                  location="Eastside Location"
                  user="Sarah Williams"
                  time="Yesterday"
                />
                <ActivityItem
                  action="Order Placed"
                  item="Fresh Produce"
                  quantity="200 kg"
                  location="All Locations"
                  user="System"
                  time="2 days ago"
                />
              </div>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/activity">
                    View All Activity
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Locations Overview</CardTitle>
              <CardDescription>Inventory status across all store locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <LocationItem
                  name="Downtown Store"
                  address="123 Main St, City Center"
                  value="$45,321.50"
                  status="Good"
                  alerts={0}
                />
                <LocationItem
                  name="Westside Location"
                  address="456 West Ave, Westside"
                  value="$32,845.75"
                  status="Warning"
                  alerts={3}
                />
                <LocationItem
                  name="Eastside Location"
                  address="789 East Blvd, Eastside"
                  value="$28,932.25"
                  status="Good"
                  alerts={1}
                />
                <LocationItem
                  name="Northside Branch"
                  address="101 North Rd, Northside"
                  value="$18,433.30"
                  status="Critical"
                  alerts={5}
                />
              </div>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/locations">
                    Manage Locations
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, change, trend, icon }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 rounded-md bg-gray-100">{icon}</span>
          <div className={`flex items-center text-sm ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
            <span>{change}</span>
            {trend === "up" ? <TrendingUp className="ml-1 h-4 w-4" /> : <TrendingDown className="ml-1 h-4 w-4" />}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function InventoryStatusItem({ name, status, value, percentage, color }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "text-emerald-600"
      case "Warning":
        return "text-amber-600"
      case "Low":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{name}</p>
          <p className={`text-sm ${getStatusColor(status)}`}>{status}</p>
        </div>
        <p className="font-medium">{value}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

function ActivityItem({ action, item, quantity, location, user, time }) {
  const getActionColor = (action) => {
    switch (action) {
      case "Stock Added":
        return "bg-emerald-100 text-emerald-800"
      case "Stock Removed":
        return "bg-blue-100 text-blue-800"
      case "Order Received":
        return "bg-purple-100 text-purple-800"
      case "Order Placed":
        return "bg-amber-100 text-amber-800"
      case "Waste Logged":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex items-start space-x-4">
      <div className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(action)}`}>{action}</div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between">
          <p className="font-medium">{item}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
        <div className="text-sm text-gray-600">
          <span>{quantity}</span> • <span>{location}</span> • <span>by {user}</span>
        </div>
      </div>
    </div>
  )
}

function LocationItem({ name, address, value, status, alerts }) {
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
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{address}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{value}</p>
        <div className="flex items-center justify-end space-x-2">
          <span className={`text-sm ${getStatusColor(status)}`}>{status}</span>
          {alerts > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              {alerts} {alerts === 1 ? "alert" : "alerts"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
