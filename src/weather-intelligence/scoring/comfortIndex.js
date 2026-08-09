/**
 * comfortIndex.js
 * Weather Comfort Index Engine (0-100)
 * Evaluates Heat Index, Dew Point comfort zone, Wind Chill, and UV exposure.
 */

export const calculateComfortIndex = (weather) => {
  if (!weather) return { score: 75, rating: 'Comfortable', reasons: [] };

  const {
    temperature = 20,
    feelsLike = 20,
    humidity = 50,
    dewPoint = 12,
    windSpeed = 10,
    uvIndex = 3,
  } = weather;

  let score = 100;
  const reasons = [];

  // 1. Dew Point Comfort Check (Ideal dew point is 10°C to 16°C)
  if (dewPoint > 24) {
    score -= 35;
    reasons.push('Oppressive tropical mugginess (dew point > 24°C)');
  } else if (dewPoint > 20) {
    score -= 20;
    reasons.push('Uncomfortably sticky & muggy');
  } else if (dewPoint > 16) {
    score -= 10;
    reasons.push('Slightly humid air');
  } else if (dewPoint >= 10 && dewPoint <= 16) {
    reasons.push('Perfect human dew point comfort zone (10-16°C)');
  } else if (dewPoint < 4) {
    score -= 10;
    reasons.push('Dry air (may cause dry skin/throat)');
  }

  // 2. Temperature & Feels Like Variance
  const tempDiff = Math.abs(feelsLike - temperature);
  if (tempDiff >= 5) {
    score -= 15;
    reasons.push(`Apparent temperature feels ${feelsLike > temperature ? 'hotter' : 'colder'} by ${tempDiff}°C`);
  }

  // 3. Extreme Heat / Cold Penalties
  if (feelsLike > 35) {
    score -= 25;
    reasons.push('High heat stress (>35°C)');
  } else if (feelsLike < 5) {
    score -= 25;
    reasons.push('Chilly wind discomfort (<5°C)');
  }

  // 4. UV Discomfort
  if (uvIndex >= 8) {
    score -= 10;
    reasons.push('Intense UV radiation');
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let rating = 'Ideal';
  if (finalScore < 40) rating = 'Uncomfortable';
  else if (finalScore < 65) rating = 'Moderate';
  else if (finalScore < 85) rating = 'Pleasant';

  return {
    score: finalScore,
    rating,
    reasons,
  };
};
