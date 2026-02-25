import { Link, useLocation } from 'react-router-dom'
import { FiGrid, FiPlusCircle, FiClock, FiBarChart2, FiUser, FiLogOut, FiMenu, FiX, FiCpu, FiPieChart, FiTarget, FiMoon, FiSun } from 'react-icons/fi'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function Layout({ user, onLogout, children }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { dark, toggle } = useTheme()

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', icon: <FiGrid size={18} />,       label: 'Dashboard' },
    { path: '/log-food',  icon: <FiPlusCircle size={18} />,  label: 'Log Food' },
    { path: '/history',   icon: <FiClock size={18} />,       label: 'Meal History' },
    { path: '/nutrition', icon: <FiBarChart2 size={18} />,   label: 'Nutrition' },
    { path: '/ai-chat',   icon: <FiCpu size={18} />,         label: 'NutriBot AI' },
    { path: '/charts',    icon: <FiPieChart size={18} />,    label: 'Charts' },
    { path: '/goals',     icon: <FiTarget size={18} />,      label: 'Goals' },
    { path: '/profile',   icon: <FiUser size={18} />,        label: 'Profile' },
  ]

  const initials = user?.username ? user.username.substring(0, 2).toUpperCase() : '??'

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg shadow-brand-500/30">
            🌿
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white leading-tight">NutriTrack</h2>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Diet Balance</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 mb-3">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Menu</span>
        </div>
        {navItems.map(({ path, icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive(path)
                ? 'bg-gradient-to-r from-brand-500/20 to-purple-500/10 text-brand-400 shadow-sm shadow-brand-500/5'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className={`w-5 flex items-center justify-center ${isActive(path) ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
              {icon}
            </span>
            {label}
            {isActive(path) && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4 mt-2">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-brand-300 border-2 border-slate-600 uppercase">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-200 truncate">{user?.username}</div>
            <div className="text-[11px] text-slate-500">Member</div>
          </div>
        </div>
        {/* Dark Mode Toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 w-full transition-all duration-200 mb-1"
        >
          {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 w-full transition-all duration-200"
        >
          <FiLogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[260px] bg-slate-900 fixed inset-y-0 left-0 z-50">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-slate-900 flex flex-col transform transition-transform duration-300 lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <FiX size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <FiMenu size={20} />
          </button>
          <span className="text-sm font-bold text-slate-800 dark:text-white">NutriTrack</span>
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 uppercase">
            {initials}
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
