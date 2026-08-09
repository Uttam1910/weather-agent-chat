/**
 * riskIndex.js
 * Weather Risk Assessment Engine
 * Evaluates general planning risk (Low, Moderate, High) strictly from physical weather metrics.
 * Note: Not an official emergency warning system.
 */

export const calculateWeatherRisk = (weather) => {
  if (!weather) return { level: 'Low', color: 'text-emerald-400', factors: ['Stable conditions'] };

  const {
    windGust = 10,
    windSpeed = 10,
    weatherCode = 0,
    visibility = 10,
    temperature = 20,
    feelsLike = 20,
  } = weather;

  let riskPoints = 0;
  const factors = [];

  // Wind risk
  if (windGust >= 50 || windSpeed >= 40) {
    riskPoints += 40;
    factors.push(`Severe wind gusts up to ${windGust} km/h`);
  } else if (windGust >= 35) {
    riskPoints += 20;
    factors.push(`Fresh wind gusts (${windGust} km/h)`);
  }

  // Precipitation / Storm risk
  if (weatherCode >= 95) {
    riskPoints += 50;
    factors.push('Thunderstorm & lightning activity');
  } else if (weatherCode >= 65 || weatherCode === 75) {
    riskPoints += 30;
    factors.push('Heavy rain / snowfall');
  } else if (weatherCode >= 51) {
    riskPoints += 10;
    factors.push('Precipitation risk');
  }

  // Visibility risk
  if (parseFloat(visibility) < 2) {
    riskPoints += 35;
    factors.push(`Low fog visibility (${visibility} km)`);
  } else if (parseFloat(visibility) < 5) {
    riskPoints += 15;
    factors.push('Reduced atmospheric visibility');
  }

  // Extreme heat / cold
  if (feelsLike > 38 || feelsLike < -5) {
    riskPoints += 30;
    factors.push(`Extreme thermal stress (${feelsLike}°C feels like)`);
  }

  if (factors.length === 0) {
    factors.push('Mild, benign weather conditions');
  }

  if (riskPoints >= 45) {
    return { level: 'High Risk', color: 'text-rose-400', bg: 'bg-rose-500/20', factors };
  }
  if (riskPoints >= 20) {
    return { level: 'Moderate Risk', color: 'text-amber-400', bg: 'bg-amber-500/20', factors };
  }
  return { level: 'Low Risk', color: 'text-emerald-400', bg: 'bg-emerald-500/20', factors };
};
