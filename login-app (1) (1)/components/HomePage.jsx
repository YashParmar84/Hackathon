"use client"

const HomePage = ({ onNavigate }) => {
  const HomeIcon = () => (
    <svg className="hero-icon" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  )

  const UserIcon = () => (
    <svg className="feature-icon blue" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  )

  const SettingsIcon = () => (
    <svg className="feature-icon green" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  )

  const BellIcon = () => (
    <svg className="feature-icon purple" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
    </svg>
  )

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
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <button className="home-button" onClick={() => onNavigate("login")}>
            <ArrowLeftIcon />
            Back to Login
          </button>
          <h1 className="home-title">Welcome Home</h1>
          <div className="spacer"></div>
        </div>

        <div className="hero-card">
          <div className="hero-header">
            <HomeIcon />
            <h2 className="hero-title">You're Successfully Logged In!</h2>
            <p className="hero-description">Welcome to your dashboard. Explore the features below.</p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-header">
              <UserIcon />
              <h3 className="feature-title">Profile</h3>
              <p className="feature-description">Manage your personal information and preferences</p>
            </div>
            <div className="feature-content">
              <button className="feature-button primary">View Profile</button>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <SettingsIcon />
              <h3 className="feature-title">Settings</h3>
              <p className="feature-description">Configure your account settings and security options</p>
            </div>
            <div className="feature-content">
              <button className="feature-button outline">Open Settings</button>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <BellIcon />
              <h3 className="feature-title">Notifications</h3>
              <p className="feature-description">Stay updated with your latest notifications and alerts</p>
            </div>
            <div className="feature-content">
              <button className="feature-button secondary">View All</button>
            </div>
          </div>
        </div>

        <div className="home-footer">
          <p>Thank you for using our platform! 🎉</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
