/**
 * photographyMode.js
 * Outdoor Photography Mode Engine
 * Calculates Golden Hour window, Landscape Score, and Sunset Rating.
 */

export const calculatePhotographyScore = (weather) => {
  if (!weather) {
    return {
      landscapeScore: 85,
      sunsetScore: 90,
      goldenHourWindow: '5:45 PM – 6:30 PM',
      lightingCondition: 'Soft diffused natural light',
    };
  }

  const { cloudCover = 30, visibility = 10, sunset, sunrise } = weather;

  let sunsetScore = 100;
  let landscapeScore = 100;

  // Cloud cover rating for photography
  if (cloudCover >= 30 && cloudCover <= 70) {
    // Perfect dramatic clouds
    sunsetScore += 5;
    landscapeScore += 5;
  } else if (cloudCover < 15) {
    sunsetScore -= 20; // Too bald sky
    landscapeScore -= 15;
  } else if (cloudCover > 85) {
    sunsetScore -= 35; // Overcast flat sky
    landscapeScore -= 25;
  }

  if (parseFloat(visibility) >= 10) {
    landscapeScore += 5;
  } else if (parseFloat(visibility) < 5) {
    landscapeScore -= 30;
  }

  // Golden Hour Calculation (45 mins before sunset)
  let goldenHourWindow = '5:30 PM – 6:15 PM';
  if (sunset) {
    const sunsetDate = new Date(sunset);
    const startGolden = new Date(sunsetDate.getTime() - 45 * 60000);
    goldenHourWindow = `${startGolden.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  return {
    landscapeScore: Math.max(20, Math.min(100, Math.round(landscapeScore))),
    sunsetScore: Math.max(20, Math.min(100, Math.round(sunsetScore))),
    goldenHourWindow,
    lightingCondition: cloudCover > 50 ? 'Soft diffused clouds' : 'Direct warm sunlight',
  };
};
