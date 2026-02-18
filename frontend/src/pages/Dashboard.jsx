import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Dashboard({ user, onLogout }) {
  const [todaysMeals, setTodaysMeals] = useState([])
  const [totalCalories, setTotalCalories] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodaysMeals()
  }, [])

  const fetchTodaysMeals = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/entries/today?userId=${user.userId}`)
      setTodaysMeals(response.data)
      
      // Calculate total calories
      const total = response.data.reduce((sum, entry) => {
        const calories = entry.foodItem?.nutrientProfile?.calories || 0
        return sum + (calories * entry.portionSize)
      }, 0)
      setTotalCalories(Math.round(total))
    } catch (err) {
      console.error('Error fetching meals:', err)
    } finally {
      setLoading(false)
    }
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
        <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>
          Welcome back, {user.username}! 👋
        </h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Today's Calories</div>
            <div className="stat-value" style={{ color: '#667eea' }}>
              {totalCalories}
            </div>
            <div className="stat-label">kcal</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Meals Logged</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              {todaysMeals.length}
            </div>
            <div className="stat-label">today</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Goal</div>
            <div className="stat-value" style={{ color: '#f59e0b' }}>
              2000
            </div>
            <div className="stat-label">kcal</div>
          </div>
        </div>

        <div className="card">
          <h2>Today's Meals</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : todaysMeals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p>No meals logged today</p>
              <Link to="/log-food">
                <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Log Your First Meal
                </button>
              </Link>
            </div>
          ) : (
            <div className="meal-list">
              {todaysMeals.map((meal) => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-header">
                    <span className="meal-name">{meal.foodItem?.name}</span>
                    <span className="meal-time">
                      {new Date(meal.consumedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="meal-details">
                    {meal.mealType} • {meal.portionSize} serving(s) • 
                    {Math.round((meal.foodItem?.nutrientProfile?.calories || 0) * meal.portionSize)} kcal
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/log-food">
            <button className="btn btn-success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              + Log New Meal
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
