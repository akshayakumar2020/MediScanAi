import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../../redux/reportSlice';
import reportService from '../../services/reportService';
import './UserPages.css';

const MyReports = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await reportService.getAll();
        setReports(res.data || []);
      } catch (err) {
        console.error("Error loading reports", err);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const filtered = reports.filter(r => {
    const matchSearch = r.fileName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (r.aiSummary ? 'Analyzed' : 'Pending') === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Reports</h1>
          <p className="page-subtitle">View and manage your medical reports</p>
        </div>
        <Link to="/user/upload" className="btn btn-primary">📤 Upload New</Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Analyzed">Analyzed</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <div className="empty-state-title">No reports found</div>
            <div className="empty-state-text">Upload your first medical report to get started</div>
            <Link to="/user/upload" className="btn btn-primary" style={{ marginTop: 16 }}>Upload Report</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date</th>
                  <th>AI Summary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{r.fileName?.endsWith('.pdf') ? '📕' : '🖼️'}</span>
                        <span style={{ fontWeight: 600 }}>{r.fileName}</span>
                      </div>
                    </td>
                    <td>{new Date(r.uploadedAt).toLocaleDateString()}</td>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.aiSummary || 'Analysis pending'}</td>
                    <td>
                      <span className={`badge ${r.aiSummary ? 'badge-success' : 'badge-warning'}`}>
                        {r.aiSummary ? 'Analyzed' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/user/reports/${r.id}`} className="btn btn-ghost btn-sm">View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
