import { parseCookies, verifyAdminSession } from '../../lib/auth.js';

export default async function handler(req, res) {
  const cookies = parseCookies(req);
  const token = cookies.weather_admin_sessionToken;

  if (verifyAdminSession(token)) {
    return res.status(200).json({ authenticated: true });
  }

  return res.status(401).json({ authenticated: false });
}
