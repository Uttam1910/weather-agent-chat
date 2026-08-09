import { filterByDateRange } from './OverviewView';
import { FaServer, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

export default function ApiSystemView({ data, dateRange }) {
  const apiRequests = filterByDateRange(data.apiRequests, dateRange);

  const providerCounts = {};
  let totalDuration = 0;
  let errorCount = 0;

  apiRequests.forEach((req) => {
    const prov = req.provider || 'open-meteo-forecast';
    if (!providerCounts[prov]) {
      providerCounts[prov] = { success: 0, error: 0, totalMs: 0, count: 0 };
    }
    providerCounts[prov].count++;
    providerCounts[prov].totalMs += req.durationMs || 0;
    totalDuration += req.durationMs || 0;

    if (req.status === 'error') {
      providerCounts[prov].error++;
      errorCount++;
    } else {
      providerCounts[prov].success++;
    }
  });

  const avgLatency = apiRequests.length > 0 ? Math.round(totalDuration / apiRequests.length) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">API Consumption & Provider Health</h2>
        <p className="text-xs text-slate-400 mt-1">Open-Meteo forecast, air quality, marine, and historical archive API metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <FaServer className="text-blue-400" /> Total API Requests
          </span>
          <div className="text-3xl font-extrabold text-white">{apiRequests.length}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <FaClock className="text-amber-400" /> Average Latency
          </span>
          <div className="text-3xl font-extrabold text-white">{avgLatency} <span className="text-xs text-slate-500">ms</span></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            <FaExclamationTriangle className={errorCount > 0 ? 'text-rose-400' : 'text-emerald-400'} /> Provider Errors
          </span>
          <div className={`text-3xl font-extrabold ${errorCount > 0 ? 'text-rose-400' : 'text-white'}`}>{errorCount}</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FaCheckCircle className="text-emerald-400" /> Provider Request Breakdown
        </h3>

        {Object.keys(providerCounts).length === 0 ? (
          <div className="text-xs text-slate-500 py-8 text-center">
            No API request metrics recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Provider Endpoint</th>
                  <th className="py-2.5 px-3 text-center">Requests</th>
                  <th className="py-2.5 px-3 text-center">Avg Latency</th>
                  <th className="py-2.5 px-3 text-center">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {Object.entries(providerCounts).map(([prov, stat], idx) => {
                  const avg = Math.round(stat.totalMs / stat.count);
                  const successRate = Math.round((stat.success / stat.count) * 100);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-semibold text-white">{prov}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-200">{stat.count}</td>
                      <td className="py-2.5 px-3 text-center font-medium text-amber-300">{avg} ms</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-400">{successRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
