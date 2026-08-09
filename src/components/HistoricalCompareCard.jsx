import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchHistoricalComparison } from '../weather-intelligence/providers/WeatherProvider';
import { calculateHistoricalInsights } from '../weather-intelligence/historical/historicalInsights';
import { useUser } from '../context/UserContext';
import { FaHistory, FaThermometerHalf, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

export default function HistoricalCompareCard({ weather }) {
  const { formatTemp } = useUser();
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHist = async () => {
      if (!weather || !weather.coord) return;
      setLoading(true);
      try {
        const data = await fetchHistoricalComparison(weather.coord.lat, weather.coord.lon);
        setHistoricalData(data);
      } catch (err) {
        console.warn('Historical compare error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHist();
  }, [weather]);

  if (!weather || loading) return null;

  const insights = calculateHistoricalInsights(weather, historicalData);
  if (!insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-300">
          <FaHistory className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Historical Climate Benchmark</h3>
          <p className="text-xs text-white/60">Comparing today's metrics with {insights.yearsAgo}-year historical averages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <span className="text-xs text-white/60 font-semibold block">Today's Temperature</span>
          <span className="text-2xl font-extrabold text-white mt-1 block">{formatTemp(insights.currentTemp)}</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <span className="text-xs text-white/60 font-semibold block">Historical Average</span>
          <span className="text-2xl font-extrabold text-white/80 mt-1 block">{formatTemp(insights.histAvgTemp)}</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-xs text-white/60 font-semibold block mb-1">Climate Variance</span>
          <span className="text-sm font-bold text-amber-300 flex items-center gap-1">
            {insights.diff > 0 ? <FaArrowUp className="text-rose-400" /> : insights.diff < 0 ? <FaArrowDown className="text-blue-400" /> : <FaMinus />}
            {insights.trendLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
