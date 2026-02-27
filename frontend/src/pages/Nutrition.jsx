import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import api from '../services/api';

export default function Nutrition({ user }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/analysis/today?userId=${user.id}`)
      .then((r) => setAnalysis(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="loading-spinner w-8 h-8" /></div>;
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <FiInfo className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-600">Log some meals to see your nutrition analysis</p>
      </div>
    );
  }

  const { deficiencies = [], recommendations = [], overallScore } = analysis;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nutrition Analysis</h1>

      {/* Score */}
      {overallScore !== undefined && (
        <div className="card p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-3">
            <span className="text-2xl font-bold">{overallScore}</span>
          </div>
          <p className="text-sm text-slate-600">Your Nutrition Score</p>
        </div>
      )}

      {/* Deficiencies */}
      {deficiencies.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
            <FiAlertTriangle className="text-amber-500" /> Areas to Improve
          </h2>
          <div className="space-y-3">
            {deficiencies.map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 w-2 h-2 rounded-full ${d.level === 'SEVERE' ? 'bg-red-500' : d.level === 'MODERATE' ? 'bg-amber-500' : 'bg-yellow-400'}`} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{d.nutrientName}</p>
                  <p className="text-xs text-slate-500">
                    {d.currentIntake?.toFixed(1)} / {d.recommendedIntake?.toFixed(1)} {d.unit} ({d.percentOfTarget?.toFixed(0)}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="card p-4">
          <h2 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" /> Recommendations
          </h2>
          <ul className="space-y-2">
            {recommendations.map((r, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{typeof r === 'string' ? r : r.message || r.recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {deficiencies.length === 0 && recommendations.length === 0 && (
        <div className="card p-6 text-center">
          <FiCheckCircle className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
          <p className="text-slate-600">Your nutrition looks balanced! Keep it up!</p>
        </div>
      )}
    </div>
  );
}
