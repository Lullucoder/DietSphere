import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function MealHistory({ user, onLogout }) {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMealHistory()
  }, [])

  const fetchMealHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/entries?userId=${user.userId}`)
      setMeals(response.data)
    } catch (err) {
      console.error('Error fetching meal history:', err)
    } finally {
      setLoading(false)
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

  return (
    <div>
      <nav className="navbar">
        <h1>🥗 Diet Balance Tracker</h1>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/log-food">Log Food</Link>
          <Link to="/history">History</Link>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="container">
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
            <div className="meal-list">
              {meals.map((meal) => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-header">
                    <span className="meal-name">{meal.foodItem?.name}</span>
                    <span className="meal-time">{formatDate(meal.consumedAt)}</span>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MealHistory
