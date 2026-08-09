/**
 * WeatherProvider.js
 * Weather Data Provider Abstraction Layer
 * Interfaces with Open-Meteo APIs (Forecast, Air Quality, Marine, Historical)
 * Implements 15-minute in-memory caching, request deduplication, and error resilience.
 */

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const weatherCache = new Map();

/**
 * Cache helper
 */
const getCachedData = (key) => {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  weatherCache.set(key, { timestamp: Date.now(), data });
};

/**
 * Fetch City Suggestions (Geocoding)
 */
export const fetchCitySuggestions = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const cacheKey = `geo_${query.trim().toLowerCase()}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];
    const results = data.results.map((item) => ({
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      displayLabel: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}${item.country ? `, ${item.country}` : ''}`,
    }));
    setCachedData(cacheKey, results);
    return results;
  } catch (error) {
    console.warn('Geocoding search failed:', error);
    return [];
  }
};

/**
 * Reverse Geocode Coordinates
 */
export const fetchReverseGeocoding = async (lat, lon) => {
  const cacheKey = `rev_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
    const country = data.countryName ? `, ${data.countryName}` : '';
    const result = `${city}${country}`;
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Reverse geocoding error:', error);
    return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
  }
};

/**
 * Fetch Full Weather Data from Open-Meteo
 */
export const fetchWeatherData = async (cityOrCoords) => {
  let lat, lon, locationName, countryName;

  if (typeof cityOrCoords === 'object' && cityOrCoords.lat !== undefined) {
    lat = cityOrCoords.lat;
    lon = cityOrCoords.lon;
    locationName = cityOrCoords.name || (await fetchReverseGeocoding(lat, lon));
  } else if (typeof cityOrCoords === 'string') {
    const suggestions = await fetchCitySuggestions(cityOrCoords);
    if (suggestions.length === 0) {
      throw new Error(`City "${cityOrCoords}" not found. Please check spelling.`);
    }
    const first = suggestions[0];
    lat = first.latitude;
    lon = first.longitude;
    locationName = first.displayLabel;
    countryName = first.country;
  } else {
    throw new Error('Invalid city or coordinates');
  }

  const cacheKey = `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_gusts_10m,uv_index,evapotranspiration,soil_temperature_0cm,soil_moisture_0_to_1cm&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const res = await fetch(forecastUrl);
    if (!res.ok) throw new Error('Open-Meteo weather fetch failed');
    const data = await res.json();

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const now = new Date();
    const currentHourIndex = hourly.time ? hourly.time.findIndex((t) => new Date(t).getHours() === now.getHours()) : 0;
    const safeIdx = currentHourIndex >= 0 ? currentHourIndex : 0;

    const uvIndex = hourly.uv_index && safeIdx < hourly.uv_index.length ? Math.round(hourly.uv_index[safeIdx] || 0) : 3;

    // Hourly forecast list
    const hourlyList = [];
    if (hourly.time) {
      for (let i = safeIdx; i < Math.min(hourly.time.length, safeIdx + 24); i++) {
        hourlyList.push({
          time: new Date(hourly.time[i]),
          temp: Math.round(hourly.temperature_2m[i]),
          feelsLike: Math.round(hourly.apparent_temperature[i] || hourly.temperature_2m[i]),
          humidity: Math.round(hourly.relative_humidity_2m[i] || 50),
          dewPoint: Math.round(hourly.dew_point_2m ? hourly.dew_point_2m[i] : hourly.temperature_2m[i] - 4),
          pop: Math.round(hourly.precipitation_probability ? hourly.precipitation_probability[i] || 0 : 0),
          precipitation: hourly.precipitation ? hourly.precipitation[i] || 0 : 0,
          windSpeed: Math.round(hourly.wind_speed_10m[i] || 0),
          windGust: Math.round(hourly.wind_gusts_10m ? hourly.wind_gusts_10m[i] || 0 : 0),
          uv: Math.round(hourly.uv_index ? hourly.uv_index[i] || 0 : 0),
          cloudCover: Math.round(hourly.cloud_cover ? hourly.cloud_cover[i] || 0 : 0),
          visibility: hourly.visibility ? (hourly.visibility[i] / 1000).toFixed(1) : 10.0,
          weatherCode: hourly.weather_code ? hourly.weather_code[i] : 0,
        });
      }
    }

    // Daily 7-day forecast
    const dailyList = [];
    if (daily.time) {
      for (let i = 0; i < daily.time.length; i++) {
        dailyList.push({
          date: new Date(daily.time[i]),
          tempMax: Math.round(daily.temperature_2m_max[i]),
          tempMin: Math.round(daily.temperature_2m_min[i]),
          temp: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
          pop: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[i] || 0 : 0),
          uvMax: Math.round(daily.uv_index_max ? daily.uv_index_max[i] || 0 : 0),
          sunrise: daily.sunrise ? new Date(daily.sunrise[i]) : null,
          sunset: daily.sunset ? new Date(daily.sunset[i]) : null,
          weatherCode: daily.weather_code ? daily.weather_code[i] : 0,
        });
      }
    }

    const result = {
      location: locationName,
      country: countryName || '',
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature || current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m || 50),
      windSpeed: Math.round(current.wind_speed_10m || 0),
      windGust: Math.round(current.wind_gusts_10m || current.wind_speed_10m || 0),
      windDirection: Math.round(current.wind_direction_10m || 0),
      pressure: Math.round(current.pressure_msl || current.surface_pressure || 1013),
      cloudCover: Math.round(current.cloud_cover || 0),
      visibility: hourly.visibility && safeIdx < hourly.visibility.length ? (hourly.visibility[safeIdx] / 1000).toFixed(1) : '10.0',
      dewPoint: hourly.dew_point_2m && safeIdx < hourly.dew_point_2m.length ? Math.round(hourly.dew_point_2m[safeIdx]) : Math.round(current.temperature_2m - 5),
      evapotranspiration: hourly.evapotranspiration && safeIdx < hourly.evapotranspiration.length ? hourly.evapotranspiration[safeIdx] : 0,
      soilMoisture: hourly.soil_moisture_0_to_1cm && safeIdx < hourly.soil_moisture_0_to_1cm.length ? hourly.soil_moisture_0_to_1cm[safeIdx] : 0.25,
      weatherCode: current.weather_code || 0,
      uvIndex: uvIndex,
      isDay: current.is_day === 1,
      sunrise: daily.sunrise && daily.sunrise[0] ? new Date(daily.sunrise[0]) : new Date(),
      sunset: daily.sunset && daily.sunset[0] ? new Date(daily.sunset[0]) : new Date(),
      coord: { lat, lon },
      hourly: hourlyList,
      forecast: dailyList,
    };

    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw new Error('Weather data temporarily unavailable. Please check spelling or connection.');
  }
};

