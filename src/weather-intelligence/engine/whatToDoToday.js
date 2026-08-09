/**
 * whatToDoToday.js
 * "What Should I Do Today?" Weather Decision Engine
 * Analyzes raw weather metrics and hourly forecast to deliver personalized daily decisions.
 */

import { scoreAllActivities } from '../scoring/activityScorer';
import { calculateBestTimeWindow } from './bestTimeEngine';

export const getWhatToDoToday = (weather, userInterests = []) => {
  if (!weather) {
    return {
      headline: 'Loading Weather Intelligence...',
      topActivities: [],
      avoidActivities: [],
      bestWindow: null,
      rationale: 'Fetching current atmospheric data.',
    };
  }

  const allScored = scoreAllActivities(weather);

  // Filter or prioritize based on user interests if available
  let prioritized = allScored;
  if (userInterests && userInterests.length > 0) {
    const interestSet = new Set(userInterests.map((i) => i.toLowerCase()));
    prioritized = [...allScored].sort((a, b) => {
      const aUser = interestSet.has(a.id.toLowerCase());
      const bUser = interestSet.has(b.id.toLowerCase());
      if (aUser && !bUser) return -1;
      if (!aUser && bUser) return 1;
      return b.score - a.score;
    });
  }

  const topActivities = prioritized.filter((a) => a.score >= 70).slice(0, 4);
  const avoidActivities = allScored.filter((a) => a.score < 50).slice(0, 3);

  // Best time for primary top activity
  const primaryActivity = topActivities.length > 0 ? topActivities[0] : allScored[0];
  const bestWindow = calculateBestTimeWindow(primaryActivity.id, weather.hourly);

  // Deterministic Headline & Rationale
  let headline = 'Great Day for Outdoor Activities';
  if (weather.weatherCode >= 51) headline = 'Wet Weather Advisory - Indoor & Covered Plans Recommended';
  else if (weather.temperature > 32) headline = 'High Heat Conditions - Morning/Evening Outdoor Windows';
  else if (weather.windSpeed > 30) headline = 'Windy Conditions - Sheltered Outdoor Options Best';
  else if (topActivities.length >= 3) headline = 'Optimal Conditions for Outdoor Plans';

  const rationaleParts = [];
  if (topActivities.length > 0) {
    rationaleParts.push(`Comfortable temperature (${weather.temperature}°C) and favorable conditions for ${topActivities.slice(0, 2).map((a) => a.name.toLowerCase()).join(' and ')}.`);
  }
  if (weather.uvIndex >= 7) rationaleParts.push(`UV Index is high (${weather.uvIndex}) during midday.`);
  if (weather.humidity > 75) rationaleParts.push(`High humidity (${weather.humidity}%) may increase apparent heat.`);
  if (avoidActivities.length > 0) rationaleParts.push(`Avoid ${avoidActivities[0].name.toLowerCase()} due to atmospheric constraints.`);

  return {
    headline,
    topActivities,
    avoidActivities,
    bestWindow,
    primaryActivityName: primaryActivity ? primaryActivity.name : 'Outdoor Activity',
    rationale: rationaleParts.join(' '),
  };
};
