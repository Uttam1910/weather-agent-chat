/**
 * commuteIntelligence.js
 * Smart Commute Intelligence Engine
 * Evaluates Morning (07:00–09:00) and Evening (17:00–19:00) commute conditions.
 */

export const calculateCommuteIntelligence = (hourlyList) => {
  if (!hourlyList || hourlyList.length === 0) {
    return {
      morning: { score: 85, status: 'Good', rainRisk: 10, visibility: '10.0 km', advice: 'Smooth morning commute expected.' },
      evening: { score: 75, status: 'Moderate', rainRisk: 25, visibility: '10.0 km', advice: 'Evening commute clear.' },
    };
  }

  const getWindowStats = (startHour, endHour) => {
    const hours = hourlyList.filter((h) => {
      const hr = new Date(h.time).getHours();
      return hr >= startHour && hr <= endHour;
    });

    if (hours.length === 0) return { score: 80, status: 'Good', rainRisk: 0, visibility: '10.0 km', advice: 'Standard driving conditions.' };

    const maxPop = Math.max(...hours.map((h) => h.pop || 0));
    const maxWind = Math.max(...hours.map((h) => h.windSpeed || 0));
    const minVis = Math.min(...hours.map((h) => parseFloat(h.visibility) || 10));

    let score = 100;
    const notes = [];

    if (maxPop >= 60) {
      score -= 30;
      notes.push(`High rain risk (${maxPop}%) may cause wet roads & slower traffic`);
    } else if (maxPop >= 30) {
      score -= 15;
      notes.push(`Slight rain risk (${maxPop}%)`);
    }

    if (minVis < 3) {
      score -= 35;
      notes.push(`Low fog visibility (${minVis} km)`);
    }

    if (maxWind > 35) {
      score -= 20;
      notes.push(`Crosswind gusts (${maxWind} km/h)`);
    }

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    let status = 'Smooth Commute';
    if (finalScore < 50) status = 'Potential Delays';
    else if (finalScore < 75) status = 'Moderate Drive';

    const advice = notes.length > 0 ? notes.join('. ') : 'Dry, clear roadways with minimal weather disruption.';

    return {
      score: finalScore,
      status,
      rainRisk: maxPop,
      visibility: `${minVis.toFixed(1)} km`,
      advice,
    };
  };

  return {
    morning: getWindowStats(7, 9),
    evening: getWindowStats(17, 19),
  };
};
