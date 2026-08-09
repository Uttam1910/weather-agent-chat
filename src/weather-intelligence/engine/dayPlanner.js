/**
 * dayPlanner.js
 * Weather-Based Daily Timeline Planner Engine
 * Maps hourly forecasts to structured daily time slots.
 */

import { calculateActivityScore } from '../scoring/activityScorer';

export const generateDayPlannerTimeline = (hourlyList) => {
  if (!hourlyList || hourlyList.length === 0) return [];

  // Pick representative hours: 07:00, 09:00, 12:00, 15:00, 18:00, 21:00
  const targetHours = [7, 9, 12, 15, 18, 21];

  return targetHours.map((targetHour) => {
    // Find closest hour in hourly list
    const match = hourlyList.find((h) => new Date(h.time).getHours() === targetHour) || hourlyList[0];

    const timeLabel = new Date(match.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const runScore = calculateActivityScore('running', match).score;
    const walkScore = calculateActivityScore('walking', match).score;
    const photoScore = calculateActivityScore('photography', match).score;

    let recommendation = '🌤️ Good for outdoor activity';
    let type = 'good';

    if (match.pop >= 60 || match.weatherCode >= 51) {
      recommendation = `🌧️ Rain risk likely (${match.pop}%) - Indoor plans recommended`;
      type = 'rain';
    } else if (match.uv >= 8) {
      recommendation = `☀️ Peak UV exposure (UV ${match.uv}) - Seek shade & apply sunscreen`;
      type = 'uv';
    } else if (match.temp >= 30) {
      recommendation = `🌡️ High temperature (${match.temp}°C) - Hydration advised`;
      type = 'heat';
    } else if (runScore >= 80) {
      recommendation = `🏃 Optimal window for running & outdoor workout`;
      type = 'prime';
    } else if (walkScore >= 80) {
      recommendation = `🚶 Great conditions for walking & outdoor dining`;
      type = 'good';
    }

    return {
      hour: targetHour,
      timeLabel,
      temp: match.temp,
      feelsLike: match.feelsLike,
      pop: match.pop,
      uv: match.uv,
      windSpeed: match.windSpeed,
      condition: match.condition || 'Clear',
      recommendation,
      type,
    };
  });
};
