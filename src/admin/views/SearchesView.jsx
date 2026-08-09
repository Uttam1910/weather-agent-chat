import { filterByDateRange } from './OverviewView';
import { FaSearchLocation, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

export default function SearchesView({ data, dateRange }) {
  const searches = filterByDateRange(data.searches, dateRange);

  // Group searches by city
  const locationCounts = {};
  const sourceCounts = { current: 0, manual: 0, saved: 0 };

  searches.forEach((s) => {
    const city = s.city || 'Unknown Location';
    locationCounts[city] = (locationCounts[city] || 0) + 1;

    const src = s.source || 'manual';
    if (sourceCounts[src] !== undefined) sourceCounts[src]++;
    else sourceCounts.manual++;
  });

  const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Weather Search Intelligence</h2>
        <p className="text-xs text-slate-400 mt-1">Aggregated location search frequency, top requested destinations, and search source ratio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Source Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FaMapMarkerAlt className="text-rose-400" /> Search Source Breakdown
          </h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">📍 Current Location (GPS)</span>
              <span className="font-bold text-emerald-400">{sourceCounts.current}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">🔍 Manual Search</span>
              <span className="font-bold text-purple-400">{sourceCounts.manual}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">⭐ Saved Locations</span>
              <span className="font-bold text-amber-400">{sourceCounts.saved}</span>
            </div>
          </div>
        </div>

        {/* Top Searched Locations Ranking Table */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FaSearchLocation className="text-amber-400" /> Most Searched Destinations
          </h3>

          {sortedLocations.length === 0 ? (
            <div className="text-xs text-slate-500 py-8 text-center">
              No weather searches recorded yet for this date range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase font-bold text-[10px]">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">City / Destination</th>
                    <th className="py-2.5 px-3 text-right">Total Searches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sortedLocations.map(([city, count], idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-bold text-slate-500">#{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{city}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-amber-400">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
