import { Link, useLocation } from 'react-router-dom'

function Layout({ user, onLogout, children }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div>
      <nav className="navbar">
        <h1>🥗 Diet Balance Tracker</h1>
        <div className="nav-links">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'nav-active' : ''}>
            Dashboard
          </Link>
          <Link to="/log-food" className={isActive('/log-food') ? 'nav-active' : ''}>
            Log Food
          </Link>
          <Link to="/history" className={isActive('/history') ? 'nav-active' : ''}>
            History
          </Link>
          <Link to="/nutrition" className={isActive('/nutrition') ? 'nav-active' : ''}>
            Nutrition
          </Link>
          <Link to="/profile" className={isActive('/profile') ? 'nav-active' : ''}>
            Profile
          </Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <div className="container">
        {children}
      </div>
    </div>
  )
}

export default Layout
