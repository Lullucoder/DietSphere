import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Layout from '../components/Layout'

function MealHistory({ user, onLogout }) {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMealHistory()
  }, [])

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

  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this meal entry?')) return
    try {
      await api.delete(`/api/entries/${entryId}?userId=${user.userId}`)
      setMeals(meals.filter(m => m.id !== entryId))
    } catch (err) {
      console.error('Error deleting entry:', err)
      alert('Failed to delete meal entry')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Group meals by date
  const groupedMeals = meals.reduce((groups, meal) => {
    const date = meal.consumedAt?.substring(0, 10) || 'Unknown'
    if (!groups[date]) groups[date] = []
    groups[date].push(meal)
    return groups
  }, {})

  return (
    <Layout user={user} onLogout={onLogout}>
      <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Meal History 📋</h2>

      <div className="card">
        {loading ? (
          <div className="loading">Loading your meal history...</div>
        ) : meals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <p>No meals logged yet</p>
            <Link to="/log-food">
              <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Log Your First Meal
              </button>
            </Link>
          </div>
        ) : (
          Object.entries(groupedMeals).map(([date, dateMeals]) => (
            <div key={date} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#667eea', marginBottom: '0.75rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <div className="meal-list">
                {dateMeals.map((meal) => (
                  <div key={meal.id} className="meal-item">
                    <div className="meal-header">
                      <span className="meal-name">{meal.foodItem?.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="meal-time">{formatDate(meal.consumedAt)}</span>
                        <button 
                          onClick={() => handleDelete(meal.id)} 
                          className="btn-delete"
                          title="Delete entry"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="meal-details">
                      <span style={{ 
                        background: '#667eea', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        marginRight: '0.5rem'
                      }}>
                        {meal.mealType}
                      </span>
                      {meal.portionSize} serving(s) • 
                      {Math.round((meal.foodItem?.nutrientProfile?.calories || 0) * meal.portionSize)} kcal
                      {meal.foodItem?.nutrientProfile && (
                        <span style={{ marginLeft: '0.5rem', color: '#9ca3af' }}>
                          (P: {(meal.foodItem.nutrientProfile.protein * meal.portionSize).toFixed(1)}g • 
                          C: {(meal.foodItem.nutrientProfile.carbohydrates * meal.portionSize).toFixed(1)}g • 
                          F: {(meal.foodItem.nutrientProfile.fat * meal.portionSize).toFixed(1)}g)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  )
}

export default MealHistory
