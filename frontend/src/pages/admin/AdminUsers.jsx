import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import './AdminPages.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users', error);
      toast.error('Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      switch (action) {
        case 'suspend':
          await adminService.suspendUser(id);
          break;
        case 'block':
          await adminService.blockUser(id);
          break;
        case 'activate':
          await adminService.activateUser(id);
          break;
        case 'delete':
          await adminService.deleteUser(id);
          break;
        default:
          return;
      }
      toast.success(`User ${action}${action === 'delete' ? 'd' : action === 'block' ? 'ed' : 'ed'} successfully`);
      await loadUsers();
    } catch (error) {
      console.error(`Failed to ${action} user`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, fontSize: 16, color: 'var(--text-light)' }}>
        Loading users...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">View and manage patient accounts</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="search-box" style={{ maxWidth: 350 }}>
            <span className="search-icon">🔍</span>
            <input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
                        {u.name[0]}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-info">{u.role}</span></td>
                  <td>
                    <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : u.status === 'SUSPENDED' ? 'badge-warning' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <div className="admin-action-buttons">
                      {u.status !== 'ACTIVE' && (
                        <button className="btn btn-sm" style={{ background: 'var(--accent)', color: 'white' }} onClick={() => handleAction(u.id, 'activate')}>Activate</button>
                      )}
                      {u.status === 'ACTIVE' && (
                        <button className="btn btn-warning btn-sm" onClick={() => handleAction(u.id, 'suspend')}>Suspend</button>
                      )}
                      {u.status !== 'BLOCKED' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleAction(u.id, 'block')}>Block</button>
                      )}
                      <button className="btn btn-sm" style={{ background: '#991B1B', color: 'white' }} onClick={() => handleAction(u.id, 'delete')}>Delete</button>
                    </div>
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

export default AdminUsers;
