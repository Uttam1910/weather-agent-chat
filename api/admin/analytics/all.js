import { parseCookies, verifyAdminSession } from '../../lib/auth.js';
import { serverlessDb } from '../../lib/db.js';

export default async function handler(req, res) {
  const cookies = parseCookies(req);
  const token = cookies.weather_admin_sessionToken;

  if (!verifyAdminSession(token)) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required.' });
  }

  try {
    const data = await serverlessDb.getAllData();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch central analytics data.' });
  }
}
