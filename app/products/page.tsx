"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { productsData } from "@/data/products-data"
import { ArrowUpDown, Filter, Search } from "lucide-react"
import { AddProductDialog } from "@/components/dialogs/add-product-dialog"

export default function ProductsPage() {
  const [products, setProducts] = useState(productsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" })

  // Handle product added from dialog
  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products])
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase()
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.supplier.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    )
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-gray-500">Manage your product catalog and pricing</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <AddProductDialog onProductAdded={handleProductAdded} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-gray-500">In your catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(products.map((product) => product.category)).size}</div>
            <p className="text-xs text-gray-500">Product categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(products.map((product) => product.supplier)).size}</div>
            <p className="text-xs text-gray-500">Providing products</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>View and manage your product catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("name")}>
                      Product Name
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "name" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("sku")}>
                      SKU
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "sku" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("category")}>
                      Category
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "category" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("price")}>
                      Price
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "price" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("supplier")}>
                      Supplier
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${sortConfig.key === "supplier" ? "opacity-100" : "opacity-50"}`}
                      />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No products found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <Link href={`/products/${product.id}`} className="hover:underline">
                          {product.name}
                        </Link>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.supplier}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
