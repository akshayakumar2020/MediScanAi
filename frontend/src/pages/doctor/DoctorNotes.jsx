import { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import './DoctorPages.css';

const DoctorNotes = () => {
  const [search, setSearch] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Missing backend endpoint GET /api/doctors/notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // const res = await doctorService.getNotes();
        // setNotesList(res.data || []);
      } catch (err) {
        console.error("Failed to load notes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filtered = notesList.filter(n => (n.patient?.name || n.patient || '').toLowerCase().includes(search.toLowerCase()) || (n.diagnosis || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Notes</h1>
          <p className="page-subtitle">View all diagnosis notes and recommendations</p>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: 20 }}>
          <div className="search-box" style={{ maxWidth: 400 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Patient</th><th>Report</th><th>Diagnosis</th><th>Notes</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: 20}}>No notes found</td></tr>
              )}
              {filtered.map(n => (
                <tr key={n.id}>
                  <td style={{ fontWeight: 600 }}>{n.patient?.name || n.patient || 'Unknown'}</td>
                  <td>{n.report?.fileName || n.report || 'General'}</td>
                  <td><span className="badge badge-info">{n.diagnosis || 'No diagnosis'}</span></td>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.notes}</td>
                  <td>{new Date(n.createdAt || n.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorNotes;
