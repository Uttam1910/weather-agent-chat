import { trackApiCall } from '../../admin/analytics/tracker';

const CACHE_TTL_MS = 15 * 60 * 1000;
const weatherCache = new Map();

function getCacheKey(locationKey) {
  return typeof locationKey === 'string'
    ? locationKey.toLowerCase().trim()
    : `${locationKey.lat?.toFixed(2)}_${locationKey.lon?.toFixed(2)}`;
}

export async function fetchGeocoding(cityName) {
  const start = Date.now();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  try {
    const res = await fetch(url);
    const duration = Date.now() - start;
    if (!res.ok) {
      trackApiCall('/geocoding', 'open-meteo-geocoding', duration, 'error');
      throw new Error(`Location search failed for "${cityName}".`);
    }
    trackApiCall('/geocoding', 'open-meteo-geocoding', duration, 'success');
    const data = await res.json();
    if (!data.results || data.results.length === 0) {
      throw new Error(`Location "${cityName}" not found.`);
    }
    return data.results[0];
  } catch (err) {
    trackApiCall('/geocoding', 'open-meteo-geocoding', Date.now() - start, 'error');
    throw err;
  }
}

export async function fetchReverseGeocoding(lat, lon) {
  const start = Date.now();
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  try {
    const res = await fetch(url);
    const duration = Date.now() - start;
    if (!res.ok) {
      trackApiCall('/reverse-geocode', 'bigdatacloud', duration, 'error');
      return 'Current Location';
    }
    trackApiCall('/reverse-geocode', 'bigdatacloud', duration, 'success');
    const data = await res.json();
    return data.city || data.locality || data.principalSubdivision || 'Current Location';
  } catch (err) {
    trackApiCall('/reverse-geocode', 'bigdatacloud', Date.now() - start, 'error');
    return 'Current Location';
  }
}

export async function fetchWeatherData(locationInput) {
  const cacheKey = getCacheKey(locationInput);
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let lat, lon, locationName, countryName;

  if (typeof locationInput === 'string') {
    const geo = await fetchGeocoding(locationInput);
    lat = geo.latitude;
    lon = geo.longitude;
    locationName = geo.name;
    countryName = geo.country;
  } else if (typeof locationInput === 'object' && locationInput.lat && locationInput.lon) {
    lat = locationInput.lat;
    lon = locationInput.lon;
    locationName = locationInput.name || (await fetchReverseGeocoding(lat, lon));
    countryName = locationInput.country || '';
  } else {
    throw new Error('Invalid location parameters provided.');
  }

  const start = Date.now();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,dew_point_2m,uv_index,is_day,et0_fao_evapotranspiration,soil_moisture_0_to_1cm&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index,cloud_cover,dew_point_2m&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;

  try {
    const res = await fetch(url);
    const duration = Date.now() - start;

    if (!res.ok) {
      trackApiCall('/forecast', 'open-meteo-forecast', duration, 'error');
      throw new Error(`Failed to fetch forecast data for ${locationName}.`);
    }

    trackApiCall('/forecast', 'open-meteo-forecast', duration, 'success');
    const data = await res.json();
    const normalized = normalizeWeatherData(data, locationName, countryName, lat, lon);

    weatherCache.set(cacheKey, { timestamp: Date.now(), data: normalized });
    return normalized;
  } catch (err) {
    trackApiCall('/forecast', 'open-meteo-forecast', Date.now() - start, 'error');
    throw err;
  }
}

export async function fetchAirQualityData(lat, lon) {
  const start = Date.now();
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust&timezone=auto`;

  try {
    const res = await fetch(url);
    const duration = Date.now() - start;

    if (!res.ok) {
      trackApiCall('/air-quality', 'open-meteo-air-quality', duration, 'error');
      return null;
    }

    trackApiCall('/air-quality', 'open-meteo-air-quality', duration, 'success');
    const data = await res.json();
    return normalizeAqiData(data);
  } catch (err) {
    trackApiCall('/air-quality', 'open-meteo-air-quality', Date.now() - start, 'error');
    return null;
  }
}

export async function fetchMarineData(lat, lon) {
  const start = Date.now();
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period&timezone=auto`;

  try {
    const res = await fetch(url);
    const duration = Date.now() - start;

    if (!res.ok) {
      trackApiCall('/marine', 'open-meteo-marine', duration, 'error');
      return null;
    }

    trackApiCall('/marine', 'open-meteo-marine', duration, 'success');
    const data = await res.json();
    return data.current || null;
  } catch (err) {
    trackApiCall('/marine', 'open-meteo-marine', Date.now() - start, 'error');
    return null;
  }
}

export const fetchMarineWeather = fetchMarineData;

export async function fetchHistoricalData(lat, lon, startDate, endDate) {
  const start = Date.now();
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;

  try {
    const res = await fetch(url);
    const duration = Date.now() - start;

    if (!res.ok) {
      trackApiCall('/historical', 'open-meteo-historical', duration, 'error');
      return null;
    }

    trackApiCall('/historical', 'open-meteo-historical', duration, 'success');
    return await res.json();
  } catch (err) {
    trackApiCall('/historical', 'open-meteo-historical', Date.now() - start, 'error');
    return null;
  }
}

export async function fetchHistoricalComparison(lat, lon) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const monthDay = today.toISOString().split('T')[0].substring(5);

  const startDate = `${currentYear - 5}-${monthDay}`;
  const endDate = `${currentYear - 1}-${monthDay}`;

  return await fetchHistoricalData(lat, lon, startDate, endDate);
}

