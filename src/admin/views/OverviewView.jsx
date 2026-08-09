import { FaUsers, FaSearch, FaEye, FaServer, FaGlobe, FaExclamationCircle } from 'react-icons/fa';

export function filterByDateRange(records, rangeKey) {
  if (!records || records.length === 0) return [];
  if (rangeKey === 'all') return records;

  const now = new Date();
  let startTime = 0;

  if (rangeKey === 'today') {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    startTime = today.getTime();
  } else if (rangeKey === '7d') {
    startTime = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  } else if (rangeKey === '30d') {
    startTime = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  } else if (rangeKey === '90d') {
    startTime = now.getTime() - 90 * 24 * 60 * 60 * 1000;
  }

  return records.filter((r) => {
    const ts = new Date(r.timestamp || r.startedAt || r.firstSeenAt || r.lastSeenAt).getTime();
    return ts >= startTime;
  });
}

export default function OverviewView({ data, dateRange }) {
  const visitors = filterByDateRange(data.visitors, dateRange);
  const sessions = filterByDateRange(data.sessions, dateRange);
  const pageViews = filterByDateRange(data.pageViews, dateRange);
  const searches = filterByDateRange(data.searches, dateRange);
  const apiRequests = filterByDateRange(data.apiRequests, dateRange);

  const uniqueVisitorIds = new Set(visitors.map((v) => v.id)).size;
  const uniqueCities = new Set(searches.map((s) => s.city)).size;
  const errorApiCount = apiRequests.filter((a) => a.status === 'error').length;

  const kpis = [
    { title: 'Total Visitors', value: visitors.length, icon: FaUsers, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { title: 'Unique Visitors', value: uniqueVisitorIds, icon: FaUsers, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Sessions', value: sessions.length, icon: FaEye, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Page Views', value: pageViews.length, icon: FaEye, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { title: 'Weather Searches', value: searches.length, icon: FaSearch, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { title: 'Unique Locations', value: uniqueCities, icon: FaGlobe, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'API Requests', value: apiRequests.length, icon: FaServer, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { title: 'API Errors', value: errorApiCount, icon: FaExclamationCircle, color: errorApiCount > 0 ? 'text-rose-400' : 'text-slate-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">System Overview & Core Analytics</h2>
        <p className="text-xs text-slate-400 mt-1">Real public user telemetry, session counts, and search activity.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`p-5 rounded-2xl border ${kpi.bg} shadow-lg space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">{kpi.title}</span>
                <Icon className={`text-lg ${kpi.color}`} />
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FaSearch className="text-amber-400" /> Recent Real-Time Search Events
        </h3>

        {searches.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-medium">
            No weather searches recorded for this period yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Search Source</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {searches.slice(-10).reverse().map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-semibold text-white">{s.city}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${s.source === 'current' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {s.source}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(s.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
