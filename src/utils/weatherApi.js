/**
 * OpenWeatherMap API Integration
 * Free weather API from OpenWeatherMap.org
 */

// Get API key from environment variable or use default
// To get your own free API key: https://home.openweathermap.org/api_keys
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Extract city name from user message
 * @param {string} message - User's message
 * @returns {string|null} - Extracted city name or null
 */
export const extractCityFromMessage = (message) => {

  
  // Common patterns - order matters, more specific first
  const patterns = [
    /weather in (.+?)(?:\?|$|\.|,)/i,
    /weather at (.+?)(?:\?|$|\.|,)/i,
    /weather for (.+?)(?:\?|$|\.|,)/i,
    /temperature in (.+?)(?:\?|$|\.|,)/i,
    /humidity in (.+?)(?:\?|$|\.|,)/i,
    /(.+?) weather/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      let city = match[1].trim();
      // Remove common words that might be captured
      city = city.replace(/^(in|at|for|the)\s+/i, '').trim();
      // Remove trailing punctuation
      city = city.replace(/[?.,!;:]+$/, '').trim();
      if (city.length > 0) {
        return city;
      }
    }
  }

  // If message starts with "in" or "at", try to extract city after it
  if (/^(in|at)\s+/i.test(message)) {
    const city = message.replace(/^(in|at)\s+/i, '').trim();
    if (city.length > 2) {
      return city.replace(/[?.,!;:]+$/, '').trim();
    }
  }

  // If no pattern matches, try to extract the last word/phrase
  const words = message.split(/\s+/);
  if (words.length > 2) {
    // Try last 2-3 words as city name, but skip if it starts with "in", "at", "for"
    let possibleCity = words.slice(-2).join(' ').replace(/[?.,!;:]/g, '').trim();
    possibleCity = possibleCity.replace(/^(in|at|for)\s+/i, '').trim();
    if (possibleCity.length > 2) {
      return possibleCity;
    }
  }

  return null;
};

/**
 * Fetch current weather from OpenWeatherMap
 * @param {string} city - City name
 * @returns {Promise<Object>} - Weather data
 */
export const fetchWeatherData = async (city) => {
  if (!city) {
    throw new Error('City name is required');
  }

  const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 404) {
        throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
      } else if (response.status === 401) {
        const errorMsg = errorData.message || 'Invalid API key';
        throw new Error(`${errorMsg}. Please get a free API key from https://home.openweathermap.org/api_keys and add it to your .env file as VITE_OPENWEATHER_API_KEY=your_key_here`);
      } else {
        throw new Error(errorData.message || `Failed to fetch weather data: ${response.statusText}`);
      }
    }

    const data = await response.json();
    return formatWeatherResponse(data);
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

/**
 * Fetch Air Quality Index (AQI)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} - AQI data
 */
export const fetchAirQuality = async (lat, lon) => {
  const url = `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data.list[0];
  } catch (error) {
    console.warn('AQI fetch error:', error);
    return null;
  }
};

/**
 * Get city name from coordinates (Reverse Geocoding)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<string>} - City name
 */
export const fetchReverseGeocoding = async (lat, lon) => {
  const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0].name;
    }
    return null;
  } catch (error) {
    console.warn('Reverse geocoding error:', error);
    return null;
  }
};

/**
 * Fetch 5-day forecast from OpenWeatherMap
 * @param {string} city - City name
 * @returns {Promise<Object>} - Forecast data
 */
export const fetchForecastData = async (city) => {
  if (!city) {
    throw new Error('City name is required');
  }

  const url = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // We don't throw here to avoid breaking the main weather display if forecast fails
      console.warn('Forecast fetch failed');
      return null;
    }

    const data = await response.json();
    return formatForecastResponse(data);
  } catch (error) {
    console.warn('Forecast fetch error:', error);
    return null;
  }
};

/**
 * Format OpenWeatherMap forecast response
 * @param {Object} data - Raw OpenWeatherMap API response
 * @returns {Array} - Formatted forecast data (daily)
 */
const formatForecastResponse = (data) => {
  // Filter for one reading per day (e.g., noon) to simulate daily forecast
  // The API returns data every 3 hours
  const dailyData = [];
  const seenDates = new Set();

  for (const item of data.list) {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    // We want the reading closest to noon (12:00)
    // Or just the first reading of a new day if we haven't seen it
    if (!seenDates.has(date)) {
      seenDates.add(date);
      dailyData.push({
        date: new Date(item.dt * 1000),
        temp: Math.round(item.main.temp),
        conditions: item.weather[0].main,
        icon: item.weather[0].icon,
        description: item.weather[0].description
      });
    }
    
    if (dailyData.length >= 5) break;
  }

  return dailyData;
};

/**
 * Format OpenWeatherMap response to match our UI format
 * @param {Object} data - Raw OpenWeatherMap API response
 * @returns {Object} - Formatted weather data
 */
const formatWeatherResponse = (data) => {
  return {
    location: `${data.name}, ${data.sys.country}`,
    conditions: data.weather[0].main,
    description: data.weather[0].description,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    windGust: data.wind.gust ? Math.round(data.wind.gust * 3.6) : Math.round(data.wind.speed * 3.6),
    pressure: data.main.pressure,
    visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : null,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
    icon: data.weather[0].icon,
    coord: data.coord, // Add coordinates for AQI
  };
};

/**
 * Generate a friendly weather message
 * @param {Object} weather - Formatted weather data
 * @returns {string} - Friendly message
 */
export const generateWeatherMessage = (weather) => {
  const { location, conditions, temperature, feelsLike, humidity, windSpeed, windGust } = weather;
  
  return `The current weather in ${location} is ${conditions.toLowerCase()}. The temperature is ${temperature}°C but feels like ${feelsLike}°C due to the humidity of ${humidity}%. Wind speed is ${windSpeed} km/h${windGust > windSpeed ? ` with gusts up to ${windGust} km/h` : ''}.`;
};

