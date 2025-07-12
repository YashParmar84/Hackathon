"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Home, Mail, Lock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetStep, setResetStep] = useState("email") // 'email', 'sent', 'reset'
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  // Password validation
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const minLength = password.length >= 8

    if (!password) {
      setPasswordError("Password is required")
      return false
    }
    if (!minLength) {
      setPasswordError("Password must be at least 8 characters long")
      return false
    }
    if (!hasUpperCase) {
      setPasswordError("Password must contain at least one uppercase letter")
      return false
    }
    if (!hasLowerCase) {
      setPasswordError("Password must contain at least one lowercase letter")
      return false
    }
    if (!hasNumbers) {
      setPasswordError("Password must contain at least one number")
      return false
    }
    if (!hasSpecialChar) {
      setPasswordError("Password must contain at least one special character")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (isEmailValid && isPasswordValid) {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (resetStep === "email") {
      if (validateEmail(forgotEmail)) {
        // Simulate sending email
        setResetStep("sent")
        setTimeout(() => setResetStep("reset"), 2000)
      }
    } else if (resetStep === "reset") {
      if (newPassword === confirmPassword && validatePassword(newPassword)) {
        alert("Password reset successfully! You can now login with your new password.")
        setShowForgotPassword(false)
        setResetStep("email")
        setForgotEmail("")
        setNewPassword("")
        setConfirmPassword("")
      } else if (newPassword !== confirmPassword) {
        alert("Passwords do not match!")
      }
    }
  }

  const getPasswordStrength = (password: string) => {
    const checks = [
      { test: password.length >= 8, label: "At least 8 characters" },
      { test: /[A-Z]/.test(password), label: "One uppercase letter" },
      { test: /[a-z]/.test(password), label: "One lowercase letter" },
      { test: /\d/.test(password), label: "One number" },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: "One special character" },
    ]
    return checks
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {resetStep === "email" && "Forgot Password"}
              {resetStep === "sent" && "Check Your Email"}
              {resetStep === "reset" && "Reset Password"}
            </CardTitle>
            <CardDescription>
              {resetStep === "email" && "Enter your email to reset your password"}
              {resetStep === "sent" && "We sent you a reset link"}
              {resetStep === "reset" && "Enter your new password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              {resetStep === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              {resetStep === "sent" && (
                <div className="text-center py-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    We've sent a password reset link to <strong>{forgotEmail}</strong>
                  </p>
                </div>
              )}

              {resetStep === "reset" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPassword && (
                      <div className="space-y-1">
                        {getPasswordStrength(newPassword).map((check, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            {check.test ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className={check.test ? "text-green-600" : "text-red-600"}>{check.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetStep("email")
                    setForgotEmail("")
                    setNewPassword("")
                    setConfirmPassword("")
                  }}
                  className="flex-1"
                >
                  Back to Login
                </Button>
                {resetStep !== "sent" && (
                  <Button type="submit" className="flex-1">
                    {resetStep === "email" ? "Send Reset Link" : "Reset Password"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Home button */}
      <Link href="/home" className="absolute top-6 left-6 z-20">
        <Button variant="outline" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </Link>

      {/* Success Alert */}
      {showAlert && (
        <Alert className="absolute top-6 right-6 w-auto bg-green-500 text-white border-green-600 z-20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Login successful! Welcome back.</AlertDescription>
        </Alert>
      )}

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (e.target.value) validateEmail(e.target.value)
                  }}
                  className={`pl-10 ${emailError ? "border-red-500" : email && !emailError ? "border-green-500" : ""}`}
                />
                {email && (
                  <div className="absolute right-3 top-3">
                    {emailError ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (e.target.value) validatePassword(e.target.value)
                  }}
                  className={`pl-10 pr-10 ${passwordError ? "border-red-500" : password && !passwordError ? "border-green-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                  {getPasswordStrength(password).map((check, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      {check.test ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className={check.test ? "text-green-600" : "text-red-600"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5"
            >
              Sign In
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Forgot username or password?
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="w-full bg-transparent">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button" className="w-full bg-transparent">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
