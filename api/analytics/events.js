import { serverlessDb } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const { eventType, visitorId, sessionId, path, title, city, region, country, source, lat, lon, featureId, provider, endpoint, status, latencyMs, deviceType, browser, os, referrer } = body || {};

    if (visitorId && sessionId) {
      await serverlessDb.recordVisitorAndSession({ visitorId, sessionId, deviceType, browser, os, referrer });
    }

    if (eventType === 'page_view' && path) {
      await serverlessDb.recordPageView({ visitorId, sessionId, path, title });
    } else if (eventType === 'weather_search') {
      await serverlessDb.recordSearch({ visitorId, sessionId, city, region, country, source, lat, lon });
    } else if (eventType === 'feature_usage' && featureId) {
      await serverlessDb.recordFeatureUsage({ visitorId, sessionId, featureId });
    } else if (eventType === 'api_request') {
      await serverlessDb.recordApiCall({ provider, endpoint, status, latencyMs });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    // Non-blocking
    return res.status(200).json({ success: false });
  }
}
