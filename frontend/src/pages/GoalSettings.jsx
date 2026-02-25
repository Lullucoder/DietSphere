import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiTarget, FiSave, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../services/api'
import Layout from '../components/Layout'

const PRESETS = [
  { label: '🏃 Weight Loss',    cal: 1500, protein: 120, carbs: 150, fat: 50, fiber: 30 },
  { label: '⚖️ Maintenance',    cal: 2000, protein: 50,  carbs: 300, fat: 65, fiber: 25 },
  { label: '💪 Muscle Building', cal: 2500, protein: 180, carbs: 300, fat: 80, fiber: 30 },
  { label: '🧘 Balanced Indian', cal: 2000, protein: 60,  carbs: 310, fat: 60, fiber: 28 },
]

const FIELDS = [
  { key: 'calorieGoal', label: 'Calories',  unit: 'kcal', min: 800,  max: 5000, step: 50,  emoji: '🔥', color: 'amber' },
  { key: 'proteinGoal', label: 'Protein',   unit: 'g',    min: 10,   max: 400,  step: 5,   emoji: '🥩', color: 'rose' },
  { key: 'carbsGoal',   label: 'Carbs',     unit: 'g',    min: 20,   max: 600,  step: 10,  emoji: '🌾', color: 'blue' },
  { key: 'fatGoal',     label: 'Fat',        unit: 'g',    min: 10,   max: 250,  step: 5,   emoji: '💧', color: 'purple' },
  { key: 'fiberGoal',   label: 'Fiber',      unit: 'g',    min: 5,    max: 80,   step: 1,   emoji: '🥦', color: 'emerald' },
]

function GoalSettings({ user, onLogout }) {
  const [goals, setGoals] = useState({ calorieGoal: 2000, proteinGoal: 50, carbsGoal: 300, fatGoal: 65, fiberGoal: 25 })
  const [original, setOriginal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchGoals() }, [])

  const fetchGoals = async () => {
    try {
      const res = await api.get(`/api/goals?userId=${user.userId}`)
      setGoals(res.data)
      setOriginal(res.data)
    } catch (err) { console.error('Error fetching goals:', err) }
    finally { setLoading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await api.put(`/api/goals?userId=${user.userId}`, goals)
      setGoals(res.data)
      setOriginal(res.data)
      toast.success('Goals saved!')
    } catch (err) { toast.error('Failed to save goals') }
    finally { setSaving(false) }
  }

  const applyPreset = (preset) => {
    setGoals({
      calorieGoal: preset.cal,
      proteinGoal: preset.protein,
      carbsGoal: preset.carbs,
      fatGoal: preset.fat,
      fiberGoal: preset.fiber,
    })
  }

  const isDirty = original && JSON.stringify(goals) !== JSON.stringify(original)

  const colorMap = {
    amber:   { bg: 'bg-amber-50 dark:bg-amber-500/10',   text: 'text-amber-600 dark:text-amber-400',   track: 'bg-amber-200 dark:bg-amber-900',   fill: 'bg-amber-500' },
    rose:    { bg: 'bg-rose-50 dark:bg-rose-500/10',     text: 'text-rose-600 dark:text-rose-400',     track: 'bg-rose-200 dark:bg-rose-900',     fill: 'bg-rose-500' },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-500/10',     text: 'text-blue-600 dark:text-blue-400',     track: 'bg-blue-200 dark:bg-blue-900',     fill: 'bg-blue-500' },
    purple:  { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', track: 'bg-purple-200 dark:bg-purple-900', fill: 'bg-purple-500' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10',text:'text-emerald-600 dark:text-emerald-400',track:'bg-emerald-200 dark:bg-emerald-900',fill:'bg-emerald-500'},
  }

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FiTarget size={18} className="text-white" />
            </div>
            Goal Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Set your daily nutrition targets</p>
        </div>
        {isDirty && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={15} />}
            Save Goals
          </motion.button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          <span className="w-5 h-5 border-2 border-slate-200 border-t-brand-500 rounded-full animate-spin mr-3" />
          Loading goals...
        </div>
      ) : (
        <>
          {/* Presets */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-6"
          >
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Quick Presets</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Choose a preset to auto-fill your goals, then tweak as needed</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="text-left p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-500/10 transition-all group"
                >
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{preset.label}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{preset.cal} kcal · P{preset.protein}g · C{preset.carbs}g · F{preset.fat}g</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Goal Sliders */}
          <div className="space-y-4">
            {FIELDS.map((field, i) => {
              const val = goals[field.key] || 0
              const pct = ((val - field.min) / (field.max - field.min)) * 100
              const c = colorMap[field.color]
              return (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center text-lg`}>{field.emoji}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{field.label}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{field.min}–{field.max} {field.unit}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={val}
                        onChange={(e) => {
                          let v = parseInt(e.target.value) || field.min
                          v = Math.max(field.min, Math.min(field.max, v))
                          setGoals({ ...goals, [field.key]: v })
                        }}
                        className={`w-24 text-right text-lg font-bold ${c.text} bg-transparent border-none focus:outline-none focus:ring-0 p-0`}
                      />
                      <span className="text-xs text-slate-400 dark:text-slate-500">{field.unit}/day</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={val}
                    onChange={(e) => setGoals({ ...goals, [field.key]: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand-500"
                    style={{
                      background: `linear-gradient(to right, var(--tw-gradient-from, #6366f1) ${pct}%, #e2e8f0 ${pct}%)`,
                    }}
                  />
                </motion.div>
              )
            })}
          </div>

          {/* Reset */}
          <div className="mt-6 text-center">
            <button
              onClick={() => applyPreset({ cal: 2000, protein: 50, carbs: 300, fat: 65, fiber: 25 })}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <FiRefreshCw size={12} /> Reset to defaults
            </button>
          </div>
        </>
      )}
    </Layout>
  )
}

export default GoalSettings
