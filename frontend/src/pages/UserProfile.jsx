import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import api from '../services/api';
import { mapDietaryEntries } from '../utils/apiMappers';
import {
  FiUser, FiMail, FiCalendar, FiEdit3, FiSave,
  FiLock, FiTrash2, FiActivity, FiAward, FiZap, FiX
} from 'react-icons/fi';

export default function UserProfile({ user, onLogout, onUpdateUser }) {
  const [stats, setStats] = useState({ totalEntries: 0, activeDays: 0, avgPerDay: 0, totalCalories: 0 });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    age: user?.age || '',
    weightKg: user?.weightKg || '',
    heightCm: user?.heightCm || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : 'U';

  const bmi = form.weightKg && form.heightCm
    ? (parseFloat(form.weightKg) / ((parseFloat(form.heightCm) / 100) ** 2)).toFixed(1)
    : null;
  const bmiColor = !bmi ? '' : parseFloat(bmi) < 18.5 ? 'text-amber-500' : parseFloat(bmi) < 25 ? 'text-sage-600 dark:text-sage-400' : parseFloat(bmi) < 30 ? 'text-orange-500' : 'text-red-500';

  useEffect(() => {
    api.get(`/dietary-entries/user/${user.id}`)
      .then((res) => {
        const entries = mapDietaryEntries(res.data);
        const dates = new Set(entries.map((e) => new Date(e.entryDate).toDateString()));
        const totalCal = entries.reduce((s, e) => s + (e.calories || 0), 0);
        setStats({
          totalEntries: entries.length,
          activeDays: dates.size,
          avgPerDay: dates.size > 0 ? (entries.length / dates.size).toFixed(1) : 0,
          totalCalories: Math.round(totalCal),
        });
      })
      .catch(() => {});
  }, [user.id]);

  useEffect(() => {
    api.get(`/auth/profile?userId=${user.id}`)
      .then((res) => {
        if (!res.data) return;
        setForm((prev) => ({
          ...prev,
          username: res.data.username ?? prev.username,
          email: res.data.email ?? prev.email,
          age: res.data.age ?? '',
          weightKg: res.data.weightKg ?? '',
          heightCm: res.data.heightCm ?? '',
        }));
        onUpdateUser({ ...user, ...res.data });
      })
      .catch(() => {});
  }, [user.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/auth/profile?userId=${user.id}`, {
        username: form.username,
        email: form.email,
        age: form.age ? parseInt(form.age) : null,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : null,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : null,
      });
      const updated = { ...user, ...res.data };
      onUpdateUser(updated);
      if (bmi) localStorage.setItem('userBMI', bmi);
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('Min 6 characters'); return; }
    setChangingPw(true);
    try {
      await api.put(`/auth/change-password?userId=${user.id}`, {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPwForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setChangingPw(false);
  };

  const handleDelete = async () => {
    try {
      if (!deletePassword) { toast.error('Password is required'); return; }
      await api.delete(`/auth/account?userId=${user.id}`, { data: { password: deletePassword } });
      toast.success('Account deleted');
      onLogout();
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Profile Header */}
      <div className="card overflow-hidden mb-6">
        <div className="h-28 bg-sage-500" />
        <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-20 h-20 rounded-2xl bg-sage-600 border-4 border-white dark:border-dark-card flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-charcoal dark:text-dark-text">{user.username}</h1>
            <p className="text-sm text-brown-400 dark:text-dark-muted">{user.email}</p>
          </div>
          {bmi && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cream-100 dark:bg-dark-border/50">
              <FiActivity className={`w-4 h-4 ${bmiColor}`} />
              <span className={`text-sm font-bold ${bmiColor}`}>BMI {bmi}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Meals',    value: stats.totalEntries, icon: FiZap,      bg: 'bg-sage-50 dark:bg-sage-500/10',  accent: 'text-sage-600 dark:text-sage-400' },
          { label: 'Active Days',    value: stats.activeDays,   icon: FiCalendar, bg: 'bg-cream-100 dark:bg-dark-border/50', accent: 'text-brown-500 dark:text-dark-muted' },
          { label: 'Avg Meals/Day',  value: stats.avgPerDay,    icon: FiAward,    bg: 'bg-sage-50 dark:bg-sage-500/10',  accent: 'text-sage-600 dark:text-sage-400' },
          { label: 'Total Calories', value: stats.totalCalories, icon: FiActivity, bg: 'bg-cream-100 dark:bg-dark-border/50', accent: 'text-brown-500 dark:text-dark-muted' },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.accent}`} />
            </div>
            <p className="text-2xl font-bold text-charcoal dark:text-dark-text">{s.value}</p>
            <p className="text-xs text-brown-400 dark:text-dark-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-charcoal dark:text-dark-text">Account Information</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn-ghost text-xs">
                <FiEdit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <button onClick={() => setEditing(false)} className="btn-ghost text-xs text-brown-300">
                <FiX className="w-3.5 h-3.5" /> Cancel
              </button>
            )}
          </div>
          <div className="space-y-4">
            {[
              { icon: FiUser, label: 'Username', key: 'username', type: 'text' },
              { icon: FiMail, label: 'Email',    key: 'email',    type: 'email' },
              { icon: FiCalendar, label: 'Age',   key: 'age',     type: 'number' },
              { icon: FiActivity, label: 'Weight (kg)', key: 'weightKg', type: 'number' },
              { icon: FiActivity, label: 'Height (cm)', key: 'heightCm', type: 'number' },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-brown-400 dark:text-dark-muted mb-1">{f.label}</label>
                {editing ? (
                  <div className="relative">
                    <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="input pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-cream-50 dark:bg-dark-border/40">
                    <f.icon className="w-4 h-4 text-brown-300 dark:text-dark-muted" />
                    <span className="text-sm text-charcoal dark:text-dark-text">{form[f.key] || '—'}</span>
                  </div>
                )}
              </div>
            ))}
            {editing && (
              <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 text-sm mt-2">
                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave className="w-4 h-4" /> Save Changes</>}
              </button>
            )}
          </div>
        </div>

        {/* Security + Danger */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-charcoal dark:text-dark-text">Security</h3>
              <button onClick={() => setShowPwForm(!showPwForm)} className="btn-ghost text-xs">
                <FiLock className="w-3.5 h-3.5" /> {showPwForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>
            {showPwForm && (
              <div className="space-y-3">
                <input type="password" placeholder="Current password" value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  className="input" />
                <input type="password" placeholder="New password (min 6 chars)" value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="input" />
                <input type="password" placeholder="Confirm new password" value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  className="input" />
                <button onClick={handleChangePassword} disabled={changingPw} className="btn-primary w-full py-2.5 text-sm">
                  {changingPw ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Update Password'}
                </button>
              </div>
            )}
          </div>

          <div className="card p-6 border-red-200 dark:border-red-500/30">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
            <p className="text-xs text-brown-400 dark:text-dark-muted mb-4">
              Permanently delete your account and all data. This action cannot be undone.
            </p>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                <FiTrash2 className="inline w-4 h-4 mr-1.5 -mt-0.5" /> Delete Account
              </button>
            ) : (
              <div className="space-y-3">
                <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Confirm password" className="input" />
                <div className="flex items-center gap-3">
                  <button onClick={handleDelete} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                    Confirm Delete
                  </button>
                  <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-brown-400 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
