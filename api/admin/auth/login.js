import { ADMIN_USERNAME, ADMIN_PASSWORD, createAdminSession, checkRateLimit, recordFailedLogin, resetFailedLogin } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const limitCheck = checkRateLimit(clientIp);

  if (limitCheck.locked) {
    return res.status(429).json({ error: `Too many failed attempts. Try again in ${limitCheck.remainingSecs} seconds.` });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  const { username, password } = body || {};

  // Validate server-side credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    resetFailedLogin(clientIp);
    const { token, expiresAt } = createAdminSession(username);

    res.setHeader(
      'Set-Cookie',
      `weather_admin_sessionToken=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    );

    return res.status(200).json({ success: true, message: 'Authenticated successfully.' });
  } else {
    recordFailedLogin(clientIp);
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
}
