import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiBarChart2, FiTrendingUp, FiPieChart } from 'react-icons/fi'
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import api from '../services/api'
import Layout from '../components/Layout'

const PERIOD_OPTIONS = [
  { key: 7,  label: '7 Days' },
  { key: 14, label: '14 Days' },
  { key: 30, label: '30 Days' },
]

const PIE_COLORS = ['#6366f1', '#a855f7', '#f59e0b'] // brand, purple, amber
const MEAL_COLORS = { BREAKFAST: '#f59e0b', LUNCH: '#22c55e', DINNER: '#6366f1', SNACK: '#ec4899', OTHER: '#94a3b8' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-900 text-white text-xs rounded-xl px-3.5 py-2.5 shadow-xl border border-slate-700">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-bold">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  )
}

function Charts({ user, onLogout }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => { fetchData() }, [days])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/charts?userId=${user.userId}&days=${days}`)
      setData(res.data)
    } catch (err) { console.error('Error fetching chart data:', err) }
    finally { setLoading(false) }
  }

  const card = (delay, children) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5"
    >
      {children}
    </motion.div>
  )

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FiBarChart2 size={18} className="text-white" />
            </div>
            Charts & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Visual breakdown of your nutrition journey</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {PERIOD_OPTIONS.map(p => (
            <button
              key={p.key}
              onClick={() => setDays(p.key)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                days === p.key
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          <span className="w-5 h-5 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin mr-3" />
          Loading charts...
        </div>
      ) : !data ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center py-16">
          <div className="text-4xl mb-3 opacity-30">📊</div>
          <p className="text-slate-400 text-sm">No data available. Start logging meals to see charts!</p>
        </div>
      ) : (
        <div className="space-y-6">

          {/* ====== 1. Calorie Trend (Area Chart) ====== */}
          {card(0.05, <>
            <div className="flex items-center gap-2 mb-1">
              <FiTrendingUp size={16} className="text-brand-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Calorie Trend</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">Daily calorie intake over the past {days} days</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.dailyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="calories" name="Calories" stroke="#6366f1" strokeWidth={2.5} fill="url(#gradCal)" dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </>)}

          {/* ====== 2. Macro Stacked Bars ====== */}
          {card(0.1, <>
            <div className="flex items-center gap-2 mb-1">
              <FiBarChart2 size={16} className="text-brand-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Daily Macros</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">Protein, carbs & fat stacked per day</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.dailyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="g" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="protein" name="Protein" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                <Bar dataKey="carbs"   name="Carbs"   stackId="a" fill="#a855f7" />
                <Bar dataKey="fat"     name="Fat"     stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>)}

          {/* ====== Row: Macro Pie + Meal Type Pie ====== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 3. Macro Pie */}
            {card(0.15, <>
              <div className="flex items-center gap-2 mb-1">
                <FiPieChart size={16} className="text-brand-500" />
                <h2 className="text-base font-bold text-slate-800 dark:text-white">Macro Split</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">Overall macronutrient distribution</p>
              {data.macroSplit && (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Protein', value: data.macroSplit.proteinGrams },
                          { name: 'Carbs',   value: data.macroSplit.carbsGrams },
                          { name: 'Fat',     value: data.macroSplit.fatGrams },
                        ]}
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex gap-5 mt-2">
                    {[
                      { label: 'Protein', pct: data.macroSplit.proteinPct, g: data.macroSplit.proteinGrams, c: PIE_COLORS[0] },
                      { label: 'Carbs',   pct: data.macroSplit.carbsPct,   g: data.macroSplit.carbsGrams,   c: PIE_COLORS[1] },
                      { label: 'Fat',     pct: data.macroSplit.fatPct,     g: data.macroSplit.fatGrams,     c: PIE_COLORS[2] },
                    ].map(m => (
                      <div key={m.label} className="text-center">
                        <div className="flex items-center gap-1.5 justify-center mb-0.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.c }} />
                          <span className="text-xs font-semibold text-slate-600">{m.label}</span>
                        </div>
                        <p className="text-lg font-bold text-slate-800">{m.pct}%</p>
                        <p className="text-[11px] text-slate-400">{m.g}g total</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>)}

            {/* 4. Calories by Meal Type */}
            {card(0.2, <>
              <div className="flex items-center gap-2 mb-1">
                <FiPieChart size={16} className="text-purple-500" />
                <h2 className="text-base font-bold text-slate-800 dark:text-white">Calories by Meal</h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">Calorie distribution across meal types</p>
              {data.mealTypeBreakdown?.length > 0 ? (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={data.mealTypeBreakdown.map(m => ({ name: m.mealType, value: m.calories }))}
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {data.mealTypeBreakdown.map((m, i) => (
                          <Cell key={i} fill={MEAL_COLORS[m.mealType] || '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-4 justify-center mt-2">
                    {data.mealTypeBreakdown.map(m => (
                      <div key={m.mealType} className="text-center">
                        <div className="flex items-center gap-1.5 justify-center mb-0.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: MEAL_COLORS[m.mealType] || '#94a3b8' }} />
                          <span className="text-xs font-semibold text-slate-600 capitalize">{m.mealType.toLowerCase()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800">{Math.round(m.calories)} kcal</p>
                        <p className="text-[11px] text-slate-400">{m.count} meals</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm text-slate-400 py-8">No meal data yet</p>
              )}
            </>)}
          </div>

          {/* ====== 5. Nutrient Radar ====== */}
          {card(0.25, <>
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-1">🎯 Nutrient Radar</h2>
            <p className="text-xs text-slate-400 mb-4">Daily average % of recommended intake (100% = meeting RDA)</p>
            {data.nutrientRadar?.length > 0 ? (
              <ResponsiveContainer width="100%" height={360}>
                <RadarChart outerRadius="70%" data={data.nutrientRadar}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Radar name="% of RDA" dataKey="percentage" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} dot={{ r: 3, fill: '#6366f1' }} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-slate-400 py-8">No nutrient data</p>
            )}
          </>)}

          {/* ====== 6. Top Foods Bar ====== */}
          {data.topFoods?.length > 0 && card(0.3, <>
            <h2 className="text-base font-bold text-slate-800 dark:text-white mb-1">🏆 Most Logged Foods</h2>
            <p className="text-xs text-slate-400 mb-4">Your top foods by frequency</p>
            <div className="space-y-2.5">
              {data.topFoods.map((food, i) => {
                const max = data.topFoods[0].timesLogged
                const pct = max > 0 ? (food.timesLogged / max) * 100 : 0
                return (
                  <motion.div
                    key={food.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-5 text-xs font-bold text-slate-400 text-right">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{food.name}</span>
                        <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{food.timesLogged}× · {Math.round(food.totalCalories)} kcal</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, delay: 0.35 + i * 0.04 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>)}
        </div>
      )}
    </Layout>
  )
}

export default Charts