/**
 * Fetch Air Quality Data
 */
export const fetchAirQualityData = async (lat, lon) => {
  const cacheKey = `aqi_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const cur = data.current || {};
    const result = {
      aqi: cur.us_aqi || Math.round((cur.pm2_5 || 10) * 2),
      pm2_5: Math.round(cur.pm2_5 || 0),
      pm10: Math.round(cur.pm10 || 0),
      o3: Math.round(cur.ozone || 0),
      no2: Math.round(cur.nitrogen_dioxide || 0),
      so2: Math.round(cur.sulphur_dioxide || 0),
      co: Math.round(cur.carbon_monoxide || 0),
      dust: Math.round(cur.dust || 0),
    };
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('AQI fetch failed:', error);
    return null;
  }
};

/**
 * Fetch Marine Weather (Coastal Locations)
 */
export const fetchMarineWeather = async (lat, lon) => {
  const cacheKey = `marine_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,ocean_current_velocity`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const cur = data.current;
    if (!cur || cur.wave_height === undefined || cur.wave_height === null) return null;
    const result = {
      waveHeight: parseFloat(cur.wave_height.toFixed(1)),
      waveDirection: Math.round(cur.wave_direction || 0),
      wavePeriod: Math.round(cur.wave_period || 0),
      swellHeight: parseFloat((cur.swell_wave_height || cur.wave_height).toFixed(1)),
    };
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    // Non-coastal location or marine API silent fallback
    return null;
  }
};

/**
 * Fetch Historical Weather Data (Open-Meteo Historical Archive API)
 */
export const fetchHistoricalComparison = async (lat, lon) => {
  const cacheKey = `hist_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const pastYear = new Date().getFullYear() - 5; // 5 years historical average date
    const todayMonthDay = new Date().toISOString().slice(5, 10);
    const startDate = `${pastYear}-${todayMonthDay}`;
    const endDate = `${pastYear}-${todayMonthDay}`;

    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const daily = data.daily;
    if (!daily || !daily.temperature_2m_max || daily.temperature_2m_max.length === 0) return null;

    const histMax = Math.round(daily.temperature_2m_max[0]);
    const histMin = Math.round(daily.temperature_2m_min[0]);
    const histRain = daily.precipitation_sum[0] || 0;

    const result = {
      historicalMaxTemp: histMax,
      historicalMinTemp: histMin,
      historicalAvgTemp: Math.round((histMax + histMin) / 2),
      historicalRainSum: histRain,
      yearsAgo: 5,
    };
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Historical weather fetch error:', error);
    return null;
  }
};
