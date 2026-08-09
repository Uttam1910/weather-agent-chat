import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '../context/UserContext';
import { WiRaindrop, WiStrongWind, WiDaySunny } from 'react-icons/wi';

export default function HourlyForecast({ hourlyData }) {
  const { getTempNum, tempUnit, formatSpeed } = useUser();
  const [activeMetric, setActiveMetric] = useState('temp'); // 'temp' | 'pop' | 'wind' | 'uv'

  if (!hourlyData || hourlyData.length === 0) return null;

  const chartData = hourlyData.map((item) => ({
    time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: getTempNum(item.temp),
    pop: item.pop || 0,
    wind: item.windSpeed || 0,
    uv: item.uv || 0,
  }));

  const getMetricConfig = () => {
    switch (activeMetric) {
      case 'pop':
        return { label: 'Rain Chance (%)', stroke: '#06b6d4', fill: '#06b6d4', unit: '%' };
      case 'wind':
        return { label: 'Wind Speed', stroke: '#3b82f6', fill: '#3b82f6', unit: ' km/h' };
      case 'uv':
        return { label: 'UV Index', stroke: '#f59e0b', fill: '#f59e0b', unit: '' };
      case 'temp':
      default:
        return { label: `Temperature (°${tempUnit})`, stroke: '#a855f7', fill: '#a855f7', unit: `°${tempUnit}` };
    }
  };

  const metricConfig = getMetricConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">24-Hour Forecast</h3>
          <p className="text-sm text-white/60">Hourly temperature, rain probability & wind forecast</p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
          {[
            { key: 'temp', label: `Temp (°${tempUnit})` },
            { key: 'pop', label: 'Rain %' },
            { key: 'wind', label: 'Wind' },
            { key: 'uv', label: 'UV' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveMetric(btn.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeMetric === btn.key
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Graph */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricConfig.fill} stopOpacity={0.7} />
                <stop offset="95%" stopColor={metricConfig.fill} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '16px',
                color: 'white',
              }}
              formatter={(value) => [`${value}${metricConfig.unit}`, metricConfig.label]}
            />
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={metricConfig.stroke}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Horizontal Hourly Cards Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-white/20">
        {hourlyData.slice(0, 24).map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-24 bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-between hover:bg-white/10 transition-colors"
          >
            <span className="text-xs text-white/60 font-medium">
              {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt={item.description}
              className="w-10 h-10 my-1 filter drop-shadow"
            />
            <span className="text-base font-bold text-white">{getTempNum(item.temp)}°</span>
            <div className="flex items-center gap-1 text-[11px] text-cyan-300 mt-1">
              <WiRaindrop className="text-sm" />
              <span>{item.pop}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
