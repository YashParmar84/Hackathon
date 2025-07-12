"use client"

import { useState } from "react"
import LoginPage from "./components/LoginPage"
import HomePage from "./components/HomePage"
import SignUpPage from "./components/SignUpPage"
import "./styles/App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("login")

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />
      case "signup":
        return <SignUpPage onNavigate={handleNavigate} />
      default:
        return <LoginPage onNavigate={handleNavigate} />
    }
  }

  return <div className="App">{renderPage()}</div>
}

export default App
