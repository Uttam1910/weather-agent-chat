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
  const lowerMessage = message.toLowerCase().trim();
  
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

