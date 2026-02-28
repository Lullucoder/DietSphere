import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  FiHome, FiPlusCircle, FiClock, FiActivity, FiMessageSquare,
  FiBarChart2, FiTarget, FiUser, FiLogOut, FiMenu, FiX,
  FiSun, FiMoon
} from 'react-icons/fi';

const NAV = [
  { to: '/dashboard',  icon: FiHome,          label: 'Dashboard' },
  { to: '/log-food',   icon: FiPlusCircle,    label: 'Log Food' },
  { to: '/history',    icon: FiClock,         label: 'History' },
  { to: '/nutrition',  icon: FiActivity,      label: 'Nutrition' },
  { to: '/charts',     icon: FiBarChart2,     label: 'Charts' },
  { to: '/goals',      icon: FiTarget,        label: 'Goals' },
  { to: '/ai-chat',    icon: FiMessageSquare, label: 'NutriBot' },
  { to: '/profile',    icon: FiUser,          label: 'Profile' },
];

export default function Layout({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { dark, toggle } = useTheme();

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'U';

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-sage-100 text-sage-700 dark:bg-sage-500/15 dark:text-sage-400'
        : 'text-brown-400 hover:bg-cream-100 hover:text-charcoal dark:text-dark-muted dark:hover:bg-dark-border dark:hover:text-dark-text'
    }`;

  const Sidebar = ({ onNav }) => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5">
        <Link to="/dashboard" onClick={onNav} className="flex items-center gap-3">
          <img src="/logo.svg" alt="DietSphere" className="w-9 h-9 rounded-xl" />
          <span className="text-lg font-bold text-charcoal dark:text-dark-text">DietSphere</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} onClick={onNav} className={linkClass(to)}>
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-cream-200 dark:border-dark-border space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-brown-400 dark:text-dark-muted hover:bg-cream-100 dark:hover:bg-dark-border transition-colors"
        >
          {dark ? <FiSun className="w-[18px] h-[18px]" /> : <FiMoon className="w-[18px] h-[18px]" />}
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={() => { onNav?.(); onLogout(); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-brown-400 dark:text-dark-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
        >
          <FiLogOut className="w-[18px] h-[18px]" />
          <span>Sign Out</span>
        </button>
        <div className="flex items-center gap-3 px-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-sage-200 dark:bg-sage-500/20 flex items-center justify-center text-xs font-bold text-sage-700 dark:text-sage-400">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-charcoal dark:text-dark-text truncate">{user?.username}</p>
            <p className="text-[10px] text-brown-300 dark:text-dark-muted truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream-100 dark:bg-dark-bg">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] fixed inset-y-0 left-0 z-30 bg-white dark:bg-dark-card border-r border-cream-200 dark:border-dark-border">
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 bg-white dark:bg-dark-card border-b border-cream-200 dark:border-dark-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.svg" alt="DietSphere" className="w-7 h-7 rounded-lg" />
          <span className="text-sm font-bold text-charcoal dark:text-dark-text">DietSphere</span>
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-dark-border text-brown-400 dark:text-dark-muted">
            {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-dark-border text-brown-400 dark:text-dark-muted">
            {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-[260px] bg-white dark:bg-dark-card lg:hidden">
            <Sidebar onNav={() => setOpen(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-[240px] pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
