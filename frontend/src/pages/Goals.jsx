import { useEffect, useState } from 'react';
import { FiSave, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Goals({ user }) {
  const [goals, setGoals] = useState({
    dailyCalorieTarget: 2000,
    proteinTarget: 50,
    carbTarget: 250,
    fatTarget: 65,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/goals?userId=${user.id}`)
      .then((r) => setGoals({ ...goals, ...r.data }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/goals?userId=${user.id}`, goals);
      toast.success('Goals saved!');
    } catch {
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  const set = (k) => (e) => setGoals({ ...goals, [k]: parseFloat(e.target.value) || 0 });

  if (loading) {
    return <div className="flex justify-center py-12"><div className="loading-spinner w-8 h-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nutrition Goals</h1>

      <div className="card p-4 space-y-4">
        <div>
          <label className="label">Daily Calories (kcal)</label>
          <input type="number" className="input" value={goals.dailyCalorieTarget} onChange={set('dailyCalorieTarget')} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Protein (g)</label>
            <input type="number" className="input" value={goals.proteinTarget} onChange={set('proteinTarget')} />
          </div>
          <div>
            <label className="label">Carbs (g)</label>
            <input type="number" className="input" value={goals.carbTarget} onChange={set('carbTarget')} />
          </div>
          <div>
            <label className="label">Fat (g)</label>
            <input type="number" className="input" value={goals.fatTarget} onChange={set('fatTarget')} />
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? <FiLoader className="animate-spin" /> : <><FiSave className="w-4 h-4" /> Save Goals</>}
        </button>
      </div>

      <div className="card p-4">
        <h2 className="font-medium text-slate-900 mb-3">Macro Breakdown</h2>
        <div className="space-y-3">
          {[
            { label: 'Protein', value: goals.proteinTarget, kcal: goals.proteinTarget * 4, color: 'bg-indigo-500' },
            { label: 'Carbs', value: goals.carbTarget, kcal: goals.carbTarget * 4, color: 'bg-emerald-500' },
            { label: 'Fat', value: goals.fatTarget, kcal: goals.fatTarget * 9, color: 'bg-amber-500' },
          ].map((m) => {
            const pct = ((m.kcal / goals.dailyCalorieTarget) * 100).toFixed(0);
            return (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{m.label}</span>
                  <span className="text-slate-500">{m.value}g ({pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${m.color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
