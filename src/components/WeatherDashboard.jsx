import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import {
  WiStrongWind,
  WiHumidity,
  WiBarometer,
  WiSunrise,
  WiSunset,
  WiDaySunny,
  WiRaindrop,
} from 'react-icons/wi';
import {
  FaStar,
  FaRegStar,
  FaChartLine,
  FaCalendarAlt,
  FaLungs,
  FaRobot,
  FaSun,
  FaTachometerAlt,
  FaCheckCircle,
} from 'react-icons/fa';
import HourlyForecast from './HourlyForecast';
import AirQualityCard from './AirQualityCard';
import AiWeatherAssistant from './AiWeatherAssistant';

export default function WeatherDashboard({ weatherData, forecastData, aqiData }) {
  const { formatTemp, formatSpeed, isFavorite, addFavorite, removeFavorite } = useUser();
  const { updateWeatherCondition } = useTheme();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'hourly' | 'daily' | 'aqi' | 'ai'

  if (!weatherData) return null;

  // Update background theme condition
  if (weatherData.conditionType) {
    updateWeatherCondition(weatherData.conditionType);
  }

  const {
    location,
    conditions,
    description,
    temperature,
    feelsLike,
    humidity,
    windSpeed,
    windGust,
    windDirection,
    pressure,
    visibility,
    dewPoint,
    uvIndex,
    sunrise,
    sunset,
    icon,
    hourly,
    forecast,
  } = weatherData;

  const fav = isFavorite(location);

  const toggleFav = () => {
    if (fav) removeFavorite(location);
    else addFavorite(location);
  };

  const getUvLevel = (uv) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400' };
    return { label: 'Extreme', color: 'text-purple-400' };
  };

  const uvMeta = getUvLevel(uvIndex);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaTachometerAlt },
    { id: 'hourly', label: '24-Hour Chart', icon: FaChartLine },
    { id: 'daily', label: '7-Day Forecast', icon: FaCalendarAlt },
    { id: 'aqi', label: 'Air Quality', icon: FaLungs },
    { id: 'ai', label: 'AI Assistant', icon: FaRobot },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 space-y-6">
      {/* Top Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-purple-500/30 to-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight">{location}</h1>
              <button
                onClick={toggleFav}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-yellow-400 hover:scale-110 transition-all shadow-md"
              >
                {fav ? <FaStar className="text-xl" /> : <FaRegStar className="text-xl text-white/50" />}
              </button>
            </div>
            <p className="text-xl text-white/80 capitalize font-medium flex items-center gap-2">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-6">
              <span className="text-7xl sm:text-9xl font-bold text-white tracking-tighter">
                {formatTemp(temperature)}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xl text-white/70 font-medium">Feels like {formatTemp(feelsLike)}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-full text-white/80 font-semibold">
                    Dew Point: {formatTemp(dewPoint)}
                  </span>
                  <span className={`text-xs border border-white/15 px-3 py-1 rounded-full font-bold bg-white/10 ${uvMeta.color}`}>
                    UV: {uvIndex} ({uvMeta.label})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Large Weather Icon Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md min-w-[200px]">
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={description}
              className="w-32 h-32 filter drop-shadow-xl animate-float-slow"
            />
            <span className="text-lg font-semibold text-white capitalize">{conditions}</span>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tab Bar */}
      <div className="flex gap-2 overflow-x-auto p-1 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="text-base" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Primary Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  icon: WiStrongWind,
                  label: 'Wind Speed',
                  value: formatSpeed(windSpeed),
                  sub: `Gusts up to ${formatSpeed(windGust)}`,
                  color: 'text-blue-300',
                },
                {
                  icon: WiHumidity,
                  label: 'Humidity',
                  value: `${humidity}%`,
                  sub: `Dew point ${formatTemp(dewPoint)}`,
                  color: 'text-cyan-300',
                },
                {
                  icon: WiBarometer,
                  label: 'Air Pressure',
                  value: `${pressure} hPa`,
                  sub: pressure > 1013 ? 'High Pressure' : 'Low Pressure',
                  color: 'text-emerald-300',
                },
                {
                  icon: WiDaySunny,
                  label: 'UV Index',
                  value: `${uvIndex} / 12`,
                  sub: uvMeta.label,
                  color: 'text-amber-300',
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition-all shadow-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <stat.icon className={`text-5xl ${stat.color}`} />
                  </div>
                  <div>
                    <span className="text-xs text-white/60 font-medium block">{stat.label}</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{stat.value}</span>
                    <span className="text-[11px] text-white/50 block mt-1">{stat.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Sun & Air Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sun Arc Card */}
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl flex flex-col justify-between">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaSun className="text-amber-400" /> Sun Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <WiSunrise className="text-5xl text-amber-300 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-white/60 block">Sunrise</span>
                      <span className="text-lg font-bold text-white">
                        {sunrise ? new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:15 AM'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <WiSunset className="text-5xl text-rose-300 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-white/60 block">Sunset</span>
                      <span className="text-lg font-bold text-white">
                        {sunset ? new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:45 PM'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/60 flex justify-between">
                  <span>Visibility: <strong className="text-white">{visibility} km</strong></span>
                  <span>Wind Dir: <strong className="text-white">{windDirection}°</strong></span>
                </div>
              </div>

              {/* AQI Quick Card */}
              <AirQualityCard aqiData={aqiData} />
            </div>

            {/* Hourly Forecast Preview */}
            {hourly && <HourlyForecast hourlyData={hourly} />}
          </motion.div>
        )}

        {activeTab === 'hourly' && (
          <motion.div
            key="hourly"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {hourly ? <HourlyForecast hourlyData={hourly} /> : <p className="text-white/60">No hourly data available.</p>}
          </motion.div>
        )}

        {activeTab === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4"
          >
            <h3 className="text-xl font-bold text-white mb-2">7-Day Extended Forecast</h3>
            <div className="space-y-3">
              {(forecast || []).map((day, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="w-32">
                    <div className="font-bold text-white text-base">
                      {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString([], { weekday: 'long' })}
                    </div>
                    <div className="text-xs text-white/50">{new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      alt={day.description}
                      className="w-12 h-12"
                    />
                    <span className="text-sm font-medium text-white/80 capitalize hidden sm:inline">{day.description}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-cyan-300 w-20 justify-center">
                    <WiRaindrop className="text-lg" />
                    <span>{day.pop || 0}%</span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className="text-lg font-bold text-white">{formatTemp(day.tempMax)}</span>
                    <span className="text-sm font-semibold text-white/50">{formatTemp(day.tempMin)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'aqi' && (
          <motion.div
            key="aqi"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <AirQualityCard aqiData={aqiData} />
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <AiWeatherAssistant weatherData={weatherData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
