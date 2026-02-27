import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      toast.success('Welcome back!');
      onLogin(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">DietSphere</h1>
          <p className="text-slate-500 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                type="email"
                className="input pl-10"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input
                type="password"
                className="input pl-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <FiLoader className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
