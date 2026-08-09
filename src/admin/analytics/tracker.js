/**
 * tracker.js
 * Centralized, non-blocking telemetry engine for Weather Agent.
 * Sends anonymous events asynchronously to POST /api/analytics/events.
 * Weather features continue functioning normally even if analytics fails.
 */

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

// Asynchronous non-blocking central event dispatcher
function sendEvent(payload) {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const { deviceType, browser, os } = getDeviceInfo();

    const fullData = {
      visitorId,
      sessionId,
      deviceType,
      browser,
      os,
      referrer: document.referrer ? new URL(document.referrer).hostname : 'Direct',
      ...payload,
    };

    const blob = new Blob([JSON.stringify(fullData)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/events', blob);
    } else {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    // Analytics errors MUST NEVER break weather features
  }
}

// Public Page View Telemetry
export function trackPageView(path, title = '') {
  if (path.includes('/private-') || path.includes('/admin')) return;
  sendEvent({
    eventType: 'page_view',
    path,
    title: title || document.title,
  });
}

// Public Weather Search Telemetry
export function trackSearch({ city, region = '', country = '', source = 'manual', lat = null, lon = null }) {
  sendEvent({
    eventType: 'weather_search',
    city: city || 'Unknown Location',
    region,
    country,
    source, // 'current' | 'manual' | 'saved'
    lat: lat ? parseFloat(lat.toFixed(2)) : null,
    lon: lon ? parseFloat(lon.toFixed(2)) : null,
  });
}

// Public Feature Interaction Telemetry
export function trackFeatureUse(featureId) {
  sendEvent({
    eventType: 'feature_usage',
    featureId,
  });
}

// Open-Meteo & System API Request Telemetry
export function trackApiCall(endpoint, provider, durationMs, status = 'success') {
  sendEvent({
    eventType: 'api_request',
    endpoint,
    provider,
    durationMs,
    status,
  });
}
