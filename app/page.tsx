"use client"

import { useState } from "react"
import { UserProfile } from "@/components/user-profile"
import { SwapRequests } from "@/components/swap-requests"
import { Home } from "@/components/home"
import { ThemeProvider } from "@/components/theme-provider"

export default function App() {
  const [currentPage, setCurrentPage] = useState<"profile" | "swap" | "home">("profile")

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <UserProfile onNavigate={setCurrentPage} />
      case "swap":
        return <SwapRequests onNavigate={setCurrentPage} />
      case "home":
        return <Home onNavigate={setCurrentPage} />
      default:
        return <UserProfile onNavigate={setCurrentPage} />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">{renderPage()}</div>
    </ThemeProvider>
  )
}
