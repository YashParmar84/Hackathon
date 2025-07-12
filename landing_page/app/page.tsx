import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Search, ArrowRightLeft, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillSwap</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-slate-800">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Exchange Skills,{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Grow Together
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
          Connect with like-minded individuals, share your expertise, and learn new skills through our innovative
          skill-swapping platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
              <Star className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-800 px-8 py-3 text-lg bg-transparent"
          >
            <Users className="w-5 h-5 mr-2" />
            Browse as Guest
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Create Profile</h3>
            <p className="text-slate-300">List your skills and what you want to learn</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Find Matches</h3>
            <p className="text-slate-300">Discover people with complementary skills</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowRightLeft className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Start Swapping</h3>
            <p className="text-slate-300">Exchange knowledge and grow together</p>
          </div>
        </div>
      </section>
    </div>
  )
}
