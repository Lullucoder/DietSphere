import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi'
import api from '../services/api'
import './AuthPages.css'

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const response = await api.post('/api/auth/login', formData)
      onLogin(response.data)
    } catch (err) {
      setError('Invalid username or password')
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
            Track every bite, understand your nutrition, and achieve your health goals with smart insights.
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
          <h2>Welcome back</h2>
          <p>Sign in to your account to continue</p>

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
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label><FiLock size={13} style={{ marginRight: '0.3rem', verticalAlign: '-1px' }} /> Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : <><FiLogIn size={16} /> Sign In</>}
            </button>

            <p className="auth-link">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
