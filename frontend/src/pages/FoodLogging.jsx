import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiArrowLeft, FiPlus, FiMinus, FiCheck, FiX, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../services/api'
import Layout from '../components/Layout'
import { getFoodEmoji, getCategoryEmoji, getCategoryColor, getCategoryLabel, CATEGORY_CONFIG, MEAL_TYPE_CONFIG } from '../utils/foodIcons'
import './FoodLogging.css'

function FoodLogging({ user, onLogout }) {
  const navigate = useNavigate()
  const searchRef = useRef(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [selectedFood, setSelectedFood] = useState(null)
  const [portionSize, setPortionSize] = useState(1)
  const [mealType, setMealType] = useState('BREAKFAST')
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  
  // Debounce timer
  const debounceRef = useRef(null)

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
    searchFoods('', null)
    // Auto-select meal type based on time of day
    const hour = new Date().getHours()
    if (hour < 11) setMealType('BREAKFAST')
    else if (hour < 15) setMealType('LUNCH')
    else if (hour < 18) setMealType('SNACK')
    else setMealType('DINNER')
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/foods/categories')
      setCategories(response.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const searchFoods = async (query, category) => {
    setSearchLoading(true)
    try {
      let url = `/api/foods/search?query=${query || ''}`
      if (category && category !== 'ALL') {
        url += `&category=${category}`
      }
      const response = await api.get(url)
      setFoods(response.data)
    } catch (err) {
      console.error('Error searching foods:', err)
    } finally {
      setSearchLoading(false)
    }
  }

  // Debounced search
  const handleSearch = useCallback((e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchFoods(query, activeCategory)
    }, 300)
  }, [activeCategory])

  // Category tab click
  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    searchFoods(searchQuery, category)
  }

  // Portion controls
  const incrementPortion = () => setPortionSize(prev => Math.round((prev + 0.5) * 10) / 10)
  const decrementPortion = () => setPortionSize(prev => Math.max(0.5, Math.round((prev - 0.5) * 10) / 10))

  // Log the meal
  const handleLogMeal = async () => {
    if (!selectedFood) return
    setLoading(true)
    try {
      await api.post(`/api/entries?userId=${user.userId}`, {
        foodItemId: selectedFood.id,
        portionSize: parseFloat(portionSize),
        mealType: mealType
      })
      
      toast.success(
        `${selectedFood.name} logged as ${MEAL_TYPE_CONFIG[mealType]?.label}!`,
        { icon: '✅', duration: 2000 }
      )
      
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      console.error('Error logging meal:', err)
      toast.error('Failed to log meal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Quick log — select food and immediately show confirm
  const handleQuickLog = (food) => {
    if (selectedFood?.id === food.id) {
      setSelectedFood(null)
      setShowConfirm(false)
      return
    }
    setSelectedFood(food)
    setPortionSize(1)
    setShowConfirm(true)
    // Scroll to confirm panel
    setTimeout(() => {
      document.getElementById('confirm-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Back link */}
      <Link to="/dashboard" className="fl-back-link">
        <FiArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Page header */}
      <div className="fl-header">
        <div>
          <h1 className="fl-title">Log a Meal</h1>
          <p className="fl-subtitle">Find and add food to your daily tracker</p>
        </div>
        {/* Meal type pills */}
        <div className="fl-meal-pills">
          {Object.entries(MEAL_TYPE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              className={`fl-meal-pill ${mealType === type ? 'active' : ''}`}
              onClick={() => setMealType(type)}
              style={mealType === type ? { background: config.bg, color: config.color, borderColor: config.color } : {}}
            >
              <span className="fl-meal-pill-emoji">{config.emoji}</span>
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="fl-search-card">
        <div className="fl-search-bar">
          <FiSearch className="fl-search-icon" size={18} />
          <input
            ref={searchRef}
            type="text"
            className="fl-search-input"
            placeholder="Search for any food... (e.g., paneer, dosa, biryani)"
            value={searchQuery}
            onChange={handleSearch}
            autoFocus
          />
          {searchQuery && (
            <button className="fl-search-clear" onClick={() => { setSearchQuery(''); searchFoods('', activeCategory) }}>
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="fl-category-tabs">
          <button
            className={`fl-category-tab ${activeCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('ALL')}
          >
            <span className="fl-cat-emoji">{CATEGORY_CONFIG.ALL.emoji}</span>
            <span className="fl-cat-label">All</span>
          </button>
          {categories.map(({ category, count }) => (
            <button
              key={category}
              className={`fl-category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
              style={activeCategory === category ? { borderColor: getCategoryColor(category), color: getCategoryColor(category) } : {}}
            >
              <span className="fl-cat-emoji">{getCategoryEmoji(category)}</span>
              <span className="fl-cat-label">{getCategoryLabel(category)}</span>
              <span className="fl-cat-count">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Food grid */}
      <div className="fl-results-info">
        <span>{foods.length} food{foods.length !== 1 ? 's' : ''} found</span>
        {searchLoading && <span className="fl-loading-dot" />}
      </div>

      <div className="fl-food-grid">
        <AnimatePresence mode="popLayout">
          {foods.map((food) => {
            const isSelected = selectedFood?.id === food.id
            const emoji = getFoodEmoji(food.name, food.category)
            const catColor = getCategoryColor(food.category)

            return (
              <motion.div
                key={food.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`fl-food-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleQuickLog(food)}
              >
                {/* Emoji header */}
                <div className="fl-food-emoji" style={{ background: `${catColor}15` }}>
                  <span>{emoji}</span>
                </div>

                {/* Food info */}
                <div className="fl-food-body">
                  <h3 className="fl-food-name">{food.name}</h3>
                  <p className="fl-food-desc">{food.description}</p>
                </div>

                {/* Nutrient chips */}
                <div className="fl-food-nutrients">
                  <span className="fl-nut-chip cal">{Math.round(food.calories)} kcal</span>
                  <span className="fl-nut-chip pro">P {food.protein}g</span>
                  <span className="fl-nut-chip carb">C {food.carbohydrates}g</span>
                  <span className="fl-nut-chip fat">F {food.fat}g</span>
                </div>

                {/* Quick-add button */}
                <button className="fl-quick-add" title="Quick add">
                  <FiPlus size={16} />
                </button>

                {/* Selected check */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fl-selected-badge"
                  >
                    <FiCheck size={14} />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {foods.length === 0 && !searchLoading && (
        <div className="fl-empty">
          <div className="fl-empty-emoji">🔍</div>
          <p>No foods found for &ldquo;{searchQuery}&rdquo;</p>
          <span>Try a different search term or category</span>
        </div>
      )}

      {/* Confirm Panel (slide up) */}
      <AnimatePresence>
        {showConfirm && selectedFood && (
          <motion.div
            id="confirm-panel"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fl-confirm-panel"
          >
            {/* Close */}
            <button className="fl-confirm-close" onClick={() => { setShowConfirm(false); setSelectedFood(null) }}>
              <FiX size={18} />
            </button>

            <div className="fl-confirm-content">
              {/* Left: food info */}
              <div className="fl-confirm-food">
                <span className="fl-confirm-emoji">{getFoodEmoji(selectedFood.name, selectedFood.category)}</span>
                <div>
                  <h3>{selectedFood.name}</h3>
                  <p>{selectedFood.description}</p>
                </div>
              </div>

              {/* Middle: portion + meal type */}
              <div className="fl-confirm-controls">
                {/* Portion */}
                <div className="fl-portion-group">
                  <label>Portion</label>
                  <div className="fl-portion-stepper">
                    <button onClick={decrementPortion} disabled={portionSize <= 0.5}><FiMinus size={14} /></button>
                    <span className="fl-portion-value">{portionSize}</span>
                    <button onClick={incrementPortion}><FiPlus size={14} /></button>
                  </div>
                  <span className="fl-portion-unit">serving{portionSize !== 1 ? 's' : ''}</span>
                </div>

                {/* Live calorie preview */}
                <div className="fl-live-preview">
                  <div className="fl-preview-item">
                    <span className="fl-preview-val">{Math.round(selectedFood.calories * portionSize)}</span>
                    <span className="fl-preview-lbl">kcal</span>
                  </div>
                  <div className="fl-preview-sep" />
                  <div className="fl-preview-item">
                    <span className="fl-preview-val">{(selectedFood.protein * portionSize).toFixed(1)}g</span>
                    <span className="fl-preview-lbl">protein</span>
                  </div>
                  <div className="fl-preview-sep" />
                  <div className="fl-preview-item">
                    <span className="fl-preview-val">{(selectedFood.carbohydrates * portionSize).toFixed(1)}g</span>
                    <span className="fl-preview-lbl">carbs</span>
                  </div>
                  <div className="fl-preview-sep" />
                  <div className="fl-preview-item">
                    <span className="fl-preview-val">{(selectedFood.fat * portionSize).toFixed(1)}g</span>
                    <span className="fl-preview-lbl">fat</span>
                  </div>
                </div>
              </div>

              {/* Right: Log button */}
              <button
                className="fl-log-btn"
                onClick={handleLogMeal}
                disabled={loading}
              >
                {loading ? (
                  <span className="fl-log-loading" />
                ) : (
                  <>
                    <FiZap size={18} />
                    Log {MEAL_TYPE_CONFIG[mealType]?.label}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default FoodLogging
