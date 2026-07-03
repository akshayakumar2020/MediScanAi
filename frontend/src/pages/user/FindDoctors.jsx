import { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import { Link } from 'react-router-dom';
import './UserPages.css';



const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('all');

  useEffect(() => {
    loadDoctors();
}, []);

const loadDoctors = async () => {
    try {
        const response = await doctorService.getAll();
        console.log(response.data);
        setDoctors(response.data);
    } catch (error) {
        console.error("Error loading doctors", error);
    }
};

  const filtered = doctors.filter(d => {
  const matchSearch = d.user.name
    .toLowerCase()
    .includes(search.toLowerCase()); 
    const matchSpec = specFilter === 'all' || d.specialization === specFilter;
    return matchSearch && matchSpec;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Find Doctors</h1>
          <p className="page-subtitle">Browse and connect with verified healthcare professionals</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-box" style={{ maxWidth: 350 }}>
          <span className="search-icon">🔍</span>
          <input placeholder="Search by doctor name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={specFilter} onChange={(e) => setSpecFilter(e.target.value)}>
          <option value="all">All Specializations</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="General Practitioner">General Practitioner</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Orthopedist">Orthopedist</option>
          <option value="Pediatrician">Pediatrician</option>
        </select>
      </div>

      <div className="doctors-grid">
        {filtered.map((d) => (
          <div className="doctor-card" key={d.id}>
            <div className="doctor-card-top">
              <div className="doctor-card-avatar">{d.user.name.charAt(0)}</div>
              <div>
                <div className="doctor-card-name">{d.user.name}</div>
                <div className="doctor-card-spec">{d.specialization}</div>
                <div className="doctor-card-exp">{d.experience} years experience</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 12, fontSize: 13, color: 'var(--text-light)' }}>
              <span>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                  <span>🪪 {d.licenseNumber}</span>
              </div>
              </span>
              <span>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                  <span>📧 {d.user.email}</span>
              </div>
              </span>
            </div>
            <div className="doctor-card-actions">
              <Link to={`/user/appointments`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Book Appointment</Link>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>View Profile</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👨‍⚕️</div>
          <div className="empty-state-title">No doctors found</div>
          <div className="empty-state-text">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
