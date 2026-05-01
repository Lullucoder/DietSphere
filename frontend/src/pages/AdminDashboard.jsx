import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
  FiUsers, FiShield, FiDatabase, FiTrendingUp,
  FiSearch, FiChevronDown, FiChevronUp, FiX,
  FiTrash2, FiArrowUp, FiArrowDown, FiCalendar,
  FiMail, FiUser, FiActivity, FiTarget, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';

/* ───────── stat card ───────── */
function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-cream-200 dark:border-dark-border p-5 flex items-start gap-4 shadow-soft hover:shadow-soft-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-charcoal dark:text-dark-text">{value}</p>
        <p className="text-xs text-brown-400 dark:text-dark-muted mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-brown-300 dark:text-dark-muted/70 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

/* ───────── confirm dialog ───────── */
function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-dark-card rounded-2xl border border-cream-200 dark:border-dark-border shadow-soft-lg p-6 w-full max-w-sm animate-in">
        <h3 className="text-lg font-semibold text-charcoal dark:text-dark-text">{title}</h3>
        <p className="text-sm text-brown-400 dark:text-dark-muted mt-2">{message}</p>
        <div className="flex gap-3 mt-5 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium rounded-xl border border-cream-200 dark:border-dark-border text-brown-500 dark:text-dark-muted hover:bg-cream-100 dark:hover:bg-dark-border transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium rounded-xl text-white transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-sage-500 hover:bg-sage-600'}`}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── user detail panel ───────── */
