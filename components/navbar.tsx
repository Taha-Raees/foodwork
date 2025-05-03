"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Building2, LogOut, Menu, Package, ShoppingCart, Truck, User, Users, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Don't show navbar on login/register pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-emerald-600">FoodWorks</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user && (
              <>
                <NavLink href="/dashboard" active={isActive("/dashboard")}>
                  Dashboard
                </NavLink>
                <NavLink href="/inventory" active={isActive("/inventory")}>
                  Inventory
                </NavLink>
                <NavLink href="/products" active={isActive("/products")}>
                  Products
                </NavLink>
                <NavLink href="/locations" active={isActive("/locations")}>
                  Locations
                </NavLink>
                <NavLink href="/orders" active={isActive("/orders")}>
                  Orders
                </NavLink>
                <NavLink href="/suppliers" active={isActive("/suppliers")}>
                  Suppliers
                </NavLink>
                <NavLink href="/users" active={isActive("/users")}>
                  Users
                </NavLink>
                <NavLink href="/reports" active={isActive("/reports")}>
                  Reports
                </NavLink>
              </>
            )}
          </div>

          {/* Login/Profile button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-emerald-100 text-emerald-800">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <User className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-2">
          <div className="container mx-auto px-4 space-y-1">
            {user ? (
              <>
                <MobileNavLink href="/dashboard" icon={<BarChart3 className="h-5 w-5" />}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink href="/inventory" icon={<Package className="h-5 w-5" />}>
                  Inventory
                </MobileNavLink>
                <MobileNavLink href="/products" icon={<Package className="h-5 w-5" />}>
                  Products
                </MobileNavLink>
                <MobileNavLink href="/locations" icon={<Building2 className="h-5 w-5" />}>
                  Locations
                </MobileNavLink>
                <MobileNavLink href="/orders" icon={<ShoppingCart className="h-5 w-5" />}>
                  Orders
                </MobileNavLink>
                <MobileNavLink href="/suppliers" icon={<Truck className="h-5 w-5" />}>
                  Suppliers
                </MobileNavLink>
                <MobileNavLink href="/users" icon={<Users className="h-5 w-5" />}>
                  Users
                </MobileNavLink>
                <MobileNavLink href="/reports" icon={<BarChart3 className="h-5 w-5" />}>
                  Reports
                </MobileNavLink>
                <div className="pt-2 pb-1">
                  <Button onClick={logout} className="w-full" size="sm" variant="outline">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-2 pb-1">
                <Button asChild className="w-full" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        active ? "bg-emerald-100 text-emerald-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, icon, children }) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        active ? "bg-emerald-100 text-emerald-700" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </Link>
  )
}
