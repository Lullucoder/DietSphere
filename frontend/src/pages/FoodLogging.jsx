import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiArrowLeft, FiPlus, FiMinus, FiCheck, FiX, FiZap } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../services/api'
import Layout from '../components/Layout'
import { getFoodEmoji, getCategoryEmoji, getCategoryColor, getCategoryLabel, CATEGORY_CONFIG, MEAL_TYPE_CONFIG } from '../utils/foodIcons'

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
  const debounceRef = useRef(null)

  useEffect(() => {
    fetchCategories()
    searchFoods('', null)
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
    } catch (err) { console.error('Error fetching categories:', err) }
  }

  const searchFoods = async (query, category) => {
    setSearchLoading(true)
    try {
      let url = `/api/foods/search?query=${query || ''}`
      if (category && category !== 'ALL') url += `&category=${category}`
      const response = await api.get(url)
      setFoods(response.data)
    } catch (err) { console.error('Error searching foods:', err) }
    finally { setSearchLoading(false) }
  }

  const handleSearch = useCallback((e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchFoods(query, activeCategory), 300)
  }, [activeCategory])

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    searchFoods(searchQuery, category)
  }

  const incrementPortion = () => setPortionSize(prev => Math.round((prev + 0.5) * 10) / 10)
  const decrementPortion = () => setPortionSize(prev => Math.max(0.5, Math.round((prev - 0.5) * 10) / 10))

  const handleLogMeal = async () => {
    if (!selectedFood) return
    setLoading(true)
    try {
      await api.post(`/api/entries?userId=${user.userId}`, {
        foodItemId: selectedFood.id,
        portionSize: parseFloat(portionSize),
        mealType
      })
      toast.success(`${selectedFood.name} logged as ${MEAL_TYPE_CONFIG[mealType]?.label}!`, { icon: '✅', duration: 2000 })
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      toast.error('Failed to log meal. Please try again.')
    } finally { setLoading(false) }
  }

  const handleQuickLog = (food) => {
    if (selectedFood?.id === food.id) { setSelectedFood(null); setShowConfirm(false); return }
    setSelectedFood(food)
    setPortionSize(1)
    setShowConfirm(true)
    setTimeout(() => document.getElementById('confirm-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Back */}
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-4 transition-colors">
        <FiArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Header + Meal Type Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Log a Meal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Find and add food to your daily tracker</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MEAL_TYPE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                mealType === type
                  ? 'border-brand-300 bg-brand-50 text-brand-700 shadow-sm'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <span className="mr-1">{config.emoji}</span>{config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for any food... (e.g., paneer, dosa, biryani)"
            autoFocus
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white dark:bg-slate-800 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); searchFoods('', activeCategory) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleCategoryClick('ALL')}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'ALL'
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-slate-500 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <span>{CATEGORY_CONFIG.ALL.emoji}</span>All
          </button>
          {categories.map(({ category, count }) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === category
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-500 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <span>{getCategoryEmoji(category)}</span>
              {getCategoryLabel(category)}
              <span className="text-[10px] text-slate-400 ml-0.5">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-medium">
        <span>{foods.length} food{foods.length !== 1 ? 's' : ''} found</span>
        {searchLoading && <span className="w-3 h-3 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin" />}
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
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
                onClick={() => handleQuickLog(food)}
                className={`relative bg-white dark:bg-slate-900 rounded-2xl border p-4 cursor-pointer transition-all duration-200 hover:shadow-md group ${
                  isSelected
                    ? 'border-brand-400 ring-2 ring-brand-100 dark:ring-brand-500/20 shadow-md'
                    : 'border-slate-100 dark:border-slate-800 hover:border-brand-200'
                }`}
              >
                {/* Emoji Header */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3" style={{ background: `${catColor}15` }}>
                  {emoji}
                </div>

                {/* Info */}
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5 line-clamp-1">{food.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">{food.description}</p>

                {/* Nutrient Chips */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold">{Math.round(food.calories)} kcal</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-semibold">P {food.protein}g</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-semibold">C {food.carbohydrates}g</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-semibold">F {food.fat}g</span>
                </div>

                {/* Quick-add */}
                <button className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-50 hover:text-brand-600">
                  <FiPlus size={14} />
                </button>

                {/* Selected badge */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30"
                  >
                    <FiCheck size={14} />
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {foods.length === 0 && !searchLoading && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 opacity-30">🔍</div>
          <p className="text-slate-500 text-sm">No foods found for &ldquo;{searchQuery}&rdquo;</p>
          <span className="text-slate-400 text-xs">Try a different search term or category</span>
        </div>
      )}

      {/* Confirm Panel */}
      <AnimatePresence>
        {showConfirm && selectedFood && (
          <motion.div
            id="confirm-panel"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 lg:left-[260px] z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl px-6 py-5"
          >
            <button onClick={() => { setShowConfirm(false); setSelectedFood(null) }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <FiX size={18} />
            </button>

            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
              {/* Food Info */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-3xl">{getFoodEmoji(selectedFood.name, selectedFood.category)}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedFood.name}</h3>
                  <p className="text-xs text-slate-400">{selectedFood.description}</p>
                </div>
              </div>

              {/* Portion + Preview */}
              <div className="flex items-center gap-6 flex-1 flex-wrap justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Portion</span>
                  <div className="flex items-center gap-2">
                    <button onClick={decrementPortion} disabled={portionSize <= 0.5} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30">
                      <FiMinus size={14} />
                    </button>
                    <span className="text-lg font-bold text-slate-900 w-8 text-center">{portionSize}</span>
                    <button onClick={incrementPortion} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">serving{portionSize !== 1 ? 's' : ''}</span>
                </div>

                {/* Live Calorie Preview */}
                <div className="flex items-center gap-4 text-center">
                  {[
                    { val: Math.round(selectedFood.calories * portionSize), lbl: 'kcal' },
                    { val: (selectedFood.protein * portionSize).toFixed(1) + 'g', lbl: 'protein' },
                    { val: (selectedFood.carbohydrates * portionSize).toFixed(1) + 'g', lbl: 'carbs' },
                    { val: (selectedFood.fat * portionSize).toFixed(1) + 'g', lbl: 'fat' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-800">{item.val}</span>
                      <span className="text-[10px] text-slate-400">{item.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log Button */}
              <button
                onClick={handleLogMeal}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50 flex-shrink-0"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><FiZap size={16} /> Log {MEAL_TYPE_CONFIG[mealType]?.label}</>
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
