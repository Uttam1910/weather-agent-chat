import { useState } from 'react';
import { useAdminAuth } from '../auth/AdminAuthContext';
import {
  FaChartPie,
  FaUsers,
  FaSearchLocation,
  FaLayerGroup,
  FaServer,
  FaSignOutAlt,
  FaShieldAlt,
  FaCalendarAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

export default function AdminLayout({ activeTab, setActiveTab, dateRange, setDateRange, children }) {
  const { logout } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaChartPie },
    { id: 'traffic', label: 'Visitors & Traffic', icon: FaUsers },
    { id: 'searches', label: 'Weather Searches', icon: FaSearchLocation },
    { id: 'features', label: 'Feature Usage', icon: FaLayerGroup },
    { id: 'api', label: 'API & System Health', icon: FaServer },
  ];

  const dateRangeOptions = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            {mobileSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-400 flex items-center justify-center text-sm font-bold">
              <FaShieldAlt />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Weather Agent</span>
              <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block">Private Operations</span>
            </div>
          </div>
        </div>

        {/* Date Filter & Logout */}
        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <FaCalendarAlt className="text-purple-400 text-xs" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {dateRangeOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={logout}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-rose-900/40 hover:border-rose-700/50 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-300 transition-all flex items-center gap-1.5"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`w-64 bg-slate-900/90 border-r border-slate-800 p-4 space-y-2 fixed md:sticky top-16 h-[calc(100vh-4rem)] z-30 transition-transform ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">
            Analytics & System
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="text-base" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content View Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-x-hidden space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
