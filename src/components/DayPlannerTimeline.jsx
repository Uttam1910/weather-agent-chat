import { motion } from 'framer-motion';
import { generateDayPlannerTimeline } from '../weather-intelligence/engine/dayPlanner';
import { useUser } from '../context/UserContext';
import { FaCalendarDay, FaClock, FaInfoCircle } from 'react-icons/fa';

export default function DayPlannerTimeline({ hourly }) {
  const { formatTemp } = useUser();
  const timeline = generateDayPlannerTimeline(hourly);

  if (!timeline || timeline.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-300">
          <FaCalendarDay className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Weather-Based Day Planner</h3>
          <p className="text-xs text-white/60">Structured daily timeline with hourly activity recommendations</p>
        </div>
      </div>

      <div className="space-y-3">
        {timeline.map((slot, idx) => (
          <div
            key={idx}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
          >
            <div className="flex items-center gap-4 min-w-[140px]">
              <div className="p-2.5 bg-white/10 rounded-xl text-white font-extrabold text-sm flex items-center gap-1.5">
                <FaClock className="text-amber-400 text-xs" />
                {slot.timeLabel}
              </div>
              <div>
                <span className="text-lg font-bold text-white block">{formatTemp(slot.temp)}</span>
                <span className="text-[11px] text-white/50 block">Rain: {slot.pop}% | UV: {slot.uv}</span>
              </div>
            </div>

            <div className="flex-1 text-sm font-medium text-white/90 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl">
              {slot.recommendation}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
