import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_TYPES, evaluateEventWeather } from '../weather-intelligence/events/eventMonitor';
import { fetchWeatherData } from '../weather-intelligence/providers/WeatherProvider';
import SearchBar from './SearchBar';
import { FaCalendarPlus, FaTimes, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function EventMonitorModal({ isOpen, onClose }) {
  const [eventType, setEventType] = useState('wedding');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (cityInput) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(cityInput);
      setWeatherData(data);
    } catch (err) {
      console.warn('Event weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const evaluation = weatherData ? evaluateEventWeather(eventType, weatherData) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-300">
                <FaCalendarPlus className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Event Weather Monitor</h3>
                <p className="text-xs text-white/60">Evaluate outdoor event suitability & backup windows</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white">
              <FaTimes />
            </button>
          </div>

          {/* Event Type Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/70 uppercase">Event Category</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEventType(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    eventType === t.id ? 'bg-purple-600 text-white shadow-md' : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/70 uppercase">Event Location</label>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>

          {/* Evaluation Results */}
          {loading && (
            <div className="py-8 text-center text-white/60 flex flex-col items-center gap-2">
              <ImSpinner8 className="animate-spin text-3xl text-purple-400" />
              <span>Checking event atmospheric risks...</span>
            </div>
          )}

          {evaluation && !loading && (
            <div className="space-y-4 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">Outdoor Event Feasibility</h4>
                  <p className="text-xs text-white/60">Calculated for {weatherData.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-purple-300">{evaluation.eventScore}</span>
                  <span className="text-[10px] text-white/40 block">/ 100</span>
                </div>
              </div>

              {/* Risks & Concerns */}
              {evaluation.concerns.length > 0 ? (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 space-y-2">
                  <h5 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <FaExclamationTriangle /> Potential Weather Concerns
                  </h5>
                  {evaluation.concerns.map((c, i) => (
                    <div key={i} className="text-xs text-rose-200/90">• {c}</div>
                  ))}
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-2">
                  <FaCheckCircle className="text-base" />
                  <span>Excellent atmospheric stability for your outdoor event!</span>
                </div>
              )}

              {/* Best Backup Window */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <FaClock className="text-amber-400 text-lg flex-shrink-0" />
                <div>
                  <span className="text-xs text-white/60 block font-semibold">Recommended Backup Window</span>
                  <span className="text-sm font-bold text-white">{evaluation.backupWindow}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
