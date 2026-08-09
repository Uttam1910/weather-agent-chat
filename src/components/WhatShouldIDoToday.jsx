import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { getWhatToDoToday } from '../weather-intelligence/engine/whatToDoToday';
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaLightbulb, FaSlidersH } from 'react-icons/fa';

export default function WhatShouldIDoToday({ weather, onSelectActivity }) {
  const { userInterests, toggleInterest } = useUser();
  if (!weather) return null;

  const decision = getWhatToDoToday(weather, userInterests);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900/90 via-purple-950/40 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 border border-purple-500/30 shadow-2xl space-y-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs font-bold text-purple-300 mb-2">
            <FaLightbulb className="text-amber-400" /> Signature Decision Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{decision.headline}</h2>
        </div>

        {/* Best Activity Window Badge */}
        {decision.bestWindow && (
          <div className="bg-white/10 border border-white/15 rounded-2xl p-3 flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-300">
              <FaClock className="text-xl" />
            </div>
            <div>
              <span className="text-[11px] text-white/60 font-semibold block uppercase">Best Outdoor Window</span>
              <span className="text-sm font-bold text-white">{decision.bestWindow.bestWindowLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Decision Rationale */}
      <p className="text-sm text-white/80 leading-relaxed bg-white/5 border border-white/10 p-4 rounded-2xl">
        {decision.rationale}
      </p>

      {/* Recommended & Avoid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Recommended Activities */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <FaCheckCircle /> Recommended Activities Today
          </h3>
          <div className="space-y-2">
            {decision.topActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => onSelectActivity && onSelectActivity(act)}
                className="bg-white/5 hover:bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{act.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {act.name}
                    </div>
                    <div className="text-xs text-white/50">{act.pros[0] || 'Favorable conditions'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400">{act.score}</span>
                  <span className="text-[10px] text-white/40 block">/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities to Avoid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <FaExclamationTriangle /> Sub-Optimal Activities Today
          </h3>
          <div className="space-y-2">
            {decision.avoidActivities.map((act) => (
              <div
                key={act.id}
                className="bg-white/5 border border-rose-500/20 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{act.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white/90">{act.name}</div>
                    <div className="text-xs text-rose-300/80">{act.cons[0] || 'Sub-optimal weather'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-rose-400">{act.score}</span>
                  <span className="text-[10px] text-white/40 block">/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
