import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { fetchMarineWeather } from '../weather-intelligence/providers/WeatherProvider';
import { calculateComfortIndex } from '../weather-intelligence/scoring/comfortIndex';
import { calculateWeatherRisk } from '../weather-intelligence/scoring/riskIndex';
import { scoreAllActivities } from '../weather-intelligence/scoring/activityScorer';
import { generateWeatherAdvisories } from '../weather-intelligence/alerts/weatherAdvisories';
import { calculatePhotographyScore } from '../weather-intelligence/photography/photographyMode';
import { calculateMarineScores } from '../weather-intelligence/marine/marineIntelligence';
import { calculateGardeningIntelligence } from '../weather-intelligence/gardening/gardeningIntelligence';
import { getPreparationGear } from '../weather-intelligence/products/productRecommendations';

import HourlyForecast from './HourlyForecast';
import AirQualityCard from './AirQualityCard';
import SmartCommuteCard from './SmartCommuteCard';
import DayPlannerTimeline from './DayPlannerTimeline';
import HistoricalCompareCard from './HistoricalCompareCard';

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
  FaSun,
  FaTachometerAlt,
  FaCamera,
  FaShieldAlt,
  FaSmile,
  FaWater,
  FaSeedling,
  FaSuitcase,
  FaExclamationTriangle,
  FaCar,
} from 'react-icons/fa';

