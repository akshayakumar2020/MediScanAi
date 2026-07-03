import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import reportService from '../../services/reportService';
import appointmentService from '../../services/appointmentService';
import './UserPages.css';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Missing endpoint GET /api/user/dashboard-stats for chart data and AI metrics
  const chartData = [];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reportsRes, aptsRes] = await Promise.all([
          reportService.getAll(),
          appointmentService.getAll()
        ]);
        setReports(reportsRes.data || []);
        setAppointments(aptsRes.data || []);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled');
  const totalReports = reports.length;
  const recentReportsList = reports.slice(0, 5);

  return (
    <div className="user-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name || 'Patient'}! 👋</h1>
          <p className="page-subtitle">Here's an overview of your health analytics</p>
        </div>
        <Link to="/user/upload" className="btn btn-primary">📤 Upload Report</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon="📄" title="Total Reports" value={loading ? "-" : totalReports.toString()} subtitle="All time" color="primary" />
        <StatCard icon="❤️" title="Health Score" value="-" subtitle="Pending data" color="green" />
        <StatCard icon="📅" title="Appointments" value={loading ? "-" : upcomingAppointments.length.toString()} subtitle="Upcoming" color="orange" />
        <StatCard icon="🤖" title="AI Analyses" value="-" subtitle="Pending data" color="purple" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Health Score Trend</h3>
            <Link to="/user/health-metrics" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div style={{ height: 250 }}>
            {chartData.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-light)' }}>
                No trend data available
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1FA2FF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#1FA2FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#1FA2FF" fill="url(#scoreGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Appointments</h3>
            <Link to="/user/appointments" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          {upcomingAppointments.length === 0 && !loading && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-light)' }}>No upcoming appointments</div>
          )}
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="appointment-item">
              <div className="appointment-avatar">👨‍⚕️</div>
              <div className="appointment-info">
                <div className="appointment-doctor">{apt.doctorName || apt.doctor?.user?.name || 'Doctor'}</div>
                <div className="appointment-spec">{apt.doctor?.specialization || apt.specialization || 'General'}</div>
              </div>
              <div className="appointment-time">
                <div className="appointment-date">{new Date(apt.appointmentDate || apt.date).toLocaleDateString()}</div>
                <div className="appointment-hour">{new Date(apt.appointmentDate || apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) || apt.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Recent Reports</h3>
          <Link to="/user/reports" className="btn btn-ghost btn-sm">View All →</Link>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentReportsList.length === 0 && !loading && (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No reports found</td></tr>
              )}
              {recentReportsList.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.fileName || r.name}</td>
                  <td>{r.type || 'Medical Report'}</td>
                  <td>{r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : (r.date ? new Date(r.date).toLocaleDateString() : '—')}</td>
                  <td>
                    <span className={`badge ${r.aiSummary || r.status === 'Analyzed' ? 'badge-success' : 'badge-warning'}`}>
                      {r.aiSummary ? 'Analyzed' : (r.status || 'Pending')}
                    </span>
                  </td>
                  <td>
                    <Link to={`/user/reports/${r.id}`} className="btn btn-ghost btn-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
