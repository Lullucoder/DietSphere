import { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import api from '../services/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Charts({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/charts/data?userId=${user.id}`)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="loading-spinner w-8 h-8" /></div>;
  }

  if (!data) {
    return <p className="text-center text-slate-500 py-12">Log some meals to see charts</p>;
  }

  const { dailyTrend = [], macroSplit = [], mealTypeBreakdown = [], topFoods = [] } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Charts</h1>

      {/* Daily Trend */}
      {dailyTrend.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-indigo-500" /> Daily Calories
          </h2>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={dailyTrend}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v?.slice(5)} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="calories" stroke="#6366f1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Macro Split */}
      {macroSplit.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
            <FiPieChart className="text-emerald-500" /> Macro Distribution
          </h2>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={macroSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {macroSplit.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Meal Type Breakdown */}
      {mealTypeBreakdown.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-amber-500" /> Calories by Meal
          </h2>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={mealTypeBreakdown} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="mealType" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="calories" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Foods */}
      {topFoods.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-3">Top Foods</h2>
          <ul className="space-y-2">
            {topFoods.slice(0, 5).map((f, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{f.foodName || f.name}</span>
                <span className="text-slate-500">{f.count || f.times}x</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
