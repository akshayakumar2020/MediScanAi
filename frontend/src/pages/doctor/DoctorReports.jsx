import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import doctorService from '../../services/doctorService';
import './DoctorPages.css';

const DoctorReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // TODO: Missing backend endpoints:
  // GET /api/doctors/reports/pending
  // POST /api/doctors/notes (or similar to add notes to a report)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // const res = await doctorService.getPendingReports();
        // setReports(res.data || []);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);


  const handleSubmitReview = async () => {
    if (!diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }
    
    setSubmitting(true);
    try {
      // NOTE: Using mocked backend logic due to missing actual data in this component context, 
      // but passing prescriptions array structure
      const payload = { reportId: selectedReport.id, diagnosis, notes, prescriptions };
      // await doctorService.addNote(payload);
      toast.success('Report reviewed and notes saved! (Mocked due to missing API)');
      setSelectedReport(null);
      setDiagnosis('');
      setNotes('');
      setPrescriptions([]);
      // Refresh reports here
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pending Reports</h1>
          <p className="page-subtitle">Review patient reports and add your diagnosis</p>
        </div>
      </div>

      {!selectedReport ? (
        <div className="card">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Report</th>
                  <th>Date</th>
                  <th>AI Summary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 && !loading && (
                  <tr><td colSpan="6" style={{textAlign: 'center', padding: 20}}>No pending reports</td></tr>
                )}
                {reports.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.patient?.name || r.patient || 'Unknown'}</td>
                    <td>{r.fileName}</td>
                    <td>{new Date(r.uploadedAt || r.date).toLocaleDateString()}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.aiSummary || 'Pending'}</td>
                    <td><span className={`badge ${r.status === 'Pending' ? 'badge-warning' : 'badge-success'}`}>{r.status || 'Pending'}</span></td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => setSelectedReport(r)}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedReport(null)} style={{ marginBottom: 16 }}>← Back to Reports</button>
          <div className="doctor-review-grid">
            <div>
              <div className="report-section">
                <h3 className="report-section-title">📄 Report: {selectedReport.fileName}</h3>
                <div className="patient-detail-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="patient-detail-item">
                    <div className="patient-detail-label">Patient</div>
                    <div className="patient-detail-value">{selectedReport.patient?.name || selectedReport.patient || 'Unknown'}</div>
                  </div>
                  <div className="patient-detail-item">
                    <div className="patient-detail-label">Date</div>
                    <div className="patient-detail-value">{new Date(selectedReport.uploadedAt || selectedReport.date).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
              <div className="report-section" style={{ marginTop: 16 }}>
                <h3 className="report-section-title">🤖 AI Analysis</h3>
                <div className="report-text">{selectedReport.aiSummary}</div>
              </div>
            </div>
            <div className="diagnosis-form">
              <h3>📝 Add Diagnosis & Notes</h3>
              <div className="form-group">
                <label className="form-label">Diagnosis</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Enter your diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Notes & Recommendations</label>
                <textarea
                  className="form-input"
                  rows={6}
                  placeholder="Add detailed notes and recommendations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <div className="form-group" style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label className="form-label" style={{ margin: 0 }}>Prescriptions</label>
                  <button className="btn btn-outline btn-sm" onClick={() => setPrescriptions([...prescriptions, { drugName: '', dosage: '', frequency: '', durationDays: '' }])}>
                    + Add Medication
                  </button>
                </div>
                {prescriptions.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 10, background: 'var(--bg-light)', padding: 10, borderRadius: 8 }}>
                    <input className="form-input" placeholder="Drug Name" value={p.drugName} onChange={(e) => {
                      const newP = [...prescriptions]; newP[idx].drugName = e.target.value; setPrescriptions(newP);
                    }} />
                    <input className="form-input" placeholder="Dosage (e.g. 500mg)" value={p.dosage} onChange={(e) => {
                      const newP = [...prescriptions]; newP[idx].dosage = e.target.value; setPrescriptions(newP);
                    }} />
                    <input className="form-input" placeholder="Frequency (e.g. 1x daily)" value={p.frequency} onChange={(e) => {
                      const newP = [...prescriptions]; newP[idx].frequency = e.target.value; setPrescriptions(newP);
                    }} />
                    <input type="number" className="form-input" placeholder="Days" value={p.durationDays} onChange={(e) => {
                      const newP = [...prescriptions]; newP[idx].durationDays = parseInt(e.target.value); setPrescriptions(newP);
                    }} style={{ width: 80 }} />
                    <button className="btn btn-danger btn-sm" onClick={() => {
                      const newP = [...prescriptions]; newP.splice(idx, 1); setPrescriptions(newP);
                    }}>X</button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="btn btn-primary" onClick={handleSubmitReview} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button className="btn btn-ghost" onClick={() => setSelectedReport(null)} disabled={submitting}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorReports;
