/**
 * productRecommendations.js
 * Weather-Aware Preparation Checklist & Product Provider Interface
 * Generates deterministic gear recommendations based on physical weather conditions.
 */

export const getPreparationGear = (weather) => {
  if (!weather) return [];

  const { temperature = 20, humidity = 50, uvIndex = 3, weatherCode = 0, windGust = 10 } = weather;

  const gearList = [];
  const isRaining = weatherCode >= 51;

  if (isRaining) {
    gearList.push({ id: 'umbrella', name: 'Windproof Travel Umbrella', category: 'Rain', icon: '☂️' });
    gearList.push({ id: 'raincoat', name: 'Breathable Waterproof Jacket', category: 'Rain', icon: '🧥' });
    gearList.push({ id: 'waterproof_bag', name: 'Water-Resistant Backpack Cover', category: 'Rain', icon: '🎒' });
  }

  if (uvIndex >= 6) {
    gearList.push({ id: 'sunscreen', name: 'Broad-Spectrum SPF 50+ Sunscreen', category: 'Sun', icon: '🧴' });
    gearList.push({ id: 'sunglasses', name: 'UV400 Polarized Sunglasses', category: 'Sun', icon: '🕶️' });
  }

  if (temperature > 28) {
    gearList.push({ id: 'hydration', name: 'Insulated Stainless Water Bottle', category: 'Heat', icon: '💧' });
  }

  if (temperature < 10) {
    gearList.push({ id: 'thermal', name: 'Thermal Insulated Fleece Jacket', category: 'Cold', icon: '🧥' });
  }

  return gearList;
};
