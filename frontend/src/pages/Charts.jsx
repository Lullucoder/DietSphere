import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { FiBarChart2 } from 'react-icons/fi';

const COLORS = ['#10b981', '#78716c', '#6ee7b7', '#a8a29e', '#059669', '#d6d3d1', '#34d399', '#e7e5e4'];
const PERIODS = [
  { value: 7,  label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 30, label: '30 Days' },
];

const ChartCard = ({ title, children }) => (
  <div className="card p-5">
    <h3 className="text-sm font-semibold text-charcoal dark:text-dark-text mb-4">{title}</h3>
    <div style={{ width: '100%', height: 256 }}>{children}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-dark-card rounded-xl border border-cream-200 dark:border-dark-border shadow-soft p-3 text-xs">
      <p className="font-semibold text-charcoal dark:text-dark-text mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-brown-400 dark:text-dark-muted">{p.name}:</span>
          <span className="font-medium text-charcoal dark:text-dark-text">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function Charts({ user, onLogout }) {
  const { dark } = useTheme();
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/charts?userId=${user.id}&days=${days}`);
        setData(res.data);
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, [days, user.id]);

  const dailyData = data?.dailyTrend || [];
  const macroSplit = data?.macroSplit || {};
  const mealTypeData = data?.mealTypeBreakdown || [];
  const topFoods = data?.topFoods || [];
  const nutrientRadar = data?.nutrientRadar || [];

  const macroPieData = [
    { name: 'Protein', value: macroSplit.proteinGrams || 0 },
    { name: 'Carbs',   value: macroSplit.carbsGrams   || 0 },
    { name: 'Fat',     value: macroSplit.fatGrams     || 0 },
  ].filter((d) => d.value > 0);

  const mealTypePieData = mealTypeData.map((m) => ({ name: m.mealType, value: m.calories }));
  const radarData = nutrientRadar.map((p) => ({ nutrient: p.nutrient, value: p.percentage }));
  const topFoodsData = topFoods.map((f) => ({ name: f.name, count: f.timesLogged, calories: f.totalCalories }));

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text">Charts & Analytics</h1>
          <p className="text-sm text-brown-400 dark:text-dark-muted mt-1">Visual insights into your nutrition data</p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-cream-300 dark:border-dark-border text-xs self-start">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setDays(p.value)}
              className={`px-4 py-2 font-semibold transition-colors ${
                days === p.value ? 'bg-sage-500 text-white' : 'text-brown-400 dark:text-dark-muted hover:bg-cream-100 dark:hover:bg-dark-card'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-80 rounded-2xl bg-cream-200 dark:bg-dark-card" />)}
        </div>
      )}

      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 1: Calorie Trend */}
          <ChartCard title="Calorie Trend">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#334155' : '#e7e5e4'} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke={dark ? '#94a3b8' : '#a8a29e'} />
                <YAxis tick={{ fontSize: 11 }} stroke={dark ? '#94a3b8' : '#a8a29e'} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="calories" name="Calories" stroke="#10b981" strokeWidth={2.5} fill="url(#calGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2: Macro Stacked Bar */}
          <ChartCard title="Macro Distribution (Daily)">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#334155' : '#e7e5e4'} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke={dark ? '#94a3b8' : '#a8a29e'} />
                <YAxis tick={{ fontSize: 11 }} stroke={dark ? '#94a3b8' : '#a8a29e'} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="protein" name="Protein" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="carbs"   name="Carbs"   stackId="a" fill="#78716c" />
                <Bar dataKey="fat"     name="Fat"     stackId="a" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 3: Macro Pie */}
          <ChartCard title="Macro Split (Total)">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroPieData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {macroPieData.map((_, i) => (
                    <Cell key={i} fill={['#10b981', '#78716c', '#6ee7b7'][i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 4: Meal Type Pie */}
          <ChartCard title="Meal Type Breakdown">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mealTypePieData}
                  cx="50%" cy="50%"
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {mealTypePieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 5: Nutrient Radar */}
          {radarData.length > 0 && (
            <ChartCard title="Nutrient Balance">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={dark ? '#334155' : '#e7e5e4'} />
                  <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 10, fill: dark ? '#94a3b8' : '#a8a29e' }} />
                  <PolarRadiusAxis tick={{ fontSize: 9 }} stroke={dark ? '#94a3b8' : '#a8a29e'} />
                  <Radar name="Intake" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {/* 6: Top Foods */}
          {topFoodsData.length > 0 && (
            <ChartCard title="Most Logged Foods">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFoodsData.slice(0, 8)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#334155' : '#e7e5e4'} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke={dark ? '#94a3b8' : '#a8a29e'} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke={dark ? '#94a3b8' : '#a8a29e'} width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Times Logged" fill="#10b981" radius={[0, 6, 6, 0]}>
                    {topFoodsData.slice(0, 8).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      )}

      {!loading && !data && (
        <div className="text-center py-20">
          <FiBarChart2 className="w-8 h-8 text-brown-300 dark:text-dark-muted mx-auto mb-3" />
          <p className="text-sm text-brown-400 dark:text-dark-muted">No chart data available. Log some meals first!</p>
        </div>
      )}
    </Layout>
  );
}
