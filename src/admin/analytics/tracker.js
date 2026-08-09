/**
 * tracker.js
 * Centralized, non-blocking telemetry engine for Weather Agent.
 * Collects anonymous visitor metrics, weather search events, feature interactions, and API consumption.
 */

import { addRecord } from './analyticsStore';

function getVisitorId() {
  let visitorId = localStorage.getItem('weather_visitor_id');
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('weather_visitor_id', visitorId);
  }
  return visitorId;
}

function getSessionId() {
  const now = Date.now();
  const lastActive = parseInt(localStorage.getItem('weather_last_active') || '0', 10);
  let sessionId = localStorage.getItem('weather_session_id');

  // New session if inactive for > 30 minutes (1800000 ms)
  if (!sessionId || now - lastActive > 1800000) {
    sessionId = `s_${now}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem('weather_session_id', sessionId);
  }

  localStorage.setItem('weather_last_active', now.toString());
  return sessionId;
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceType = 'Desktop';
  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';

  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Unknown';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { deviceType, browser, os };
}

// Track Anonymous Visitor & Session entry
export async function trackSession() {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const now = new Date().toISOString();
    const { deviceType, browser, os } = getDeviceInfo();

    await addRecord('visitors', {
      id: visitorId,
      firstSeenAt: localStorage.getItem('weather_first_seen') || now,
      lastSeenAt: now,
    });

    if (!localStorage.getItem('weather_first_seen')) {
      localStorage.setItem('weather_first_seen', now);
    }

    await addRecord('sessions', {
      id: sessionId,
      visitorId,
      startedAt: now,
      lastSeenAt: now,
      deviceType,
      browser,
      os,
      referrer: document.referrer ? new URL(document.referrer).hostname : 'Direct',
    });
  } catch (err) {
    // Non-blocking
  }
}

// Track Public Page Views
export async function trackPageView(path, title = '') {
  try {
    if (path.includes('/private-') || path.includes('/admin')) return; // Never track admin pages

    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    await trackSession();

    await addRecord('page_views', {
      visitorId,
      sessionId,
      path,
      title: title || document.title,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Non-blocking
  }
}

// Track Weather Search Events
export async function trackSearch({ city, region = '', country = '', source = 'manual', lat = null, lon = null }) {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    await addRecord('searches', {
      visitorId,
      sessionId,
      city: city || 'Unknown Location',
      region,
      country,
      source, // 'current' | 'manual' | 'saved'
      latitudeApprox: lat ? parseFloat(lat.toFixed(2)) : null,
      longitudeApprox: lon ? parseFloat(lon.toFixed(2)) : null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Non-blocking
  }
}

// Track Feature Interactions
export async function trackFeatureUse(featureId) {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    await addRecord('feature_usage', {
      visitorId,
      sessionId,
      featureId, // 'what_should_i_do_today' | 'activity_scores' | 'best_time' | 'travel_planner' | 'event_monitor' | etc.
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Non-blocking
  }
}

// Track Open-Meteo & System API Requests
export async function trackApiCall(endpoint, provider, durationMs, status = 'success') {
  try {
    await addRecord('api_requests', {
      endpoint,
      provider, // 'open-meteo-forecast' | 'open-meteo-air-quality' | 'open-meteo-marine' | 'open-meteo-archive'
      durationMs,
      status, // 'success' | 'error'
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Non-blocking
  }
}
