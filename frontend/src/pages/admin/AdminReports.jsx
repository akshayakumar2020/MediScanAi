import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './AdminPages.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await adminService.getAllReports();
      setReports(response.data);
    } catch (error) {
      console.error('Failed to load reports', error);
      toast.error('Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filtered = reports.filter(r => {
    const patientName = r.patient?.user?.name || '';
    return patientName.toLowerCase().includes(search.toLowerCase()) || r.fileName.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, fontSize: 16, color: 'var(--text-light)' }}>
        Loading reports...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Reports</h1>
          <p className="page-subtitle">Monitor all uploaded medical reports</p>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: 20 }}>
          <div className="search-box" style={{ maxWidth: 400 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Report</th>
                <th>Date</th>
                <th>Assigned Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.patient?.user?.name || '—'}</td>
                  <td>{r.fileName}</td>
                  <td>{r.uploadedAt ? new Date(r.uploadedAt).toLocaleDateString() : '—'}</td>
                  <td>—</td>
                  <td>
                    <span className={`badge ${r.aiSummary ? 'badge-success' : 'badge-warning'}`}>
                      {r.aiSummary ? 'Analyzed' : 'Pending'}
                    </span>
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

export default AdminReports;
