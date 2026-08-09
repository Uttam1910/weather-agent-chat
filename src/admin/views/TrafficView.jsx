import { filterByDateRange } from './OverviewView';
import { FaLaptop, FaMobileAlt, FaTabletAlt, FaUsers, FaGlobe } from 'react-icons/fa';

export default function TrafficView({ data, dateRange }) {
  const visitors = filterByDateRange(data.visitors, dateRange);
  const sessions = filterByDateRange(data.sessions, dateRange);
  const pageViews = filterByDateRange(data.pageViews, dateRange);

  // Device Breakdown
  const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
  sessions.forEach((s) => {
    const dev = s.deviceType || 'Desktop';
    if (deviceCounts[dev] !== undefined) deviceCounts[dev]++;
    else deviceCounts.Desktop++;
  });

  // Browser Breakdown
  const browserCounts = {};
  sessions.forEach((s) => {
    const b = s.browser || 'Unknown';
    browserCounts[b] = (browserCounts[b] || 0) + 1;
  });

  // Referrer Breakdown
  const referrerCounts = {};
  sessions.forEach((s) => {
    const ref = s.referrer || 'Direct';
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Visitors & Traffic Acquisition</h2>
        <p className="text-xs text-slate-400 mt-1">Anonymous visitor sessions, device types, browsers, and traffic sources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Device Types */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FaLaptop className="text-purple-400" /> Device Breakdown
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <FaLaptop className="text-blue-400" /> Desktop
              </span>
              <span className="font-bold text-white">{deviceCounts.Desktop}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <FaMobileAlt className="text-emerald-400" /> Mobile
              </span>
              <span className="font-bold text-white">{deviceCounts.Mobile}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <FaTabletAlt className="text-amber-400" /> Tablet
              </span>
              <span className="font-bold text-white">{deviceCounts.Tablet}</span>
            </div>
          </div>
        </div>

        {/* Browsers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FaGlobe className="text-cyan-400" /> Browser Distribution
          </h3>

          <div className="space-y-2">
            {Object.keys(browserCounts).length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">No session data recorded yet.</div>
            ) : (
              Object.entries(browserCounts).map(([browser, count], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                  <span className="text-slate-300 font-medium">{browser}</span>
                  <span className="font-bold text-white">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Traffic Referrers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FaUsers className="text-amber-400" /> Top Referrers
          </h3>

          <div className="space-y-2">
            {Object.keys(referrerCounts).length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">No referral data recorded yet.</div>
            ) : (
              Object.entries(referrerCounts).map(([ref, count], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                  <span className="text-slate-300 font-medium">{ref}</span>
                  <span className="font-bold text-white">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
