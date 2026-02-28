import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import {
  FiUser, FiMail, FiLock, FiArrowRight,
  FiEye, FiEyeOff, FiActivity, FiArrowLeft, FiSun, FiMoon
} from 'react-icons/fi';

export default function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    age: '', weightKg: '', heightCm: '',
  });
  const [heightMode, setHeightMode] = useState('cm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleFeetChange = (v) => {
    setFeet(v);
    const cm = Math.round((parseInt(v || 0) * 30.48) + (parseInt(inches || 0) * 2.54));
    setForm((f) => ({ ...f, heightCm: cm || '' }));
  };
  const handleInchesChange = (v) => {
    setInches(v);
    const cm = Math.round((parseInt(feet || 0) * 30.48) + (parseInt(v || 0) * 2.54));
    setForm((f) => ({ ...f, heightCm: cm || '' }));
  };

  const bmi = useMemo(() => {
    const w = parseFloat(form.weightKg), h = parseFloat(form.heightCm);
    if (w > 0 && h > 0) return (w / ((h / 100) ** 2)).toFixed(1);
    return null;
  }, [form.weightKg, form.heightCm]);

  const bmiInfo = useMemo(() => {
    if (!bmi) return null;
    const v = parseFloat(bmi);
    if (v < 18.5) return { label: 'Underweight', color: 'text-amber-500', bg: 'bg-amber-500' };
    if (v < 25)   return { label: 'Normal',      color: 'text-sage-600 dark:text-sage-400',  bg: 'bg-sage-500' };
    if (v < 30)   return { label: 'Overweight',   color: 'text-orange-500', bg: 'bg-orange-500' };
    return { label: 'Obese', color: 'text-red-500', bg: 'bg-red-500' };
  }, [bmi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const body = {
        username: form.username, email: form.email, password: form.password,
        age: form.age ? parseInt(form.age) : null,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : null,
      };
      await api.post('/auth/register', body);
      toast.success('Account created! Signing in…');
      const loginRes = await api.post('/auth/login', { username: form.username, password: form.password });
      if (bmi) localStorage.setItem('userBMI', bmi);
      onRegister(loginRes.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            Start Your<br />
            <span className="text-white/80">Wellness Journey</span>
          </h2>
          <p className="text-white/70 text-sm max-w-sm leading-relaxed">
            Create an account to begin tracking your nutrition with AI-powered insights
            and personalized recommendations.
          </p>
          <div className="mt-10 space-y-3">
            {['BMI-adjusted nutrition goals', 'AI chatbot for dietary advice', 'Comprehensive charts & analytics'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-[10px]">✓</span>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-white/[0.06]" />
      </div>

      {/* Right Panel (form) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-cream-50 dark:bg-dark-bg overflow-y-auto relative">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white dark:bg-dark-card border border-cream-200 dark:border-dark-border text-brown-400 dark:text-dark-muted hover:text-sage-600 transition-colors"
        >
          {dark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-lg">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-medium text-brown-400 dark:text-dark-muted hover:text-brown-600 dark:hover:text-dark-text mb-6 transition-colors">
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>

          <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text mb-1">Create your account</h1>
          <p className="text-sm text-brown-400 dark:text-dark-muted mb-6">Fill in your details to get started</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Username + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                  <input type="text" value={form.username} onChange={set('username')} className="input pl-10" placeholder="johndoe" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                  <input type="email" value={form.email} onChange={set('email')} className="input pl-10" placeholder="john@example.com" required />
                </div>
              </div>
            </div>

            {/* Row 2: Password + Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                  <input
                    type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    className="input pl-10 pr-10" placeholder="Min. 6 characters" required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brown-300 dark:text-dark-muted hover:text-brown-500">
                    {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                  <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} className="input pl-10" placeholder="Repeat password" required />
                </div>
              </div>
            </div>

            {/* Row 3: Age + Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Age <span className="text-brown-300 dark:text-dark-muted font-normal">(optional)</span></label>
                <input type="number" value={form.age} onChange={set('age')} className="input" placeholder="e.g. 25" min="1" max="120" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brown-500 dark:text-dark-muted mb-1.5">Weight (kg) <span className="text-brown-300 dark:text-dark-muted font-normal">(optional)</span></label>
                <input type="number" value={form.weightKg} onChange={set('weightKg')} className="input" placeholder="e.g. 70" min="20" max="300" step="0.1" />
              </div>
            </div>

            {/* Row 4: Height */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-brown-500 dark:text-dark-muted">Height <span className="text-brown-300 dark:text-dark-muted font-normal">(optional)</span></label>
                <div className="flex rounded-lg overflow-hidden border border-cream-300 dark:border-dark-border text-xs">
                  <button type="button" onClick={() => setHeightMode('cm')}
                    className={`px-3 py-1 font-medium transition-colors ${heightMode === 'cm' ? 'bg-sage-500 text-white' : 'text-brown-400 dark:text-dark-muted hover:text-brown-600'}`}>
                    cm
                  </button>
                  <button type="button" onClick={() => setHeightMode('ft')}
                    className={`px-3 py-1 font-medium transition-colors ${heightMode === 'ft' ? 'bg-sage-500 text-white' : 'text-brown-400 dark:text-dark-muted hover:text-brown-600'}`}>
                    ft/in
                  </button>
                </div>
              </div>
              {heightMode === 'cm' ? (
                <input type="number" value={form.heightCm} onChange={set('heightCm')} className="input" placeholder="e.g. 175" min="50" max="300" />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={feet} onChange={(e) => handleFeetChange(e.target.value)} className="input" placeholder="Feet" min="1" max="8" />
                  <input type="number" value={inches} onChange={(e) => handleInchesChange(e.target.value)} className="input" placeholder="Inches" min="0" max="11" />
                </div>
              )}
            </div>

            {/* BMI Preview */}
            {bmi && bmiInfo && (
              <div className="rounded-xl bg-cream-100 dark:bg-dark-card border border-cream-200 dark:border-dark-border p-4 flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <FiActivity className={`w-5 h-5 ${bmiInfo.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-charcoal dark:text-dark-text">BMI: {bmi}</p>
                    <p className={`text-xs font-medium ${bmiInfo.color}`}>{bmiInfo.label}</p>
                  </div>
                </div>
                <div className="flex-1 h-2 rounded-full bg-cream-200 dark:bg-dark-border relative ml-4">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-charcoal dark:border-dark-text shadow"
                    style={{ left: `${Math.min(Math.max(((parseFloat(bmi) - 15) / 25) * 100, 0), 100)}%` }}
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <FiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-brown-400 dark:text-dark-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sage-600 dark:text-sage-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
