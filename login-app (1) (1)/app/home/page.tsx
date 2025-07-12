import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Home, User, Settings, Bell } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white">Welcome Home</h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Hero Section */}
        <Card className="mb-8 bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center">
            <Home className="h-16 w-16 mx-auto mb-4 text-blue-600" />
            <CardTitle className="text-3xl font-bold text-gray-800">You're Successfully Logged In!</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Welcome to your dashboard. Explore the features below.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <User className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Profile</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Settings className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Settings</CardTitle>
              <CardDescription>Configure your account settings and security options</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline">
                Open Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <Bell className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Stay updated with your latest notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                View All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/80">Thank you for using our platform! 🎉</p>
        </div>
      </div>
    </div>
  )
}
