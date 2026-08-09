import { filterByDateRange } from './OverviewView';
import { FaLayerGroup, FaRunning, FaPlane, FaCalendarAlt, FaCamera, FaExchangeAlt, FaWind } from 'react-icons/fa';

export default function FeatureUsageView({ data, dateRange }) {
  const featureUsage = filterByDateRange(data.featureUsage, dateRange);

  const featureLabels = {
    what_should_i_do_today: { name: 'What Should I Do Today?', icon: FaRunning, color: 'text-amber-400' },
    activity_scores: { name: '15+ Outdoor Activity Scores', icon: FaRunning, color: 'text-emerald-400' },
    best_time: { name: 'Best Time Engine', icon: FaWind, color: 'text-purple-400' },
    travel_planner: { name: 'Travel Weather Planner', icon: FaPlane, color: 'text-blue-400' },
    event_monitor: { name: 'Outdoor Event Monitor', icon: FaCalendarAlt, color: 'text-rose-400' },
    photography_mode: { name: 'Photography Mode & Golden Hour', icon: FaCamera, color: 'text-cyan-400' },
    compare_destinations: { name: 'Destination Weather Comparison', icon: FaExchangeAlt, color: 'text-indigo-400' },
  };

  const featureCounts = {};
  featureUsage.forEach((f) => {
    const id = f.featureId;
    featureCounts[id] = (featureCounts[id] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Feature Usage Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">Interactions with decision cards, travel planner, event monitor, and activity engines.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FaLayerGroup className="text-purple-400" /> Feature Interaction Breakdown
        </h3>

        {Object.keys(featureCounts).length === 0 ? (
          <div className="text-xs text-slate-500 py-8 text-center">
            No feature interactions recorded yet for this date range.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(featureCounts).map(([featId, count], idx) => {
              const meta = featureLabels[featId] || { name: featId, icon: FaLayerGroup, color: 'text-slate-400' };
              const Icon = meta.icon;
              return (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`text-lg ${meta.color}`} />
                    <span className="text-xs font-semibold text-white">{meta.name}</span>
                  </div>
                  <span className="text-lg font-extrabold text-purple-400">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
