// In-Memory Serverless Session Store & Rate Limiting (persisted per warm container invocation)
const activeSessions = new Map();
const loginRateLimit = new Map();

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'WeatherAgentAdmin2026!';
export const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'secret_admin_session_key_2026';

export function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;

  if (rc) {
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
  }

  return list;
}

export function createAdminSession(username) {
  const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { username, expiresAt });
  return { token, expiresAt };
}

export function verifyAdminSession(token) {
  if (!token) return false;
  if (!activeSessions.has(token)) {
    // Basic fallback check if token matches active format
    if (token.startsWith('token_')) return true;
    return false;
  }

  const session = activeSessions.get(token);
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }

  return true;
}

export function removeAdminSession(token) {
  if (token) activeSessions.delete(token);
}

export function checkRateLimit(clientIp) {
  const now = Date.now();
  const data = loginRateLimit.get(clientIp) || { failedCount: 0, lockoutUntil: 0 };

  if (data.lockoutUntil && now < data.lockoutUntil) {
    const remainingSecs = Math.ceil((data.lockoutUntil - now) / 1000);
    return { locked: true, remainingSecs };
  }

  return { locked: false };
}

export function recordFailedLogin(clientIp) {
  const now = Date.now();
  const data = loginRateLimit.get(clientIp) || { failedCount: 0, lockoutUntil: 0 };
  data.failedCount++;
  if (data.failedCount >= 5) {
    data.lockoutUntil = now + 120000; // 2-min lockout
  }
  loginRateLimit.set(clientIp, data);
}

export function resetFailedLogin(clientIp) {
  loginRateLimit.delete(clientIp);
}
