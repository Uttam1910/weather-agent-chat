/**
 * historicalInsights.js
 * Historical Climate Comparison Engine
 * Compares current weather with 5-10 year historical averages.
 */

export const calculateHistoricalInsights = (currentWeather, historicalData) => {
  if (!currentWeather || !historicalData) return null;

  const currentTemp = currentWeather.temperature;
  const histAvgTemp = historicalData.historicalAvgTemp;

  const diff = currentTemp - histAvgTemp;

  let trendLabel = 'Similar to historical average';
  if (diff >= 3) trendLabel = `+${Math.round(diff)}°C warmer than 5-year average`;
  else if (diff <= -3) trendLabel = `${Math.round(diff)}°C cooler than 5-year average`;

  return {
    currentTemp,
    histAvgTemp,
    diff: Math.round(diff),
    trendLabel,
    yearsAgo: historicalData.yearsAgo || 5,
  };
};
