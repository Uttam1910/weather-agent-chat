import { useState, useEffect } from 'react';
import { AdminAuthProvider } from './auth/AdminAuthContext';
import AdminProtectedRoute from './auth/AdminProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import OverviewView from './views/OverviewView';
import TrafficView from './views/TrafficView';
import SearchesView from './views/SearchesView';
import FeatureUsageView from './views/FeatureUsageView';
import ApiSystemView from './views/ApiSystemView';

import { getAllRecords } from './analytics/analyticsStore';

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

  const loadData = async () => {
    const [visitors, sessions, pageViews, searches, featureUsage, apiRequests] = await Promise.all([
      getAllRecords('visitors'),
      getAllRecords('sessions'),
      getAllRecords('page_views'),
      getAllRecords('searches'),
      getAllRecords('feature_usage'),
      getAllRecords('api_requests'),
    ]);

    setAnalyticsData({
      visitors,
      sessions,
      pageViews,
      searches,
      featureUsage,
      apiRequests,
    });
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Live refresh every 5s
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
