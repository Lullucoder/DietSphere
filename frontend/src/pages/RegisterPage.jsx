import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCalendar, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    age: '', weightKg: '', heightCm: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error('Fill required fields');
    setLoading(true);
    try {
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        age: form.age ? parseInt(form.age) : null,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : null,
      };
      const { data } = await api.post('/auth/register', payload);
      toast.success('Account created!');
      // Auto-login after registration
      const loginRes = await api.post('/auth/login', { email: form.email, password: form.password });
      onRegister(loginRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">DietSphere</h1>
          <p className="text-slate-500 mt-1">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="label">Username *</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input type="text" className="input pl-10" placeholder="johndoe" value={form.username} onChange={set('username')} />
            </div>
          </div>
          <div>
            <label className="label">Email *</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input type="email" className="input pl-10" placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
          </div>
          <div>
            <label className="label">Password *</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <input type="password" className="input pl-10" placeholder="••••••••" value={form.password} onChange={set('password')} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Age</label>
              <input type="number" className="input text-center" placeholder="25" value={form.age} onChange={set('age')} />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input type="number" className="input text-center" placeholder="70" value={form.weightKg} onChange={set('weightKg')} />
            </div>
            <div>
              <label className="label">Height (cm)</label>
              <input type="number" className="input text-center" placeholder="175" value={form.heightCm} onChange={set('heightCm')} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <FiLoader className="animate-spin" /> : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
