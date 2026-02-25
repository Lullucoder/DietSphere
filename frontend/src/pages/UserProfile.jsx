import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiCalendar, FiActivity, FiAward, FiTrendingUp } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../services/api'
import Layout from '../components/Layout'

function UserProfile({ user, onLogout, onUpdateUser }) {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ age: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/api/auth/profile?userId=${user.userId}`)
      setProfile(response.data)
      setFormData({ age: response.data.age, email: response.data.email })
    } catch (err) {
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get(`/api/entries?userId=${user.userId}`)
      const meals = response.data
      const uniqueDays = new Set(meals.map(m => m.consumedAt?.substring(0, 10)))
      const totalCal = meals.reduce((sum, m) => sum + Math.round((m.foodItem?.nutrientProfile?.calories || 0) * m.portionSize), 0)
      setStats({
        totalMeals: meals.length,
        activeDays: uniqueDays.size,
        avgMealsPerDay: uniqueDays.size > 0 ? (meals.length / uniqueDays.size).toFixed(1) : 0,
        totalCalories: totalCal
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  }

  if (loading) return <Layout user={user} onLogout={onLogout}><div className="loading">Loading profile...</div></Layout>

  const initials = profile?.username ? profile.username.substring(0, 2).toUpperCase() : '??'

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information and view activity</p>
      </div>

      {/* Profile banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ textAlign: 'center', paddingTop: '2.5rem', paddingBottom: '2rem' }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.75rem',
            boxShadow: '0 4px 16px rgba(15, 118, 110, 0.3)'
          }}
        >
          {initials}
        </motion.div>
        <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-text)', fontWeight: 700 }}>{profile?.username}</h2>
        <p style={{ margin: '0.3rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>{profile?.email}</p>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
          Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          }) : 'N/A'}
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Meals', value: stats?.totalMeals || 0, icon: <FiActivity />, color: 'teal' },
          { label: 'Active Days', value: stats?.activeDays || 0, icon: <FiAward />, color: 'green' },
          { label: 'Avg Meals/Day', value: stats?.avgMealsPerDay || 0, icon: <FiTrendingUp />, color: 'amber' },
          { label: 'Total Calories', value: (stats?.totalCalories || 0).toLocaleString(), icon: <FiCalendar />, color: 'blue' }
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <div className="stat-card-row">
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
              </div>
              <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <div>
            <div className="card-title"><FiUser size={16} style={{ marginRight: '0.4rem', verticalAlign: '-2px' }} /> Account Information</div>
            <div className="card-subtitle">View and edit your details</div>
          </div>
          {!editing && (
            <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
              <FiEdit2 size={13} /> Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="profile-info">
            <div className="profile-field">
              <span className="profile-label">Username</span>
              <span className="profile-value">{profile?.username}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{profile?.email}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Age</span>
              <span className="profile-value">{profile?.age} years</span>
            </div>
          </div>
        ) : (
          <motion.form
            onSubmit={handleUpdate}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={profile?.username} disabled />
              <small>Username cannot be changed</small>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FiMail size={13} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} /> Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label><FiCalendar size={13} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} /> Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary"><FiSave size={15} /> Save Changes</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}><FiX size={15} /> Cancel</button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </Layout>
  )
}

export default UserProfile
