import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import api from '../services/api';
import {
  getFoodEmoji, getCategoryEmoji,
  getCategoryLabel, MEAL_TYPE_CONFIG, CATEGORY_CONFIG,
} from '../utils/foodIcons';
import { normalizeFoodItem } from '../utils/apiMappers';
import { FiSearch, FiCheck, FiX, FiPlus, FiMinus } from 'react-icons/fi';

const CATEGORIES = Object.keys(CATEGORY_CONFIG);

function getMealSuggestion() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'BREAKFAST';
  if (h >= 11 && h < 15) return 'LUNCH';
  if (h >= 15 && h < 18) return 'SNACK';
  return 'DINNER';
}

export default function FoodLogging({ user, onLogout }) {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('ALL');
  // selected: { [foodId]: quantity } — maps food ID to its quantity (servings)
  const [selected, setSelected] = useState({});
  const [mealType, setMealType] = useState(getMealSuggestion());
  const [portionSize, setPortionSize] = useState(100);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    api.get('/api/foods').then((r) => {
      const normalized = (r.data || []).map(normalizeFoodItem);
      setFoods(normalized);
      setFiltered(normalized);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let list = foods;
    if (category !== 'ALL') list = list.filter((f) => f.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [query, category, foods]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
      }
      return next;
    });
  };

  const adjustQty = (id, delta) => {
    setSelected((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const clearAll = () => setSelected({});

  const selectedIds = Object.keys(selected).map(Number);
  const selectedCount = selectedIds.length;
  const selectedFoods = foods.filter((f) => selectedIds.includes(f.id));

  const totalCal = selectedFoods.reduce(
    (s, f) => s + ((f.caloriesPer100g || 0) * portionSize * (selected[f.id] || 1)) / 100, 0,
  );

  const handleLog = async () => {
    if (selectedCount === 0) return;
    setLogging(true);
    try {
      await Promise.all(
        selectedFoods.map((food) =>
          api.post(`/api/dietary-entries?userId=${user.id}`, {
            foodItemId: food.id,
            portionSize: portionSize * (selected[food.id] || 1),
            mealType,
          }),
        ),
      );
      toast.success(`${selectedCount} item(s) logged!`);
      setSelected({});
      navigate('/dashboard');
    } catch {
      toast.error('Failed to log meals');
    }
    setLogging(false);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text">Log Food</h1>
        <p className="text-sm text-brown-400 dark:text-dark-muted mt-1">Tap items to select, use +/− to set quantity</p>
      </div>

      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown-300 dark:text-dark-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 111+ Indian foods…"
            className="input pl-10 w-full"
          />
        </div>

        {/* Meal type */}
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="input w-full sm:w-44"
        >
          {Object.entries(MEAL_TYPE_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.emoji} {cfg.label}</option>
          ))}
        </select>

        {/* Portion */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-brown-500 dark:text-dark-muted whitespace-nowrap">Portion (g)</label>
          <input
            type="number"
            value={portionSize}
            onChange={(e) => setPortionSize(Math.max(1, parseInt(e.target.value) || 100))}
            className="input w-20 text-center"
            min={1}
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {CATEGORIES.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors
                ${active
                  ? 'bg-sage-500 text-white'
                  : 'bg-white dark:bg-dark-card text-brown-500 dark:text-dark-muted border border-cream-300 dark:border-dark-border hover:border-sage-400'}
              `}
            >
              <span>{getCategoryEmoji(c)}</span>
              {getCategoryLabel(c)}
            </button>
          );
        })}
      </div>

      {/* Food grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[58vh] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-sm text-brown-300 dark:text-dark-muted">No foods found</p>
          </div>
        ) : (
          filtered.map((food) => {
            const qty = selected[food.id];
            const checked = !!qty;
            return (
              <div
                key={food.id}
                className={`
                  relative p-4 rounded-2xl text-left transition-all duration-150
                  ${checked
                    ? 'bg-sage-50 dark:bg-sage-500/10 border-2 border-sage-500 shadow-soft'
                    : 'bg-white dark:bg-dark-card border-2 border-cream-200 dark:border-dark-border hover:border-sage-300 hover:shadow-soft'}
                `}
              >
                {/* Select area — tap the top part to toggle */}
                <button
                  onClick={() => toggle(food.id)}
                  className="w-full text-left"
                >
                  {/* Check badge */}
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-colors
                    ${checked ? 'bg-sage-500' : 'border-2 border-cream-300 dark:border-dark-border'}`}>
                    {checked && <FiCheck className="w-3 h-3 text-white" />}
                  </div>

                  <div className="text-2xl mb-2">{getFoodEmoji(food.name)}</div>
                  <p className="text-sm font-semibold text-charcoal dark:text-dark-text truncate pr-6">{food.name}</p>
                  <p className="text-xs text-brown-300 dark:text-dark-muted mt-0.5">{food.caloriesPer100g} kcal / 100g</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span className="text-[10px]">{getCategoryEmoji(food.category)}</span>
                    <span className="text-[10px] text-brown-300 dark:text-dark-muted">{getCategoryLabel(food.category)}</span>
                  </div>
                </button>

                {/* Quantity controls — visible when selected */}
                {checked && (
                  <div className="mt-3 pt-3 border-t border-sage-200 dark:border-sage-500/30 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-sage-700 dark:text-sage-400">Qty</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); adjustQty(food.id, -1); }}
                        disabled={qty <= 1}
                        className="w-7 h-7 rounded-lg bg-sage-100 dark:bg-sage-500/20 flex items-center justify-center text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-500/30 disabled:opacity-30 transition-colors"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-sage-700 dark:text-sage-300">{qty}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); adjustQty(food.id, 1); }}
                        className="w-7 h-7 rounded-lg bg-sage-100 dark:bg-sage-500/20 flex items-center justify-center text-sage-600 dark:text-sage-400 hover:bg-sage-200 dark:hover:bg-sage-500/30 transition-colors"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating bottom bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-dark-card border-t border-cream-200 dark:border-dark-border shadow-soft-lg px-4 py-3 sm:left-64">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sage-500 text-white text-sm font-bold flex items-center justify-center">
                {selectedCount}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal dark:text-dark-text truncate">
                  {selectedFoods.map((f) => {
                    const q = selected[f.id];
                    return q > 1 ? `${f.name} ×${q}` : f.name;
                  }).join(', ')}
                </p>
                <p className="text-xs text-brown-400 dark:text-dark-muted">~{Math.round(totalCal)} kcal total</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={clearAll} className="btn-ghost text-xs px-3 py-2">
                <FiX className="w-3.5 h-3.5" /> Clear
              </button>
              <button onClick={handleLog} disabled={logging} className="btn-primary px-5 py-2.5 text-sm">
                {logging ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" /> Log {selectedCount} Item{selectedCount > 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
