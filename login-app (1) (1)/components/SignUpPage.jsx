"use client"

const SignUpPage = ({ onNavigate }) => {
  const ArrowLeftIcon = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ec4899 0%, #ef4444 50%, #f59e0b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div className="login-card">
        <div className="card-header">
          <h1 className="card-title">Sign Up</h1>
          <p className="card-description">Create your account to get started</p>
        </div>
        <div className="card-content" style={{ textAlign: "center" }}>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>Sign up functionality coming soon! 🚀</p>
          <button
            className="login-button"
            onClick={() => onNavigate("login")}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <ArrowLeftIcon />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