function UserDetailPanel({ userId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    api.get(`/admin/users/${userId}`)
      .then(res => setDetail(res.data))
      .catch(() => toast.error('Failed to load user details'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-dark-card border-l border-cream-200 dark:border-dark-border shadow-soft-lg overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm border-b border-cream-200 dark:border-dark-border px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-charcoal dark:text-dark-text">User Details</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-cream-100 dark:hover:bg-dark-border text-brown-400 dark:text-dark-muted transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : detail ? (
          <div className="p-6 space-y-6">
            {/* Profile header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center text-white font-bold text-lg shadow-soft">
                {detail.username?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-charcoal dark:text-dark-text">{detail.username}</h4>
                <p className="text-sm text-brown-400 dark:text-dark-muted">{detail.email}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${detail.role === 'ADMIN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' : 'bg-sage-100 text-sage-700 dark:bg-sage-500/15 dark:text-sage-400'}`}>
                  {detail.role}
                </span>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FiCalendar, label: 'Age', value: detail.age ?? '—' },
                { icon: FiActivity, label: 'BMI', value: detail.bmi ? `${detail.bmi} (${detail.bmiCategory})` : '—' },
                { icon: FiUser, label: 'Weight', value: detail.weightKg ? `${detail.weightKg} kg` : '—' },
                { icon: FiUser, label: 'Height', value: detail.heightCm ? `${detail.heightCm} cm` : '—' },
                { icon: FiDatabase, label: 'Entries', value: detail.totalDietaryEntries },
                { icon: FiClock, label: 'Joined', value: detail.createdAt ? new Date(detail.createdAt).toLocaleDateString() : '—' },
              ].map(({ icon: I, label, value }) => (
                <div key={label} className="bg-cream-100 dark:bg-dark-bg rounded-xl p-3 flex items-center gap-3">
                  <I className="w-4 h-4 text-sage-500 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-brown-300 dark:text-dark-muted">{label}</p>
                    <p className="text-sm font-medium text-charcoal dark:text-dark-text">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Nutrition goals */}
            {detail.calorieGoal && (
              <div>
                <h5 className="text-sm font-semibold text-charcoal dark:text-dark-text mb-3 flex items-center gap-2">
                  <FiTarget className="w-4 h-4 text-sage-500" /> Nutrition Goals
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Calories', value: detail.calorieGoal, unit: 'kcal' },
                    { label: 'Protein', value: detail.proteinGoal, unit: 'g' },
                    { label: 'Carbs', value: detail.carbsGoal, unit: 'g' },
                    { label: 'Fat', value: detail.fatGoal, unit: 'g' },
                    { label: 'Fiber', value: detail.fiberGoal, unit: 'g' },
                  ].map(g => (
                    <div key={g.label} className="bg-cream-100 dark:bg-dark-bg rounded-lg p-2.5 text-center">
                      <p className="text-xs text-brown-300 dark:text-dark-muted">{g.label}</p>
                      <p className="text-sm font-semibold text-charcoal dark:text-dark-text">{g.value}<span className="text-[10px] text-brown-300 dark:text-dark-muted ml-0.5">{g.unit}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent dietary entries */}
            <div>
              <h5 className="text-sm font-semibold text-charcoal dark:text-dark-text mb-3 flex items-center gap-2">
                <FiDatabase className="w-4 h-4 text-sage-500" /> Recent Dietary Entries
              </h5>
              {detail.recentEntries?.length > 0 ? (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {detail.recentEntries.map(e => (
                    <div key={e.id} className="flex items-center justify-between bg-cream-100 dark:bg-dark-bg rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-charcoal dark:text-dark-text">{e.foodName}</p>
                        <p className="text-xs text-brown-300 dark:text-dark-muted">
                          {e.mealType} · {e.portionSize}x · {new Date(e.consumedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-brown-300 dark:text-dark-muted italic">No dietary entries recorded.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-brown-300 dark:text-dark-muted">User not found</div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN ADMIN DASHBOARD
   ═══════════════════════════════════════ */
export default function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [confirm, setConfirm] = useState({ open: false });

  // Fetch data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  // Sort
  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...users]
    .filter(u => {
      const q = search.toLowerCase();
      return u.username.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.role.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (av == null) av = '';
      if (bv == null) bv = '';
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  // Role toggle
  const handleRoleToggle = (u) => {
    const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setConfirm({
      open: true,
      title: `Change role to ${newRole}?`,
      message: `Are you sure you want to ${newRole === 'ADMIN' ? 'promote' : 'demote'} "${u.username}" to ${newRole}?`,
      danger: newRole === 'USER',
      onConfirm: async () => {
        setConfirm({ open: false });
        try {
          await api.put(`/admin/users/${u.id}/role`, { role: newRole });
          toast.success(`${u.username} is now ${newRole}`);
          loadData();
        } catch { toast.error('Failed to update role'); }
      },
    });
  };

  // Delete user
  const handleDelete = (u) => {
    setConfirm({
      open: true,
      title: 'Delete user?',
      message: `This will permanently delete "${u.username}" and all their data. This cannot be undone.`,
      danger: true,
      onConfirm: async () => {
        setConfirm({ open: false });
        try {
          await api.delete(`/admin/users/${u.id}`);
          toast.success(`${u.username} deleted`);
          loadData();
        } catch { toast.error('Failed to delete user'); }
      },
    });
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <FiChevronDown className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />;
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-soft">
            <FiShield className="w-5 h-5" />
          </div>
          Admin Dashboard
        </h1>
        <p className="text-sm text-brown-400 dark:text-dark-muted mt-1">Manage users, monitor activity, and oversee the system.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-3 border-sage-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Stats cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FiUsers} label="Total Users" value={stats?.totalUsers ?? 0}
              accent="bg-sage-100 text-sage-600 dark:bg-sage-500/15 dark:text-sage-400"
              sub={`${stats?.newUsersToday ?? 0} today`} />
            <StatCard icon={FiShield} label="Admins" value={stats?.totalAdmins ?? 0}
              accent="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" />
            <StatCard icon={FiDatabase} label="Dietary Entries" value={stats?.totalDietaryEntries ?? 0}
              accent="bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
              sub={`${stats?.avgEntriesPerUser ?? 0} avg/user`} />
            <StatCard icon={FiTrendingUp} label="This Week" value={`+${stats?.newUsersThisWeek ?? 0}`}
              accent="bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"
              sub="new signups" />
          </div>

          {/* ── Users table ── */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-cream-200 dark:border-dark-border shadow-soft overflow-hidden">
            {/* Table header */}
            <div className="p-5 border-b border-cream-200 dark:border-dark-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg font-semibold text-charcoal dark:text-dark-text">
                All Users <span className="text-sm font-normal text-brown-300 dark:text-dark-muted">({sorted.length})</span>
              </h2>
              <div className="relative max-w-xs w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
                <input
                  id="admin-user-search"
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-cream-200 dark:border-dark-border bg-cream-100 dark:bg-dark-bg text-charcoal dark:text-dark-text placeholder:text-brown-300 dark:placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-sage-400/40"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200 dark:border-dark-border">
                    {[
                      { key: 'username', label: 'User' },
                      { key: 'email', label: 'Email' },
                      { key: 'age', label: 'Age' },
                      { key: 'role', label: 'Role' },
                      { key: 'bmi', label: 'BMI' },
                      { key: 'totalDietaryEntries', label: 'Entries' },
                      { key: 'createdAt', label: 'Joined' },
                    ].map(col => (
                      <th key={col.key}
                        onClick={() => toggleSort(col.key)}
                        className="px-4 py-3 text-left text-xs font-semibold text-brown-400 dark:text-dark-muted uppercase tracking-wider cursor-pointer hover:text-charcoal dark:hover:text-dark-text select-none whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          {col.label} <SortIcon col={col.key} />
                        </span>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brown-400 dark:text-dark-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 dark:divide-dark-border">
                  {sorted.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-brown-300 dark:text-dark-muted">No users found.</td>
                    </tr>
                  ) : sorted.map(u => (
                    <tr key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className="hover:bg-cream-100 dark:hover:bg-dark-border/50 cursor-pointer transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-300 to-sage-500 dark:from-sage-500 dark:to-sage-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.username?.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-charcoal dark:text-dark-text">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-brown-400 dark:text-dark-muted">{u.email}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-brown-400 dark:text-dark-muted">{u.age ?? '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' : 'bg-sage-100 text-sage-700 dark:bg-sage-500/15 dark:text-sage-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-brown-400 dark:text-dark-muted">
                        {u.bmi ? <span>{u.bmi} <span className="text-xs text-brown-300 dark:text-dark-muted/70">({u.bmiCategory})</span></span> : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-brown-400 dark:text-dark-muted font-medium">{u.totalDietaryEntries}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-brown-400 dark:text-dark-muted text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleRoleToggle(u)}
                            title={u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                            className="p-1.5 rounded-lg hover:bg-sage-100 dark:hover:bg-sage-500/15 text-sage-600 dark:text-sage-400 transition-colors"
                          >
                            {u.role === 'ADMIN' ? <FiArrowDown className="w-4 h-4" /> : <FiArrowUp className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            title="Delete user"
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 dark:text-red-400 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Detail panel */}
      <UserDetailPanel userId={selectedUserId} onClose={() => setSelectedUserId(null)} />

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        danger={confirm.danger}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm({ open: false })}
      />

      {/* Inline animation styles */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeScaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.25s ease-out; }
        .animate-in        { animation: fadeScaleIn 0.2s ease-out; }
      `}</style>
    </Layout>
  );
}
