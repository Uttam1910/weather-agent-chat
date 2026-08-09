import { motion } from 'framer-motion';
import { WiStrongWind, WiHumidity, WiBarometer, WiDaySunny, WiRaindrop } from 'react-icons/wi';
import { FaStar, FaRegStar, FaEye } from 'react-icons/fa';
import { useUser } from '../context/UserContext';

export default function WeatherCard({ weatherData, onClick }) {
  const { formatTemp, formatSpeed, isFavorite, addFavorite, removeFavorite } = useUser();

  if (!weatherData) return null;

  const {
    location,
    description,
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    pressure,
    visibility,
    uvIndex,
    icon,
  } = weatherData;

  const fav = isFavorite(location);

  const toggleFav = (e) => {
    e.stopPropagation();
    if (fav) removeFavorite(location);
    else addFavorite(location);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-all pointer-events-none" />

      {/* Top Header */}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{location}</h2>
          <p className="text-sm text-white/70 capitalize font-medium">{description}</p>
        </div>
        <button
          onClick={toggleFav}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 hover:scale-110 transition-transform"
        >
          {fav ? <FaStar className="text-lg" /> : <FaRegStar className="text-lg text-white/50" />}
        </button>
      </div>

      {/* Main Temperature & Weather Icon */}
      <div className="flex items-center justify-between my-6 relative z-10">
        <div>
          <div className="text-6xl font-bold text-white tracking-tighter">{formatTemp(temperature)}</div>
          <div className="text-xs text-white/60 mt-1 font-medium">Feels like {formatTemp(feelsLike)}</div>
        </div>
        <div className="w-20 h-20 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 p-1">
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={description}
            className="w-16 h-16 filter drop-shadow-md"
          />
        </div>
      </div>

      {/* Metric Pills */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 relative z-10 text-xs">
        <div className="bg-white/5 rounded-xl p-2 text-center">
          <WiStrongWind className="text-xl text-blue-300 mx-auto" />
          <span className="text-white/50 block">Wind</span>
          <span className="font-semibold text-white">{formatSpeed(windSpeed)}</span>
        </div>

        <div className="bg-white/5 rounded-xl p-2 text-center">
          <WiHumidity className="text-xl text-cyan-300 mx-auto" />
          <span className="text-white/50 block">Humidity</span>
          <span className="font-semibold text-white">{humidity}%</span>
        </div>

        <div className="bg-white/5 rounded-xl p-2 text-center">
          <WiDaySunny className="text-xl text-amber-300 mx-auto" />
          <span className="text-white/50 block">UV Index</span>
          <span className="font-semibold text-white">{uvIndex}</span>
        </div>
      </div>
    </motion.div>
  );
}
