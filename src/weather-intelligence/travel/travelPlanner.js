/**
 * travelPlanner.js
 * Travel Weather Planner Engine
 * Analyzes multi-day travel forecasts to score trip comfort and build deterministic packing lists.
 */

export const analyzeTravelPlan = (forecastList) => {
  if (!forecastList || forecastList.length === 0) {
    return {
      tripScore: 82,
      bestDayLabel: 'Day 2',
      rainRiskDayLabel: 'Day 4',
      avgTemp: 22,
      packingChecklist: ['Light jacket', 'Sunscreen', 'Umbrella', 'Comfortable walking shoes'],
    };
  }

  let totalTemp = 0;
  let maxRainProb = -1;
  let maxRainDayIndex = 0;
  let bestDayScore = -1;
  let bestDayIndex = 0;

  const packingSet = new Set();
  packingSet.add('Comfortable walking footwear');

  forecastList.forEach((day, idx) => {
    const dayTemp = day.temp || Math.round((day.tempMax + day.tempMin) / 2);
    totalTemp += dayTemp;

    // Check rain
    if ((day.pop || 0) > maxRainProb) {
      maxRainProb = day.pop || 0;
      maxRainDayIndex = idx;
    }

    // Packing rules
    if (day.tempMax > 26) {
      packingSet.add('Lightweight cotton clothing');
      packingSet.add('Sunglasses & sun hat');
    }
    if (day.tempMin < 14) {
      packingSet.add('Warm sweater / jacket');
    }
    if ((day.pop || 0) >= 30) {
      packingSet.add('Compact travel umbrella');
      packingSet.add('Water-resistant shoes');
    }
    if ((day.uvMax || 0) >= 6) {
      packingSet.add('Broad-spectrum Sunscreen (SPF 30+)');
    }

    // Score day
    const dayScore = 100 - (day.pop || 0) * 0.5 - Math.abs(dayTemp - 22) * 2;
    if (dayScore > bestDayScore) {
      bestDayScore = dayScore;
      bestDayIndex = idx;
    }
  });

  const avgTemp = Math.round(totalTemp / forecastList.length);
  const tripScore = Math.max(30, Math.min(100, Math.round(100 - maxRainProb * 0.4 - Math.abs(avgTemp - 22) * 1.5)));

  const bestDayObj = forecastList[bestDayIndex];
  const bestDayLabel = bestDayObj ? new Date(bestDayObj.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : 'Day 1';

  const rainDayObj = forecastList[maxRainDayIndex];
  const rainRiskDayLabel = rainDayObj && maxRainProb >= 30
    ? `${new Date(rainDayObj.date).toLocaleDateString([], { weekday: 'short' })} (${maxRainProb}% rain)`
    : 'Low rain risk throughout trip';

  return {
    tripScore,
    bestDayLabel,
    rainRiskDayLabel,
    avgTemp,
    packingChecklist: Array.from(packingSet),
  };
};
