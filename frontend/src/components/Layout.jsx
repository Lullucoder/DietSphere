import { Link, useLocation } from 'react-router-dom'
import { FiGrid, FiPlusCircle, FiClock, FiBarChart2, FiUser, FiLogOut } from 'react-icons/fi'

function Layout({ user, onLogout, children }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', icon: <FiGrid size={18} />,       label: 'Dashboard' },
    { path: '/log-food',  icon: <FiPlusCircle size={18} />,  label: 'Log Food' },
    { path: '/history',   icon: <FiClock size={18} />,       label: 'Meal History' },
    { path: '/nutrition', icon: <FiBarChart2 size={18} />,   label: 'Nutrition' },
    { path: '/profile',   icon: <FiUser size={18} />,        label: 'Profile' },
  ]

  const initials = user?.username ? user.username.substring(0, 2) : '??'

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🌿</div>
          <div className="sidebar-brand-text">
            <h2>NutriTrack</h2>
            <span>Diet Balance</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ path, icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`sidebar-link ${isActive(path) ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.username}</div>
              <div className="sidebar-user-role">Member</div>
            </div>
          </div>
          <button onClick={onLogout} className="sidebar-logout">
            <span className="sidebar-link-icon"><FiLogOut size={16} /></span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout
