import { useState } from 'react';
import { motion } from 'framer-motion';
import { scoreAllActivities } from '../weather-intelligence/scoring/activityScorer';
import { calculateBestTimeWindow } from '../weather-intelligence/engine/bestTimeEngine';
import { FaCheck, FaTimes, FaClock, FaFilter } from 'react-icons/fa';

export default function ActivityScoreGrid({ weather }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);

  if (!weather) return null;

  const activities = scoreAllActivities(weather);

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'fitness', label: 'Fitness & Sports' },
    { id: 'leisure', label: 'Leisure & Dining' },
    { id: 'daily', label: 'Commute & Pet' },
    { id: 'home', label: 'Home & Garden' },
  ];

  const filtered = activeCategory === 'all' ? activities : activities.filter((a) => a.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Activity Intelligence</h3>
          <p className="text-sm text-white/60">Deterministic outdoor suitability scores calculated from weather metrics</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1 overflow-x-auto p-1 bg-white/5 border border-white/10 rounded-2xl scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 15 Activity Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((act) => {
          const window = calculateBestTimeWindow(act.id, weather.hourly);
          return (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(selectedActivity?.id === act.id ? null : act)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex flex-col justify-between transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{act.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                      {act.name}
                    </h4>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${act.status.bg} ${act.status.color}`}>
                      {act.status.label}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white tracking-tight">{act.score}</div>
                  <span className="text-[10px] text-white/40 block">/ 100</span>
                </div>
              </div>

              {/* Best Window Badge */}
              <div className="text-xs text-white/70 bg-white/5 p-2 rounded-xl flex items-center justify-between border border-white/5">
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <FaClock className="text-[11px]" /> Best:
                </span>
                <span className="font-bold text-white">{window.bestWindowLabel}</span>
              </div>

              {/* Expanded Pros & Cons */}
              <div className="space-y-1 text-xs pt-1 border-t border-white/5">
                {act.pros.slice(0, 2).map((pro, idx) => (
                  <div key={idx} className="text-emerald-300/90 flex items-center gap-1.5">
                    <FaCheck className="text-[10px] flex-shrink-0" />
                    <span>{pro}</span>
                  </div>
                ))}
                {act.cons.slice(0, 2).map((con, idx) => (
                  <div key={idx} className="text-rose-300/90 flex items-center gap-1.5">
                    <FaTimes className="text-[10px] flex-shrink-0" />
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
