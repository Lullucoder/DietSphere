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
    } catch (err) {
      console.error('Error fetching analysis:', err)
    } finally {
      setLoading(false)
    }
  }

  const getNutrientColor = (pct) => {
    if (pct >= 80) return 'var(--color-success)'
    if (pct >= 50) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  const getNutrientStatus = (pct) => {
    if (pct >= 100) return '✓ Sufficient'
    if (pct >= 80) return 'Adequate'
    if (pct >= 50) return 'Low'
    return '⚠ Deficient'
  }

  const scoreEmoji = (score) => {
    if (score >= 80) return '🎉'
    if (score >= 60) return '👍'
    if (score >= 40) return '💪'
    return '⚡'
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            Nutrition Analysis
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Detailed breakdown of your nutrient intake
          </p>
        </div>
        <div className="period-selector">
          {['today', 'week'].map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p === 'today' ? '📅 Today' : '📊 This Week'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading analysis...</div>
      ) : !analysis ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>No meals logged for this period. Start logging meals to see your nutrition analysis!</p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="stats-grid">
            {[
              { label: 'Total Calories', value: Math.round(analysis.totalCalories), unit: 'kcal', icon: <FiZap />, color: 'amber', bg: '#fef3c7' },
              { label: 'Meals Logged', value: analysis.mealCount, unit: period === 'today' ? 'today' : 'this week', icon: <FiDroplet />, color: 'green', bg: '#d1fae5' },
              { label: 'Nutrient Score', value: `${Math.round(analysis.overallScore)}%`, unit: 'of daily needs', icon: <FiAward />, color: 'teal', bg: '#ccfbf1', valueColor: getNutrientColor(analysis.overallScore) }
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="stat-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="stat-card-row">
                  <div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value" style={s.valueColor ? { color: s.valueColor } : {}}>
                      {s.value}
                    </div>
                    <div className="stat-meta">{s.unit}</div>
                  </div>
                  <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Score Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="card"
            style={{ textAlign: 'center', padding: '2rem 1.5rem' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{scoreEmoji(analysis.overallScore)}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: getNutrientColor(analysis.overallScore) }}>
              {Math.round(analysis.overallScore)}%
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              Overall Nutrition Score
            </div>
            {/* Score bar */}
            <div style={{ maxWidth: '320px', margin: '1rem auto 0' }}>
              <div className="progress-bar-track" style={{ height: '10px' }}>
                <motion.div
                  className="progress-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(analysis.overallScore, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ backgroundColor: getNutrientColor(analysis.overallScore) }}
                />
              </div>
            </div>
          </motion.div>

          {/* Macronutrients */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card"
          >
            <div className="card-header">
              <div>
                <div className="card-title"><FiActivity size={16} style={{ marginRight: '0.4rem', verticalAlign: '-2px' }} /> Macronutrients</div>
                <div className="card-subtitle">Protein, carbs, and fat breakdown</div>
              </div>
            </div>
            <div className="nutrient-grid">
              {analysis.macronutrients && analysis.macronutrients.map((nutrient, i) => {
                const pct = Math.min(nutrient.percentage, 100)
                return (
                  <div key={nutrient.name} className="nutrient-bar-item">
                    <div className="nutrient-bar-header">
                      <span className="nutrient-bar-name">{nutrient.name}</span>
                      <span className="nutrient-bar-value">
                        {nutrient.consumed.toFixed(1)}g / {nutrient.recommended.toFixed(0)}g
                      </span>
                    </div>
                    <div className="nutrient-bar-track">
                      <motion.div
                        className="nutrient-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                        style={{ backgroundColor: getNutrientColor(nutrient.percentage) }}
                      />
                    </div>
                    <div className="nutrient-bar-footer">
                      <span style={{ color: getNutrientColor(nutrient.percentage), fontWeight: 600 }}>
                        {getNutrientStatus(nutrient.percentage)}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{Math.round(nutrient.percentage)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Vitamins & Minerals */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="card"
          >
            <div className="card-header">
              <div>
                <div className="card-title"><FiTrendingUp size={16} style={{ marginRight: '0.4rem', verticalAlign: '-2px' }} /> Vitamins & Minerals</div>
                <div className="card-subtitle">Micronutrient levels</div>
              </div>
            </div>
            <div className="nutrient-grid">
              {analysis.micronutrients && analysis.micronutrients.map((nutrient, i) => {
                const pct = Math.min(nutrient.percentage, 100)
                return (
                  <div key={nutrient.name} className="nutrient-bar-item">
                    <div className="nutrient-bar-header">
                      <span className="nutrient-bar-name">{nutrient.name}</span>
                      <span className="nutrient-bar-value">
                        {nutrient.consumed.toFixed(1)}{nutrient.unit} / {nutrient.recommended.toFixed(0)}{nutrient.unit}
                      </span>
                    </div>
                    <div className="nutrient-bar-track">
                      <motion.div
                        className="nutrient-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + i * 0.05, ease: 'easeOut' }}
                        style={{ backgroundColor: getNutrientColor(nutrient.percentage) }}
                      />
                    </div>
                    <div className="nutrient-bar-footer">
                      <span style={{ color: getNutrientColor(nutrient.percentage), fontWeight: 600 }}>
                        {getNutrientStatus(nutrient.percentage)}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)' }}>{Math.round(nutrient.percentage)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="card"
            >
              <div className="card-header">
                <div>
                  <div className="card-title">💡 Recommendations</div>
                  <div className="card-subtitle">Personalised suggestions to improve your diet</div>
                </div>
              </div>
              <div className="recommendations-list">
                {analysis.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    className="recommendation-item"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <div className={`rec-priority ${rec.priority === 'HIGH' ? 'high' : rec.priority === 'MEDIUM' ? 'medium' : 'low'}`} />
                    <div className="rec-content">
                      <strong>{rec.nutrient}</strong>
                      <p>{rec.message}</p>
                      {rec.foods && rec.foods.length > 0 && (
                        <p className="rec-foods">🍴 Try: {rec.foods.join(', ')}</p>
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
