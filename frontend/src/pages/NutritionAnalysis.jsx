import { useState, useEffect } from 'react'
import api from '../services/api'
import Layout from '../components/Layout'

function NutritionAnalysis({ user, onLogout }) {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('today')

  useEffect(() => {
    fetchAnalysis()
  }, [period])

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

  const getNutrientColor = (percentage) => {
    if (percentage >= 80) return '#10b981'  // green — good
    if (percentage >= 50) return '#f59e0b'  // amber — moderate
    return '#ef4444'                         // red — deficient
  }

  const getNutrientStatus = (percentage) => {
    if (percentage >= 100) return 'Sufficient'
    if (percentage >= 80) return 'Adequate'
    if (percentage >= 50) return 'Low'
    return 'Deficient'
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>Nutrition Analysis 📊</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <div className="period-selector">
          {['today', 'week'].map(p => (
            <button
              key={p}
              className={`btn ${period === p ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setPeriod(p)}
              style={{ marginRight: '0.5rem' }}
            >
              {p === 'today' ? "Today" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading analysis...</div>
      ) : !analysis ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
            No meals logged for this period. Start logging meals to see your nutrition analysis!
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Calories</div>
              <div className="stat-value" style={{ color: '#667eea' }}>
                {Math.round(analysis.totalCalories)}
              </div>
              <div className="stat-label">kcal</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Meals Logged</div>
              <div className="stat-value" style={{ color: '#10b981' }}>
                {analysis.mealCount}
              </div>
              <div className="stat-label">{period === 'today' ? 'today' : 'this week'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Nutrient Score</div>
              <div className="stat-value" style={{ color: getNutrientColor(analysis.overallScore) }}>
                {Math.round(analysis.overallScore)}%
              </div>
              <div className="stat-label">of daily needs</div>
            </div>
          </div>

          {/* Macronutrients */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Macronutrients</h3>
            <div className="nutrient-grid">
              {analysis.macronutrients && analysis.macronutrients.map(nutrient => (
                <div key={nutrient.name} className="nutrient-bar-item">
                  <div className="nutrient-bar-header">
                    <span className="nutrient-bar-name">{nutrient.name}</span>
                    <span className="nutrient-bar-value">
                      {nutrient.consumed.toFixed(1)}g / {nutrient.recommended.toFixed(0)}g
                    </span>
                  </div>
                  <div className="nutrient-bar-track">
                    <div
                      className="nutrient-bar-fill"
                      style={{
                        width: `${Math.min(nutrient.percentage, 100)}%`,
                        backgroundColor: getNutrientColor(nutrient.percentage)
                      }}
                    />
                  </div>
                  <div className="nutrient-bar-footer">
                    <span style={{ color: getNutrientColor(nutrient.percentage) }}>
                      {getNutrientStatus(nutrient.percentage)}
                    </span>
                    <span>{Math.round(nutrient.percentage)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vitamins & Minerals */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Vitamins & Minerals</h3>
            <div className="nutrient-grid">
              {analysis.micronutrients && analysis.micronutrients.map(nutrient => (
                <div key={nutrient.name} className="nutrient-bar-item">
                  <div className="nutrient-bar-header">
                    <span className="nutrient-bar-name">{nutrient.name}</span>
                    <span className="nutrient-bar-value">
                      {nutrient.consumed.toFixed(1)}{nutrient.unit} / {nutrient.recommended.toFixed(0)}{nutrient.unit}
                    </span>
                  </div>
                  <div className="nutrient-bar-track">
                    <div
                      className="nutrient-bar-fill"
                      style={{
                        width: `${Math.min(nutrient.percentage, 100)}%`,
                        backgroundColor: getNutrientColor(nutrient.percentage)
                      }}
                    />
                  </div>
                  <div className="nutrient-bar-footer">
                    <span style={{ color: getNutrientColor(nutrient.percentage) }}>
                      {getNutrientStatus(nutrient.percentage)}
                    </span>
                    <span>{Math.round(nutrient.percentage)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Recommendations 💡</h3>
              <div className="recommendations-list">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="rec-icon">
                      {rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🟢'}
                    </div>
                    <div className="rec-content">
                      <strong>{rec.nutrient}</strong>
                      <p>{rec.message}</p>
                      {rec.foods && rec.foods.length > 0 && (
                        <p className="rec-foods">
                          Try: {rec.foods.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export default NutritionAnalysis
