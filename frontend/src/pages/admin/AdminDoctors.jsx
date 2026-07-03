import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './AdminPages.css';



const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    loadDoctors();
}, []);

const loadDoctors = async () => {
    try {
        const response = await adminService.getDoctors();
        console.log(response.data);
        setDoctors(response.data);
    } catch (error) {
        console.error("Failed to load doctors", error);
        toast.error("Unable to load doctors");
    }
};
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleAction = async (id, action) => {
    try {
      switch (action) {
        case 'approve':
          await adminService.approveDoctor(id);
          break;
        case 'reject':
          await adminService.rejectDoctor(id);
          break;
        case 'suspend':
          await adminService.suspendDoctor(id);
          break;
        case 'block':
          await adminService.blockDoctor(id);
          break;
        case 'delete':
          await adminService.deleteDoctor(id);
          break;
        default:
          return;
      }
      toast.success(`Doctor ${action}${action === 'delete' ? 'd' : action === 'block' ? 'ed' : 'd'} successfully`);
      await loadDoctors();
    } catch (error) {
      console.error(`Failed to ${action} doctor`, error);
      toast.error(`Failed to ${action} doctor`);
    }
  };

  const filtered = doctors.filter(d => {
    const matchSearch =
      d.user.name.toLowerCase().includes(search.toLowerCase()) ||
      d.user.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      d.approvalStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctor Management</h1>
          <p className="page-subtitle">Approve, manage, and monitor doctor accounts</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-warning" style={{ padding: '8px 14px', fontSize: 13 }}>
            {doctors.filter(d => d.approvalStatus === 'PENDING').length} Pending Approval
          </span>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="search-box" style={{ maxWidth: 350 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>License</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                        {d.user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, cursor: 'pointer', color: 'var(--secondary)' }} onClick={() => setSelectedDoctor(d)}>{d.user.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-light)' }}>{d.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{d.specialization}</td>
                  <td>{d.experience} years</td>
                  <td><code style={{ fontSize: 12, background: 'var(--bg)', padding: '2px 6px', borderRadius: 4 }}>{d.licenseNumber}</code></td>
                  <td>
                    <span className={`badge ${d.approvalStatus === 'APPROVED' ? 'badge-success' : d.approvalStatus === 'PENDING' ? 'badge-warning' : d.approvalStatus === 'SUSPENDED' ? 'badge-warning' : 'badge-danger'}`}>
                      {d.approvalStatus}
                    </span>
                  </td>
                  <td>
                              <div className="admin-action-buttons">
                              {d.approvalStatus === 'PENDING' && (
                              <>
                                  <button
                            className="btn btn-sm"
                            style={{ background: 'var(--accent)', color: 'white' }}
                            onClick={() => handleAction(d.id, 'approve')}
                          >
                          Approve
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(d.id, 'reject')}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {d.approvalStatus === 'APPROVED' && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleAction(d.id, 'suspend')}
                      >
                        Suspend
                      </button>
                    )}

                    {d.approvalStatus === 'SUSPENDED' && (
                      <button
                        className="btn btn-sm"
                        style={{ background: 'var(--accent)', color: 'white' }}
                        onClick={() => handleAction(d.id, 'approve')}
                      >
                        Reactivate
                      </button>
                    )}

                    {d.approvalStatus !== 'BLOCKED' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleAction(d.id, 'block')}
                      >
                        Block
                      </button>
                    )}
                      <button className="btn btn-sm" style={{ background: '#991B1B', color: 'white' }} onClick={() => handleAction(d.id, 'delete')}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDoctor && (
        <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Doctor Details</h3>
              <button className="modal-close" onClick={() => setSelectedDoctor(null)}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { label: 'Name', value: selectedDoctor.user?.name || '—' },
                { label: 'Email', value: selectedDoctor.user?.email || '—' },
                { label: 'Specialization', value: selectedDoctor.specialization },
                { label: 'Experience', value: `${selectedDoctor.experience} years` },
                { label: 'License Number', value: selectedDoctor.licenseNumber },
                { label: 'Status', value: selectedDoctor.approvalStatus },
                { label: 'Joined', value: selectedDoctor.createdAt ? new Date(selectedDoctor.createdAt).toLocaleDateString() : '—' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
