import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/cards/StatCard';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import './DoctorPages.css';

const DoctorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [patients, setPatients] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Missing backend endpoints:
  // GET /api/doctors/patients
  // GET /api/doctors/reports/pending
  // GET /api/doctors/stats (for weeklyData and statusData)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Commented out to prevent 404s until endpoints are built
        // const [patientsRes, reportsRes] = await Promise.all([
        //   doctorService.getPatients(),
        //   doctorService.getPendingReports()
        // ]);
        // setPatients(patientsRes.data || []);
        // setPendingReports(reportsRes.data || []);
      } catch (err) {
        console.error("Failed to load doctor dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const weeklyData = [];
  const statusData = [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome, Dr. {user?.name || 'Doctor'}! 👨‍⚕️</h1>
          <p className="page-subtitle">Here's your practice overview for today</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="👥" title="Total Patients" value={loading ? "-" : patients.length.toString()} subtitle="Pending API" color="primary" trend={0} />
        <StatCard icon="📋" title="Pending Reports" value={loading ? "-" : pendingReports.length.toString()} subtitle="Needs review" color="orange" />
        <StatCard icon="📅" title="Today's Consultations" value="-" subtitle="Pending API" color="green" />
        <StatCard icon="📝" title="Notes Added" value="-" subtitle="Pending API" color="purple" />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Consultations</h3>
          </div>
          <div style={{ height: 280 }}>
            {weeklyData.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-light)' }}>
                No weekly data available
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="consultations" fill="#1FA2FF" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Report Status</h3>
          </div>
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {statusData.length === 0 ? (
              <div style={{ color: 'var(--text-light)' }}>No status data available</div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 8 }}>
            {statusData.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                {s.name}: {s.value}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Patients</h3>
            <Link to="/doctor/patients" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Age</th><th>Last Visit</th><th>Status</th></tr>
              </thead>
              <tbody>
                {patients.length === 0 && !loading && (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: 20}}>No patients found</td></tr>
                )}
                {patients.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name || p.user?.name}</td>
                    <td>{p.age || '—'}</td>
                    <td>{p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : '—'}</td>
                    <td><span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-info'}`}>{p.status || 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pending Reports</h3>
            <Link to="/doctor/reports" className="btn btn-ghost btn-sm">View All →</Link>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Patient</th><th>Report</th><th>Priority</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pendingReports.length === 0 && !loading && (
                  <tr><td colSpan="4" style={{textAlign: 'center', padding: 20}}>No pending reports</td></tr>
                )}
                {pendingReports.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.patient?.name || r.patient}</td>
                    <td>{r.fileName || r.report}</td>
                    <td>
                      <span className={`badge badge-info`}>
                        {r.priority || 'Normal'}
                      </span>
                    </td>
                    <td><Link to={`/doctor/reports/${r.id}`} className="btn btn-primary btn-sm">Review</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
