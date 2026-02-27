import { useEffect, useState } from 'react';
import { FiTrash2, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function MealHistory({ user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setLoading(true);
    api.get(`/dietary-entries/user/${user.id}`)
      .then((r) => setEntries(r.data))
      .finally(() => setLoading(false));
  }, [user.id]);

  const deleteEntry = async (id) => {
    try {
      await api.delete(`/dietary-entries/${id}?userId=${user.id}`);
      setEntries(entries.filter((e) => e.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = entries.filter((e) => e.entryDate?.startsWith(date));
  const grouped = filtered.reduce((acc, e) => {
    const m = e.mealType || 'OTHER';
    if (!acc[m]) acc[m] = [];
    acc[m].push(e);
    return acc;
  }, {});

  const total = filtered.reduce((s, e) => s + (e.calories || 0), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Meal History</h1>

      <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-slate-400" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input w-auto" />
        </div>
        <div className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{total}</span> kcal total
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="loading-spinner w-6 h-6" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">No entries for this date</p>
      ) : (
        Object.entries(grouped).map(([meal, items]) => (
          <div key={meal} className="card overflow-hidden">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-700">{meal}</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {items.map((e) => (
                <li key={e.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{e.foodItemName}</p>
                    <p className="text-xs text-slate-500">{e.portionSize}x • {e.calories} kcal</p>
                  </div>
                  <button onClick={() => deleteEntry(e.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
