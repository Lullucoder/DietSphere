import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiClock, FiArrowLeft, FiCalendar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../services/api'
import Layout from '../components/Layout'
import { getFoodEmoji, MEAL_TYPE_CONFIG } from '../utils/foodIcons'

function MealHistory({ user, onLogout }) {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchMealHistory() }, [])

  const fetchMealHistory = async () => {
    try {
      const response = await api.get(`/api/entries?userId=${user.userId}`)
      setMeals(response.data)
    } catch (err) { console.error('Error fetching meal history:', err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (entryId, foodName) => {
    if (!window.confirm(`Delete "${foodName}" from your history?`)) return
    try {
      await api.delete(`/api/entries/${entryId}?userId=${user.userId}`)
      setMeals(prev => prev.filter(m => m.id !== entryId))
      toast.success(`Removed ${foodName}`)
    } catch (err) { toast.error('Failed to delete entry') }
  }

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
    if (d.getTime() === today.getTime()) return 'Today'
    if (d.getTime() === yesterday.getTime()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  const filtered = filter === 'all' ? meals : meals.filter(m => (m.mealType || '').toLowerCase() === filter)

  const grouped = filtered.reduce((groups, meal) => {
    const date = meal.consumedAt?.substring(0, 10) || 'Unknown'
    if (!groups[date]) groups[date] = []
    groups[date].push(meal)
    return groups
  }, {})

  const totalCal = filtered.reduce((sum, m) => sum + Math.round((m.foodItem?.nutrientProfile?.calories || 0) * m.portionSize), 0)

  return (
    <Layout user={user} onLogout={onLogout}>
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-4 transition-colors">
        <FiArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Meal History</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} meal{filtered.length !== 1 ? 's' : ''} · {totalCal.toLocaleString()} kcal total
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ key: 'all', label: 'All', emoji: '📋' }, ...Object.entries(MEAL_TYPE_CONFIG).map(([k, v]) => ({ key: k.toLowerCase(), label: v.label, emoji: v.emoji }))].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                filter === f.key
                  ? 'border-brand-300 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          <span className="w-5 h-5 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin mr-3" />
          Loading your meal history...
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-30">🍽️</div>
            <p className="text-slate-400 text-sm mb-4">{filter === 'all' ? 'No meals logged yet' : `No ${filter} meals found`}</p>
            {filter === 'all' && (
              <Link to="/log-food">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
                  Log Your First Meal
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          {Object.entries(grouped).map(([date, dateMeals], gi) => {
            const dayCalories = dateMeals.reduce((s, m) => s + Math.round((m.foodItem?.nutrientProfile?.calories || 0) * m.portionSize), 0)
            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
                className="mb-6"
              >
                {/* Date Header */}
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <FiCalendar size={13} />
                  {formatDate(date)}
                  <span className="ml-auto font-semibold normal-case tracking-normal text-slate-500">{dayCalories} kcal</span>
                </div>

                <div className="space-y-2.5">
                  {dateMeals.map((meal, i) => {
                    const mt = MEAL_TYPE_CONFIG[meal.mealType] || { emoji: '🍽️', color: '#94a3b8', bg: '#f1f5f9', label: meal.mealType }
                    const kcal = Math.round((meal.foodItem?.nutrientProfile?.calories || 0) * meal.portionSize)
                    const np = meal.foodItem?.nutrientProfile
                    const emoji = getFoodEmoji(meal.foodItem?.name || '', meal.foodItem?.category)

                    return (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-200 hover:bg-brand-50/30 dark:hover:bg-brand-500/10 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: mt.bg }}>
                            {emoji}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{meal.foodItem?.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase" style={{ background: mt.bg, color: mt.color }}>
                                {mt.emoji} {mt.label}
                              </span>
                              <span className="text-[11px] text-slate-400">{meal.portionSize} serving{meal.portionSize !== 1 ? 's' : ''}</span>
                              {np && (
                                <span className="hidden sm:flex gap-1.5 text-[11px]">
                                  <span className="text-rose-500">P:{(np.protein * meal.portionSize).toFixed(0)}g</span>
                                  <span className="text-blue-500">C:{(np.carbohydrates * meal.portionSize).toFixed(0)}g</span>
                                  <span className="text-purple-500">F:{(np.fat * meal.portionSize).toFixed(0)}g</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{kcal} kcal</p>
                            <p className="text-[11px] text-slate-400 flex items-center justify-end gap-1">
                              <FiClock size={10} />{formatTime(meal.consumedAt)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(meal.id, meal.foodItem?.name)}
                            className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-all hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      )}
    </Layout>
  )
}

export default MealHistory
