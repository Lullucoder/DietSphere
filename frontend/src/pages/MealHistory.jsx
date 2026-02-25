import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiClock, FiArrowLeft, FiCalendar, FiFilter } from 'react-icons/fi'
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
    } catch (err) {
      console.error('Error fetching meal history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entryId, foodName) => {
    if (!window.confirm(`Delete "${foodName}" from your history?`)) return
    try {
      await api.delete(`/api/entries/${entryId}?userId=${user.userId}`)
      setMeals(prev => prev.filter(m => m.id !== entryId))
      toast.success(`Removed ${foodName}`)
    } catch (err) {
      toast.error('Failed to delete entry')
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    const today = new Date(); today.setHours(0,0,0,0)
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
    if (d.getTime() === today.getTime()) return 'Today'
    if (d.getTime() === yesterday.getTime()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  }

  // Filter meals by type
  const filtered = filter === 'all' ? meals : meals.filter(m => (m.mealType || '').toLowerCase() === filter)

  // Group by date
  const grouped = filtered.reduce((groups, meal) => {
    const date = meal.consumedAt?.substring(0, 10) || 'Unknown'
    if (!groups[date]) groups[date] = []
    groups[date].push(meal)
    return groups
  }, {})

  // Total calories
  const totalCal = filtered.reduce((sum, m) => sum + Math.round((m.foodItem?.nutrientProfile?.calories || 0) * m.portionSize), 0)

  return (
    <Layout user={user} onLogout={onLogout}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' }}>
        <FiArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Meal History</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            {filtered.length} meal{filtered.length !== 1 ? 's' : ''} · {totalCal.toLocaleString()} kcal total
          </p>
        </div>
        {/* Meal type filter pills */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[{ key: 'all', label: 'All', emoji: '📋' }, ...Object.entries(MEAL_TYPE_CONFIG).map(([k, v]) => ({ key: k.toLowerCase(), label: v.label, emoji: v.emoji }))].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '0.4rem 0.85rem', borderRadius: '100px', border: '1.5px solid',
                borderColor: filter === f.key ? 'var(--color-primary)' : 'var(--color-border)',
                background: filter === f.key ? 'var(--color-primary-soft)' : 'transparent',
                color: filter === f.key ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.15s ease'
              }}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading your meal history...</div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <p>{filter === 'all' ? 'No meals logged yet' : `No ${filter} meals found`}</p>
            {filter === 'all' && (
              <Link to="/log-food"><button className="btn btn-primary">Log Your First Meal</button></Link>
            )}
          </div>
        </motion.div>
      ) : (
        <AnimatePresence>
          {Object.entries(grouped).map(([date, dateMeals], gi) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05 }}
              style={{ marginBottom: '1.5rem' }}
            >
              <div className="date-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCalendar size={13} />
                {formatDate(date)}
                <span style={{ marginLeft: 'auto', fontWeight: 500, textTransform: 'none', letterSpacing: 0, fontSize: '0.78rem' }}>
                  {dateMeals.reduce((s, m) => s + Math.round((m.foodItem?.nutrientProfile?.calories || 0) * m.portionSize), 0)} kcal
                </span>
              </div>

              <div className="meal-list">
                {dateMeals.map((meal, i) => {
                  const mealType = (meal.mealType || '').toLowerCase()
                  const mt = MEAL_TYPE_CONFIG[meal.mealType] || { emoji: '🍽️', color: '#94a3b8', bg: '#f1f5f9' }
                  const kcal = Math.round((meal.foodItem?.nutrientProfile?.calories || 0) * meal.portionSize)
                  const np = meal.foodItem?.nutrientProfile
                  const cat = meal.foodItem?.category
                  const emoji = getFoodEmoji(meal.foodItem?.name || '', cat)

                  return (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.03 }}
                      className="meal-item"
                    >
                      <div className="meal-left">
                        <div className="meal-emoji-badge" style={{ background: mt.bg }}>
                          {emoji}
                        </div>
                        <div>
                          <div className="meal-name">{meal.foodItem?.name}</div>
                          <div className="meal-meta">
                            <span className={`meal-badge ${mealType}`}>{mt.emoji} {mt.label}</span>
                            <span>{meal.portionSize} serving{meal.portionSize !== 1 ? 's' : ''}</span>
                            {np && (
                              <span style={{ display: 'flex', gap: '0.35rem' }}>
                                <span style={{ color: '#ec4899' }}>P:{(np.protein * meal.portionSize).toFixed(0)}g</span>
                                <span style={{ color: '#3b82f6' }}>C:{(np.carbohydrates * meal.portionSize).toFixed(0)}g</span>
                                <span style={{ color: '#8b5cf6' }}>F:{(np.fat * meal.portionSize).toFixed(0)}g</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="meal-right">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="meal-calories">{kcal} kcal</span>
                          <button
                            onClick={() => handleDelete(meal.id, meal.foodItem?.name)}
                            className="btn-delete"
                            title="Delete entry"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                        <span className="meal-time">
                          <FiClock size={11} style={{ marginRight: '0.25rem', verticalAlign: '-1px' }} />
                          {formatTime(meal.consumedAt)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </Layout>
  )
}

export default MealHistory
