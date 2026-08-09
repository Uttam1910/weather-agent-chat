/**
 * ActivityScorer.js
 * Deterministic Activity Scoring Engine
 * Evaluates 15+ activities against raw weather parameters.
 */

export const ACTIVITIES_DEF = [
  { id: 'running', name: 'Running / Jogging', category: 'fitness', icon: '🏃' },
  { id: 'walking', name: 'Walking / Hiking', category: 'fitness', icon: '🚶' },
  { id: 'cycling', name: 'Cycling & Biking', category: 'fitness', icon: '🚴' },
  { id: 'photography', name: 'Outdoor Photography', category: 'leisure', icon: '📸' },
  { id: 'beach', name: 'Beach & Swimming', category: 'leisure', icon: '🏖️' },
  { id: 'dining', name: 'Outdoor Dining', category: 'leisure', icon: '☕' },
  { id: 'stargazing', name: 'Stargazing', category: 'leisure', icon: '🌌' },
  { id: 'golf', name: 'Golf', category: 'sports', icon: '⛳' },
  { id: 'dogWalking', name: 'Dog Walking', category: 'daily', icon: '🐕' },
  { id: 'gardening', name: 'Gardening & Lawn', category: 'home', icon: '🌱' },
  { id: 'driving', name: 'Driving & Commute', category: 'daily', icon: '🚗' },
  { id: 'camping', name: 'Camping', category: 'adventure', icon: '⛺' },
  { id: 'hiit', name: 'Outdoor HIIT Workout', category: 'fitness', icon: '💪' },
  { id: 'fishing', name: 'Fishing', category: 'sports', icon: '🎣' },
  { id: 'riding', name: 'Motorcycle Riding', category: 'adventure', icon: '🏍️' },
];

/**
 * Status helper
 */
const getScoreStatus = (score) => {
  if (score >= 85) return { label: 'Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (score >= 70) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  if (score >= 50) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  if (score >= 30) return { label: 'Poor', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  return { label: 'Avoid', color: 'text-rose-400', bg: 'bg-rose-500/20' };
};

/**
 * Calculate Activity Score for a single activity
 */
export const calculateActivityScore = (activityId, weather) => {
  if (!weather) return { score: 50, status: getScoreStatus(50), pros: [], cons: [] };

  const {
    temperature = 20,
    feelsLike = 20,
    humidity = 50,
    windSpeed = 10,
    windGust = 12,
    uvIndex = 3,
    cloudCover = 30,
    visibility = 10,
    isDay = true,
    weatherCode = 0,
  } = weather;

  const isRaining = weatherCode >= 51;
  const isStorming = weatherCode >= 95;

  let score = 100;
  const pros = [];
  const cons = [];

  switch (activityId) {
    case 'running': {
      // Ideal: 10-18°C, low humidity, low wind, UV < 6, no rain
      if (temperature < 5) { score -= 25; cons.push('Cold air temperature'); }
      else if (temperature <= 18) { pros.push('Optimal cool temperature'); }
      else if (temperature <= 25) { score -= 15; cons.push('Warm for intense running'); }
      else { score -= 35; cons.push('High heat stress risk'); }

      if (humidity > 75) { score -= 15; cons.push('High humidity (sweat cooling reduced)'); }
      else { pros.push('Comfortable humidity'); }

      if (windSpeed > 25) { score -= 20; cons.push(`High wind resistance (${windSpeed} km/h)`); }
      else { pros.push('Light breeze'); }

      if (isRaining) { score -= 40; cons.push('Rain / wet pavement'); }
      else { pros.push('Dry conditions'); }

      if (uvIndex >= 7) { score -= 15; cons.push('High UV exposure'); }
      break;
    }

    case 'walking':
    case 'hiking': {
      // Ideal: 14-24°C, low rain, pleasant wind
      if (temperature < 8) { score -= 20; cons.push('Chilly outdoor temperature'); }
      else if (temperature <= 24) { pros.push('Pleasant hiking temperature'); }
      else { score -= 25; cons.push('Hot temperature for walking'); }

      if (isRaining) { score -= 40; cons.push('Rain risk'); }
      else { pros.push('Clear trails'); }

      if (windSpeed > 30) { score -= 15; cons.push('Bustling wind'); }
      if (uvIndex >= 8) { score -= 10; cons.push('Strong UV rays'); }
      break;
    }

    case 'cycling': {
      // Ideal: 15-25°C, wind < 15 km/h, no rain
      if (windSpeed > 20 || windGust > 30) {
        score -= 35;
        cons.push(`Crosswinds & gusts up to ${windGust} km/h`);
      } else {
        pros.push('Favorable low wind');
      }

      if (isRaining) { score -= 45; cons.push('Slippery roads & wet brakes'); }
      else { pros.push('Dry road surface'); }

      if (temperature > 30) { score -= 25; cons.push('High overheating risk'); }
      else if (temperature >= 14 && temperature <= 25) { pros.push('Comfortable cycling temperature'); }
      break;
    }

    case 'photography': {
      // Ideal: Partial cloud cover (30-70%), high visibility, golden hour, low wind
      if (cloudCover >= 25 && cloudCover <= 70) { pros.push('Dynamic cloud formations'); }
      else if (cloudCover < 20) { score -= 10; cons.push('Harsh flat sunlight (clear sky)'); }
      else { score -= 15; cons.push('Overcast muted sky'); }

      if (parseFloat(visibility) >= 8) { pros.push('High atmospheric visibility'); }
      else { score -= 25; cons.push('Low atmospheric clarity'); }

      if (isRaining) { score -= 40; cons.push('Rain protecting gear required'); }
      if (windSpeed < 15) { pros.push('Stable tripod conditions'); }
      break;
    }

    case 'beach': {
      // Ideal: Temp > 25°C, sunny, isDay, low wind
      if (!isDay) { score -= 70; cons.push('Nighttime (no beach sun)'); }
      if (temperature < 22) { score -= 45; cons.push('Cool for swimming/sunbathing'); }
      else if (temperature >= 26) { pros.push('Warm beach weather'); }

      if (cloudCover > 60) { score -= 25; cons.push('Cloudy sky shielding sun'); }
      else { pros.push('Sunny & bright'); }

      if (isRaining) { score -= 50; cons.push('Precipitation at beach'); }
      if (windSpeed > 25) { score -= 20; cons.push('High wind / blowing sand'); }
      break;
    }

    case 'dining': {
      // Ideal: 18-26°C, wind < 15 km/h, 0% rain, low bugs/humidity
      if (temperature < 16) { score -= 35; cons.push('Too cold for patio dining'); }
      else if (temperature <= 26) { pros.push('Ideal patio dining temperature'); }
      else { score -= 20; cons.push('Warm outdoor seating'); }

      if (windSpeed > 18) { score -= 30; cons.push('Windy patio conditions'); }
      else { pros.push('Gentle breeze'); }

      if (isRaining) { score -= 60; cons.push('Rain risk for outdoor tables'); }
      break;
    }

    case 'stargazing': {
      // Ideal: Nighttime, Cloud cover < 20%, visibility > 10km, no rain
      if (isDay) { score -= 90; cons.push('Daytime (stars invisible)'); }
      if (cloudCover > 30) { score -= Math.min(80, cloudCover); cons.push(`${cloudCover}% cloud cover blocking stars`); }
      else { pros.push('Clear night sky'); }

      if (parseFloat(visibility) >= 9) { pros.push('High night visibility'); }
      if (humidity > 80) { score -= 15; cons.push('High humidity / dew haze'); }
      break;
    }

    case 'golf': {
      // Ideal: 18-26°C, wind < 15 km/h, dry
      if (windSpeed > 20) { score -= 30; cons.push(`Wind affecting ball trajectory (${windSpeed} km/h)`); }
      else { pros.push('Calm fairway wind'); }

      if (isRaining) { score -= 50; cons.push('Wet green & rain'); }
      if (temperature < 12) { score -= 25; cons.push('Cold hands / stiff ball'); }
      break;
    }

    case 'dogWalking': {
      // Ideal: 12-22°C, dry pavement
      if (temperature > 28) { score -= 45; cons.push('Hot pavement risk for paws (>28°C)'); }
      else if (temperature > 24) { score -= 15; cons.push('Warm pavement'); }
      else { pros.push('Safe paw temperature'); }

      if (isRaining) { score -= 30; cons.push('Wet paws & muddy walk'); }
      if (isStorming) { score -= 60; cons.push('Thunderstorm noise anxiety'); }
      break;
    }

    case 'gardening': {
      // Ideal: Moderate temp, mild sun, light soil moisture
      if (temperature > 32) { score -= 30; cons.push('Extreme heat for gardening'); }
      if (isRaining) { score -= 25; cons.push('Rainy soil conditions'); }
      else { pros.push('Good planting window'); }
      if (uvIndex >= 7) { score -= 15; cons.push('Sunburn risk during garden work'); }
      break;
    }

    case 'driving': {
      // Ideal: Dry, high visibility, low wind
      if (isRaining) { score -= 30; cons.push('Rain / hydroplaning risk'); }
      else { pros.push('Dry roadway'); }

      if (parseFloat(visibility) < 5) { score -= 35; cons.push(`Low fog visibility (${visibility} km)`); }
      else { pros.push('Clear road vision'); }

      if (windGust > 40) { score -= 25; cons.push('High vehicle wind sway'); }
      break;
    }

    case 'camping': {
      // Ideal: Moderate temp overnight, 0% rain, low wind
      if (isRaining) { score -= 50; cons.push('Rain & wet campsite'); }
      if (windGust > 35) { score -= 35; cons.push('High tent wind stress'); }
      if (temperature < 5) { score -= 30; cons.push('Freezing overnight temperature'); }
      break;
    }

    case 'hiit': {
      // Ideal: 14-22°C, moderate humidity
      if (temperature > 27) { score -= 40; cons.push('High heat exhaustion risk'); }
      if (humidity > 70) { score -= 20; cons.push('High humidity'); }
      if (isRaining) { score -= 30; cons.push('Slippery outdoor ground'); }
      break;
    }

    case 'fishing': {
      // Ideal: Overcast sky, mild wind, stable pressure
      if (cloudCover >= 40) { pros.push('Cloud cover (fish active near surface)'); }
      if (windSpeed > 25) { score -= 30; cons.push('Rough water surface'); }
      if (isStorming) { score -= 80; cons.push('Severe lightning hazard'); }
      break;
    }

    case 'riding': {
      // Ideal: Dry pavement, wind < 20km/h, 16-26°C
      if (isRaining) { score -= 65; cons.push('Wet asphalt & reduced traction'); }
      if (windGust > 30) { score -= 40; cons.push('Severe motorcycle wind buffeting'); }
      if (temperature < 10) { score -= 30; cons.push('Cold wind chill for riding'); }
      break;
    }

    default:
      break;
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return {
    score: finalScore,
    status: getScoreStatus(finalScore),
    pros,
    cons,
  };
};

/**
 * Score all activities for a weather object
 */
export const scoreAllActivities = (weather) => {
  return ACTIVITIES_DEF.map((act) => {
    const result = calculateActivityScore(act.id, weather);
    return {
      ...act,
      ...result,
    };
  }).sort((a, b) => b.score - a.score);
};
