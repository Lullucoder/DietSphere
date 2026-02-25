import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Layout from '../components/Layout'

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
  const caloriePercent = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)

  return (
    <Layout user={user} onLogout={onLogout}>
      <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>
        Welcome back, {user.username}! 👋
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Today's Calories</div>
          <div className="stat-value" style={{ color: '#667eea' }}>
            {totalCalories}
          </div>
          <div className="stat-label">of {calorieGoal} kcal goal</div>
          <div className="progress-bar-track" style={{ marginTop: '0.5rem' }}>
            <div className="progress-bar-fill" style={{ width: `${caloriePercent}%`, backgroundColor: caloriePercent > 90 ? '#10b981' : '#667eea' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Meals Logged</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {todaysMeals.length}
          </div>
          <div className="stat-label">today</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Protein</div>
          <div className="stat-value" style={{ color: '#ef4444', fontSize: '1.8rem' }}>
            {macros.protein}g
          </div>
          <div className="stat-label">Carbs: {macros.carbs}g • Fat: {macros.fat}g</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Today's Meals</h2>
          <Link to="/nutrition">
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              View Nutrition Analysis →
            </button>
          </Link>
        </div>
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
                    {new Date(meal.consumedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="meal-details">
                  <span style={{ 
                    background: '#667eea', 
                    color: 'white', 
                    padding: '0.15rem 0.5rem', 
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

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/log-food">
          <button className="btn btn-success" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            + Log New Meal
          </button>
        </Link>
      </div>
    </Layout>
  )
}

export default Dashboard
