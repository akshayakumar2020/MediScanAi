import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './AdminPages.css';

const PIE_COLORS = ['#1FA2FF', '#34C759', '#0F4C81'];

const AdminDashboard = () => {
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
      toast.error('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const roleDistribution = analytics ? [
    { name: 'Patients', value: analytics.totalPatients || 0, color: PIE_COLORS[0] },
    { name: 'Doctors', value: analytics.totalDoctors || 0, color: PIE_COLORS[1] },
    { name: 'Admins', value: Math.max(0, (analytics.totalUsers || 0) - (analytics.totalPatients || 0) - (analytics.totalDoctors || 0)), color: PIE_COLORS[2] },
  ] : [];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, fontSize: 16, color: 'var(--text-light)' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard 🎛️</h1>
          <p className="page-subtitle">Platform overview and management</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="👥" title="Total Users" value={analytics?.totalUsers ?? '—'} subtitle={`${analytics?.pendingDoctors ?? 0} pending doctors`} color="primary" />
        <StatCard icon="👨‍⚕️" title="Total Doctors" value={analytics?.totalDoctors ?? '—'} subtitle={`${analytics?.pendingDoctors ?? 0} pending`} color="green" />
        <StatCard icon="📄" title="Reports Uploaded" value={analytics?.totalReports ?? '—'} color="orange" />
        <StatCard icon="📅" title="Appointments" value={analytics?.totalAppointments ?? '—'} color="purple" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Growth</h3>
          </div>
          <div style={{ height: 280 }}>
            {/* TODO: Missing endpoint GET /api/admin/analytics/trends for userGrowthData */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-light)' }}>
              No user growth data available
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Distribution</h3>
          </div>
          <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value">
                  {roleDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
            {roleDistribution.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color }} />
                {r.name}: {r.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginTop: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Report Upload Trends</h3>
          </div>
          <div style={{ height: 250 }}>
            {/* TODO: Missing endpoint GET /api/admin/analytics/trends for reportUploadData */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-light)' }}>
              No upload trend data available
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          {/* TODO: Missing endpoint GET /api/admin/activity */}
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-light)' }}>
            No recent activity
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
