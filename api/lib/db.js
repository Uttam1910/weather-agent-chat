import fs from 'fs';
import path from 'path';
import os from 'os';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

// Store local dev fallback strictly in OS temp directory OUTSIDE the project workspace
// This prevents Vite's file watcher from detecting file changes and reloading the client.
const DEV_TMP_DB_FILE = path.join(os.tmpdir(), 'weather_agent_dev_analytics.json');

const initialSchema = {
  visitors: {},
  sessions: {},
  pageViews: [],
  searches: [],
  featureUsage: [],
  apiRequests: [],
};

let inMemoryStore = null;

function loadDevStore() {
  if (inMemoryStore) return inMemoryStore;
  try {
    if (!fs.existsSync(DEV_TMP_DB_FILE)) {
      fs.writeFileSync(DEV_TMP_DB_FILE, JSON.stringify(initialSchema, null, 2));
      inMemoryStore = { ...initialSchema };
      return inMemoryStore;
    }
    const raw = fs.readFileSync(DEV_TMP_DB_FILE, 'utf-8');
    inMemoryStore = JSON.parse(raw);
    return inMemoryStore;
  } catch (err) {
    inMemoryStore = { ...initialSchema };
    return inMemoryStore;
  }
}

function saveDevStore(data) {
  inMemoryStore = data;
  try {
    fs.writeFileSync(DEV_TMP_DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    // Ignore tmp write errors in serverless
  }
}

// Supabase REST client helper for global production analytics
async function supabaseFetch(table, method = 'GET', body = null, params = '') {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}${params ? `?${params}` : ''}`;
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    };

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export const serverlessDb = {
  async recordVisitorAndSession({ visitorId, sessionId, deviceType, browser, os: userOs, referrer }) {
    const now = new Date().toISOString();

    // 1. Production Supabase database insert if env keys are present
    if (SUPABASE_URL && SUPABASE_KEY) {
      await supabaseFetch('visitors', 'POST', { id: visitorId, first_seen_at: now, last_seen_at: now }, 'on_conflict=id');
      await supabaseFetch('sessions', 'POST', { id: sessionId, visitor_id: visitorId, started_at: now, last_seen_at: now, device_type: deviceType, browser, os: userOs, referrer }, 'on_conflict=id');
      return;
    }

    // 2. Dev fallback outside workspace
    const store = loadDevStore();
    if (!store.visitors[visitorId]) {
      store.visitors[visitorId] = { id: visitorId, firstSeenAt: now, lastSeenAt: now };
    } else {
      store.visitors[visitorId].lastSeenAt = now;
    }

    if (!store.sessions[sessionId]) {
      store.sessions[sessionId] = {
        id: sessionId,
        visitorId,
        startedAt: now,
        lastSeenAt: now,
        deviceType: deviceType || 'Desktop',
        browser: browser || 'Unknown',
        os: userOs || 'Unknown',
        referrer: referrer || 'Direct',
      };
    } else {
      store.sessions[sessionId].lastSeenAt = now;
    }

    saveDevStore(store);
  },

  async recordPageView({ visitorId, sessionId, path, title }) {
    if (!path || path.startsWith('/private-') || path.startsWith('/admin')) return;
    const now = new Date().toISOString();

    if (SUPABASE_URL && SUPABASE_KEY) {
      await supabaseFetch('page_views', 'POST', { visitor_id: visitorId, session_id: sessionId, path, title, created_at: now });
      return;
    }

    const store = loadDevStore();
    store.pageViews.push({
      id: `pv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visitorId,
      sessionId,
      path,
      title: title || '',
      createdAt: now,
    });
    if (store.pageViews.length > 10000) store.pageViews.shift();
    saveDevStore(store);
  },

  async recordSearch({ visitorId, sessionId, city, region, country, source, lat, lon }) {
    const now = new Date().toISOString();

    if (SUPABASE_URL && SUPABASE_KEY) {
      await supabaseFetch('searches', 'POST', {
        visitor_id: visitorId,
        session_id: sessionId,
        city: city || 'Unknown Location',
        region: region || '',
        country: country || '',
        source: source || 'manual',
        latitude_approx: lat,
        longitude_approx: lon,
        created_at: now,
      });
      return;
    }

    const store = loadDevStore();
    store.searches.push({
      id: `srch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visitorId,
      sessionId,
      city: city || 'Unknown Location',
      region: region || '',
      country: country || '',
      source: source || 'manual',
      latitudeApprox: lat ? parseFloat(lat.toFixed(2)) : null,
      longitudeApprox: lon ? parseFloat(lon.toFixed(2)) : null,
      createdAt: now,
    });
    if (store.searches.length > 10000) store.searches.shift();
    saveDevStore(store);
  },

  async recordFeatureUsage({ visitorId, sessionId, featureId }) {
    const now = new Date().toISOString();

    if (SUPABASE_URL && SUPABASE_KEY) {
      await supabaseFetch('feature_usage', 'POST', { visitor_id: visitorId, session_id: sessionId, feature_id: featureId, created_at: now });
      return;
    }

    const store = loadDevStore();
    store.featureUsage.push({
      id: `feat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      visitorId,
      sessionId,
      featureId,
      createdAt: now,
    });
    if (store.featureUsage.length > 10000) store.featureUsage.shift();
    saveDevStore(store);
  },

  async recordApiCall({ provider, endpoint, status, latencyMs }) {
    const now = new Date().toISOString();

    if (SUPABASE_URL && SUPABASE_KEY) {
      await supabaseFetch('api_requests', 'POST', { provider, endpoint, status, latency_ms: latencyMs, created_at: now });
      return;
    }

    const store = loadDevStore();
    store.apiRequests.push({
      id: `api_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: provider || 'open-meteo',
      endpoint: endpoint || '/forecast',
      status: status || 'success',
      latencyMs: latencyMs || 0,
      createdAt: new Date().toISOString(),
    });
    if (store.apiRequests.length > 10000) store.apiRequests.shift();
    saveDevStore(store);
  },

  async getAllData() {
    if (SUPABASE_URL && SUPABASE_KEY) {
      const [v, s, pv, sr, fu, ar] = await Promise.all([
        supabaseFetch('visitors', 'GET', null, 'select=*&limit=5000'),
        supabaseFetch('sessions', 'GET', null, 'select=*&limit=5000'),
        supabaseFetch('page_views', 'GET', null, 'select=*&limit=5000'),
        supabaseFetch('searches', 'GET', null, 'select=*&limit=5000'),
        supabaseFetch('feature_usage', 'GET', null, 'select=*&limit=5000'),
        supabaseFetch('api_requests', 'GET', null, 'select=*&limit=5000'),
      ]);

      if (v || s || pv || sr || fu || ar) {
        return {
          visitors: (v || []).map((x) => ({ id: x.id, firstSeenAt: x.first_seen_at, lastSeenAt: x.last_seen_at })),
          sessions: (s || []).map((x) => ({ id: x.id, visitorId: x.visitor_id, startedAt: x.started_at, deviceType: x.device_type, browser: x.browser, os: x.os, referrer: x.referrer })),
          pageViews: (pv || []).map((x) => ({ id: x.id, visitorId: x.visitor_id, path: x.path, title: x.title, createdAt: x.created_at })),
          searches: (sr || []).map((x) => ({ id: x.id, visitorId: x.visitor_id, city: x.city, source: x.source, createdAt: x.created_at })),
          featureUsage: (fu || []).map((x) => ({ id: x.id, featureId: x.feature_id, createdAt: x.created_at })),
          apiRequests: (ar || []).map((x) => ({ id: x.id, provider: x.provider, status: x.status, latencyMs: x.latency_ms, createdAt: x.created_at })),
        };
      }
    }

    const store = loadDevStore();
    return {
      visitors: Object.values(store.visitors || {}),
      sessions: Object.values(store.sessions || {}),
      pageViews: store.pageViews || [],
      searches: store.searches || [],
      featureUsage: store.featureUsage || [],
      apiRequests: store.apiRequests || [],
    };
  },
};
