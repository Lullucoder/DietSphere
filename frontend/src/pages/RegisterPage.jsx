import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUserPlus, FiUser, FiMail, FiLock, FiCalendar } from 'react-icons/fi'
import api from '../services/api'
import './AuthPages.css'

function RegisterPage({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/api/auth/register', {
        ...formData,
        age: parseInt(formData.age)
      })
      onRegister(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-side">
        <div className="auth-side-content">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="auth-side-logo"
          >
            🌿
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            NutriTrack
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Join thousands of users who track their nutrition and live healthier every day.
          </motion.p>
          <motion.div
            className="auth-side-features"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <div className="auth-feature">🍛 111+ Indian foods</div>
            <div className="auth-feature">📊 Real-time analysis</div>
            <div className="auth-feature">💡 Smart recommendations</div>
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Create your account</h2>
          <p>Start your nutrition journey today</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><FiUser size={13} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} /> Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength="3"
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label><FiMail size={13} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} /> Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FiLock size={13} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} /> Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="form-group">
                <label><FiCalendar size={13} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} /> Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  placeholder="Your age"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : <><FiUserPlus size={16} /> Create Account</>}
            </button>

            <p className="auth-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
