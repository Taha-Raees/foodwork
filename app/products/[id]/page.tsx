"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Edit, Package, Tag, Truck, AlertTriangle, BarChart3 } from "lucide-react"
import Link from "next/link"
import { productsData } from "@/data/products-data"
import { inventoryData } from "@/data/inventory-data"

export default function ProductDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inventoryItems, setInventoryItems] = useState([])

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = async () => {
      try {
        const foundProduct = productsData.find((p) => p.id === params.id)

        if (!foundProduct) {
          toast({
            title: "Product not found",
            description: "The requested product could not be found.",
            variant: "destructive",
          })
          router.push("/products")
          return
        }

        setProduct(foundProduct)

        // Get inventory items for this product
        const relatedInventory = inventoryData.filter((item) => item.name === foundProduct.name)
        setInventoryItems(relatedInventory)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) return null

  // Calculate total inventory quantity across all locations
  const totalInventory = inventoryItems.reduce((sum, item) => sum + item.quantity, 0)

  // Check if product is low on stock
  const isLowStock = totalInventory < product.reorderThreshold

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Badge variant="outline" className="flex items-center">
                <Tag className="mr-1 h-3 w-3" />
                {product.category}
              </Badge>
            </div>
            <p className="text-gray-500">SKU: {product.sku}</p>
          </div>
          <Button asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{product.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">SKU</p>
                          <p className="font-medium">{product.sku}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">{product.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p>{product.description || "No description available."}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Pricing & Supply</h3>
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">
                            ${product.price.toFixed(2)} per {product.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Unit</p>
                          <p className="font-medium">{product.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Supplier</p>
                          <p className="font-medium">{product.supplier}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Reorder Threshold</p>
                          <p className="font-medium">
                            {product.reorderThreshold} {product.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Inventory Status
                  </CardTitle>
                  <CardDescription>Current inventory levels across all locations</CardDescription>
                </CardHeader>
                <CardContent>
                  {inventoryItems.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No inventory data available for this product.</p>
                      <Button asChild className="mt-4">
                        <Link href="/inventory/add">Add Inventory</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Total Inventory</p>
                              <p className="text-3xl font-bold">
                                {totalInventory} {product.unit}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Total Value</p>
                              <p className="text-3xl font-bold">${(totalInventory * product.price).toFixed(2)}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Status</p>
                              {isLowStock ? (
                                <div className="flex items-center justify-center">
                                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
                                  <p className="text-xl font-bold text-amber-500">Low Stock</p>
                                </div>
                              ) : (
                                <p className="text-xl font-bold text-emerald-500">In Stock</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Inventory by Location</h3>
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Location
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Quantity
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Value
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {inventoryItems.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{item.location}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {item.quantity} {product.unit}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      ${(item.quantity * product.price).toFixed(2)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge
                                      variant={
                                        item.status === "Low"
                                          ? "destructive"
                                          : item.status === "Warning"
                                            ? "warning"
                                            : "success"
                                      }
                                    >
                                      {item.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/inventory/add">Add Inventory</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Order History
                  </CardTitle>
                  <CardDescription>Recent orders containing this product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-gray-500">Order history will be displayed here.</p>
                    <Button asChild className="mt-4">
                      <Link href="/orders/create">Create New Order</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/orders/create">Order More</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/inventory/add">Add to Inventory</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/products/${product.id}/edit`}>Edit Product</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="font-medium">{product.supplier}</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/suppliers?search=${encodeURIComponent(product.supplier)}`}>View Supplier Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
