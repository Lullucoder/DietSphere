import { useState } from 'react';
import { FiUser, FiMail, FiSave, FiLogOut, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Profile({ user, onLogout }) {
  const [form, setForm] = useState({
    username: user.username || '',
    email: user.email || '',
    age: user.age || '',
    weightKg: user.weightKg || '',
    heightCm: user.heightCm || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/auth/profile?userId=${user.id}`, {
        age: form.age ? parseInt(form.age) : null,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : null,
      });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    }
    setSaving(false);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Profile</h1>

      <div className="card p-4 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
            <FiUser className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user.username}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Username</label>
            <input type="text" className="input bg-slate-50" value={form.username} disabled />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input bg-slate-50" value={form.email} disabled />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Age</label>
            <input type="number" className="input" value={form.age} onChange={set('age')} />
          </div>
          <div>
            <label className="label">Weight (kg)</label>
            <input type="number" className="input" value={form.weightKg} onChange={set('weightKg')} />
          </div>
          <div>
            <label className="label">Height (cm)</label>
            <input type="number" className="input" value={form.heightCm} onChange={set('heightCm')} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <FiLoader className="animate-spin" /> : <><FiSave className="w-4 h-4" /> Save</>}
          </button>
          <button onClick={onLogout} className="btn-danger">
            <FiLogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {user.bmi && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-2">Body Stats</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">BMI</p>
              <p className="text-lg font-semibold text-slate-900">{user.bmi.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-slate-500">Category</p>
              <p className="text-lg font-semibold text-slate-900">{user.bmiCategory || '--'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
