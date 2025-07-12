"use client"

import { useState } from "react"
import ForgotPasswordModal from "./ForgotPasswordModal"

const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  // Email validation
  const validateEmail = (email) => {
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
  const validatePassword = (password) => {
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

  const handleLogin = (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (isEmailValid && isPasswordValid) {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const getPasswordStrength = (password) => {
    return [
      { test: password.length >= 8, label: "At least 8 characters" },
      { test: /[A-Z]/.test(password), label: "One uppercase letter" },
      { test: /[a-z]/.test(password), label: "One lowercase letter" },
      { test: /\d/.test(password), label: "One number" },
      { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: "One special character" },
    ]
  }

  const CheckIcon = () => (
    <svg className="requirement-icon" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  const XIcon = () => (
    <svg className="requirement-icon" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )

  const EyeIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  const EyeOffIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
        clipRule="evenodd"
      />
      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
    </svg>
  )

  return (
    <div className="app">
      <div className="background-decorations">
        <div className="decoration-1"></div>
        <div className="decoration-2"></div>
        <div className="decoration-3"></div>
      </div>

      <button className="home-button" onClick={() => onNavigate("home")}>
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Home
      </button>

      {showAlert && (
        <div className="success-alert">
          <CheckIcon />
          Login successful! Welcome back.
        </div>
      )}

      <div className="login-container">
        <div className="login-card">
          <div className="card-header">
            <h1 className="card-title">Welcome Back</h1>
            <p className="card-description">Sign in to your account to continue</p>
          </div>
          <div className="card-content">
            <form onSubmit={handleLogin} className="form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-container">
                  <svg className="input-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (e.target.value) validateEmail(e.target.value)
                    }}
                    className={`form-input ${emailError ? "error" : email && !emailError ? "success" : ""}`}
                  />
                  {email && (
                    <div className="input-validation-icon">
                      {emailError ? <XIcon className="error-icon" /> : <CheckIcon className="success-icon" />}
                    </div>
                  )}
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-container">
                  <svg className="input-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (e.target.value) validatePassword(e.target.value)
                    }}
                    className={`form-input ${passwordError ? "error" : password && !passwordError ? "success" : ""}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}

                {password && (
                  <div className="password-requirements">
                    <p className="requirements-title">Password Requirements:</p>
                    {getPasswordStrength(password).map((check, index) => (
                      <div key={index} className="requirement-item">
                        <div className={check.test ? "requirement-met" : "requirement-unmet"}>
                          {check.test ? <CheckIcon /> : <XIcon />}
                        </div>
                        <span className={check.test ? "requirement-met" : "requirement-unmet"}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="login-button">
                Sign In
              </button>

              <div className="forgot-password-link">
                <button type="button" onClick={() => setShowForgotPassword(true)} className="forgot-password-button">
                  Forgot username or password?
                </button>
              </div>

              <div className="divider">
                <div className="divider-line">
                  <span className="divider-border" />
                </div>
                <div className="divider-text">Or continue with</div>
              </div>

              <div className="social-buttons">
                <button type="button" className="social-button">
                  <svg width="16" height="16" viewBox="0 0 24 24">
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
                </button>
                <button type="button" className="social-button">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              <div className="signup-link">
                <p>
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigate("signup")
                    }}
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    </div>
  )
}

export default LoginPage
