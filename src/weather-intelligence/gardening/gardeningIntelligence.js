/**
 * gardeningIntelligence.js
 * Gardening & Soil Intelligence Engine
 * Evaluates soil moisture, evapotranspiration, and watering advice.
 */

export const calculateGardeningIntelligence = (weather) => {
  if (!weather) {
    return { wateringRecommendation: 'Water Now', soilCondition: 'Moist', gardenScore: 80 };
  }

  const { evapotranspiration = 0.2, soilMoisture = 0.25, temperature = 22, weatherCode = 0 } = weather;

  const isRaining = weatherCode >= 51;
  let wateringRecommendation = 'Water Normally';

  if (isRaining || soilMoisture > 0.35) {
    wateringRecommendation = 'Skip Watering (Soil Moist / Rain)';
  } else if (evapotranspiration > 0.4 || (temperature > 28 && soilMoisture < 0.2)) {
    wateringRecommendation = 'Water Thoroughly Today (High Evaporation)';
  }

  const gardenScore = Math.max(30, Math.min(100, Math.round(100 - (isRaining ? 20 : 0) - (temperature > 32 ? 30 : 0))));

  return {
    wateringRecommendation,
    soilCondition: soilMoisture > 0.3 ? 'Saturated / Moist' : 'Dry / Well-drained',
    evapotranspiration: `${evapotranspiration.toFixed(2)} mm/h`,
    gardenScore,
  };
};
