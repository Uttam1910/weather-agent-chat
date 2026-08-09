/**
 * eventMonitor.js
 * Outdoor Event Weather Monitor Engine
 * Evaluates outdoor events (Weddings, Concerts, Picnics, Festivals, Sports) against forecast data.
 */

export const EVENT_TYPES = [
  { id: 'wedding', name: 'Outdoor Wedding', icon: '💍' },
  { id: 'concert', name: 'Outdoor Concert / Festival', icon: '🎵' },
  { id: 'picnic', name: 'Picnic / Party', icon: '🧺' },
  { id: 'sports', name: 'Sports Tournament', icon: '⚽' },
  { id: 'photo', name: 'Photo Shoot', icon: '📸' },
];

export const evaluateEventWeather = (eventType, weather) => {
  if (!weather) {
    return { eventScore: 80, rainRisk: 10, windRisk: 10, backupWindow: '2 hours later', advice: 'Good conditions.' };
  }

  const { temperature = 22, humidity = 50, windSpeed = 10, windGust = 12, weatherCode = 0, hourly } = weather;

  const isRaining = weatherCode >= 51;
  let score = 100;
  const concerns = [];

  if (isRaining) {
    score -= 50;
    concerns.push('High rain probability during event hours');
  }

  if (windGust > 30) {
    score -= 30;
    concerns.push(`High wind gusts (${windGust} km/h) affecting tents & decorations`);
  }

  if (temperature > 32) {
    score -= 25;
    concerns.push('High heat discomfort for guests');
  } else if (temperature < 12) {
    score -= 25;
    concerns.push('Chilly outdoor temperatures');
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  // Scan hourly forecast to find best backup window
  let backupWindow = 'Evening window (after 6:00 PM)';
  if (hourly && hourly.length > 0) {
    const clearHours = hourly.filter((h) => h.pop < 20 && h.windSpeed < 20 && h.temp >= 18);
    if (clearHours.length > 0) {
      const t = new Date(clearHours[0].time);
      backupWindow = `${t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} onward`;
    }
  }

  return {
    eventScore: finalScore,
    rainRisk: isRaining ? 80 : 15,
    windRisk: windGust > 25 ? 40 : 10,
    concerns,
    backupWindow,
  };
};
