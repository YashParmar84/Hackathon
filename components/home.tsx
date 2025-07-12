"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { User, ArrowLeftRight, TrendingUp, Users, MessageSquare, Star } from "lucide-react"

interface HomeProps {
  onNavigate: (page: "profile" | "swap" | "home") => void
}

const featuredUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["React", "Node.js", "TypeScript"],
    skillsWanted: ["Python", "Machine Learning"],
    location: "San Francisco, CA",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["UI/UX Design", "Figma", "Photoshop"],
    skillsWanted: ["React", "Frontend Development"],
    location: "Austin, TX",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Emily Watson",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["Data Science", "Python", "SQL"],
    skillsWanted: ["Web Development", "JavaScript"],
    location: "New York, NY",
    rating: 4.7,
  },
]

const stats = [
  { label: "Active Users", value: "2,847", icon: Users, color: "text-blue-400" },
  { label: "Skills Exchanged", value: "15,392", icon: TrendingUp, color: "text-green-400" },
  { label: "Successful Swaps", value: "8,156", icon: MessageSquare, color: "text-purple-400" },
  { label: "Average Rating", value: "4.8", icon: Star, color: "text-yellow-400" },
]

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">SkillSwap Platform</h1>
          <p className="text-xl text-slate-300 mb-6">Exchange skills, grow together</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("profile")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <User className="w-5 h-5 mr-2" />
              Manage Profile
            </Button>
            <Button
              onClick={() => onNavigate("swap")}
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <ArrowLeftRight className="w-5 h-5 mr-2" />
              View Swap Requests
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Users */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Featured Skill Swappers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredUsers.map((user) => (
                <Card
                  key={user.id}
                  className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold truncate">{user.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-sm">{user.rating}</span>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{user.location}</p>

                        <div className="space-y-2">
                          <div>
                            <p className="text-slate-300 text-xs font-medium mb-1">Offers:</p>
                            <div className="flex flex-wrap gap-1">
                              {user.skillsOffered.slice(0, 2).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {user.skillsOffered.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-slate-600/20 text-slate-300 border-slate-500/30 text-xs"
                                >
                                  +{user.skillsOffered.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-300 text-xs font-medium mb-1">Wants:</p>
                            <div className="flex flex-wrap gap-1">
                              {user.skillsWanted.slice(0, 2).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="bg-purple-600/20 text-purple-300 border-purple-500/30 text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button size="sm" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center">How SkillSwap Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">1. Create Your Profile</h3>
                <p className="text-slate-400 text-sm">
                  Set up your profile with skills you can offer and skills you want to learn.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeftRight className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">2. Find Skill Matches</h3>
                <p className="text-slate-400 text-sm">
                  Browse and connect with people who have skills you want and need skills you offer.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">3. Start Learning</h3>
                <p className="text-slate-400 text-sm">
                  Exchange knowledge through video calls, mentoring sessions, or collaborative projects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
