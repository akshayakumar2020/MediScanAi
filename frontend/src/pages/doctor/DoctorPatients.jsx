import { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import './DoctorPages.css';

const DoctorPatients = () => {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Missing backend endpoint GET /api/doctors/patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // const res = await doctorService.getPatients();
        // setPatients(res.data || []);
      } catch (err) {
        console.error("Failed to load patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter(p => (p.name || p.user?.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Patients</h1>
          <p className="page-subtitle">View and manage your patient records</p>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: 20 }}>
          <div className="search-box" style={{ maxWidth: 400 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age</th>
                <th>Email</th>
                <th>Last Visit</th>
                <th>Reports</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: 20}}>No patients found</td></tr>
              )}
              {filtered.map(p => {
                const name = p.name || p.user?.name || 'Unknown';
                return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                        {name[0]}
                      </div>
                      <span style={{ fontWeight: 600 }}>{name}</span>
                    </div>
                  </td>
                  <td>{p.age || '—'}</td>
                  <td>{p.email || p.user?.email || '—'}</td>
                  <td>{p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : '—'}</td>
                  <td>{p.reports || 0}</td>
                  <td><span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-info'}`}>{p.status || 'Active'}</span></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelectedPatient(p)}>View</button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Patient Details</h3>
              <button className="modal-close" onClick={() => setSelectedPatient(null)}>✕</button>
            </div>
            <div className="patient-detail-grid">
              <div className="patient-detail-item">
                <div className="patient-detail-label">Name</div>
                <div className="patient-detail-value">{selectedPatient.name || selectedPatient.user?.name || 'Unknown'}</div>
              </div>
              <div className="patient-detail-item">
                <div className="patient-detail-label">Age</div>
                <div className="patient-detail-value">{selectedPatient.age || '—'}</div>
              </div>
              <div className="patient-detail-item">
                <div className="patient-detail-label">Email</div>
                <div className="patient-detail-value">{selectedPatient.email || selectedPatient.user?.email || '—'}</div>
              </div>
              <div className="patient-detail-item">
                <div className="patient-detail-label">Phone</div>
                <div className="patient-detail-value">{selectedPatient.phone || '—'}</div>
              </div>
              <div className="patient-detail-item">
                <div className="patient-detail-label">Total Reports</div>
                <div className="patient-detail-value">{selectedPatient.reports || 0}</div>
              </div>
              <div className="patient-detail-item">
                <div className="patient-detail-label">Last Visit</div>
                <div className="patient-detail-value">{selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString() : '—'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
