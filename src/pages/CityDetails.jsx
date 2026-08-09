import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWeatherData, fetchAirQuality } from '../utils/weatherApi';
import WeatherDashboard from '../components/WeatherDashboard';
import ErrorMessage from '../components/ErrorMessage';
import SEO from '../components/SEO';
import SearchBar from '../components/SearchBar';
import { ImSpinner8 } from 'react-icons/im';

export default function CityDetails() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!city) return;
      setLoading(true);
      setError(null);
      try {
        const weatherData = await fetchWeatherData(city);
        let aqiData = null;
        if (weatherData.coord) {
          aqiData = await fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon);
        }

        setWeather(weatherData);
        setAqi(aqiData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [city]);

  const handleSearchNew = (newCity) => {
    if (typeof newCity === 'string') {
      navigate(`/weather/${encodeURIComponent(newCity)}`);
    } else if (typeof newCity === 'object' && newCity.name) {
      navigate(`/weather/${encodeURIComponent(newCity.name)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <ImSpinner8 className="text-5xl text-purple-400 animate-spin" />
        <p className="text-white/70 text-sm font-medium">Fetching real-time weather & air quality data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 px-4 max-w-xl mx-auto space-y-6">
        <ErrorMessage message={error} onRetry={() => navigate('/')} />
        <div className="text-center">
          <p className="text-white/60 text-xs mb-3">Try searching another city:</p>
          <SearchBar onSearch={handleSearchNew} isLoading={false} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <SEO
        title={`Weather in ${weather?.location}`}
        description={`Detailed 24-hour weather forecast, air quality index, and AI weather insights for ${weather?.location}.`}
      />
      <div className="mb-6 px-4 max-w-xl mx-auto">
        <SearchBar onSearch={handleSearchNew} isLoading={false} />
      </div>

      <WeatherDashboard weatherData={weather} forecastData={weather?.forecast} aqiData={aqi} />
    </div>
  );
}
