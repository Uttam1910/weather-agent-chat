import { parseCookies, removeAdminSession } from '../../lib/auth.js';

export default async function handler(req, res) {
  const cookies = parseCookies(req);
  const token = cookies.weather_admin_sessionToken;
  if (token) {
    removeAdminSession(token);
  }

  res.setHeader(
    'Set-Cookie',
    'weather_admin_sessionToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );

  return res.status(200).json({ success: true, message: 'Logged out successfully.' });
}
