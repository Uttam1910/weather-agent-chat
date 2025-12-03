import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWeatherData, fetchForecastData, fetchAirQuality } from '../utils/weatherApi';
import WeatherDashboard from '../components/WeatherDashboard';
import ErrorMessage from '../components/ErrorMessage';
import SEO from '../components/SEO';
import { ImSpinner8 } from 'react-icons/im';

export default function CityDetails() {
  const { city } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
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
        const forecastData = await fetchForecastData(city);
        
        let aqiData = null;
        if (weatherData.coord) {
          aqiData = await fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon);
        }

        setWeather(weatherData);
        setForecast(forecastData);
        setAqi(aqiData); 
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [city]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ImSpinner8 className="text-4xl text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <ErrorMessage message={error} onRetry={() => navigate('/')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <SEO 
        title={`Weather in ${weather?.location}`} 
        description={`Detailed weather forecast for ${weather?.location}.`} 
      />
      <WeatherDashboard weatherData={weather} forecastData={forecast} aqiData={aqi} />
    </div>
  );
}
