import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import api from '../services/api';
import { getFoodEmoji, MEAL_TYPE_CONFIG } from '../utils/foodIcons';
import { mapDietaryEntries } from '../utils/apiMappers';
import { FiTrash2, FiCalendar, FiFilter } from 'react-icons/fi';

const MEAL_FILTERS = ['ALL', 'BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

export default function MealHistory({ user, onLogout }) {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    try {
      const res = await api.get(`/dietary-entries/user/${user.id}`);
      setEntries(mapDietaryEntries(res.data));
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user.id]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/dietary-entries/${id}?userId=${user.id}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success('Entry deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleting(null);
  };

  const filtered = filter === 'ALL' ? entries : entries.filter((e) => e.mealType === filter);
  const grouped = filtered.reduce((acc, e) => {
    const d = new Date(e.entryDate).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'short', day: 'numeric',
    });
    if (!acc[d]) acc[d] = [];
    acc[d].push(e);
    return acc;
  }, {});
  const dateKeys = Object.keys(grouped);

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text">Meal History</h1>
          <p className="text-sm text-brown-400 dark:text-dark-muted mt-1">{entries.length} entries total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {MEAL_FILTERS.map((f) => {
          const active = filter === f;
          const cfg = MEAL_TYPE_CONFIG[f];
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all
                ${active
                  ? 'bg-sage-500 text-white'
                  : 'bg-white dark:bg-dark-card text-brown-500 dark:text-dark-muted border border-cream-300 dark:border-dark-border hover:border-sage-300'}`}
            >
              {f === 'ALL' ? <FiFilter className="w-3.5 h-3.5" /> : <span>{cfg?.emoji}</span>}
              {f === 'ALL' ? 'All' : cfg?.label || f}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-cream-200 dark:bg-dark-card animate-pulse" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-cream-100 dark:bg-dark-card flex items-center justify-center mx-auto mb-3">
            <FiCalendar className="w-6 h-6 text-cream-300 dark:text-dark-muted" />
          </div>
          <p className="text-sm text-brown-400 dark:text-dark-muted">No meal entries found</p>
        </div>
      )}

      {!loading && dateKeys.map((date) => {
        const dayEntries = grouped[date];
        const dayCals = dayEntries.reduce((s, e) => s + (e.calories || 0), 0);
        return (
          <div key={date} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-sage-500" />
              <h3 className="text-sm font-semibold text-charcoal dark:text-dark-text">{date}</h3>
              <span className="text-xs text-brown-300 dark:text-dark-muted ml-auto">{Math.round(dayCals)} kcal</span>
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-cream-200 dark:border-dark-border ml-1">
              {dayEntries.map((entry) => {
                const cfg = MEAL_TYPE_CONFIG[entry.mealType] || MEAL_TYPE_CONFIG.SNACK;
                return (
                  <div key={entry.id} className="card p-4 flex items-center gap-4">
                    <div className="text-2xl flex-shrink-0">{getFoodEmoji(entry.foodName)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-charcoal dark:text-dark-text truncate">{entry.foodName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-brown-400 dark:text-dark-muted">{entry.portionSize}g</span>
                        <span className="text-xs text-cream-300 dark:text-dark-border">·</span>
                        <span className="text-xs text-brown-400 dark:text-dark-muted">{cfg.emoji} {cfg.label}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-sage-600 dark:text-sage-400">{Math.round(entry.calories)} kcal</p>
                      <div className="flex gap-2 text-[10px] text-brown-300 dark:text-dark-muted mt-0.5">
                        <span>P:{Math.round(entry.protein || 0)}g</span>
                        <span>C:{Math.round(entry.carbs || 0)}g</span>
                        <span>F:{Math.round(entry.fat || 0)}g</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      className="p-2 rounded-lg text-brown-300 dark:text-dark-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex-shrink-0"
                    >
                      {deleting === entry.id ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        <FiTrash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </Layout>
  );
}
