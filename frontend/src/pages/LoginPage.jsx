import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogIn, FiUser, FiLock, FiArrowRight } from 'react-icons/fi'
import api from '../services/api'

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
    <div className="min-h-screen flex">
      {/* Left — Gradient branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800">
        {/* Decorative shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-purple-400/10" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-4xl mb-8 shadow-2xl"
          >
            🌿
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-4xl font-extrabold text-white mb-3 tracking-tight"
          >
            NutriTrack
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-brand-200 text-center max-w-sm text-lg leading-relaxed"
          >
            Track every bite, understand your nutrition, and achieve your health goals with smart insights.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-10 justify-center"
          >
            {['🍛 111+ Indian Foods', '📊 Real-time Analysis', '💡 Smart Recommendations', '🤖 AI-Powered'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium border border-white/10">
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-brand-500/20">
              🌿
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">NutriTrack</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-200 flex items-center gap-2">
              <span className="text-red-400">●</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <FiUser className="inline mr-1.5 -mt-0.5" size={14} />Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <FiLock className="inline mr-1.5 -mt-0.5" size={14} />Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <FiArrowRight size={16} /></>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
