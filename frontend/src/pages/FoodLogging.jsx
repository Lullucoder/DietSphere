import { useEffect, useState } from 'react';
import { FiSearch, FiPlus, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const MEALS = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];

export default function FoodLogging({ user }) {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('LUNCH');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    api.get('/foods').then((r) => setFoods(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.toLowerCase().includes(search.toLowerCase())
  );

  const logFood = async (food) => {
    setSaving(food.id);
    try {
      await api.post(`/dietary-entries?userId=${user.id}`, {
        foodItemId: food.id,
        portionSize: 1.0,
        mealType,
      });
      toast.success(`${food.name} logged!`);
    } catch {
      toast.error('Failed to log');
    }
    setSaving(null);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Log Food</h1>

      <div className="card p-4 space-y-4">
        {/* Meal type selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MEALS.map((m) => (
            <button
              key={m}
              onClick={() => setMealType(m)}
              className={mealType === m ? 'nav-pill-active' : 'nav-pill-inactive'}
            >
              {m.charAt(0) + m.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          <input
            type="text"
            className="input pl-10"
            placeholder="Search foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="loading-spinner w-6 h-6" /></div>
      ) : (
        <div className="grid gap-2">
          {filtered.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No foods found</p>}
          {filtered.slice(0, 30).map((f) => (
            <div key={f.id} className="card p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{f.name}</p>
                <p className="text-xs text-slate-500">{f.category} • {f.calories} kcal</p>
              </div>
              <button onClick={() => logFood(f)} disabled={saving === f.id} className="btn-primary py-1.5 px-3 text-sm">
                {saving === f.id ? <FiLoader className="animate-spin w-4 h-4" /> : <><FiPlus className="w-4 h-4" /> Add</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
