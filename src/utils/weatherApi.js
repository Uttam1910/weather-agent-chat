/**
 * Weather API Integration
 * Supports Open-Meteo (Zero-Key Free API) & OpenWeatherMap (Key Optional)
 */

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * WMO Weather interpretation codes (Open-Meteo)
 */
export const WMO_WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: '01d', condition: 'clear' },
  1: { label: 'Mainly Clear', icon: '02d', condition: 'clear' },
  2: { label: 'Partly Cloudy', icon: '03d', condition: 'clouds' },
  3: { label: 'Overcast', icon: '04d', condition: 'clouds' },
  45: { label: 'Foggy', icon: '50d', condition: 'clouds' },
  48: { label: 'Depositing Rime Fog', icon: '50d', condition: 'clouds' },
  51: { label: 'Light Drizzle', icon: '09d', condition: 'rain' },
  53: { label: 'Moderate Drizzle', icon: '09d', condition: 'rain' },
  55: { label: 'Dense Drizzle', icon: '09d', condition: 'rain' },
  61: { label: 'Slight Rain', icon: '10d', condition: 'rain' },
  63: { label: 'Moderate Rain', icon: '10d', condition: 'rain' },
  65: { label: 'Heavy Rain', icon: '10d', condition: 'rain' },
  71: { label: 'Slight Snow', icon: '13d', condition: 'snow' },
  73: { label: 'Moderate Snow', icon: '13d', condition: 'snow' },
  75: { label: 'Heavy Snow', icon: '13d', condition: 'snow' },
  80: { label: 'Rain Showers', icon: '09d', condition: 'rain' },
  81: { label: 'Heavy Rain Showers', icon: '09d', condition: 'rain' },
  82: { label: 'Violent Rain Showers', icon: '09d', condition: 'rain' },
  85: { label: 'Snow Showers', icon: '13d', condition: 'snow' },
  86: { label: 'Heavy Snow Showers', icon: '13d', condition: 'snow' },
  95: { label: 'Thunderstorm', icon: '11d', condition: 'thunderstorm' },
  96: { label: 'Thunderstorm with Hail', icon: '11d', condition: 'thunderstorm' },
  99: { label: 'Heavy Thunderstorm', icon: '11d', condition: 'thunderstorm' },
};

/**
 * Get WMO Weather details
 */

export const getWeatherMeta = (code, isDay = 1) => {
  const meta = WMO_WEATHER_CODES[code] || { label: 'Partly Cloudy', icon: '02d', condition: 'clouds' };
  let icon = meta.icon;
  if (!isDay && icon.endsWith('d')) {
    icon = icon.replace('d', 'n');
  }
  return { ...meta, icon };
};

/**
 * Fetch city search suggestions using Open-Meteo Geocoding API
 */
