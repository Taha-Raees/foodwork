import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Building2, Package, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">FoodWorks Inventory Management System</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Centralized inventory tracking and management for multi-location food businesses. Reduce waste, optimize
              ordering, and improve efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
                <Link href="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Package className="h-10 w-10 text-emerald-600" />}
              title="Inventory Management"
              description="Track stock levels across all locations in real-time with automated alerts for low inventory."
            />
            <FeatureCard
              icon={<Building2 className="h-10 w-10 text-emerald-600" />}
              title="Multi-Location Support"
              description="Manage inventory across multiple stores or warehouses with location-specific settings."
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-emerald-600" />}
              title="Role-Based Access"
              description="Assign appropriate permissions to staff members based on their responsibilities."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-emerald-600" />}
              title="Analytics & Reporting"
              description="Gain insights into inventory trends, waste reduction, and ordering patterns."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">FoodWorks Group</h3>
              <p className="text-gray-400">Inventory Management System</p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="hover:text-emerald-400 transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FoodWorks Group. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
