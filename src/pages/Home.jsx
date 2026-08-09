import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SearchBar from '../components/SearchBar';
import SEO from '../components/SEO';
import WeatherCard from '../components/WeatherCard';
import { fetchWeatherData } from '../utils/weatherApi';
import { WiDaySunny, WiRaindrop, WiStrongWind, WiCloudy } from 'react-icons/wi';
import { FaHistory, FaStar, FaRobot, FaChartLine, FaLungs, FaCompass } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const { recents, favorites, addRecent } = useUser();
  const [loading, setLoading] = useState(false);
  const [featuredWeather, setFeaturedWeather] = useState(null);

  // Load default featured city weather (London / Mumbai / User location)
  useEffect(() => {
    const loadDefault = async () => {
      try {
        const data = await fetchWeatherData('London');
        setFeaturedWeather(data);
      } catch (err) {
        console.warn('Default weather load error:', err);
      }
    };
    loadDefault();
  }, []);

  const handleSearch = (cityOrLocation) => {
    setLoading(true);
    if (typeof cityOrLocation === 'string') {
      addRecent(cityOrLocation);
      navigate(`/weather/${encodeURIComponent(cityOrLocation)}`);
    } else if (typeof cityOrLocation === 'object' && cityOrLocation.name) {
      addRecent(cityOrLocation.name);
      navigate(`/weather/${encodeURIComponent(cityOrLocation.name)}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
      <SEO
        title="Weather Agent - Premium Interactive Weather Forecasts"
        description="Get live weather forecasts, 24h hourly graphs, AQI monitoring, and AI weather agent insights."
      />

      <div className="w-full max-w-5xl space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-purple-300 backdrop-blur-md shadow-lg">
            <WiDaySunny className="text-lg text-amber-400" />
            <span>Powered by Zero-Key Live Weather API</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Weather forecasting with <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
              Intelligence & Beauty
            </span>
          </h1>

          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Real-time atmospheric data, 24-hour hourly graphs, detailed air quality analysis, and instant AI weather tips.
          </p>

          <div className="pt-4">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>

        {/* Live Featured Weather Preview */}
        {featuredWeather && (
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2 text-white/70 text-xs font-bold uppercase tracking-wider">
              <span>Featured Spot</span>
              <span>Live Updates</span>
            </div>
            <WeatherCard
              weatherData={featuredWeather}
              onClick={() => handleSearch(featuredWeather.location)}
            />
          </div>
        )}

        {/* Quick Chips Grid: Recent Searches & Favorites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-xl space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <FaStar className="text-yellow-400" /> Saved Favorite Cities
              </h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(city)}
                    className="px-4 py-2 bg-white/10 hover:bg-purple-600/40 border border-white/15 rounded-2xl text-xs font-semibold text-white transition-all hover:scale-105 shadow-sm"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recents.length > 0 && (
            <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-xl space-y-3">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                <FaHistory className="text-blue-400" /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recents.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(city)}
                    className="px-4 py-2 bg-white/10 hover:bg-blue-600/40 border border-white/15 rounded-2xl text-xs font-semibold text-white/90 hover:text-white transition-all hover:scale-105 shadow-sm"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {[
            {
              icon: FaChartLine,
              title: '24-Hour Forecast Graphs',
              desc: 'Interactive hourly charts for temperature trends, rain probability %, wind gusts, and UV index.',
              color: 'text-purple-400',
            },
            {
              icon: FaLungs,
              title: 'Air Quality & Health',
              desc: 'Detailed pollutant breakdowns for PM2.5, PM10, O3, NO2 with actionable health recommendations.',
              color: 'text-emerald-400',
            },
            {
              icon: FaRobot,
              title: 'AI Weather Agent',
              desc: 'Ask custom clothing questions, umbrella reminders, or outdoor workout safety tips in real time.',
              color: 'text-blue-400',
            },
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-3 shadow-lg"
            >
              <feat.icon className={`text-3xl ${feat.color}`} />
              <h4 className="text-base font-bold text-white">{feat.title}</h4>
              <p className="text-xs text-white/60 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
