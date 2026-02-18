import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function FoodLogging({ user, onLogout }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [foods, setFoods] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [portionSize, setPortionSize] = useState(1)
  const [mealType, setMealType] = useState('BREAKFAST')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    searchFoods('')
  }, [])

  const searchFoods = async (query) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/foods/search?query=${query}`)
      setFoods(response.data)
    } catch (err) {
      console.error('Error searching foods:', err)
    }
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    searchFoods(query)
  }

  const handleSelectFood = (food) => {
    setSelectedFood(food)
  }

  const handleLogMeal = async () => {
    if (!selectedFood) return

    setLoading(true)
    try {
      await axios.post(`http://localhost:8080/api/entries?userId=${user.userId}`, {
        foodItemId: selectedFood.id,
        portionSize: parseFloat(portionSize),
        mealType: mealType
      })
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('Error logging meal:', err)
      alert('Failed to log meal')
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
        <h2 style={{ marginBottom: '2rem', color: '#1f2937' }}>Log a Meal 🍽️</h2>

        {success && (
          <div className="success">
            ✅ Meal logged successfully! Redirecting to dashboard...
          </div>
        )}

        <div className="card">
          <h3>Search for Food</h3>
          <input
            type="text"
            placeholder="Search for foods (e.g., apple, chicken, rice)..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}
          />

          <div className="food-list">
            {foods.map((food) => (
              <div
                key={food.id}
                className="food-item"
                onClick={() => handleSelectFood(food)}
                style={{
                  cursor: 'pointer',
                  border: selectedFood?.id === food.id ? '2px solid #667eea' : 'none'
                }}
              >
                <div className="food-info">
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                </div>
                <div className="food-nutrients">
                  <span>{Math.round(food.calories)} kcal</span>
                  <span>{food.protein}g protein</span>
                  <span>{food.carbohydrates}g carbs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedFood && (
          <div className="card">
            <h3>Meal Details</h3>
            <div className="form-group">
              <label>Selected Food</label>
              <input type="text" value={selectedFood.name} disabled />
            </div>

            <div className="form-group">
              <label>Portion Size (servings)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={portionSize}
                onChange={(e) => setPortionSize(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Meal Type</label>
              <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACK">Snack</option>
              </select>
            </div>

            <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <strong>Total Calories:</strong> {Math.round(selectedFood.calories * portionSize)} kcal
            </div>

            <button
              onClick={handleLogMeal}
              className="btn btn-success"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Logging...' : 'Log This Meal'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodLogging
