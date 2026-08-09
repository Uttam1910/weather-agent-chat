/**
 * marineIntelligence.js
 * Coastal & Marine Weather Engine
 * Evaluates Beach, Swimming, Surfing, and Boating conditions.
 */

export const calculateMarineScores = (weather, marineData) => {
  if (!marineData) return null; // Only rendered for coastal locations with marine data

  const { waveHeight = 1.0, wavePeriod = 6, swellHeight = 0.8 } = marineData;
  const { temperature = 25, windSpeed = 10, weatherCode = 0 } = weather || {};

  const isRaining = weatherCode >= 51;

  let beachScore = 100;
  let surfScore = 100;
  let boatScore = 100;

  // Beach Score
  if (temperature < 22) beachScore -= 30;
  if (waveHeight > 2.0) beachScore -= 25;
  if (isRaining) beachScore -= 40;

  // Surf Score (Ideal: wave height 1.2m - 2.5m, period > 8s)
  if (waveHeight < 0.5) surfScore -= 40; // Too flat
  else if (waveHeight >= 1.2 && waveHeight <= 2.5 && wavePeriod >= 8) surfScore += 10;
  else if (waveHeight > 3.0) surfScore -= 35; // Dangerous surf

  // Boating Score (Ideal: low wind, wave height < 1.0m)
  if (windSpeed > 25) boatScore -= 40;
  if (waveHeight > 1.5) boatScore -= 35;

  return {
    isCoastal: true,
    waveHeight: `${waveHeight} m`,
    swellHeight: `${swellHeight} m`,
    wavePeriod: `${wavePeriod} s`,
    beachScore: Math.max(0, Math.min(100, Math.round(beachScore))),
    surfScore: Math.max(0, Math.min(100, Math.round(surfScore))),
    boatScore: Math.max(0, Math.min(100, Math.round(boatScore))),
  };
};
