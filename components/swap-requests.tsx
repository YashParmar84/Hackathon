"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Filter, User, Home, MessageSquare, CheckCircle, XCircle } from "lucide-react"

interface SwapRequestsProps {
  onNavigate: (page: "profile" | "swap" | "home") => void
}

const mockRequests = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["React", "TypeScript"],
    skillsWanted: ["Python", "Machine Learning"],
    location: "New York, NY",
    status: "pending",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["Graphic Design", "Photoshop"],
    skillsWanted: ["Web Development", "JavaScript"],
    location: "San Francisco, CA",
    status: "accepted",
  },
  {
    id: 3,
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["Data Analysis", "SQL"],
    skillsWanted: ["UI/UX Design", "Figma"],
    location: "Austin, TX",
    status: "pending",
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["Marketing", "SEO"],
    skillsWanted: ["Content Writing", "Social Media"],
    location: "Chicago, IL",
    status: "rejected",
  },
  {
    id: 5,
    name: "Eva Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["Photography", "Video Editing"],
    skillsWanted: ["Web Design", "CSS"],
    location: "Los Angeles, CA",
    status: "pending",
  },
  {
    id: 6,
    name: "Frank Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    skillsOffered: ["Java", "Spring Boot"],
    skillsWanted: ["React Native", "Mobile Development"],
    location: "Seattle, WA",
    status: "accepted",
  },
]

export function SwapRequests({ onNavigate }: SwapRequestsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const filteredRequests = mockRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.skillsOffered.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.skillsWanted.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-600/20 text-green-300 border-green-500/30"
      case "rejected":
        return "bg-red-600/20 text-red-300 border-red-500/30"
      default:
        return "bg-yellow-600/20 text-yellow-300 border-yellow-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => onNavigate("home")}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-slate-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Swap Requests</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl text-white">Swap Requests</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => onNavigate("profile")}
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  onClick={() => onNavigate("home")}
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-slate-400 w-4 h-4" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {paginatedRequests.map((request) => (
                <Card
                  key={request.id}
                  className="bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-purple-600 text-white">
                          {request.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold truncate">{request.name}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{request.location}</p>

                        <div className="space-y-2">
                          <div>
                            <p className="text-slate-300 text-xs font-medium mb-1">Offers:</p>
                            <div className="flex flex-wrap gap-1">
                              {request.skillsOffered.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-300 text-xs font-medium mb-1">Wants:</p>
                            <div className="flex flex-wrap gap-1">
                              {request.skillsWanted.map((skill) => (
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

                        {request.status === "pending" && (
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              Accept
                            </Button>
                            <Button size="sm" variant="destructive">
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer text-slate-200 hover:text-white"
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer text-slate-200 hover:text-white"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer text-slate-200 hover:text-white"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
