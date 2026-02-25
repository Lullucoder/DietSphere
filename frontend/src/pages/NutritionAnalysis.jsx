import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiZap, FiDroplet, FiActivity, FiAward } from 'react-icons/fi'
import api from '../services/api'
import Layout from '../components/Layout'

function NutritionAnalysis({ user, onLogout }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('today')

  useEffect(() => { fetchAnalysis() }, [period])

  const fetchAnalysis = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/api/analysis/${period}?userId=${user.userId}`)
      setAnalysis(response.data)
    } catch (err) { console.error('Error fetching analysis:', err) }
    finally { setLoading(false) }
  }

  const nutrientColor = (pct) => pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
  const nutrientTw = (pct) => pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-amber-500' : 'text-red-500'
  const nutrientBgTw = (pct) => pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500'
  const nutrientStatus = (pct) => pct >= 100 ? '✓ Sufficient' : pct >= 80 ? 'Adequate' : pct >= 50 ? 'Low' : '⚠ Deficient'
  const scoreEmoji = (s) => s >= 80 ? '🎉' : s >= 60 ? '👍' : s >= 40 ? '💪' : '⚡'

  const NutrientBar = ({ nutrient, unit = 'g', delay = 0 }) => {
    const pct = Math.min(nutrient.percentage, 100)
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{nutrient.name}</span>
          <span className="text-xs text-slate-400">
            {nutrient.consumed.toFixed(1)}{unit} / {nutrient.recommended.toFixed(0)}{unit}
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${nutrientBgTw(nutrient.percentage)}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-[11px]">
          <span className={`font-semibold ${nutrientTw(nutrient.percentage)}`}>{nutrientStatus(nutrient.percentage)}</span>
          <span className="text-slate-400">{Math.round(nutrient.percentage)}%</span>
        </div>
      </div>
    )
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header + Period Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Nutrition Analysis</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of your nutrient intake</p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['today', 'week'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                period === p
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {p === 'today' ? '📅 Today' : '📊 This Week'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          <span className="w-5 h-5 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin mr-3" />
          Loading analysis...
        </div>
      ) : !analysis ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-30">📊</div>
            <p className="text-slate-400 text-sm">No meals logged for this period. Start logging to see your nutrition analysis!</p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Calories', value: Math.round(analysis.totalCalories), unit: 'kcal', icon: <FiZap size={18} />, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
              { label: 'Meals Logged', value: analysis.mealCount, unit: period === 'today' ? 'today' : 'this week', icon: <FiDroplet size={18} />, gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
              { label: 'Nutrient Score', value: `${Math.round(analysis.overallScore)}%`, unit: 'of daily needs', icon: <FiAward size={18} />, gradient: 'from-brand-500 to-purple-500', bg: 'bg-brand-50', special: true }
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.special ? '' : 'text-slate-800 dark:text-white'}`} style={s.special ? { color: nutrientColor(analysis.overallScore) } : {}}>
                      {s.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.unit}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <div className={`bg-gradient-to-br ${s.gradient} bg-clip-text text-transparent`}>{s.icon}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Score Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-center py-8 px-6 mb-6"
          >
            <div className="text-4xl mb-2">{scoreEmoji(analysis.overallScore)}</div>
            <div className="text-4xl font-extrabold" style={{ color: nutrientColor(analysis.overallScore) }}>
              {Math.round(analysis.overallScore)}%
            </div>
            <p className="text-sm text-slate-400 mt-1">Overall Nutrition Score</p>
            <div className="max-w-xs mx-auto mt-4">
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(analysis.overallScore, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ backgroundColor: nutrientColor(analysis.overallScore) }}
                />
              </div>
            </div>
          </motion.div>

          {/* Macronutrients */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <FiActivity size={16} className="text-brand-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Macronutrients</h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">Protein, carbs, and fat breakdown</p>
            <div className="space-y-5">
              {analysis.macronutrients?.map((nutrient, i) => (
                <NutrientBar key={nutrient.name} nutrient={nutrient} delay={0.4 + i * 0.1} />
              ))}
            </div>
          </motion.div>

          {/* Vitamins & Minerals */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <FiTrendingUp size={16} className="text-brand-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Vitamins & Minerals</h2>
            </div>
            <p className="text-xs text-slate-400 mb-5">Micronutrient levels</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {analysis.micronutrients?.map((nutrient, i) => (
                <NutrientBar key={nutrient.name} nutrient={nutrient} unit={nutrient.unit} delay={0.5 + i * 0.05} />
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          {analysis.recommendations?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6"
            >
              <h2 className="text-base font-bold text-slate-800 dark:text-white mb-1">💡 Recommendations</h2>
              <p className="text-xs text-slate-400 mb-5">Personalised suggestions to improve your diet</p>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.05 }}
                  >
                    <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      rec.priority === 'HIGH' ? 'bg-red-500' : rec.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-green-400'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{rec.nutrient}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{rec.message}</p>
                      {rec.foods?.length > 0 && (
                        <p className="text-xs text-brand-600 font-medium mt-1.5">🍴 Try: {rec.foods.join(', ')}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </Layout>
  )
}

export default NutritionAnalysis
