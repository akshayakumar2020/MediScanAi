import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './AdminPages.css';

// Chart data relies on missing endpoints. Handled in UI conditionally.

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await adminService.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics', error);
      toast.error('Unable to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, fontSize: 16, color: 'var(--text-light)' }}>
        Loading analytics...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Platform usage statistics and trends</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="📈" title="Monthly Active Users" value={analytics?.totalUsers ?? '—'} color="primary" />
        <StatCard icon="📊" title="Total Reports" value={analytics?.totalReports ?? '—'} color="green" />
        <StatCard icon="👨‍⚕️" title="Total Doctors" value={analytics?.totalDoctors ?? '—'} color="orange" />
        <StatCard icon="👥" title="Total Patients" value={analytics?.totalPatients ?? '—'} color="purple" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>User Growth by Role</h3>
          <div style={{ height: 280 }}>
            {/* TODO: Missing endpoint GET /api/admin/analytics/trends for monthlyUsers */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-light)' }}>
              No user growth data available
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 16 }}>System Usage (Requests/Hour)</h3>
          <div style={{ height: 280 }}>
            {/* TODO: Missing endpoint GET /api/admin/analytics/trends for systemUsage */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-light)' }}>
              No system usage data available
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title" style={{ marginBottom: 16 }}>Report Types Distribution</h3>
        <div style={{ height: 280 }}>
          {/* TODO: Missing endpoint GET /api/admin/analytics/trends for reportTypes */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-light)' }}>
            No report types data available
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
