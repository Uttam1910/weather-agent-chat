import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWeatherData } from '../weather-intelligence/providers/WeatherProvider';
import { analyzeTravelPlan } from '../weather-intelligence/travel/travelPlanner';
import { trackFeatureUse } from '../admin/analytics/tracker';
import SearchBar from './SearchBar';
import { FaPlane, FaTimes, FaSuitcase, FaCheckCircle, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function TravelPlannerModal({ isOpen, onClose }) {
  const [destination, setDestination] = useState('Goa');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      trackFeatureUse('travel_planner');
    }
  }, [isOpen]);

  const handleSearch = async (cityInput) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(cityInput);
      setWeatherData(data);
      setDestination(data.location);
    } catch (err) {
      console.warn('Travel weather error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const analysis = weatherData ? analyzeTravelPlan(weatherData.forecast) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-300">
                <FaPlane className="text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Travel Weather Planner</h3>
                <p className="text-xs text-white/60">Trip weather scoring & deterministic packing checklist</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          {/* Destination Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/70 uppercase">Select Travel Destination</label>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>

          {/* Trip Intelligence Result */}
          {loading && (
            <div className="py-12 text-center text-white/60 flex flex-col items-center gap-2">
              <ImSpinner8 className="animate-spin text-3xl text-purple-400" />
              <span>Analyzing destination multi-day climate...</span>
            </div>
          )}

          {analysis && !loading && (
            <div className="space-y-6 pt-2">
              {/* Trip Overview Card */}
              <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-white">{destination} Trip Forecast</h4>
                  <p className="text-xs text-white/70 mt-1">Average temperature: <strong>{analysis.avgTemp}°C</strong></p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-amber-300 flex items-center gap-1">
                    <FaStar className="text-xl text-amber-400" /> {analysis.tripScore}
                  </div>
                  <span className="text-[10px] text-white/50 uppercase font-bold">Trip Weather Score</span>
                </div>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">BEST OUTDOOR DAY</span>
                  <span className="text-lg font-bold text-white flex items-center gap-2">
                    <FaCalendarAlt className="text-amber-400" /> {analysis.bestDayLabel}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-rose-400 font-bold block mb-1">HIGHEST RAIN RISK</span>
                  <span className="text-lg font-bold text-white flex items-center gap-2">
                    <FaCalendarAlt className="text-rose-400" /> {analysis.rainRiskDayLabel}
                  </span>
                </div>
              </div>

              {/* Deterministic Packing Checklist */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FaSuitcase className="text-purple-400" /> Recommended Packing Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.packingChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/90 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <FaCheckCircle className="text-emerald-400 text-xs flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
