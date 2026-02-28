import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiSun, FiMoon } from 'react-icons/fi';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { dark, toggle } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-cream-100 dark:bg-dark-bg">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-sage-500">
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.svg" alt="DietSphere" className="w-12 h-12 rounded-2xl" />
            <span className="text-2xl font-bold text-white">DietSphere</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Track Your<br />
            <span className="text-white/80">Nutrition Journey</span>
          </h2>
          <p className="text-white/70 text-sm max-w-sm leading-relaxed">
            AI-powered nutrient tracking with 111+ Indian foods, smart analysis,
            and personalized recommendations to achieve your health goals.
          </p>
          <div className="mt-10 flex gap-6">
            {[
              { n: '111+', l: 'Indian Foods' },
              { n: 'AI',   l: 'NutriBot' },
              { n: '6+',   l: 'Chart Types' },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs text-white/60">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-white/[0.06]" />
      </div>

      {/* Right Panel (form) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-cream-50 dark:bg-dark-bg relative">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-dark-card border border-cream-200 dark:border-dark-border text-brown-400 dark:text-dark-muted hover:text-sage-600 transition-colors"
        >
          {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo.svg" alt="DietSphere" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-bold text-charcoal dark:text-dark-text">DietSphere</span>
          </div>

          <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text mb-1">Welcome back</h1>
          <p className="text-sm text-brown-400 dark:text-dark-muted mb-8">Sign in to continue tracking your nutrition</p>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Username</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-300 dark:text-dark-muted hover:text-brown-500"
                >
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <FiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-brown-400 dark:text-dark-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-sage-600 dark:text-sage-400 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
