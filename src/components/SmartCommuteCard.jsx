import { motion } from 'framer-motion';
import { calculateCommuteIntelligence } from '../weather-intelligence/commute/commuteIntelligence';
import { FaCar, FaSun, FaMoon, FaExclamationTriangle } from 'react-icons/fa';

export default function SmartCommuteCard({ hourly }) {
  const commute = calculateCommuteIntelligence(hourly);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-300">
          <FaCar className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Smart Commute Intelligence</h3>
          <p className="text-xs text-white/60">Drive safety score, visibility & delay advisory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Morning Commute */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <FaSun /> Morning Commute (07:00 - 09:00)
            </span>
            <span className="text-lg font-extrabold text-white">{commute.morning.score}/100</span>
          </div>
          <div className="text-sm font-semibold text-white/90">{commute.morning.status}</div>
          <p className="text-xs text-white/70 leading-relaxed">{commute.morning.advice}</p>
          <div className="flex gap-3 text-[11px] text-white/50 pt-1 border-t border-white/5">
            <span>Rain risk: <strong>{commute.morning.rainRisk}%</strong></span>
            <span>Visibility: <strong>{commute.morning.visibility}</strong></span>
          </div>
        </div>

        {/* Evening Commute */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
              <FaMoon /> Evening Commute (17:00 - 19:00)
            </span>
            <span className="text-lg font-extrabold text-white">{commute.evening.score}/100</span>
          </div>
          <div className="text-sm font-semibold text-white/90">{commute.evening.status}</div>
          <p className="text-xs text-white/70 leading-relaxed">{commute.evening.advice}</p>
          <div className="flex gap-3 text-[11px] text-white/50 pt-1 border-t border-white/5">
            <span>Rain risk: <strong>{commute.evening.rainRisk}%</strong></span>
            <span>Visibility: <strong>{commute.evening.visibility}</strong></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
