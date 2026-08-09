import { motion } from 'framer-motion';
import { FaLungs, FaHeartbeat, FaChild, FaRunning } from 'react-icons/fa';

export default function AirQualityCard({ aqiData }) {
  if (!aqiData) return null;

  const { aqi, pm2_5, pm10, o3, no2, so2, co } = aqiData;

  const getAqiDetails = (val) => {
    if (val <= 50) {
      return {
        status: 'Good',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20 border-emerald-500/30',
        barColor: 'bg-emerald-400',
        advice: 'Air quality is satisfactory. Great day for outdoor activities!',
      };
    }
    if (val <= 100) {
      return {
        status: 'Moderate',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20 border-yellow-500/30',
        barColor: 'bg-yellow-400',
        advice: 'Air quality is acceptable. Unusually sensitive individuals should limit prolonged outdoor exertion.',
      };
    }
    if (val <= 150) {
      return {
        status: 'Unhealthy for Sensitive Groups',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20 border-orange-500/30',
        barColor: 'bg-orange-400',
        advice: 'Members of sensitive groups may experience health effects. General public is less likely to be affected.',
      };
    }
    if (val <= 200) {
      return {
        status: 'Unhealthy',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20 border-red-500/30',
        barColor: 'bg-red-400',
        advice: 'Everyone may begin to experience health effects. Wear a mask outdoors if sensitive.',
      };
    }
    return {
      status: 'Very Unhealthy / Hazardous',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20 border-purple-500/30',
      barColor: 'bg-purple-400',
      advice: 'Health warnings of emergency conditions. Keep windows closed and stay indoors.',
    };
  };

  const info = getAqiDetails(aqi);

  const pollutants = [
    { label: 'PM 2.5', value: pm2_5, unit: 'µg/m³', desc: 'Fine Particles' },
    { label: 'PM 10', value: pm10, unit: 'µg/m³', desc: 'Coarse Particles' },
    { label: 'Ozone (O3)', value: o3, unit: 'µg/m³', desc: 'Ground Level Ozone' },
    { label: 'NO2', value: no2, unit: 'µg/m³', desc: 'Nitrogen Dioxide' },
    { label: 'SO2', value: so2, unit: 'µg/m³', desc: 'Sulfur Dioxide' },
    { label: 'CO', value: co, unit: 'µg/m³', desc: 'Carbon Monoxide' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-300">
            <FaLungs className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Air Quality & Health Index</h3>
            <p className="text-sm text-white/60">Live pollution measurements & safety guidance</p>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-2xl border ${info.bgColor} font-bold text-sm ${info.color}`}>
          AQI {aqi} - {info.status}
        </div>
      </div>

      {/* AQI Progress Scale */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-white/70">
          <span>0 Good</span>
          <span>50 Moderate</span>
          <span>100 Unhealthy</span>
          <span>200+ Hazardous</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${info.barColor}`}
            style={{ width: `${Math.min(100, (aqi / 300) * 100)}%` }}
          />
        </div>
      </div>

      {/* Health Tip Box */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
        <FaHeartbeat className="text-rose-400 text-xl flex-shrink-0 mt-0.5" />
        <p className="text-sm text-white/80 leading-relaxed">{info.advice}</p>
      </div>

      {/* Pollutant Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {pollutants.map((p, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-white/60 mb-1">
              <span className="font-semibold">{p.label}</span>
              <span>{p.unit}</span>
            </div>
            <div className="text-lg font-bold text-white">{p.value}</div>
            <div className="text-[10px] text-white/40">{p.desc}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
