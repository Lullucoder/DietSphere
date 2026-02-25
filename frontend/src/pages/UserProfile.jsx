import { useState, useEffect } from 'react'
import api from '../services/api'
import Layout from '../components/Layout'

function UserProfile({ user, onLogout, onUpdateUser }) {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ age: '', email: '' })
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
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
      setStats({
        totalMeals: meals.length,
        activeDays: uniqueDays.size,
        avgMealsPerDay: uniqueDays.size > 0 ? (meals.length / uniqueDays.size).toFixed(1) : 0
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const response = await api.put(`/api/auth/profile?userId=${user.userId}`, formData)
      setProfile(response.data)
      setEditing(false)
      setSuccess('Profile updated successfully!')
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user'))
      storedUser.email = response.data.email
      localStorage.setItem('user', JSON.stringify(storedUser))
      if (onUpdateUser) onUpdateUser(storedUser)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  if (loading) return <Layout user={user} onLogout={onLogout}><div className="loading">Loading profile...</div></Layout>

  return (
    <Layout user={user} onLogout={onLogout}>
      <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>My Profile 👤</h2>

      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}

      <div className="profile-grid">
        {/* Profile Info Card */}
        <div className="card">
          <h3>Account Information</h3>
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
              <div className="profile-field">
                <span className="profile-label">Member Since</span>
                <span className="profile-value">
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                </span>
              </div>
              <button className="btn btn-primary" onClick={() => setEditing(true)} style={{ marginTop: '1rem' }}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={profile?.username} disabled style={{ background: '#f3f4f6' }} />
                <small style={{ color: '#6b7280' }}>Username cannot be changed</small>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-success">Save Changes</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Stats Card */}
        <div className="card">
          <h3>Activity Summary</h3>
          <div className="profile-stats">
            <div className="profile-stat-item">
              <div className="profile-stat-value" style={{ color: '#667eea' }}>
                {stats?.totalMeals || 0}
              </div>
              <div className="profile-stat-label">Total Meals Logged</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value" style={{ color: '#10b981' }}>
                {stats?.activeDays || 0}
              </div>
              <div className="profile-stat-label">Active Days</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-value" style={{ color: '#f59e0b' }}>
                {stats?.avgMealsPerDay || 0}
              </div>
              <div className="profile-stat-label">Avg Meals/Day</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UserProfile
