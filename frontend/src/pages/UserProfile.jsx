import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiCalendar, FiActivity, FiAward, FiTrendingUp, FiLock, FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../services/api'
import Layout from '../components/Layout'

function UserProfile({ user, onLogout, onUpdateUser }) {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ age: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  // Security state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => { fetchProfile(); fetchStats() }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/auth/profile?userId=${user.userId}`)
      setProfile(response.data)
      setFormData({ age: response.data.age, email: response.data.email })
    } catch (err) { console.error('Error fetching profile:', err) }
    finally { setLoading(false) }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get(`/api/entries?userId=${user.userId}`)
      const meals = response.data
      const uniqueDays = new Set(meals.map(m => m.consumedAt?.substring(0, 10)))
      const totalCal = meals.reduce((sum, m) => sum + Math.round((m.foodItem?.nutrientProfile?.calories || 0) * m.portionSize), 0)
      setStats({ totalMeals: meals.length, activeDays: uniqueDays.size, avgMealsPerDay: uniqueDays.size > 0 ? (meals.length / uniqueDays.size).toFixed(1) : 0, totalCalories: totalCal })
    } catch (err) { console.error('Error fetching stats:', err) }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put(`/api/auth/profile?userId=${user.userId}`, formData)
      setProfile(response.data)
      setEditing(false)
      toast.success('Profile updated successfully!')
      const storedUser = JSON.parse(localStorage.getItem('user'))
      storedUser.email = response.data.email
      localStorage.setItem('user', JSON.stringify(storedUser))
      if (onUpdateUser) onUpdateUser(storedUser)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update profile') }
  }

  if (loading) return (
    <Layout user={user} onLogout={onLogout}>
      <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
        <span className="w-5 h-5 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin mr-3" />
        Loading profile...
      </div>
    </Layout>
  )

  const initials = profile?.username ? profile.username.substring(0, 2).toUpperCase() : '??'

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account information and view activity</p>
      </div>

      {/* Profile Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center pt-10 pb-8 px-6 mb-6"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-white inline-flex items-center justify-center text-2xl font-bold mb-3 shadow-lg shadow-brand-500/30"
        >
          {initials}
        </motion.div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.username}</h2>
        <p className="text-sm text-slate-400 mt-1">{profile?.email}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Meals', value: stats?.totalMeals || 0, icon: <FiActivity size={16} />, gradient: 'from-brand-500 to-teal-500', bg: 'bg-brand-50' },
          { label: 'Active Days', value: stats?.activeDays || 0, icon: <FiAward size={16} />, gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
          { label: 'Avg Meals/Day', value: stats?.avgMealsPerDay || 0, icon: <FiTrendingUp size={16} />, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
          { label: 'Total Calories', value: (stats?.totalCalories || 0).toLocaleString(), icon: <FiCalendar size={16} />, gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50' }
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4"
          >
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2`}>
              <span className={`bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent`}>{s.icon}</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-white">
              <FiUser size={16} className="text-brand-500" /> Account Information
            </div>
            <p className="text-xs text-slate-400 mt-0.5">View and edit your details</p>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-brand-300 hover:text-brand-600 transition-all">
              <FiEdit2 size={13} /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              { label: 'Username', value: profile?.username, icon: <FiUser size={14} className="text-slate-400" /> },
              { label: 'Email', value: profile?.email, icon: <FiMail size={14} className="text-slate-400" /> },
              { label: 'Age', value: `${profile?.age} years`, icon: <FiCalendar size={14} className="text-slate-400" /> }
            ].map(field => (
              <div key={field.label} className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-2.5">
                  {field.icon}
                  <span className="text-sm text-slate-500">{field.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">{field.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <motion.form onSubmit={handleUpdate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
              <input type="text" value={profile?.username} disabled className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 text-sm cursor-not-allowed" />
              <p className="text-[11px] text-slate-400 mt-1">Username cannot be changed</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <FiMail size={13} /> Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  <FiCalendar size={13} /> Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition-all">
                <FiSave size={15} /> Save Changes
              </button>
              <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <FiX size={15} /> Cancel
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>

      {/* ── Change Password Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mt-6"
      >
        <div className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-white mb-1">
          <FiLock size={16} className="text-brand-500" /> Change Password
        </div>
        <p className="text-xs text-slate-400 mb-5">Update your account password</p>

        <form onSubmit={async (e) => {
          e.preventDefault()
          if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match'); return
          }
          if (passwordForm.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters'); return
          }
          setPasswordLoading(true)
          try {
            await api.put(`/api/auth/change-password?userId=${user.userId}`, {
              currentPassword: passwordForm.currentPassword,
              newPassword: passwordForm.newPassword
            })
            toast.success('Password changed successfully!')
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password')
          } finally { setPasswordLoading(false) }
        }} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
            <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} required placeholder="Enter current password" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
            <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} required minLength={6} placeholder="Min 6 characters" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required minLength={6} placeholder="Repeat new password" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <button type="submit" disabled={passwordLoading} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50">
            {passwordLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiLock size={14} />}
            Update Password
          </button>
        </form>
      </motion.div>

      {/* ── Danger Zone — Delete Account ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm p-6 mt-6"
      >
        <div className="flex items-center gap-2 text-base font-bold text-red-600 dark:text-red-400 mb-1">
          <FiAlertTriangle size={16} /> Danger Zone
        </div>
        <p className="text-xs text-slate-400 mb-4">Permanently delete your account and all associated data</p>

        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <FiTrash2 size={14} /> Delete Account
          </button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 max-w-md">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-xs text-red-700 dark:text-red-300 leading-relaxed">
              ⚠️ This will permanently delete your account, all meal logs, nutrition goals, and analysis data. This action <strong>cannot be undone</strong>.
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Enter your password to confirm</label>
              <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} required placeholder="Your password" className="w-full px-3.5 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-sm text-slate-800 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all" />
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={async () => {
                  if (!deletePassword) { toast.error('Enter your password'); return }
                  setDeleteLoading(true)
                  try {
                    await api.delete(`/api/auth/account?userId=${user.userId}`, { data: { password: deletePassword } })
                    toast.success('Account deleted')
                    onLogout()
                  } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to delete account')
                  } finally { setDeleteLoading(false) }
                }}
                disabled={deleteLoading || !deletePassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {deleteLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiTrash2 size={14} />}
                Yes, Delete My Account
              </button>
              <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword('') }} className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}

export default UserProfile
