import { useState, useEffect } from 'react';
import { fetchWeatherData } from '../weather-intelligence/providers/WeatherProvider';
import { scoreAllActivities } from '../weather-intelligence/scoring/activityScorer';
import { calculateComfortIndex } from '../weather-intelligence/scoring/comfortIndex';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import SEO from '../components/SEO';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaArrowUp, FaArrowDown, FaMinus, FaTrophy } from 'react-icons/fa';

export default function Compare() {
  const { formatTemp, formatSpeed } = useUser();
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    handleSearch1('London');
    handleSearch2('Tokyo');
  }, []);

  const handleSearch1 = async (cityInput) => {
    setLoading1(true);
    setError1(null);
    try {
      const data = await fetchWeatherData(cityInput);
      setCity1Data(data);
    } catch (err) {
      setError1(err.message);
    } finally {
      setLoading1(false);
    }
  };

  const handleSearch2 = async (cityInput) => {
    setLoading2(true);
    setError2(null);
    try {
      const data = await fetchWeatherData(cityInput);
      setCity2Data(data);
    } catch (err) {
      setError2(err.message);
    } finally {
      setLoading2(false);
    }
  };

  const getDiffText = (val1, val2, unitLabel = '') => {
    if (val1 === undefined || val2 === undefined) return null;
    const diff = val1 - val2;
    if (diff > 0) {
      return (
        <span className="text-emerald-400 font-bold flex items-center justify-center gap-1 text-xs">
          <FaArrowUp /> +{Math.round(diff)} {unitLabel}
        </span>
      );
    }
    if (diff < 0) {
      return (
        <span className="text-rose-400 font-bold flex items-center justify-center gap-1 text-xs">
          <FaArrowDown /> {Math.round(diff)} {unitLabel}
        </span>
      );
    }
    return (
      <span className="text-white/50 font-semibold flex items-center justify-center gap-1 text-xs">
        <FaMinus /> Equal
      </span>
    );
  };

  const comfort1 = city1Data ? calculateComfortIndex(city1Data).score : 0;
  const comfort2 = city2Data ? calculateComfortIndex(city2Data).score : 0;

  const winner = comfort1 > comfort2 ? city1Data?.location : comfort2 > comfort1 ? city2Data?.location : null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto space-y-8">
      <SEO
        title="Compare Destinations - Weather Intelligence"
        description="Compare weather comfort, outdoor activity suitability, and atmospheric metrics side-by-side."
      />

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
          Destination Weather Comparison <FaExchangeAlt className="text-purple-400 text-2xl" />
        </h1>
        <p className="text-white/60 text-sm">Head-to-head weather intelligence, comfort score comparison & outdoor suitability.</p>
      </div>

      {/* Winner Recommendation Banner */}
      {winner && (
        <div className="bg-gradient-to-r from-emerald-900/60 to-purple-900/60 border border-emerald-500/40 rounded-3xl p-5 text-center flex flex-col sm:flex-row items-center justify-center gap-3 shadow-xl">
          <FaTrophy className="text-amber-400 text-3xl" />
          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Better Outdoor Destination Today</span>
            <span className="text-xl font-extrabold text-white">{winner}</span>
            <span className="text-xs text-white/70 block mt-0.5">Higher overall atmospheric comfort score ({Math.max(comfort1, comfort2)}/100)</span>
          </div>
        </div>
      )}

      {/* Dual Search & Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/20">
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-3">Destination 1</h2>
            <SearchBar onSearch={handleSearch1} isLoading={loading1} />
            {error1 && <p className="text-xs text-rose-400 mt-2">{error1}</p>}
          </div>
          {city1Data && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <WeatherCard weatherData={city1Data} />
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/20">
            <h2 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-3">Destination 2</h2>
            <SearchBar onSearch={handleSearch2} isLoading={loading2} />
            {error2 && <p className="text-xs text-rose-400 mt-2">{error2}</p>}
          </div>
          {city2Data && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <WeatherCard weatherData={city2Data} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Metric Table */}
      {city1Data && city2Data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4 overflow-hidden"
        >
          <h3 className="text-xl font-bold text-white text-center">Head-to-Head Intelligence Matrix</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white">
              <thead>
                <tr className="border-b border-white/15 text-white/60 text-xs uppercase font-bold">
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4 text-center">{city1Data.location}</th>
                  <th className="py-3 px-4 text-center">Variance</th>
                  <th className="py-3 px-4 text-center">{city2Data.location}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white/80">Weather Comfort Index</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-300">{comfort1}/100</td>
                  <td className="py-3 px-4 text-center">{getDiffText(comfort1, comfort2, 'pts')}</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-300">{comfort2}/100</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-white/80">Temperature</td>
                  <td className="py-3 px-4 text-center font-bold text-lg">{formatTemp(city1Data.temperature)}</td>
                  <td className="py-3 px-4 text-center">{getDiffText(city1Data.temperature, city2Data.temperature, '°')}</td>
                  <td className="py-3 px-4 text-center font-bold text-lg">{formatTemp(city2Data.temperature)}</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-white/80">Humidity</td>
                  <td className="py-3 px-4 text-center">{city1Data.humidity}%</td>
                  <td className="py-3 px-4 text-center">{getDiffText(city1Data.humidity, city2Data.humidity, '%')}</td>
                  <td className="py-3 px-4 text-center">{city2Data.humidity}%</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-white/80">Wind Speed</td>
                  <td className="py-3 px-4 text-center">{formatSpeed(city1Data.windSpeed)}</td>
                  <td className="py-3 px-4 text-center">{getDiffText(city1Data.windSpeed, city2Data.windSpeed, 'km/h')}</td>
                  <td className="py-3 px-4 text-center">{formatSpeed(city2Data.windSpeed)}</td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-semibold text-white/80">UV Index</td>
                  <td className="py-3 px-4 text-center font-bold">{city1Data.uvIndex}</td>
                  <td className="py-3 px-4 text-center">{getDiffText(city1Data.uvIndex, city2Data.uvIndex, '')}</td>
                  <td className="py-3 px-4 text-center font-bold">{city2Data.uvIndex}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