export default function WeatherDashboard({ weatherData, forecastData, aqiData }) {
  const { formatTemp, formatSpeed, isFavorite, addFavorite, removeFavorite } = useUser();
  const { updateWeatherCondition } = useTheme();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'activities' | 'hourly' | 'daily' | 'aqi' | 'specialized'
  const [marineData, setMarineData] = useState(null);

  useEffect(() => {
    const loadMarine = async () => {
      if (weatherData && weatherData.coord) {
        const data = await fetchMarineWeather(weatherData.coord.lat, weatherData.coord.lon);
        setMarineData(data);
      }
    };
    loadMarine();
  }, [weatherData]);

  if (!weatherData) return null;

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
  const toggleFav = () => (fav ? removeFavorite(location) : addFavorite(location));

  const comfort = calculateComfortIndex(weatherData);
  const risk = calculateWeatherRisk(weatherData);
  const activities = scoreAllActivities(weatherData);
  const advisories = generateWeatherAdvisories(weatherData);
  const photoMode = calculatePhotographyScore(weatherData);
  const marineMode = calculateMarineScores(weatherData, marineData);
  const gardenMode = calculateGardeningIntelligence(weatherData);
  const gear = getPreparationGear(weatherData);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaTachometerAlt },
    { id: 'activities', label: 'Activity Scores', icon: FaSun },
    { id: 'hourly', label: '24-Hour Forecast', icon: FaChartLine },
    { id: 'daily', label: '7-Day Forecast', icon: FaCalendarAlt },
    { id: 'aqi', label: 'Air Quality', icon: FaLungs },
    { id: 'specialized', label: 'Photography & Garden', icon: FaCamera },
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
            <p className="text-xl text-white/80 capitalize font-medium">{description}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-6">
              <span className="text-7xl sm:text-9xl font-bold text-white tracking-tighter">
                {formatTemp(temperature)}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xl text-white/70 font-medium">Feels like {formatTemp(feelsLike)}</span>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-full text-white/80 font-semibold">
                    Comfort: {comfort.score}/100 ({comfort.rating})
                  </span>
                  <span className={`text-xs border border-white/15 px-3 py-1 rounded-full font-bold bg-white/10 ${risk.color}`}>
                    Risk: {risk.level}
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

      {/* Non-Alarmist Weather Advisories */}
      {advisories.length > 0 && (
        <div className="space-y-2">
          {advisories.map((adv, idx) => (
            <div key={idx} className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300">{adv.title}</h4>
                <p className="text-xs text-white/80 leading-relaxed">{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

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
          <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: WiStrongWind, label: 'Wind Speed', value: formatSpeed(windSpeed), sub: `Gusts ${formatSpeed(windGust)}`, color: 'text-blue-300' },
                { icon: WiHumidity, label: 'Humidity', value: `${humidity}%`, sub: `Dew point ${formatTemp(dewPoint)}`, color: 'text-cyan-300' },
                { icon: WiBarometer, label: 'Air Pressure', value: `${pressure} hPa`, sub: pressure > 1013 ? 'High Pressure' : 'Low Pressure', color: 'text-emerald-300' },
                { icon: WiDaySunny, label: 'UV Index', value: `${uvIndex} / 12`, sub: `UV Peak`, color: 'text-amber-300' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 flex flex-col justify-between hover:bg-white/15 transition-all shadow-lg">
                  <stat.icon className={`text-5xl ${stat.color} mb-2`} />
                  <div>
                    <span className="text-xs text-white/60 font-medium block">{stat.label}</span>
                    <span className="text-2xl font-bold text-white mt-1 block">{stat.value}</span>
                    <span className="text-[11px] text-white/50 block mt-1">{stat.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Commute & Day Planner */}
            <SmartCommuteCard hourly={hourly} />
            <DayPlannerTimeline hourly={hourly} />

            {/* Weather Gear Checklist */}
            {gear.length > 0 && (
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FaSuitcase className="text-purple-400" /> Recommended Weather Preparation Gear
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {gear.map((g) => (
                    <div key={g.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                      <span className="text-2xl">{g.icon}</span>
                      <span className="text-xs font-bold text-white">{g.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'activities' && (
          <motion.div key="activities" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((act) => (
                <div key={act.id} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 border border-white/20 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{act.icon}</span>
                      <h4 className="font-bold text-white">{act.name}</h4>
                    </div>
                    <span className="text-2xl font-extrabold text-white">{act.score}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${act.status.bg} ${act.status.color}`}>
                    {act.status.label}
                  </span>
                  <div className="text-xs text-white/70 pt-2 border-t border-white/10">
                    {act.pros[0] || act.cons[0] || 'Standard weather conditions'}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'hourly' && (
          <motion.div key="hourly" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <HourlyForecast hourlyData={hourly} />
          </motion.div>
        )}

        {activeTab === 'daily' && (
          <motion.div key="daily" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white mb-2">7-Day Extended Forecast</h3>
            <div className="space-y-3">
              {(forecast || []).map((day, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="w-32">
                    <div className="font-bold text-white text-base">{idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString([], { weekday: 'long' })}</div>
                    <div className="text-xs text-white/50">{new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="" className="w-12 h-12" />
                    <span className="text-sm font-medium text-white/80 capitalize hidden sm:inline">{day.description}</span>
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
          <motion.div key="aqi" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <AirQualityCard aqiData={aqiData} />
          </motion.div>
        )}

        {activeTab === 'specialized' && (
          <motion.div key="specialized" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
            {/* Photography Mode */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaCamera className="text-purple-400" /> Photography Weather Mode
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-xs text-white/60 block">Landscape Score</span>
                  <span className="text-3xl font-extrabold text-purple-300 mt-1 block">{photoMode.landscapeScore}/100</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-xs text-white/60 block">Sunset Score</span>
                  <span className="text-3xl font-extrabold text-amber-300 mt-1 block">{photoMode.sunsetScore}/100</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-xs text-white/60 block">Golden Hour Window</span>
                  <span className="text-sm font-bold text-white mt-2 block">{photoMode.goldenHourWindow}</span>
                </div>
              </div>
            </div>

            {/* Gardening & Soil Mode */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaSeedling className="text-emerald-400" /> Gardening & Soil Conditions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-white/60 font-semibold block">Watering Recommendation</span>
                  <span className="text-base font-bold text-emerald-300 mt-1 block">{gardenMode.wateringRecommendation}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <span className="text-xs text-white/60 font-semibold block">Soil Condition</span>
                  <span className="text-base font-bold text-white mt-1 block">{gardenMode.soilCondition}</span>
                </div>
              </div>
            </div>

            {/* Marine & Coastal (If Available) */}
            {marineMode && (
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaWater className="text-cyan-400" /> Coastal & Marine Weather
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-xs text-white/60 block">Wave Height</span>
                    <span className="text-lg font-bold text-white">{marineMode.waveHeight}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-xs text-white/60 block">Beach Score</span>
                    <span className="text-lg font-bold text-emerald-300">{marineMode.beachScore}/100</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <span className="text-xs text-white/60 block">Surf Score</span>
                    <span className="text-lg font-bold text-cyan-300">{marineMode.surfScore}/100</span>
                  </div>
                </div>
              </div>
            )}

            {/* Historical Climate Benchmark */}
            <HistoricalCompareCard weather={weatherData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
