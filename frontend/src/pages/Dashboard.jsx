import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiTrendingUp, FiBarChart2, FiClock, FiArrowRight } from 'react-icons/fi'
import api from '../services/api'
import Layout from '../components/Layout'
import { getFoodEmoji, MEAL_TYPE_CONFIG } from '../utils/foodIcons'

function Dashboard({ user, onLogout }) {
  const [todaysMeals, setTodaysMeals] = useState([])
  const [totalCalories, setTotalCalories] = useState(0)
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 })
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState({ calorieGoal: 2000, proteinGoal: 50, carbsGoal: 300, fatGoal: 65 })

  useEffect(() => { fetchTodaysMeals(); fetchGoals() }, [])

  const fetchGoals = async () => {
    try {
      const res = await api.get(`/api/goals?userId=${user.userId}`)
      setGoals(res.data)
    } catch (err) { console.error('Error fetching goals:', err) }
  }

  const fetchTodaysMeals = async () => {
    try {
      const response = await api.get(`/api/entries/today?userId=${user.userId}`)
      setTodaysMeals(response.data)
      let cals = 0, protein = 0, carbs = 0, fat = 0
      response.data.forEach(entry => {
        const p = entry.portionSize || 1
        const np = entry.foodItem?.nutrientProfile
        if (np) {
          cals += (np.calories || 0) * p
          protein += (np.protein || 0) * p
          carbs += (np.carbohydrates || 0) * p
          fat += (np.fat || 0) * p
        }
      })
      setTotalCalories(Math.round(cals))
      setMacros({ protein: Math.round(protein), carbs: Math.round(carbs), fat: Math.round(fat) })
    } catch (err) {
      console.error('Error fetching meals:', err)
    } finally {
      setLoading(false)
    }
  }

  const calorieGoal = goals.calorieGoal || 2000
  const proteinGoal = goals.proteinGoal || 50
  const carbsGoal = goals.carbsGoal || 300
  const fatGoal = goals.fatGoal || 65
  const caloriePercent = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statCards = [
    { label: 'Calories', value: totalCalories, unit: 'kcal', goal: calorieGoal, emoji: '🔥', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    { label: 'Protein', value: macros.protein, unit: 'g', goal: proteinGoal, emoji: '🥩', gradient: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-600' },
    { label: 'Carbs', value: macros.carbs, unit: 'g', goal: carbsGoal, emoji: '🌾', gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Fats', value: macros.fat, unit: 'g', goal: fatGoal, emoji: '💧', gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', text: 'text-purple-600' },
  ]

  const macroData = [
    { name: 'Protein', value: macros.protein, goal: proteinGoal, color: '#e11d48', bg: 'bg-rose-100' },
    { name: 'Carbs', value: macros.carbs, goal: carbsGoal, color: '#3b82f6', bg: 'bg-blue-100' },
    { name: 'Fats', value: macros.fat, goal: fatGoal, color: '#8b5cf6', bg: 'bg-purple-100' },
  ]

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {user?.username} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here&rsquo;s your nutrition summary for today</p>
        </div>
        <Link to="/log-food">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all duration-200">
            <FiPlus size={16} /> Log Meal
          </button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => {
          const pct = Math.min(Math.round((stat.value / stat.goal) * 100), 100)
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {stat.value}<span className="text-sm font-medium text-slate-400 ml-1">{stat.unit}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">of {stat.goal}{stat.unit}</p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center text-lg`}>
                  {stat.emoji}
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Two-Column: Macros + Calorie Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Macro Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FiBarChart2 size={16} className="text-brand-500" />Macro Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily nutrient targets</p>
            </div>
          </div>
          <div className="space-y-5">
            {macroData.map(({ name, value, goal, color, bg }) => {
              const pct = Math.min(Math.round((value / goal) * 100), 100)
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      {name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{value}g / {goal}g</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[11px] font-semibold" style={{ color }}>
                      {pct >= 90 ? 'On track' : pct >= 50 ? 'Getting there' : 'Need more'}
                    </span>
                    <span className="text-[11px] text-slate-400">{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Calorie Ring */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center"
        >
          <div className="w-full mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Calorie Progress</h3>
            <p className="text-xs text-slate-400 mt-0.5">Track your daily calorie goal</p>
          </div>

          <div className="relative" style={{ width: 180, height: 180 }}>
            <svg viewBox="0 0 180 180" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle className="calorie-ring-bg" cx="90" cy="90" r={radius} />
              <motion.circle
                className="calorie-ring-fill"
                cx="90" cy="90" r={radius}
                stroke={caloriePercent >= 90 ? '#059669' : caloriePercent >= 50 ? '#6366f1' : '#14b8a6'}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{caloriePercent}%</span>
              <span className="text-xs text-slate-400">of goal</span>
            </div>
          </div>

          <p className="text-sm text-slate-400 mt-4">
            {calorieGoal - totalCalories > 0
              ? `${calorieGoal - totalCalories} calories remaining`
              : '🎉 Goal reached!'
            }
          </p>
          <Link to="/log-food" className="mt-4">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition-all">
              <FiPlus size={14} /> Add Meal
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Today's Meals */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FiClock size={16} className="text-brand-500" />Today&rsquo;s Meals
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{todaysMeals.length} meal{todaysMeals.length !== 1 ? 's' : ''} logged</p>
          </div>
          <Link to="/nutrition">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors">
              <FiTrendingUp size={13} /> View Analysis
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
            <span className="w-5 h-5 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin mr-3" />
            Loading...
          </div>
        ) : todaysMeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3 opacity-30">🍽️</div>
            <p className="text-slate-400 text-sm mb-4">No meals logged today. Start tracking your nutrition!</p>
            <Link to="/log-food">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all">
                <FiPlus size={14} /> Log Your First Meal
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysMeals.map((meal, i) => {
              const kcal = Math.round((meal.foodItem?.nutrientProfile?.calories || 0) * meal.portionSize)
              const emoji = getFoodEmoji(meal.foodItem?.name, meal.foodItem?.category)
              const mtConfig = MEAL_TYPE_CONFIG[meal.mealType] || {}
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-brand-200 hover:bg-brand-50/30 dark:hover:bg-brand-500/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: mtConfig.bg || '#f1f5f9' }}>
                      {emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{meal.foodItem?.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                          style={{ background: mtConfig.bg, color: mtConfig.color }}
                        >
                          {mtConfig.emoji} {meal.mealType}
                        </span>
                        <span className="text-[11px] text-slate-400">{meal.portionSize} serving{meal.portionSize !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{kcal} kcal</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(meal.consumedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </Layout>
  )
}

export default Dashboard
