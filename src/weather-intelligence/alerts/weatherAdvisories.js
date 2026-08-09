/**
 * weatherAdvisories.js
 * Weather Advisory Engine
 * Generates non-alarmist, threshold-based Weather Advisories.
 */

export const generateWeatherAdvisories = (weather) => {
  if (!weather) return [];

  const {
    temperature = 20,
    feelsLike = 20,
    windGust = 10,
    uvIndex = 3,
    visibility = 10,
    weatherCode = 0,
  } = weather;

  const advisories = [];

  if (weatherCode >= 95) {
    advisories.push({
      type: 'storm',
      severity: 'high',
      title: 'Thunderstorm Advisory',
      desc: 'Lightning activity detected in region. Seek indoor shelter during electrical storms.',
    });
  }

  if (uvIndex >= 8) {
    advisories.push({
      type: 'uv',
      severity: 'moderate',
      title: 'High UV Advisory',
      desc: `UV Index is ${uvIndex}. Apply SPF 30+ sunscreen and wear protective eyewear during peak daylight hours.`,
    });
  }

  if (feelsLike >= 35) {
    advisories.push({
      type: 'heat',
      severity: 'moderate',
      title: 'Heat & Hydration Advisory',
      desc: `Apparent temperature is ${feelsLike}°C. Hydrate frequently during outdoor activities.`,
    });
  }

  if (windGust >= 45) {
    advisories.push({
      type: 'wind',
      severity: 'moderate',
      title: 'High Wind Gust Advisory',
      desc: `Wind gusts up to ${windGust} km/h. Secure loose outdoor objects and exercise caution when driving.`,
    });
  }

  if (parseFloat(visibility) < 3) {
    advisories.push({
      type: 'fog',
      severity: 'moderate',
      title: 'Low Visibility Advisory',
      desc: `Atmospheric visibility is reduced to ${visibility} km. Use fog lights when driving.`,
    });
  }

  return advisories;
};