export const fetchCitySuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    return data.results.map((item) => ({
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      displayLabel: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}${item.country ? `, ${item.country}` : ''}`,
    }));
  } catch (error) {
    console.warn('City suggestions fetch failed:', error);
    return [];
  }
};

/**
 * Extract city name from user prompt
 */
export const extractCityFromMessage = (message) => {
  if (!message) return null;
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
      city = city.replace(/^(in|at|for|the)\s+/i, '').trim();
      city = city.replace(/[?.,!;:]+$/, '').trim();
      if (city.length > 0) return city;
    }
  }

  if (/^(in|at)\s+/i.test(message)) {
    const city = message.replace(/^(in|at)\s+/i, '').trim();
    if (city.length > 2) return city.replace(/[?.,!;:]+$/, '').trim();
  }

  const words = message.split(/\s+/);
  if (words.length > 0) {
    return words[words.length - 1].replace(/[?.,!;:]/g, '').trim();
  }

  return null;
};

/**
 * Reverse geocode coordinates to location name
 */
export const fetchReverseGeocoding = async (lat, lon) => {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
    const country = data.countryName ? `, ${data.countryName}` : '';
    return `${city}${country}`;
  } catch (error) {
    console.warn('Reverse geocoding error:', error);
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  }
};

/**
 * Geocode city name to lat & lon
 */
export const geocodeCity = async (cityName) => {
  const suggestions = await fetchCitySuggestions(cityName);
  if (suggestions.length > 0) {
    const first = suggestions[0];
    return {
      lat: first.latitude,
      lon: first.longitude,
      name: first.name,
      country: first.country,
      formattedName: `${first.name}${first.country ? `, ${first.country}` : ''}`,
    };
  }
  throw new Error(`City "${cityName}" not found. Please check spelling or try another location.`);
};

/**
 * Fetch Air Quality from Open-Meteo Air Quality API
 */
export const fetchAirQuality = async (lat, lon) => {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const cur = data.current || {};
    return {
      aqi: cur.us_aqi || Math.round((cur.pm2_5 || 10) * 2),
      pm2_5: Math.round(cur.pm2_5 || 0),
      pm10: Math.round(cur.pm10 || 0),
      o3: Math.round(cur.ozone || 0),
      no2: Math.round(cur.nitrogen_dioxide || 0),
      so2: Math.round(cur.sulphur_dioxide || 0),
      co: Math.round(cur.carbon_monoxide || 0),
    };
  } catch (error) {
    console.warn('AQI fetch failed:', error);
    return null;
  }
};

/**
 * Main Weather Fetch Function
 * Uses Open-Meteo API as primary zero-key provider, or OpenWeather if specified/preferred
 */
export const fetchWeatherData = async (cityOrCoords) => {
  let lat, lon, locationName, countryName;

  if (typeof cityOrCoords === 'object' && cityOrCoords.lat !== undefined) {
    lat = cityOrCoords.lat;
    lon = cityOrCoords.lon;
    locationName = cityOrCoords.name || (await fetchReverseGeocoding(lat, lon));
  } else if (typeof cityOrCoords === 'string') {
    const geo = await geocodeCity(cityOrCoords);
    lat = geo.lat;
    lon = geo.lon;
    locationName = geo.formattedName;
    countryName = geo.country;
  } else {
    throw new Error('Invalid city or coordinates provided');
  }

  // Try Open-Meteo Forecast
  try {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const res = await fetch(forecastUrl);
    if (!res.ok) throw new Error('Open-Meteo weather fetch failed');
    const data = await res.json();

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const meta = getWeatherMeta(current.weather_code, current.is_day);

    // Calculate current UV index from hourly data for current hour
    const now = new Date();
    const currentHourIndex = hourly.time ? hourly.time.findIndex(t => new Date(t).getHours() === now.getHours()) : 0;
    const uvIndex = hourly.uv_index && currentHourIndex >= 0 ? Math.round(hourly.uv_index[currentHourIndex] || 0) : 3;

    // Convert hourly forecast into list
    const hourlyList = [];
    if (hourly.time) {
      const startIdx = Math.max(0, currentHourIndex >= 0 ? currentHourIndex : 0);
      for (let i = startIdx; i < Math.min(hourly.time.length, startIdx + 24); i++) {
        const hMeta = getWeatherMeta(hourly.weather_code[i], 1);
        hourlyList.push({
          time: new Date(hourly.time[i]),
          temp: Math.round(hourly.temperature_2m[i]),
          feelsLike: Math.round(hourly.apparent_temperature[i] || hourly.temperature_2m[i]),
          humidity: Math.round(hourly.relative_humidity_2m[i] || 50),
          pop: Math.round(hourly.precipitation_probability ? hourly.precipitation_probability[i] || 0 : 0),
          windSpeed: Math.round(hourly.wind_speed_10m[i] || 0),
          uv: Math.round(hourly.uv_index ? hourly.uv_index[i] || 0 : 0),
          condition: hMeta.condition,
          description: hMeta.label,
          icon: hMeta.icon,
        });
      }
    }

    // Convert 7-day daily forecast
    const dailyList = [];
    if (daily.time) {
      for (let i = 0; i < daily.time.length; i++) {
        const dMeta = getWeatherMeta(daily.weather_code[i], 1);
        dailyList.push({
          date: new Date(daily.time[i]),
          tempMax: Math.round(daily.temperature_2m_max[i]),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          temp: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
          pop: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[i] || 0 : 0),
          uvMax: Math.round(daily.uv_index_max ? daily.uv_index_max[i] || 0 : 0),
          sunrise: daily.sunrise ? new Date(daily.sunrise[i]) : null,
          sunset: daily.sunset ? new Date(daily.sunset[i]) : null,
          conditions: dMeta.condition,
          description: dMeta.label,
          icon: dMeta.icon,
        });
      }
    }

    const sunrise = daily.sunrise && daily.sunrise[0] ? new Date(daily.sunrise[0]) : new Date(now.setHours(6, 0));
    const sunset = daily.sunset && daily.sunset[0] ? new Date(daily.sunset[0]) : new Date(now.setHours(18, 30));

    return {
      location: locationName,
      country: countryName || '',
      conditions: meta.label,
      conditionType: meta.condition,
      description: meta.label,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature || current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m || 50),
      windSpeed: Math.round(current.wind_speed_10m || 0),
      windGust: Math.round(current.wind_gusts_10m || current.wind_speed_10m || 0),
      windDirection: Math.round(current.wind_direction_10m || 0),
      pressure: Math.round(current.pressure_msl || current.surface_pressure || 1013),
      visibility: hourly.visibility && currentHourIndex >= 0 ? (hourly.visibility[currentHourIndex] / 1000).toFixed(1) : '10.0',
      dewPoint: hourly.dew_point_2m && currentHourIndex >= 0 ? Math.round(hourly.dew_point_2m[currentHourIndex]) : Math.round(current.temperature_2m - 5),
      uvIndex: uvIndex,
      isDay: current.is_day === 1,
      sunrise: sunrise,
      sunset: sunset,
      icon: meta.icon,
      coord: { lat, lon },
      hourly: hourlyList,
      forecast: dailyList,
    };
  } catch (err) {
    console.error('Error fetching Open-Meteo weather:', err);
    throw new Error('Unable to retrieve weather data. Please check connection or city name.');
  }
};

/**
 * Legacy forecast helper for compatibility
 */
export const fetchForecastData = async (city) => {
  const data = await fetchWeatherData(city);
  return data.forecast;
};

/**
 * Generate friendly AI weather insight message
 */
export const generateWeatherMessage = (weather) => {
  const { location, conditions, temperature, feelsLike, humidity, windSpeed, uvIndex } = weather;
  let tip = 'Great day to be out!';
  if (conditions.toLowerCase().includes('rain')) tip = 'Don’t forget your umbrella today!';
  else if (temperature > 30) tip = 'Stay hydrated and wear light cotton clothes!';
  else if (temperature < 10) tip = 'Bundle up with a cozy jacket!';
  else if (uvIndex >= 6) tip = 'High UV levels! Apply sunscreen before heading outside.';

  return `The current weather in ${location} is ${conditions.toLowerCase()} with a temperature of ${temperature}°C (feels like ${feelsLike}°C). Humidity is at ${humidity}% and wind speed is ${windSpeed} km/h. ${tip}`;
};
