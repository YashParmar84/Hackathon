"use client"

import { useState } from "react"

const ForgotPasswordModal = ({ onClose }) => {
  const [forgotEmail, setForgotEmail] = useState("")
  const [resetStep, setResetStep] = useState("email") // 'email', 'sent', 'reset'
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const minLength = password.length >= 8
    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    if (resetStep === "email") {
      if (validateEmail(forgotEmail)) {
        setResetStep("sent")
        setTimeout(() => setResetStep("reset"), 2000)
      } else {
        alert("Please enter a valid email address")
      }
    } else if (resetStep === "reset") {
      if (newPassword === confirmPassword && validatePassword(newPassword)) {
        alert("Password reset successfully! You can now login with your new password.")
        onClose()
      } else if (newPassword !== confirmPassword) {
        alert("Passwords do not match!")
      } else {
        alert("Password does not meet requirements!")
      }
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

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="card-header">
          <h2 className="card-title">
            {resetStep === "email" && "Forgot Password"}
            {resetStep === "sent" && "Check Your Email"}
            {resetStep === "reset" && "Reset Password"}
          </h2>
          <p className="card-description">
            {resetStep === "email" && "Enter your email to reset your password"}
            {resetStep === "sent" && "We sent you a reset link"}
            {resetStep === "reset" && "Enter your new password"}
          </p>
        </div>
        <div className="card-content">
          <form onSubmit={handleForgotPassword} className="form">
            {resetStep === "email" && (
              <div className="form-group">
                <label htmlFor="forgot-email" className="form-label">
                  Email
                </label>
                <div className="input-container">
                  <svg className="input-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            )}

            {resetStep === "sent" && (
              <div className="reset-confirmation">
                <div className="reset-icon">
                  <CheckIcon />
                </div>
                <p className="reset-text">
                  We've sent a password reset link to <span className="reset-email">{forgotEmail}</span>
                </p>
              </div>
            )}

            {resetStep === "reset" && (
              <>
                <div className="form-group">
                  <label htmlFor="new-password" className="form-label">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                  />
                  {newPassword && (
                    <div className="password-requirements">
                      {getPasswordStrength(newPassword).map((check, index) => (
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
                <div className="form-group">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="modal-buttons">
              <button type="button" onClick={onClose} className="button-outline">
                Back to Login
              </button>
              {resetStep !== "sent" && (
                <button type="submit" className="button-primary">
                  {resetStep === "email" ? "Send Reset Link" : "Reset Password"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordModal
