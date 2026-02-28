import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import api from '../services/api';
import { FiSave, FiTarget, FiRefreshCw } from 'react-icons/fi';

const PRESETS = [
  {
    name: 'Weight Loss',
    emoji: '🔥',
    desc: 'Lower calories, moderate protein',
    bg: 'bg-amber-500',
    goals: { calorieGoal: 1500, proteinGoal: 60, carbsGoal: 180, fatGoal: 45, fiberGoal: 30 },
  },
  {
    name: 'Maintenance',
    emoji: '⚖️',
    desc: 'Balanced macro distribution',
    bg: 'bg-sage-500',
    goals: { calorieGoal: 2000, proteinGoal: 50, carbsGoal: 250, fatGoal: 65, fiberGoal: 25 },
  },
  {
    name: 'Muscle Building',
    emoji: '💪',
    desc: 'High protein, higher calories',
    bg: 'bg-violet-500',
    goals: { calorieGoal: 2500, proteinGoal: 100, carbsGoal: 300, fatGoal: 80, fiberGoal: 30 },
  },
  {
    name: 'Balanced Indian',
    emoji: '🍛',
    desc: 'Traditional balanced Indian diet',
    bg: 'bg-orange-500',
    goals: { calorieGoal: 2000, proteinGoal: 55, carbsGoal: 270, fatGoal: 60, fiberGoal: 32 },
  },
];

const GOAL_FIELDS = [
  { key: 'calorieGoal', label: 'Calories',  unit: 'kcal', min: 800, max: 5000, step: 50,  hex: '#f59e0b', dot: 'bg-amber-500'  },
  { key: 'proteinGoal', label: 'Protein',   unit: 'g',    min: 10,  max: 200,  step: 5,   hex: '#14b8a6', dot: 'bg-sage-500'   },
  { key: 'carbsGoal',   label: 'Carbs',     unit: 'g',    min: 50,  max: 500,  step: 10,  hex: '#8b5cf6', dot: 'bg-violet-500' },
  { key: 'fatGoal',     label: 'Fat',       unit: 'g',    min: 10,  max: 200,  step: 5,   hex: '#f97316', dot: 'bg-orange-500' },
  { key: 'fiberGoal',   label: 'Fiber',     unit: 'g',    min: 5,   max: 80,   step: 1,   hex: '#06b6d4', dot: 'bg-cyan-500'   },
];

