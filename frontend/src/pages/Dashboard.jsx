import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiTrendingUp, FiBarChart2, FiClock } from 'react-icons/fi'
import api from '../services/api'
import Layout from '../components/Layout'
import { getFoodEmoji, MEAL_TYPE_CONFIG } from '../utils/foodIcons'

function Dashboard({ user, onLogout }) {
  const [todaysMeals, setTodaysMeals] = useState([])
  const [totalCalories, setTotalCalories] = useState(0)
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodaysMeals()
  }, [])

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

  const calorieGoal = 2000
  const proteinGoal = 150
  const carbsGoal = 250
  const fatGoal = 65
  const caloriePercent = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)

  // SVG ring
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statCards = [
    { label: 'Calories', value: totalCalories, unit: 'kcal', goal: calorieGoal, emoji: '🔥', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Protein', value: macros.protein, unit: 'g', goal: proteinGoal, emoji: '🥩', color: '#e11d48', bg: '#fce7f3' },
    { label: 'Carbs', value: macros.carbs, unit: 'g', goal: carbsGoal, emoji: '🌾', color: '#2563eb', bg: '#dbeafe' },
    { label: 'Fats', value: macros.fat, unit: 'g', goal: fatGoal, emoji: '💧', color: '#7c3aed', bg: '#ede9fe' },
  ]

  const macroData = [
    { name: 'Protein', value: macros.protein, goal: proteinGoal, color: '#e11d48' },
    { name: 'Carbs',   value: macros.carbs,   goal: carbsGoal,   color: '#2563eb' },
    { name: 'Fats',    value: macros.fat,      goal: fatGoal,     color: '#7c3aed' },
  ]

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Greeting */}
      <div className="dash-greeting">
        <div>
          <h1>{getGreeting()}, {user?.username} 👋</h1>
          <p>Here&rsquo;s your nutrition summary for today</p>
        </div>
        <Link to="/log-food">
          <button className="btn btn-primary">
            <FiPlus size={16} /> Log Meal
          </button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className="stat-card-row">
              <div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}<span className="stat-unit">{stat.unit}</span></div>
                <div className="stat-meta">of {stat.goal}{stat.unit}</div>
              </div>
              <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                {stat.emoji}
              </div>
            </div>
            <div className="stat-bar-track">
              <motion.div
                className="stat-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stat.value / stat.goal) * 100, 100)}%` }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                style={{ background: stat.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two-column: Macros + Ring */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title"><FiBarChart2 size={16} style={{ marginRight: 6, verticalAlign: -2 }} />Macro Breakdown</div>
              <div className="card-subtitle">Daily nutrient targets</div>
            </div>
          </div>
          <div className="macro-list">
            {macroData.map(({ name, value, goal, color }) => {
              const pct = Math.min(Math.round((value / goal) * 100), 100)
              return (
                <div key={name} className="macro-item">
                  <div className="macro-item-header">
                    <span className="macro-item-name">
                      <span className="macro-dot" style={{ background: color }} />
                      {name}
                    </span>
                    <span className="macro-item-value">{value}g / {goal}g</span>
                  </div>
                  <div className="progress-bar-track">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <div className="macro-item-footer">
                    <span style={{ color, fontWeight: 600, fontSize: '0.75rem' }}>
                      {pct >= 90 ? 'On track' : pct >= 50 ? 'Getting there' : 'Need more'}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{pct}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Calorie Progress</div>
              <div className="card-subtitle">Track your daily calorie goal</div>
            </div>
          </div>
          <div className="calorie-ring-wrapper">
            <div className="calorie-ring" style={{ width: 180, height: 180 }}>
              <svg viewBox="0 0 180 180">
                <circle className="calorie-ring-bg" cx="90" cy="90" r={radius} />
                <motion.circle
                  className="calorie-ring-fill"
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke={caloriePercent >= 90 ? '#059669' : caloriePercent >= 50 ? '#0f766e' : '#14b8a6'}
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="calorie-ring-text">
                <div className="calorie-ring-percent">{caloriePercent}%</div>
                <div className="calorie-ring-label">of goal</div>
              </div>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              {calorieGoal - totalCalories > 0
                ? `${calorieGoal - totalCalories} calories remaining`
                : '🎉 Goal reached!'
              }
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link to="/log-food">
              <button className="btn btn-primary"><FiPlus size={14} /> Add Meal</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Today's meals */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title"><FiClock size={16} style={{ marginRight: 6, verticalAlign: -2 }} />Today&rsquo;s Meals</div>
            <div className="card-subtitle">{todaysMeals.length} meal{todaysMeals.length !== 1 ? 's' : ''} logged</div>
          </div>
          <Link to="/nutrition">
            <button className="btn btn-outline btn-sm"><FiTrendingUp size={13} /> View Analysis</button>
          </Link>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : todaysMeals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <p>No meals logged today. Start tracking your nutrition!</p>
            <Link to="/log-food">
              <button className="btn btn-primary"><FiPlus size={14} /> Log Your First Meal</button>
            </Link>
          </div>
        ) : (
          <div className="meal-list">
            {todaysMeals.map((meal, i) => {
              const mealType = (meal.mealType || '').toLowerCase()
              const kcal = Math.round((meal.foodItem?.nutrientProfile?.calories || 0) * meal.portionSize)
              const emoji = getFoodEmoji(meal.foodItem?.name, meal.foodItem?.category)
              const mtConfig = MEAL_TYPE_CONFIG[meal.mealType] || {}
              return (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="meal-item"
                >
                  <div className="meal-left">
                    <div className="meal-emoji-badge" style={{ background: mtConfig.bg || '#f1f5f9' }}>
                      {emoji}
                    </div>
                    <div>
                      <div className="meal-name">{meal.foodItem?.name}</div>
                      <div className="meal-meta">
                        <span className={`meal-badge ${mealType}`}>{mtConfig.emoji} {meal.mealType}</span>
                        <span>{meal.portionSize} serving{meal.portionSize !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="meal-right">
                    <span className="meal-calories">{kcal} kcal</span>
                    <span className="meal-time">
                      {new Date(meal.consumedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
