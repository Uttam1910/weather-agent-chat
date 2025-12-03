import { useState } from 'react';
import { fetchWeatherData } from '../utils/weatherApi';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

export default function Compare() {
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch1 = async (city) => {
    setLoading1(true);
    try {
      const data = await fetchWeatherData(city);
      setCity1Data(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading1(false);
    }
  };

  const handleSearch2 = async (city) => {
    setLoading2(true);
    try {
      const data = await fetchWeatherData(city);
      setCity2Data(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4">
      <SEO title="Compare Weather" description="Compare weather conditions between two cities." />
      
      <h1 className="text-3xl font-bold text-center text-white mb-8">Compare Cities</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* City 1 */}
        <div className="space-y-6">
          <div className="bg-glass-100 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">City 1</h2>
            <SearchBar onSearch={handleSearch1} isLoading={loading1} />
          </div>
          {city1Data && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <WeatherCard weatherData={city1Data} />
            </motion.div>
          )}
        </div>

        {/* City 2 */}
        <div className="space-y-6">
          <div className="bg-glass-100 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">City 2</h2>
            <SearchBar onSearch={handleSearch2} isLoading={loading2} />
          </div>
          {city2Data && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <WeatherCard weatherData={city2Data} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
