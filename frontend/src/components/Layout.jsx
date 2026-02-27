import { NavLink } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiList, FiActivity, FiBarChart2, FiTarget, FiUser, FiMessageCircle, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const NAV = [
  { to: '/',         icon: FiHome,          label: 'Dashboard' },
  { to: '/log',      icon: FiPlusCircle,    label: 'Log Food' },
  { to: '/history',  icon: FiList,          label: 'History' },
  { to: '/nutrition',icon: FiActivity,      label: 'Nutrition' },
  { to: '/charts',   icon: FiBarChart2,     label: 'Charts' },
  { to: '/goals',    icon: FiTarget,        label: 'Goals' },
  { to: '/ai',       icon: FiMessageCircle, label: 'AI Chat' },
  { to: '/profile',  icon: FiUser,          label: 'Profile' },
];

export default function Layout({ user, onLogout, children }) {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
    }`;

  const Sidebar = () => (
    <nav className="flex flex-col gap-1 p-4">
      <div className="mb-4 px-3">
        <h1 className="text-lg font-bold text-slate-900">DietSphere</h1>
        <p className="text-xs text-slate-500">{user?.username}</p>
      </div>
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} className={linkClass} onClick={() => setOpen(false)}>
          <Icon className="w-4 h-4" /> {label}
        </NavLink>
      ))}
      <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2 mt-4 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
        <FiLogOut className="w-4 h-4" /> Sign Out
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 bg-white border-r border-slate-200 fixed h-full">
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 z-50">
        <button onClick={() => setOpen(!open)} className="p-2 -ml-2">
          {open ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
        <span className="ml-3 font-semibold text-slate-900">DietSphere</span>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)}>
          <div className="w-64 h-full bg-white" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-56 min-h-screen">
        <div className="p-4 md:p-6 pt-16 md:pt-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
