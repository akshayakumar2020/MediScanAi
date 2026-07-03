import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './UserPages.css';

const UserSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: '👤 Profile' },
    { id: 'security', label: '🔒 Security' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'privacy', label: '🛡️ Privacy' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div>
              <h3 className="settings-section-title">Profile Settings</h3>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" defaultValue={user?.name || ''} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" defaultValue={user?.email || ''} placeholder="Email" disabled style={{ opacity: 0.6 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="Phone number" />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-input" />
              </div>
              <button className="btn btn-primary" onClick={() => toast.success('Profile updated!')}>Save Changes</button>

              <div className="card" style={{ marginTop: 30, border: '1px solid var(--border)' }}>
                <h3 className="settings-section-title">Integrations</h3>
                <button 
                  className="btn btn-outline" 
                  onClick={() => window.location.href = 'http://localhost:8080/api/google/auth'}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google Calendar" style={{ width: 20, height: 20 }}/>
                  Connect Google Calendar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="settings-section-title">Security Settings</h3>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="Enter new password" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" placeholder="Confirm new password" />
              </div>
              <button className="btn btn-primary" onClick={() => toast.success('Password updated!')}>Update Password</button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="settings-section-title">Notification Preferences</h3>
              {['Email Notifications', 'Report Analysis Alerts', 'Appointment Reminders', 'Doctor Messages', 'Health Insights'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{item}</span>
                  <label style={{ position: 'relative', width: 44, height: 24, display: 'inline-block' }}>
                    <input type="checkbox" defaultChecked={i < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: i < 3 ? 'var(--accent)' : 'var(--border)', borderRadius: 24, transition: '0.3s' }}>
                      <span style={{ position: 'absolute', height: 18, width: 18, left: i < 3 ? 23 : 3, bottom: 3, background: 'white', borderRadius: '50%', transition: '0.3s' }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <h3 className="settings-section-title">Privacy Settings</h3>
              <div className="card" style={{ marginBottom: 16, border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Data Sharing</h4>
                <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>Control who can access your medical data</p>
                <select className="form-select">
                  <option>Only my doctors</option>
                  <option>All verified doctors</option>
                  <option>Private - No sharing</option>
                </select>
              </div>
              <div className="card" style={{ border: '1px solid var(--danger)', background: '#FEF2F2' }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--danger)' }}>Danger Zone</h4>
                <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>Permanently delete your account and all data</p>
                <button className="btn btn-danger btn-sm">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
