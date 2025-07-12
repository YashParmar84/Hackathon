"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Camera, X, Plus, Save, RotateCcw, Home, ArrowLeftRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface UserProfileProps {
  onNavigate: (page: "profile" | "swap" | "home") => void
}

const skillSuggestions = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "Java",
  "C++",
  "HTML",
  "CSS",
  "Graphic Design",
  "Video Editing",
  "Photoshop",
  "Illustrator",
  "UI/UX Design",
  "Photography",
  "Marketing",
  "Content Writing",
  "SEO",
  "Social Media",
  "Project Management",
  "Data Analysis",
  "Machine Learning",
  "Web Development",
  "Mobile Development",
  "Database Management",
]

export function UserProfile({ onNavigate }: UserProfileProps) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [skillsOffered, setSkillsOffered] = useState<string[]>([])
  const [skillsWanted, setSkillsWanted] = useState<string[]>([])
  const [availability, setAvailability] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [newSkillOffered, setNewSkillOffered] = useState("")
  const [newSkillWanted, setNewSkillWanted] = useState("")
  const [showOfferedSuggestions, setShowOfferedSuggestions] = useState(false)
  const [showWantedSuggestions, setShowWantedSuggestions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateName = (value: string) => {
    return /^[a-zA-Z0-9\s]+$/.test(value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || validateName(value)) {
      setName(value)
    }
  }

  const addSkillOffered = (skill: string) => {
    if (skill && !skillsOffered.includes(skill)) {
      setSkillsOffered([...skillsOffered, skill])
      setNewSkillOffered("")
      setShowOfferedSuggestions(false)
    }
  }

  const addSkillWanted = (skill: string) => {
    if (skill && !skillsWanted.includes(skill)) {
      setSkillsWanted([...skillsWanted, skill])
      setNewSkillWanted("")
      setShowWantedSuggestions(false)
    }
  }

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s !== skill))
  }

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter((s) => s !== skill))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    if (!location.trim()) {
      toast({
        title: "Error",
        description: "Location is required",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Profile saved successfully!",
    })
  }

  const handleDiscard = () => {
    setName("")
    setLocation("")
    setSkillsOffered([])
    setSkillsWanted([])
    setAvailability("")
    setIsPublic(true)
    setProfileImage(null)
    toast({
      title: "Discarded",
      description: "All changes have been discarded",
    })
  }

  const filteredOfferedSuggestions = skillSuggestions.filter(
    (skill) => skill.toLowerCase().includes(newSkillOffered.toLowerCase()) && !skillsOffered.includes(skill),
  )

  const filteredWantedSuggestions = skillSuggestions.filter(
    (skill) => skill.toLowerCase().includes(newSkillWanted.toLowerCase()) && !skillsWanted.includes(skill),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
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
              <BreadcrumbPage className="text-white">User Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-2xl text-white">User Profile</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleDiscard} variant="destructive">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Discard
                </Button>
                <Button
                  onClick={() => onNavigate("swap")}
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Swap Request
                </Button>
                <Button
                  onClick={() => onNavigate("home")}
                  variant="outline"
                  className="border-slate-600 text-slate-200 hover:bg-slate-700"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {name.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200 text-lg">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter your name (letters and numbers only)"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                  {name && !validateName(name) && (
                    <p className="text-red-400 text-sm">Name can only contain letters, numbers, and spaces</p>
                  )}
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-200 text-lg">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                {/* Skills Offered */}
                <div className="space-y-3">
                  <Label className="text-slate-200 text-lg">Skills Offered</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skillsOffered.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-blue-600/20 text-blue-300 border-blue-500/30"
                      >
                        {skill}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-red-300"
                          onClick={() => removeSkillOffered(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="flex gap-2">
                      <Input
                        value={newSkillOffered}
                        onChange={(e) => {
                          setNewSkillOffered(e.target.value)
                          setShowOfferedSuggestions(true)
                        }}
                        onFocus={() => setShowOfferedSuggestions(true)}
                        placeholder="Add a skill you can offer"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Button
                        onClick={() => addSkillOffered(newSkillOffered)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {showOfferedSuggestions && newSkillOffered && filteredOfferedSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredOfferedSuggestions.slice(0, 5).map((skill) => (
                          <div
                            key={skill}
                            className="px-3 py-2 cursor-pointer hover:bg-slate-700 text-slate-200"
                            onClick={() => addSkillOffered(skill)}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Wanted */}
                <div className="space-y-3">
                  <Label className="text-slate-200 text-lg">Skills Wanted</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skillsWanted.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-purple-600/20 text-purple-300 border-purple-500/30"
                      >
                        {skill}
                        <X
                          className="w-3 h-3 ml-1 cursor-pointer hover:text-red-300"
                          onClick={() => removeSkillWanted(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="flex gap-2">
                      <Input
                        value={newSkillWanted}
                        onChange={(e) => {
                          setNewSkillWanted(e.target.value)
                          setShowWantedSuggestions(true)
                        }}
                        onFocus={() => setShowWantedSuggestions(true)}
                        placeholder="Add a skill you want to learn"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Button
                        onClick={() => addSkillWanted(newSkillWanted)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {showWantedSuggestions && newSkillWanted && filteredWantedSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredWantedSuggestions.slice(0, 5).map((skill) => (
                          <div
                            key={skill}
                            className="px-3 py-2 cursor-pointer hover:bg-slate-700 text-slate-200"
                            onClick={() => addSkillWanted(skill)}
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label htmlFor="availability" className="text-slate-200 text-lg">
                    Availability
                  </Label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="evenings">Evenings</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="full-time">Full Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Profile Visibility */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-visibility" className="text-slate-200 text-lg">
                    Profile
                  </Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Private</span>
                    <Switch id="profile-visibility" checked={isPublic} onCheckedChange={setIsPublic} />
                    <span className="text-slate-200">Public</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-4 border-slate-600 overflow-hidden bg-slate-700/50 flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <Camera className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Profile Photo</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center space-y-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-slate-600 text-slate-200 hover:bg-slate-700"
                  >
                    Add/Edit
                  </Button>
                  {profileImage && (
                    <Button onClick={() => setProfileImage(null)} variant="destructive" size="sm">
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
