import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlusCircle, FiActivity, FiTarget, FiTrendingUp } from 'react-icons/fi';
import api from '../services/api';

export default function Dashboard({ user }) {
  const [entries, setEntries] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [e, a] = await Promise.all([
          api.get(`/dietary-entries/user/${user.id}`),
          api.get(`/nutrient-analysis?userId=${user.id}`).catch(() => ({ data: null }))
        ]);
        setEntries(e.data.slice(0, 5));
        setAnalysis(a.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, [user.id]);

  const todayCalories = entries
    .filter((e) => new Date(e.entryDate).toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + (e.calories || 0), 0);

  const stats = [
    { label: 'Today\'s Calories', value: todayCalories, icon: FiTrendingUp, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Total Entries', value: entries.length, icon: FiActivity, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'BMI', value: user.bmi?.toFixed(1) || '--', icon: FiTarget, color: 'bg-amber-100 text-amber-600' },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="loading-spinner w-8 h-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Welcome, {user.username}</h1>
          <p className="text-sm text-slate-500">Track your nutrition journey</p>
        </div>
        <Link to="/log" className="btn-primary">
          <FiPlusCircle className="w-4 h-4" /> Log Food
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {analysis?.deficiencies?.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-2">Nutrient Alerts</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.deficiencies.slice(0, 5).map((d, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">{d.nutrientName}</span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-slate-900">Recent Entries</h2>
          <Link to="/history" className="text-sm text-indigo-600 hover:underline">See all</Link>
        </div>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-500">No entries yet. Start logging your meals!</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {entries.map((e) => (
              <li key={e.id} className="py-2 flex items-center justify-between text-sm">
                <span className="text-slate-700">{e.foodItemName}</span>
                <span className="text-slate-500">{e.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
