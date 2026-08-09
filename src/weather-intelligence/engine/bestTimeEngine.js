/**
 * bestTimeEngine.js
 * Scans 24-hour hourly forecast to compute optimal time windows for any activity.
 */

import { calculateActivityScore } from '../scoring/activityScorer';

export const calculateBestTimeWindow = (activityId, hourlyList) => {
  if (!hourlyList || hourlyList.length === 0) {
    return {
      bestWindowLabel: '06:00 AM – 09:00 AM',
      bestScore: 85,
      avoidWindowLabel: '01:00 PM – 04:00 PM',
      avoidReason: 'Higher UV & temperature',
      hourlyScores: [],
    };
  }

  // Score each hour for the selected activity
  const scoredHours = hourlyList.map((hourObj) => {
    const res = calculateActivityScore(activityId, hourObj);
    return {
      time: hourObj.time,
      hourLabel: new Date(hourObj.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: res.score,
      status: res.status,
      cons: res.cons,
    };
  });

  // Find consecutive 2-3 hour window with highest average score
  let maxAvg = -1;
  let bestStartIdx = 0;
  const windowSize = 2; // 2-hour window

  for (let i = 0; i <= scoredHours.length - windowSize; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += scoredHours[i + j].score;
    }
    const avg = sum / windowSize;
    if (avg > maxAvg) {
      maxAvg = avg;
      bestStartIdx = i;
    }
  }

  // Find worst hour window
  let minAvg = 999;
  let worstStartIdx = 0;
  for (let i = 0; i <= scoredHours.length - windowSize; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += scoredHours[i + j].score;
    }
    const avg = sum / windowSize;
    if (avg < minAvg) {
      minAvg = avg;
      worstStartIdx = i;
    }
  }

  const bestStart = scoredHours[bestStartIdx];
  const bestEnd = scoredHours[Math.min(scoredHours.length - 1, bestStartIdx + windowSize)];

  const worstStart = scoredHours[worstStartIdx];
  const worstEnd = scoredHours[Math.min(scoredHours.length - 1, worstStartIdx + windowSize)];

  const avoidCons = worstStart.cons && worstStart.cons.length > 0 ? worstStart.cons[0] : 'Sub-optimal weather conditions';

  return {
    bestWindowLabel: `${bestStart.hourLabel} – ${bestEnd.hourLabel}`,
    bestScore: Math.round(maxAvg),
    avoidWindowLabel: `${worstStart.hourLabel} – ${worstEnd.hourLabel}`,
    avoidReason: avoidCons,
    hourlyScores: scoredHours,
  };
};
