import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUserPlus, FiUser, FiMail, FiLock, FiCalendar, FiArrowRight } from 'react-icons/fi'
import api from '../services/api'

function RegisterPage({ onRegister }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', age: '', weightKg: '', heightCm: '' })
  const [heightMode, setHeightMode] = useState('cm') // 'cm' or 'ft'
  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Convert feet+inches to cm whenever they change
  const handleFeetChange = (val) => {
    setFeet(val)
    const totalCm = (parseFloat(val || 0) * 30.48) + (parseFloat(inches || 0) * 2.54)
    setFormData(prev => ({ ...prev, heightCm: totalCm > 0 ? Math.round(totalCm).toString() : '' }))
  }
  const handleInchesChange = (val) => {
    setInches(val)
    const totalCm = (parseFloat(feet || 0) * 30.48) + (parseFloat(val || 0) * 2.54)
    setFormData(prev => ({ ...prev, heightCm: totalCm > 0 ? Math.round(totalCm).toString() : '' }))
  }

  // Live BMI preview
  const bmiPreview = () => {
    const w = parseFloat(formData.weightKg)
    const h = parseFloat(formData.heightCm)
    if (!w || !h || h <= 0) return null
    const bmi = w / ((h / 100) ** 2)
    let category = '', color = ''
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500' }
    else if (bmi < 25) { category = 'Normal'; color = 'text-emerald-500' }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-amber-500' }
    else { category = 'Obese'; color = 'text-red-500' }
    return { value: bmi.toFixed(1), category, color }
  }

  const bmi = bmiPreview()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/api/auth/register', {
        ...formData,
        age: parseInt(formData.age),
        weightKg: parseFloat(formData.weightKg),
        heightCm: parseFloat(formData.heightCm),
      })
      onRegister(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Gradient branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-700 via-brand-700 to-brand-600">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-brand-400/10" />

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
            DietSphere
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-purple-200 text-center max-w-sm text-lg leading-relaxed"
          >
            Join thousands of users who track their nutrition and live healthier every day.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-10 justify-center"
          >
            {['🍛 111+ Indian Foods', '📊 Real-time Analysis', '💡 Smart Insights', '🤖 AI-Powered'].map((f) => (
              <span key={f} className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium border border-white/10">
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right — Register form */}
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DietSphere</h1>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create your account</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Start your nutrition journey today</p>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium border border-red-200 flex items-center gap-2">
              <span className="text-red-400">●</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                minLength="3"
                placeholder="Choose a username"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <FiMail className="inline mr-1.5 -mt-0.5" size={14} />Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  minLength="6"
                  placeholder="Min 6 chars"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <FiCalendar className="inline mr-1.5 -mt-0.5" size={14} />Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  placeholder="Your age"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                ⚖️ Weight (kg)
              </label>
              <input
                type="number"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleChange}
                required
                min="10"
                max="300"
                step="0.1"
                placeholder="e.g. 65"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
              />
            </div>

            {/* Height with unit toggle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  📏 Height
                </label>
                <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
                  <button type="button" onClick={() => setHeightMode('cm')}
                    className={`px-3 py-1 font-medium transition-all ${heightMode === 'cm' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    cm
                  </button>
                  <button type="button" onClick={() => setHeightMode('ft')}
                    className={`px-3 py-1 font-medium transition-all ${heightMode === 'ft' ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    ft / in
                  </button>
                </div>
              </div>
              {heightMode === 'cm' ? (
                <input
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={handleChange}
                  required
                  min="50"
                  max="280"
                  step="1"
                  placeholder="e.g. 170"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={feet}
                    onChange={(e) => handleFeetChange(e.target.value)}
                    required
                    placeholder="Feet"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={inches}
                    onChange={(e) => handleInchesChange(e.target.value)}
                    placeholder="Inches"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                  />
                </div>
              )}
            </div>

            {/* BMI Preview */}
            {bmi && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
              >
                <span className="text-sm text-slate-500 dark:text-slate-400">Your BMI</span>
                <span className={`text-sm font-bold ${bmi.color}`}>
                  {bmi.value} &middot; {bmi.category}
                </span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-brand-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <FiArrowRight size={16} /></>
              )}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
