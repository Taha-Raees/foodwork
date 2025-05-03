"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Download, BarChart3, PieChart, TrendingUp, DollarSign, Package, AlertCircle } from "lucide-react"
import { inventoryData } from "@/data/inventory-data"
import { ordersData } from "@/data/orders-data"
import { productsData } from "@/data/products-data"
import { locationsData } from "@/data/locations-data"

// Import charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("30days")
  const [locationFilter, setLocationFilter] = useState("all")

  // Calculate total inventory value
  const totalInventoryValue = inventoryData.reduce((total, item) => total + item.value, 0)

  // Calculate low stock items
  const lowStockItems = inventoryData.filter((item) => item.status === "Low").length

  // Calculate total orders
  const totalOrders = ordersData.length

  // Calculate pending orders
  const pendingOrders = ordersData.filter((order) => order.status === "Pending").length

  // Calculate total products
  const totalProducts = productsData.length

  // Calculate total locations
  const totalLocations = locationsData.length

  // Prepare data for inventory value by category chart
  const inventoryByCategory = inventoryData.reduce((acc, item) => {
    const existingCategory = acc.find((cat) => cat.name === item.category)
    if (existingCategory) {
      existingCategory.value += item.value
    } else {
      acc.push({ name: item.category, value: item.value })
    }
    return acc
  }, [])

  // Prepare data for inventory status chart
  const inventoryByStatus = [
    {
      name: "Good",
      value: inventoryData.filter((item) => item.status === "Good").length,
    },
    {
      name: "Warning",
      value: inventoryData.filter((item) => item.status === "Warning").length,
    },
    {
      name: "Low",
      value: inventoryData.filter((item) => item.status === "Low").length,
    },
  ]

  // Prepare data for orders by status chart
  const ordersByStatus = [
    {
      name: "Pending",
      value: ordersData.filter((order) => order.status === "Pending").length,
    },
    {
      name: "Shipped",
      value: ordersData.filter((order) => order.status === "Shipped").length,
    },
    {
      name: "Delivered",
      value: ordersData.filter((order) => order.status === "Delivered").length,
    },
    {
      name: "Cancelled",
      value: ordersData.filter((order) => order.status === "Cancelled").length,
    },
  ]

  // Prepare data for inventory value by location chart
  const inventoryByLocation = [
    {
      name: "Downtown",
      value: inventoryData
        .filter((item) => item.location === "Downtown Store")
        .reduce((total, item) => total + item.value, 0),
    },
    {
      name: "Westside",
      value: inventoryData
        .filter((item) => item.location === "Westside Location")
        .reduce((total, item) => total + item.value, 0),
    },
    {
      name: "Eastside",
      value: inventoryData
        .filter((item) => item.location === "Eastside Location")
        .reduce((total, item) => total + item.value, 0),
    },
    {
      name: "Northside",
      value: inventoryData
        .filter((item) => item.location === "Northside Branch")
        .reduce((total, item) => total + item.value, 0),
    },
  ]

  // Prepare data for monthly inventory value trend (simulated)
  const monthlyInventoryTrend = [
    { name: "Jan", value: 95000 },
    { name: "Feb", value: 98000 },
    { name: "Mar", value: 102000 },
    { name: "Apr", value: 110000 },
    { name: "May", value: 115000 },
    { name: "Jun", value: 120000 },
    { name: "Jul", value: 118000 },
    { name: "Aug", value: 125000 },
    { name: "Sep", value: 130000 },
    { name: "Oct", value: 135000 },
    { name: "Nov", value: 140000 },
    { name: "Dec", value: 145000 },
  ]

  // Prepare data for monthly orders trend (simulated)
  const monthlyOrdersTrend = [
    { name: "Jan", value: 45 },
    { name: "Feb", value: 52 },
    { name: "Mar", value: 48 },
    { name: "Apr", value: 55 },
    { name: "May", value: 59 },
    { name: "Jun", value: 65 },
    { name: "Jul", value: 68 },
    { name: "Aug", value: 72 },
    { name: "Sep", value: 75 },
    { name: "Oct", value: 80 },
    { name: "Nov", value: 85 },
    { name: "Dec", value: 95 },
  ]

  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">View insights and trends for your inventory management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Date Range
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="w-full sm:w-1/2 md:w-1/4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/4">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="downtown">Downtown Store</SelectItem>
              <SelectItem value="westside">Westside Location</SelectItem>
              <SelectItem value="eastside">Eastside Location</SelectItem>
              <SelectItem value="northside">Northside Branch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Inventory Value"
          value={`$${totalInventoryValue.toFixed(2)}`}
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          trend="+5.2% from last month"
          trendUp={true}
        />
        <MetricCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={<Package className="h-5 w-5 text-emerald-600" />}
          trend="+12 new products"
          trendUp={true}
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockItems.toString()}
          icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
          trend="-3 from last week"
          trendUp={false}
        />
        <MetricCard
          title="Pending Orders"
          value={pendingOrders.toString()}
          icon={<Package className="h-5 w-5 text-emerald-600" />}
          trend="+2 new orders"
          trendUp={true}
        />
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
          <TabsTrigger value="orders">Order Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends & Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Inventory Value by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Inventory Value by Category
                </CardTitle>
                <CardDescription>Distribution of inventory value across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={inventoryByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inventoryByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Inventory Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Inventory Status Distribution
                </CardTitle>
                <CardDescription>Number of products by inventory status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Products" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Value by Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Inventory Value by Location
                </CardTitle>
                <CardDescription>Total inventory value across different store locations</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryByLocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="value" name="Inventory Value" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Products by Value */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Top Products by Value
                </CardTitle>
                <CardDescription>Products with the highest inventory value</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryData
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)
                      .map((item) => ({ name: item.name, value: item.value }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="value" name="Value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Orders by Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Orders by Status
                </CardTitle>
                <CardDescription>Distribution of orders by current status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Orders Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Monthly Orders Trend
                </CardTitle>
                <CardDescription>Number of orders placed each month</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyOrdersTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Orders" stroke="#10b981" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Suppliers by Order Value */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Top Suppliers by Order Value
                </CardTitle>
                <CardDescription>Suppliers with the highest order values</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ordersData
                      .reduce((acc, order) => {
                        const existingSupplier = acc.find((s) => s.name === order.supplier)
                        if (existingSupplier) {
                          existingSupplier.value += order.total
                        } else {
                          acc.push({ name: order.supplier, value: order.total })
                        }
                        return acc
                      }, [])
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 5)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="value" name="Order Value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Orders by Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Orders by Location
                </CardTitle>
                <CardDescription>Number of orders placed by each location</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ordersData.reduce((acc, order) => {
                      const existingLocation = acc.find((loc) => loc.name === order.location)
                      if (existingLocation) {
                        existingLocation.value += 1
                      } else {
                        acc.push({ name: order.location, value: 1 })
                      }
                      return acc
                    }, [])}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Orders" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Inventory Value Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Inventory Value Trend
                </CardTitle>
                <CardDescription>Monthly inventory value over the past year</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyInventoryTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Inventory Value"
                      stroke="#10b981"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Waste Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Waste Analysis
                </CardTitle>
                <CardDescription>Monthly waste by category (simulated data)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Jan", produce: 120, dairy: 85, meat: 45, bakery: 30 },
                      { name: "Feb", produce: 110, dairy: 75, meat: 40, bakery: 35 },
                      { name: "Mar", produce: 105, dairy: 90, meat: 50, bakery: 25 },
                      { name: "Apr", produce: 95, dairy: 80, meat: 35, bakery: 20 },
                      { name: "May", produce: 90, dairy: 70, meat: 30, bakery: 25 },
                      { name: "Jun", produce: 85, dairy: 65, meat: 25, bakery: 20 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="produce" name="Fresh Produce" stackId="a" fill="#10b981" />
                    <Bar dataKey="dairy" name="Dairy Products" stackId="a" fill="#0ea5e9" />
                    <Bar dataKey="meat" name="Meat & Poultry" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="bakery" name="Bakery Items" stackId="a" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seasonal Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Seasonal Product Performance
                </CardTitle>
                <CardDescription>Quarterly sales performance by product category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Q1", produce: 25000, dairy: 18000, meat: 22000, bakery: 15000 },
                      { name: "Q2", produce: 32000, dairy: 19000, meat: 21000, bakery: 16000 },
                      { name: "Q3", produce: 30000, dairy: 20000, meat: 24000, bakery: 18000 },
                      { name: "Q4", produce: 28000, dairy: 22000, meat: 26000, bakery: 20000 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="produce" name="Fresh Produce" fill="#10b981" />
                    <Bar dataKey="dairy" name="Dairy Products" fill="#0ea5e9" />
                    <Bar dataKey="meat" name="Meat & Poultry" fill="#f59e0b" />
                    <Bar dataKey="bakery" name="Bakery Items" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reorder Frequency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Reorder Frequency
                </CardTitle>
                <CardDescription>How often products need to be reordered</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={[
                        { name: "Weekly", value: 35 },
                        { name: "Bi-weekly", value: 25 },
                        { name: "Monthly", value: 30 },
                        { name: "Quarterly", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, icon, trend, trendUp }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 rounded-md bg-gray-100">{icon}</span>
          <div className={`flex items-center text-sm ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
            <span>{trend}</span>
            {trendUp ? (
              <TrendingUp className="ml-1 h-4 w-4" />
            ) : (
              <TrendingUp className="ml-1 h-4 w-4 transform rotate-180" />
            )}
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