function normalizeWeatherData(data, locationName, countryName, lat, lon) {
  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  const weatherCode = current.weather_code ?? 0;
  const weatherMeta = getWeatherMeta(weatherCode);

  return {
    location: locationName,
    country: countryName,
    coord: { lat, lon },
    temperature: Math.round(current.temperature_2m ?? 0),
    feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 0),
    humidity: current.relative_humidity_2m ?? 0,
    windSpeed: Math.round(current.wind_speed_10m ?? 0),
    windDirection: current.wind_direction_10m ?? 0,
    windGust: Math.round(current.wind_gusts_10m ?? 0),
    pressure: current.surface_pressure ? Math.round(current.surface_pressure) : 1013,
    cloudCover: current.cloud_cover ?? 0,
    dewPoint: current.dew_point_2m ?? 12,
    uvIndex: current.uv_index ?? 0,
    evapotranspiration: current.et0_fao_evapotranspiration ?? 0.2,
    soilMoisture: current.soil_moisture_0_to_1cm ?? 0.25,
    isDay: current.is_day === 1,
    conditions: weatherMeta.description,
    icon: weatherMeta.icon,
    weatherCode: weatherCode,

    sunrise: daily.sunrise?.[0] ? daily.sunrise[0].split('T')[1] : '06:00',
    sunset: daily.sunset?.[0] ? daily.sunset[0].split('T')[1] : '18:00',
    tempMax: daily.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : 25,
    tempMin: daily.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : 15,
    uvMax: daily.uv_index_max?.[0] ?? 5,

    hourly: (hourly.time || []).slice(0, 24).map((t, idx) => ({
      time: t.split('T')[1],
      fullTime: t,
      temp: Math.round(hourly.temperature_2m?.[idx] ?? 0),
      humidity: hourly.relative_humidity_2m?.[idx] ?? 0,
      precipProb: hourly.precipitation_probability?.[idx] ?? 0,
      precip: hourly.precipitation?.[idx] ?? 0,
      windSpeed: Math.round(hourly.wind_speed_10m?.[idx] ?? 0),
      weatherCode: hourly.weather_code?.[idx] ?? 0,
      uvIndex: hourly.uv_index?.[idx] ?? 0,
      cloudCover: hourly.cloud_cover?.[idx] ?? 0,
      dewPoint: hourly.dew_point_2m?.[idx] ?? 12,
    })),

    forecast: (daily.time || []).slice(0, 7).map((d, idx) => {
      const code = daily.weather_code?.[idx] ?? 0;
      const meta = getWeatherMeta(code);
      return {
        date: d,
        day: new Date(d).toLocaleDateString('en-US', { weekday: 'short' }),
        maxTemp: Math.round(daily.temperature_2m_max?.[idx] ?? 0),
        minTemp: Math.round(daily.temperature_2m_min?.[idx] ?? 0),
        precipSum: daily.precipitation_sum?.[idx] ?? 0,
        precipProbMax: daily.precipitation_probability_max?.[idx] ?? 0,
        conditions: meta.description,
        icon: meta.icon,
        weatherCode: code,
      };
    }),
  };
}

function normalizeAqiData(data) {
  const current = data.current || {};
  const aqiVal = current.us_aqi ?? 35;

  let level = 'Good';
  let color = 'text-emerald-400';
  let desc = 'Air quality is satisfactory and poses little to no risk.';

  if (aqiVal > 300) {
    level = 'Hazardous';
    color = 'text-purple-400';
    desc = 'Health warning of emergency conditions.';
  } else if (aqiVal > 200) {
    level = 'Very Unhealthy';
    color = 'text-rose-400';
    desc = 'Health alert: Everyone may experience more serious health effects.';
  } else if (aqiVal > 150) {
    level = 'Unhealthy';
    color = 'text-red-400';
    desc = 'Everyone may begin to experience health effects.';
  } else if (aqiVal > 100) {
    level = 'Unhealthy for Sensitive Groups';
    color = 'text-orange-400';
    desc = 'Members of sensitive groups may experience health effects.';
  } else if (aqiVal > 50) {
    level = 'Moderate';
    color = 'text-amber-400';
    desc = 'Air quality is acceptable for most people.';
  }

  return {
    aqi: aqiVal,
    level,
    color,
    description: desc,
    pm25: current.pm2_5 ? Math.round(current.pm2_5) : null,
    pm10: current.pm10 ? Math.round(current.pm10) : null,
    o3: current.ozone ? Math.round(current.ozone) : null,
    no2: current.nitrogen_dioxide ? Math.round(current.nitrogen_dioxide) : null,
    so2: current.sulphur_dioxide ? Math.round(current.sulphur_dioxide) : null,
    co: current.carbon_monoxide ? Math.round(current.carbon_monoxide) : null,
    dust: current.dust ? Math.round(current.dust) : null,
  };
}

function getWeatherMeta(code) {
  switch (code) {
    case 0:
      return { description: 'Clear Sky', icon: '☀️' };
    case 1:
      return { description: 'Mainly Clear', icon: '🌤️' };
    case 2:
      return { description: 'Partly Cloudy', icon: '⛅' };
    case 3:
      return { description: 'Overcast', icon: '☁️' };
    case 45:
    case 48:
      return { description: 'Foggy', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { description: 'Light Drizzle', icon: '🌦️' };
    case 61:
    case 63:
    case 65:
      return { description: 'Rain', icon: '🌧️' };
    case 71:
    case 73:
    case 75:
      return { description: 'Snow', icon: '❄️' };
    case 80:
    case 81:
    case 82:
      return { description: 'Rain Showers', icon: '🌧️' };
    case 95:
    case 96:
    case 99:
      return { description: 'Thunderstorm', icon: '⛈️' };
    default:
      return { description: 'Variable Weather', icon: '🌤️' };
  }
}