export default function GoalSettings({ user, onLogout }) {
  const [goals, setGoals] = useState({
    calorieGoal: 2000,
    proteinGoal: 50,
    carbsGoal: 250,
    fatGoal: 65,
    fiberGoal: 25,
  });
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const bmi = useMemo(() => {
    if (user?.weightKg && user?.heightCm) {
      const v = user.weightKg / ((user.heightCm / 100) ** 2);
      return Number.isFinite(v) ? parseFloat(v.toFixed(1)) : null;
    }
    const stored = localStorage.getItem('userBMI');
    return stored ? parseFloat(stored) : null;
  }, [user?.weightKg, user?.heightCm]);

  const bmiSuggestion = useMemo(() => {
    if (!bmi) return null;
    if (bmi < 18.5) {
      return {
        label: 'Underweight focus',
        note: 'Boost calories and protein to support healthy weight gain.',
        goals: { calorieGoal: 2400, proteinGoal: 90, carbsGoal: 320, fatGoal: 80, fiberGoal: 28 },
        bg: 'bg-amber-500',
      };
    }
    if (bmi < 25) {
      return {
        label: 'Maintenance focus',
        note: 'Balanced macros to maintain weight and energy.',
        goals: { calorieGoal: 2000, proteinGoal: 70, carbsGoal: 260, fatGoal: 65, fiberGoal: 28 },
        bg: 'bg-sage-500',
      };
    }
    if (bmi < 30) {
      return {
        label: 'Fat-loss focus',
        note: 'Slight calorie reduction with higher protein and fiber.',
        goals: { calorieGoal: 1700, proteinGoal: 95, carbsGoal: 190, fatGoal: 55, fiberGoal: 32 },
        bg: 'bg-orange-500',
      };
    }
    return {
      label: 'Metabolic reset',
      note: 'Lower carbs, higher protein and fiber for satiety.',
      goals: { calorieGoal: 1500, proteinGoal: 110, carbsGoal: 160, fatGoal: 50, fiberGoal: 35 },
      bg: 'bg-rose-500',
    };
  }, [bmi]);

  useEffect(() => {
    api.get(`/goals?userId=${user.id}`)
      .then((res) => {
        if (res.data) {
          setGoals(res.data);
          setOriginal(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  const isDirty = useMemo(() => {
    if (!original) return false;
    return GOAL_FIELDS.some((f) => goals[f.key] !== original[f.key]);
  }, [goals, original]);

  const applyPreset = (preset) => {
    setGoals({ ...goals, ...preset.goals });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/goals?userId=${user.id}`, goals);
      setOriginal(res.data || goals);
      toast.success('Goals saved!');
    } catch {
      toast.error('Failed to save goals');
    }
    setSaving(false);
  };

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-dark-text">Nutrition Goals</h1>
          <p className="text-sm text-brown-400 dark:text-dark-muted mt-1">Set daily targets for your macros and calories</p>
        </div>
        {isDirty && (
          <button onClick={handleSave} disabled={saving} className="btn-primary self-start">
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><FiSave className="w-4 h-4" /> Save Goals</>
            )}
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-cream-200 dark:bg-dark-card" />)}
        </div>
      )}

      {!loading && (
        <>
          {bmiSuggestion && (
            <div className="card p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${bmiSuggestion.bg} flex items-center justify-center text-white text-lg`}>
                  <FiTarget className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-brown-400 dark:text-dark-muted">Based on your BMI {bmi}</p>
                  <p className="text-sm font-semibold text-charcoal dark:text-dark-text">{bmiSuggestion.label}</p>
                </div>
              </div>
              <p className="text-xs text-brown-400 dark:text-dark-muted mb-4">{bmiSuggestion.note}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-brown-400 dark:text-dark-muted mb-4">
                {GOAL_FIELDS.map((f) => (
                  <div key={f.key} className="px-2 py-2 rounded-lg bg-cream-100 dark:bg-dark-border/50">
                    <p className="text-brown-300 dark:text-dark-muted">{f.label}</p>
                    <p className="font-semibold text-charcoal dark:text-dark-text">{bmiSuggestion.goals[f.key]}{f.unit}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setGoals({ ...goals, ...bmiSuggestion.goals })} className="btn-primary text-sm">
                Apply BMI Suggestion
              </button>
            </div>
          )}

          {/* Presets */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-brown-400 dark:text-dark-muted uppercase tracking-wider mb-3">Quick Presets</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="card p-4 text-left hover:shadow-soft transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl ${preset.bg} flex items-center justify-center mb-3`}>
                    <span className="text-lg">{preset.emoji}</span>
                  </div>
                  <p className="text-sm font-semibold text-charcoal dark:text-dark-text">{preset.name}</p>
                  <p className="text-xs text-brown-400 dark:text-dark-muted mt-0.5">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Sliders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-charcoal dark:text-dark-text">Custom Goals</h3>
              {isDirty && (
                <button onClick={() => setGoals(original)} className="btn-ghost text-xs text-brown-400">
                  <FiRefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
            <div className="space-y-6">
              {GOAL_FIELDS.map((field) => {
                const val = goals[field.key] || field.min;
                const pct = ((val - field.min) / (field.max - field.min)) * 100;
                return (
                  <div key={field.key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${field.dot}`} />
                        <span className="text-sm font-medium text-charcoal dark:text-dark-text">{field.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => {
                            const v = parseInt(e.target.value) || field.min;
                            setGoals({ ...goals, [field.key]: Math.min(field.max, Math.max(field.min, v)) });
                          }}
                          className="w-20 text-right text-sm font-bold text-charcoal dark:text-dark-text bg-transparent border-none focus:ring-0 p-0"
                        />
                        <span className="text-xs text-brown-400 dark:text-dark-muted">{field.unit}</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={val}
                      onChange={(e) => setGoals({ ...goals, [field.key]: parseInt(e.target.value) })}
                      className="range-slider w-full"
                      style={{ '--range-progress': `${pct}%`, '--range-color': field.hex }}
                    />
                    <div className="flex justify-between text-[10px] text-brown-300 dark:text-dark-muted mt-1">
                      <span>{field.min} {field.unit}</span>
                      <span>{field.max} {field.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {isDirty && (
              <div className="mt-6 pt-6 border-t border-cream-200 dark:border-dark-border">
                <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-3 text-sm">
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><FiSave className="w-4 h-4" /> Save Goals</>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}
