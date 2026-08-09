import { useState, useEffect } from 'react';
import { AdminAuthProvider } from './auth/AdminAuthContext';
import AdminProtectedRoute from './auth/AdminProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import OverviewView from './views/OverviewView';
import TrafficView from './views/TrafficView';
import SearchesView from './views/SearchesView';
import FeatureUsageView from './views/FeatureUsageView';
import ApiSystemView from './views/ApiSystemView';

function AdminContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    visitors: [],
    sessions: [],
    pageViews: [],
    searches: [],
    featureUsage: [],
    apiRequests: [],
  });

  const loadCentralAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics/all');
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData({
          visitors: data.visitors || [],
          sessions: data.sessions || [],
          pageViews: data.pageViews || [],
          searches: data.searches || [],
          featureUsage: data.featureUsage || [],
          apiRequests: data.apiRequests || [],
        });
      }
    } catch (err) {
      console.warn('Error fetching server analytics:', err);
    }
  };

  useEffect(() => {
    loadCentralAnalytics();
    const interval = setInterval(loadCentralAnalytics, 5000); // Poll central backend every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} dateRange={dateRange} setDateRange={setDateRange}>
      {activeTab === 'overview' && <OverviewView data={analyticsData} dateRange={dateRange} />}
      {activeTab === 'traffic' && <TrafficView data={analyticsData} dateRange={dateRange} />}
      {activeTab === 'searches' && <SearchesView data={analyticsData} dateRange={dateRange} />}
      {activeTab === 'features' && <FeatureUsageView data={analyticsData} dateRange={dateRange} />}
      {activeTab === 'api' && <ApiSystemView data={analyticsData} dateRange={dateRange} />}
    </AdminLayout>
  );
}

export default function AdminSystem() {
  return (
    <AdminAuthProvider>
      <AdminProtectedRoute>
        <AdminContent />
      </AdminProtectedRoute>
    </AdminAuthProvider>
  );
}
