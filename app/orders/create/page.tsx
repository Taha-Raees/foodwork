"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Minus, Plus, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { productsData } from "@/data/products-data"
import { suppliersData } from "@/data/suppliers-data"
import { locationsData } from "@/data/locations-data"

export default function CreateOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Order form state
  const [orderData, setOrderData] = useState({
    supplier: "",
    location: "",
    expectedDelivery: new Date(),
    notes: "",
  })

  // Order items state
  const [orderItems, setOrderItems] = useState([])
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: 1,
  })

  // Calculate order total
  const orderTotal = orderItems.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setOrderData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle adding an item to the order
  const handleAddItem = () => {
    if (!currentItem.productId) {
      toast({
        title: "Product required",
        description: "Please select a product to add to the order.",
        variant: "destructive",
      })
      return
    }

    const product = productsData.find((p) => p.id === currentItem.productId)
    if (!product) return

    // Check if product already exists in order
    const existingItemIndex = orderItems.findIndex((item) => item.productId === currentItem.productId)

    if (existingItemIndex >= 0) {
      // Update quantity if product already in order
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity += currentItem.quantity
      setOrderItems(updatedItems)
    } else {
      // Add new product to order
      setOrderItems([
        ...orderItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          unit: product.unit,
          quantity: currentItem.quantity,
        },
      ])
    }

    // Reset current item
    setCurrentItem({
      productId: "",
      quantity: 1,
    })
  }

  // Handle removing an item from the order
  const handleRemoveItem = (index) => {
    const updatedItems = [...orderItems]
    updatedItems.splice(index, 1)
    setOrderItems(updatedItems)
  }

  // Handle updating item quantity
  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return

    const updatedItems = [...orderItems]
    updatedItems[index].quantity = newQuantity
    setOrderItems(updatedItems)
  }

  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault()

    if (orderItems.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to the order.",
        variant: "destructive",
      })
      return
    }

    if (!orderData.supplier) {
      toast({
        title: "Supplier required",
        description: "Please select a supplier for this order.",
        variant: "destructive",
      })
      return
    }

    if (!orderData.location) {
      toast({
        title: "Location required",
        description: "Please select a delivery location for this order.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, you would make an API call to create the order
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a new order number
      const orderNumber = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`

      // Get supplier and location names
      const supplier = suppliersData.find((s) => s.id === orderData.supplier)?.name || ""
      const location = locationsData.find((l) => l.id === orderData.location)?.name || ""

      // Create new order object (in a real app, this would be sent to the backend)
      const newOrder = {
        id: `ord-${Math.floor(Math.random() * 10000)}`,
        orderNumber,
        orderDate: new Date().toISOString(),
        expectedDelivery: orderData.expectedDelivery.toISOString(),
        supplier,
        location,
        total: orderTotal,
        status: "Pending",
        items: orderItems.map((item) => ({
          id: `item-${Math.floor(Math.random() * 10000)}`,
          product: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: item.price,
        })),
        notes: orderData.notes,
      }

      console.log("New order created:", newOrder)

      toast({
        title: "Order created successfully",
        description: `Order ${orderNumber} has been created.`,
      })

      // Redirect to orders page
      router.push("/orders")
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Failed to create order",
        description: "There was an error creating the order. Please try again.",
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
          <h1 className="text-3xl font-bold">Create Purchase Order</h1>
          <p className="text-gray-500">Create a new order for products from suppliers</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supplier and Location */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Select supplier and delivery location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Select value={orderData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
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
                    <Label htmlFor="location">Delivery Location</Label>
                    <Select value={orderData.location} onValueChange={(value) => handleInputChange("location", value)}>
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
                </div>

                <div className="space-y-2">
                  <Label>Expected Delivery Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !orderData.expectedDelivery && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {orderData.expectedDelivery ? (
                          format(orderData.expectedDelivery, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={orderData.expectedDelivery}
                        onSelect={(date) => handleInputChange("expectedDelivery", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special instructions or notes for this order"
                    value={orderData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Add Products */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Add products to this order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Select
                      value={currentItem.productId}
                      onValueChange={(value) => setCurrentItem({ ...currentItem, productId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {productsData.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.price.toFixed(2)} / {product.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-r-none"
                        onClick={() =>
                          setCurrentItem({ ...currentItem, quantity: Math.max(1, currentItem.quantity - 1) })
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={currentItem.quantity}
                        onChange={(e) =>
                          setCurrentItem({ ...currentItem, quantity: Number.parseInt(e.target.value) || 1 })
                        }
                        className="h-10 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-l-none"
                        onClick={() => setCurrentItem({ ...currentItem, quantity: currentItem.quantity + 1 })}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button type="button" variant="secondary" className="w-full" onClick={handleAddItem}>
                  Add to Order
                </Button>

                {orderItems.length > 0 && (
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.unit}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items:</span>
                  <span>{orderItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Quantity:</span>
                  <span>{orderItems.reduce((total, item) => total + item.quantity, 0)} units</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-4 border-t">
                  <span>Total Amount:</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Order..." : "Create Order"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
